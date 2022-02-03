import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import { DiscordModule } from "../infrastructure/module";

export class ServerInfoModule extends DiscordModule {
  async load(): Promise<void> {
    this.client.on("interactionCreate", async (interaction: Interaction) => {
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
    const commands = [
      new SlashCommandBuilder().setName("server").setDescription("Replies with server info!"),
      new SlashCommandBuilder().setName("user").setDescription("Replies with user info!"),
    ];
    this.registerCommands(commands);
  }

  getModuleName(): string {
    return 'ServerInfoModule';
  }
}
