import { VoiceConnection } from '@discordjs/voice'; 
import { Player } from 'discord-music-player';
import { Client, CommandInteraction, Snowflake } from 'discord.js';
import * as actions from '../commands/general_commands';

export const interaction_handler = new Map<string,
    (
        interaction: CommandInteraction,
        client: Client,
        player: Player
    ) => Promise<void>
>();

// Join
interaction_handler.set('summon', actions.summon);

// Play victory royale
// command_handler.set('record', voice_commands.victory);
