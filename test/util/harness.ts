import { REST } from "@discordjs/rest";
import { Client, Intents, Message, TextChannel } from "discord.js";

import { DiscordModule } from "../../src/infrastructure/module";
import { ModuleFactory } from "../../src/infrastructure/module-factory";
import { createLogger } from "../../src/infrastructure/logger";
import { DISCORD_CLIENT_GUILD_ID, DISCORD_CLIENT_TOKEN } from "../../src/config";

export class DiscordTestingHarness {
  private readonly client: Client;
  private readonly channelId: string;
  private readonly guildId: string;
  private readonly server: REST;
  public readonly moduleFactory: ModuleFactory;

  constructor() {
    const logger = createLogger({
      isProduction: false,
    });
    this.client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
    });
    this.server = new REST({ version: "9" }).setToken(DISCORD_CLIENT_TOKEN);
    this.channelId = '937761541602832384';
    this.guildId = DISCORD_CLIENT_GUILD_ID;
    this.moduleFactory = new ModuleFactory(this.client, this.server, logger);
  }

  async createUniverse(modules: DiscordModule[]): Promise<void> {
    await this.client.login(DISCORD_CLIENT_TOKEN);
    for (const module of modules) {
      await module.load();
    }
  }

  async destroyUniverse(): Promise<void> {
    // TODO
  }

  async sendTestMessage(message: string): Promise<Message> {
    const channel = this.client.channels.cache.get(this.channelId) as TextChannel;
    await channel.send("Functional Test Suite: ");
    return channel.send(message);
  }
}
