import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Client } from "discord.js";
import { Logger } from "winston";

export abstract class DiscordModule {
  private requestParts = [];

  constructor(
    protected readonly client: Client,
    protected readonly server: REST,
    protected readonly logger: Logger,
  ) {}

  abstract load(): Promise<void>;

  abstract getModuleName(): string;

  public getRequestParts(): string[] {
    return this.requestParts;
  }
  protected async registerCommands(commands: SlashCommandBuilder[]): Promise<void> {
    this.requestParts = commands.map(command => command.toJSON());
  }
}
