import { Awaitable, Channel, Client, Intents, Interaction, Message, TextChannel } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import { DISCORD_CLIENT_ID, DISCORD_CLIENT_GUILD_ID, DISCORD_CLIENT_TOKEN } from "./config";
import { commands } from "./commands";

// Registered Servers - Expand on this later
const registeredGuilds = [DISCORD_CLIENT_GUILD_ID];

// Setup Interactor Client - This Listens For Events 
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.once("ready", () => {
	console.log("Ready!");
});

const testChannel = "937761541602832384";
const domsUserId = "219686390152167424"
const mattUserId = "894924738642710539"

client.on("interactionCreate", async (interaction: Interaction) => {
	console.log(`${interaction.user.tag} in #${interaction.channel.id} triggered an interaction.`);

	if (!interaction.isCommand()) return;
	const { commandName } = interaction;
	if (commandName === "ping") {
		await interaction.reply("Pong!");
	} else if (commandName === "server") {
		await interaction.reply("Server info.");
	} else if (commandName === "user") {
		await interaction.reply("User info.");
	} else if (commandName === "listen") {
		// Register Channel 
	}
});

client.on('messageCreate', async (message: Message<boolean>) => {
	if (message.author.bot) return;
	if (message.author.id === domsUserId) {
		const channel = client.channels.cache.get(message.channelId) as TextChannel;
		channel.send("Dom we're watching you.");
	}
	console.log(message);
});

client.login(DISCORD_CLIENT_TOKEN);

// Construct Rest Server - This listens for commands
const rest = new REST({ version: "9" }).setToken(DISCORD_CLIENT_TOKEN);
registeredGuilds.forEach(guildId => {
	const request = {
		body: commands.map(command => command.toJSON())
	}
	rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, guildId), request)
		.then(() => console.log("Successfully registered application commands."))
		.catch(console.error);
});
