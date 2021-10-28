import { getConnection } from "../handlers/voiceconnection_handler"
import { playFile } from "../actions/music_action"
import { command_map } from "../handlers/command_handler"
import { Context } from "../shared/context"

const parse_transcription = async (context: Context, transcription: string) => {
    let command = command_map.get(transcription)
    if (command) {
        await command(context, [])
    }
    else {
        let splitTranscription = transcription.split(" ")
        let keyword = splitTranscription[0]
        let args = splitTranscription.slice(1)

        command = command_map.get(keyword)

        if (command) {
            await command(context, args)
        }
    }
}

export {
    parse_transcription
}