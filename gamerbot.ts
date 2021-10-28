import 'dotenv/config'

import Discord, { Intents } from 'discord.js';
import { interaction_handler } from './src/handlers/interaction_handler'
import { deploy } from './src/interactions/deploy'

const config = require('./config.json')

const client = new Discord.Client({intents: [Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_VOICE_STATES, 
	Intents.FLAGS.GUILD_BANS, 
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS], 
})

const { Player } = require('discord-music-player')

const player = new Player(client, {
	leaveOnEnd: false,
	leaveOnStop: false,
	leaveOnEmpty: true,
})

client.once('ready', async () => {
	console.log('Ready!');
	const app = await client.application?.fetch();

	if (config.guild_id) {
		const guild = await client.guilds.fetch(config.guild_id).catch(() => null);

		if (app && guild) {
			await deploy(guild)
			console.log("Deployed slash commands.")
		}
	}
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand() || !interaction.guildId) return;

	const handler = interaction_handler.get(interaction.commandName);

	try {
		if (handler) {
			await handler(interaction, client, player);
		} else {
			await interaction.reply('Unknown command');
		}
	} catch (error) {
		console.warn(error);
	}
});

client.login(config.auth_token);