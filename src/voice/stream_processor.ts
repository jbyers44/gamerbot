import { AudioReceiveStream, EndBehaviorType, VoiceReceiver } from '@discordjs/voice';
import { opus } from 'prism-media';
import { SpeechClient, protos } from '@google-cloud/speech'
import { pipeline } from 'stream'
import { parse_transcription } from './transcription_parser';
import { Context } from '../shared/context';
import { playFileWithQueue } from '../actions/music_action';
import { setVolumeNumber, duckVolume } from '../commands/music_commands';

const Porcupine = require("@picovoice/porcupine-node");

const googleSpeechClient = new SpeechClient();

var userFrameAccumulators = [];

let handler = new Porcupine(["./assets/ppn/gamer-bot__en_linux_2021-10-31-utc_v1_9_0.ppn"], [0.9]);

const createListeningStream = (context: Context, receiver: VoiceReceiver) => {
	if (receiver.subscriptions.get(context.user.id)) return;

	const stream = receiver.subscribe(context.user.id, {
		end: {
			behavior: EndBehaviorType.AfterInactivity,
			duration: 3000,
		},
	});

	const decoder = new opus.Decoder({
		rate: 16000,
		channels: 1,
		frameSize: 640
	})

	userFrameAccumulators[context.user.id] = []

	pipeline(
		stream,
		decoder.on('data', (data) => {
			handleListeningStream(context, data, context.user.id, receiver)
		}),
		err => {
			if (err) {
				console.log(err)
			}
		}
	)
}

const handleListeningStream = async (context, data, userId: string, receiver) => {
	// Two bytes per Int16 from the data buffer
	let newFrames16 = new Array(data.length / 2);
	for (let i = 0; i < data.length; i += 2) {
		newFrames16[i / 2] = data.readInt16LE(i);
	}
	// Split the incoming PCM integer data into arrays of size Porcupine.frameLength. If there's insufficient frames, or a remainder,
	// store it in 'frameAccumulator' for the next iteration, so that we don't miss any audio data
	userFrameAccumulators[userId] = userFrameAccumulators[userId].concat(newFrames16);
	//console.log(newFrames16)

	let frames = chunkArray(userFrameAccumulators[userId], handler.frameLength);

	if (frames[frames.length - 1].length !== handler.frameLength) {
		// store remainder from divisions of frameLength
		userFrameAccumulators[userId] = frames.pop();
	} else {
		userFrameAccumulators[userId] = [];
	}
	for (let frame of frames) {
		let index = handler.process(frame);
		if (index !== -1) {
			console.log("[GamerBot] Wake word detected.")

			let oldVolume = await duckVolume(context)

			const newStream = receiver.subscribe(context.user.id, {
				end: {
					behavior: EndBehaviorType.AfterInactivity,
					duration: 100,
				},
			});

			const newDecoder = new opus.Decoder({
				rate: 16000,
				channels: 1,
				frameSize: 640
			})

			pipeline(
				newStream,
				newDecoder,
				err => {
					if (err) {
						console.log(err)
					}
				}
			)
			
			speechStreamToText(context, newDecoder, oldVolume)

			await playFileWithQueue(context, "./assets/sounds/wake.wav")
		}
	}
}

const speechStreamToText = async (context, decoder, volume) => {
	const requestConfig: protos.google.cloud.speech.v1.IRecognitionConfig = {
		encoding: "LINEAR16",
		languageCode: 'en-us',
		sampleRateHertz: 16000,
	}
	const request = {
		config: requestConfig
	}
	const recognizeStream = googleSpeechClient
		.streamingRecognize(request)
		.on('error', console.error)
		.on('data', response => {
			const transcription = response.results
			.map(result => result.alternatives[0].transcript)
			.join('\n')
			.toLowerCase()
			console.log ("[Transcription]: " + transcription)
			parse_transcription(context, transcription)
		})
		.on('end', end => {
			setVolumeNumber(context, volume)
		})

	decoder.pipe(recognizeStream)
}

const chunkArray = (array, size) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (v, index) =>
        array.slice(index * size, index * size + size)
    );
}

export {
	createListeningStream
}