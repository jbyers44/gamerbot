import { Client, CommandInteraction, Guild } from "discord.js";
import { entersState, VoiceConnectionStatus } from '@discordjs/voice';
import { createListeningStream } from "../voice/stream_processor";
import { getConnection } from "../handlers/voiceconnection_handler";
import { Context } from "../shared/context";
import { Player } from "discord-music-player";

const summon = async (
	interaction: CommandInteraction,
	client: Client,
	player: Player
) => {
    await interaction.deferReply();

	let guild = interaction.guild
	if (!guild) {
		await interaction.followUp('You must be in a server to use this command.')
		return
	}

	let connection = await getConnection(client, guild, interaction.user)
	if (!connection) {
		await interaction.followUp('You must be in a voice channel to use this command.')
		return
	}

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
		const receiver = connection.receiver;

		receiver.speaking.on('start', async (userId) => {
				let context = new Context(
					client,
					guild as Guild,
					await client.users.fetch(userId),
					player
				)
				createListeningStream(context, receiver)
		});

		await interaction.followUp('Listening...');
	} catch (error) {
		console.warn(error);
		await interaction.followUp('Failed to join voice channel within 20 seconds, please try again later!');
	}
}

export {
    summon
}