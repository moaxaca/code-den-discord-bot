import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Logger } from "winston";
import { DISCORD_CLIENT_GUILD_ID, DISCORD_CLIENT_ID } from "../config";
import { DiscordModule } from "./module";

export class ModuleLoader {
  private modules: DiscordModule[] = []

  constructor(
    protected readonly server: REST,
    protected readonly logger: Logger,
  ) {}

  registerModule(module: DiscordModule): void {
    this.modules.push(module);
  }

  async load(): Promise<void> {
    const requestParts = [];
    const results = await Promise.all(this.modules.map(async (module) => {
      await module.load();
      module.getRequestParts().forEach(part => requestParts.push(part));
      this.logger.info(`Loaded module ${module.getModuleName()}`);
    }));
    results.forEach((maybeError) => {
      if (maybeError !== undefined) console.error(maybeError);
    });
    this.logger.info('All Modules Loaded');
    const request = {
      body: requestParts,
    }
    await this.server.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_CLIENT_GUILD_ID), request)
  }
}