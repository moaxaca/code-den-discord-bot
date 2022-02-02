import { SlashCommandBuilder } from "@discordjs/builders";

export const commands = [
	new SlashCommandBuilder().setName("ping").setDescription("Replies with pong!"),
	new SlashCommandBuilder().setName("server").setDescription("Replies with server info!"),
	new SlashCommandBuilder().setName("user").setDescription("Replies with user info!"),
	new SlashCommandBuilder().setName("listen").setDescription("Listens for messages in a specific channel"),
];
