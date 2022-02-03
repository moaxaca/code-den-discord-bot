import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import { DiscordModule } from "../infrastructure/module";

const pingCommandName = "ping";

export class PingModule extends DiscordModule {
  async load(): Promise<void> {
    this.client.on("interactionCreate", async (interaction: Interaction) => {
      if (!interaction.isCommand()) return;
      if (interaction.commandName === pingCommandName) {
        await interaction.reply("Pong!");
      }
    });
    const commands = [
      new SlashCommandBuilder().setName(pingCommandName).setDescription("Replies with pong!"),
    ];
    await this.registerCommands(commands);
  }

  getModuleName(): string {
    return 'PingModule';
  }
}
