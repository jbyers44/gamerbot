import { createAudioPlayer, createAudioResource, VoiceConnection, NoSubscriberBehavior, AudioPlayerStatus } from '@discordjs/voice'
import * as playdl from 'play-dl'
import { getConnection } from '../handlers/voiceconnection_handler'
import { Context } from '../shared/context'
import { once } from 'events'

const playUrl = async (context: Context, url: string) => {
    let connection = await getConnection(context.client, context.guild, context.user)
	if (!connection) {
		console.log ("You must be in a voice channel to play a file.")
		return
	}

    if(playdl.is_expired()){
        await playdl.refreshToken()
    }

    let stream = await playdl.stream(url)

    let resource = createAudioResource(stream.stream, {
        inputType : stream.type
    })

    let player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play
        }
    })

    player.play(resource)

    connection.subscribe(player)
}

const playFile = async (context: Context, filepath: string) => {
    let connection = await getConnection(context.client, context.guild, context.user)
	if (!connection) {
		console.log ("You must be in a voice channel to play a file.")
		return
	}

    let resource = createAudioResource(filepath)

    let player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play
        }
    })

    player.play(resource)

    connection.subscribe(player)

    await once(player, AudioPlayerStatus.Idle)
}

const playFileWithQueue = async (context: Context, filepath: string) => {
    let guildQueue = context.player.getQueue(context.guild.id)

    if (guildQueue) {
        if (guildQueue.isPlaying) {
            let connection = await getConnection(context.client, context.guild, context.user)
            // If the queue is currently playing
            if (!guildQueue.connection.paused) {
                guildQueue.setPaused(true)
    
                await playFile(context, filepath)
    
                guildQueue.setPaused(false)
            }
            else {
                await playFile(context, filepath)
            }
            if (connection) {
                connection.subscribe(guildQueue.connection.player)
            }
        }
    }
    else {
        await playFile(context, filepath)
    }
}

export {
    playUrl,
    playFile,
    playFileWithQueue
}