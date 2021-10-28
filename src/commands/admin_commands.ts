import { GuildMember, User } from "discord.js";
import { Context } from "../shared/context";

const moveAll = async (context: Context, args: string[]) => {
    let channels = context.guild.channels.cache

    channels.each((channel) => {
        if (channel.type == "GUILD_VOICE" && channel.name == args[0]) {
            let member = context.guild.members.resolve(context.user)

            if (member instanceof GuildMember && member.voice.channel) {
                const memberChannel = member.voice.channel;

                memberChannel.members.each(member => {
                    member.edit({ channel:  channel.id}).catch(console.error)
                })
            }
            else {
                console.log("You must be in a voice channel to use this command.")
            }
        }
    })
}

export {
    moveAll
}

