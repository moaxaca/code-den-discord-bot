import { REST } from "@discordjs/rest";
import { Client } from "discord.js";
import { Repository } from "typeorm";
import { Logger } from "winston";

import { CoolGuyModule } from "../modules/cool-guy";
import { DiagnosticsModule } from "../modules/diagnostics";
import { PingModule } from "../modules/ping";
import { ServerInfoModule } from "../modules/server-info";
import { SelectedUsers } from "./persistence";

export class ModuleFactory {
  constructor(
    protected readonly client: Client,
    protected readonly server: REST,
    protected readonly logger: Logger,
  ) {}

  createCoolGuy(persistence: Repository<SelectedUsers>): CoolGuyModule {
    return new CoolGuyModule(this.client, this.server, this.logger, persistence);
  }

  createDiagnostics(): DiagnosticsModule {
    return new DiagnosticsModule(this.client, this.server, this.logger);
  }

  createPing(): PingModule {
    return new PingModule(this.client, this.server, this.logger);
  }

  createServerInfo(): ServerInfoModule {
    return new ServerInfoModule(this.client, this.server, this.logger);
  }
}
