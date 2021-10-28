import { Guild } from 'discord.js';

export const deploy = async (guild: Guild) => {
	await guild.commands.set([
		{
			name: 'summon',
			description: 'Pulls GamerBot into your current voice channel.',
		},
		// {
		// 	name: 'record',
		// 	description: 'Enables recording for a user',
		// 	options: [
		// 		{
		// 			name: 'speaker',
		// 			type: 'USER' as const,
		// 			description: 'The user to record',
		// 			required: true,
		// 		},
		// 	],
		// },
	]);
};