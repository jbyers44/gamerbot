import { Context } from 'src/shared/context'

const play = async (context: Context, args) => {
    let guildQueue = context.player.getQueue(context.guild.id);

    let queue = context.player.createQueue(context.guild.id);

    let member = await context.guild.members.fetch(context.user)
    if (member) {
        let channel = member.voice.channel
        if (channel) {
            await queue.join(channel);
            let song = await queue.play(args.join(' ')).catch(_ => {
                if(!guildQueue)
                    queue.stop();
            });
        }
    }
}

const duckVolume = async (context: Context): Promise<number> => {
    let guildQueue = context.player.getQueue(context.guild.id)

    let old_volume = 100

    if (guildQueue) {
        old_volume = guildQueue.volume

        guildQueue.setVolume(30)
    }

    return Promise.resolve(old_volume)
}

const setVolumeNumber = async (context: Context, volume: number) => {
    let guildQueue = context.player.getQueue(context.guild.id)
    guildQueue?.setVolume(volume)
}

const setVolumeString = async (context: Context, args: string[]) => {
    let guildQueue = context.player.getQueue(context.guild.id)
    guildQueue?.setVolume(parseInt(args[0]))
}

const skip = async (context: Context) => {
    let guildQueue = context.player.getQueue(context.guild.id)
    guildQueue?.skip()
}


const stop = async (context: Context) => {
    let guildQueue = context.player.getQueue(context.guild.id)
    guildQueue?.stop()
}

const seek = async (context: Context, args: string[]) => {
    let guildQueue = context.player.getQueue(context.guild.id)
    guildQueue?.seek(parseInt(args[0]) * 1000);
}

const clear = async (context: Context) => {
    let guildQueue = context.player.getQueue(context.guild.id)
    guildQueue?.clearQueue()
}

const shuffle = async (context: Context) => {
    let guildQueue = context.player.getQueue(context.guild.id)
    guildQueue?.shuffle()
}

const pause = async (context: Context) => {
    let guildQueue = context.player.getQueue(context.guild.id)
    guildQueue?.setPaused(true)
}

const resume = async (context: Context) => {
    let guildQueue = context.player.getQueue(context.guild.id)
    guildQueue?.setPaused(false)
}

export {
    play,
    duckVolume,
    setVolumeNumber,
    setVolumeString,
    skip,
    stop,
    seek,
    clear,
    shuffle,
    pause,
    resume
}
