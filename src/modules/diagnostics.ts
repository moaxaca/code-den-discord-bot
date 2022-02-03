import { Interaction } from "discord.js";
import { DiscordModule } from "../infrastructure/module";

export class DiagnosticsModule extends DiscordModule {
  async load(): Promise<void> {
    this.client.once("ready", () => {
      this.logger.info("Ready!");
    });
    this.client.on("interactionCreate", async (interaction: Interaction) => {
      this.logger.info(`${interaction.user.tag} in #${interaction.channel.id} triggered an interaction.`);
    });
  }

  getModuleName(): string {
    return 'DiagnosticsModule';
  }
}
