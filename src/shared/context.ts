import { Player } from "discord-music-player";
import { Client, Guild, User } from "discord.js";

class Context {
    client: Client

    guild: Guild

    user: User

    player: Player

    constructor(client: Client, guild: Guild, user: User, player: Player) {
        this.client = client
        this.guild = guild
        this.user = user
        this.player = player
    }
}

export {
    Context
}