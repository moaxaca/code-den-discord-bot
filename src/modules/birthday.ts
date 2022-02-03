import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Client, Interaction } from "discord.js";
import { Repository } from "typeorm";
import { Logger } from "winston";

import { Birthday } from "../infrastructure/persistence";
import { DiscordModule } from "../infrastructure/module";

const command = 'birthday_register';

export class BirthdayModule extends DiscordModule {
  constructor(    
    protected readonly client: Client,
    protected readonly server: REST,
    protected readonly logger: Logger,
    protected readonly repository: Repository<Birthday>
  ) {
    super(client, server, logger);
  }

  async load(): Promise<void> {
    this.client.on("interactionCreate", async (interaction: Interaction) => {
      if (!interaction.isCommand()) return;
      if (interaction.commandName === command) {
        this.logger.info(interaction);
      }
    });
    const commands = [
      new SlashCommandBuilder().setName(command).setDescription("Register user birthday"),
    ];
    this.registerCommands(commands);
  }

  getModuleName(): string {
    return 'BirthdayModule';
  }
}
