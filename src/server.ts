import { Client, Intents } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import { DISCORD_CLIENT_ID, DISCORD_CLIENT_GUILD_ID, DISCORD_CLIENT_TOKEN } from "./config";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once("ready", () => {
	console.log("Ready!");
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;
	const { commandName } = interaction;
	if (commandName === "ping") {
		await interaction.reply("Pong!");
	} else if (commandName === "server") {
		await interaction.reply("Server info.");
	} else if (commandName === "user") {
		await interaction.reply("User info.");
	}
});

client.login(DISCORD_CLIENT_TOKEN);

const commands = [
	new SlashCommandBuilder().setName("ping").setDescription("Replies with pong!"),
	new SlashCommandBuilder().setName("server").setDescription("Replies with server info!"),
	new SlashCommandBuilder().setName("user").setDescription("Replies with user info!"),
]
	.map(command => command.toJSON());

const rest = new REST({ version: "9" }).setToken(DISCORD_CLIENT_TOKEN);

rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_CLIENT_GUILD_ID), { body: commands })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);
