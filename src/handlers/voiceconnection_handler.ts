import { getVoiceConnection, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { Client, Guild, GuildMember, User } from "discord.js";


const getConnection = async (client: Client, guild: Guild, user: User): Promise<VoiceConnection | undefined> => {
    let connection = getVoiceConnection(guild.id)

    if (!connection) {
        let member = guild.members.resolve(user)

        if (member instanceof GuildMember && member.voice.channel) {
            const channel = member.voice.channel;
            connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                selfDeaf: false,
                selfMute: false,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            return connection;
        }
    }
    
    return connection as VoiceConnection
}

export {
    getConnection
}