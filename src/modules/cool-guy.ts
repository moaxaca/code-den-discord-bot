import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Client, Interaction, Message } from "discord.js";
import { Repository } from "typeorm";
import { Logger } from "winston";

import { SelectedUsers } from "../infrastructure/persistence";
import { DiscordModule } from "../infrastructure/module";

interface PersistenceGateway {
  create(userId: string): Promise<SelectedUsers>
  exists(userId: string): Promise<boolean>
  delete(userId: string): Promise<void>
}

const persistenceGateway = (repository: Repository<SelectedUsers>): PersistenceGateway => {
  return {
    create: async (userId: string) => {
      const selectedUser = new SelectedUsers();
      selectedUser.select_key = 'cool_listener';
      selectedUser.user_id = userId;
      return await repository.save(selectedUser);
    },
    exists: async (userId: string) => {
      const count = await repository
        .createQueryBuilder()
        .where("select_key = :select_key", { select_key: 'cool_listener' })
        .andWhere("user_id = :user_id", { user_id: userId })
        .getCount();
      return count > 0;
    },
    delete: async (userId: string) => {
      const entities = await repository
        .createQueryBuilder()
        .where("select_key = :select_key", { select_key: 'cool_listener' })
        .andWhere("user_id = :user_id", { user_id: userId })
        .getMany();
      await Promise.all(entities.map(entity => repository.remove(entity)));
    },
  }
}

export class CoolGuyModule extends DiscordModule {
  private readonly gateway: PersistenceGateway;

  constructor(    
    protected readonly client: Client,
    protected readonly server: REST,
    protected readonly logger: Logger,
    protected readonly repository: Repository<SelectedUsers>
  ) {
    super(client, server, logger);
    this.gateway = persistenceGateway(repository);
  } 

  async load(): Promise<void> {
    this.client.on("interactionCreate", async (interaction: Interaction) => {
      if (!interaction.isCommand()) return;
      if (interaction.commandName === "listen") {
        const exists = await this.gateway.exists(interaction.user.id);
        if (exists) {
          await this.gateway.create(interaction.user.id);
        }
        await interaction.reply("Clearly cool af.");
      }
      if (interaction.commandName === "forget") {
        const exists = await this.gateway.exists(interaction.user.id);
        if (exists) {
          await this.gateway.delete(interaction.user.id);
        }
        await interaction.reply("Clearly uncool");
      }
    });
    this.client.on('messageCreate', async (message: Message<boolean>) => {
      if (message.author.bot) return;
      const exists = await this.gateway.exists(message.author.id);
        if (exists) {
        message.react('a:blobreach:938618547167457310');
      }
    });
    const commands = [
      new SlashCommandBuilder().setName("listen").setDescription("Listens for specific phrases"),
      new SlashCommandBuilder().setName("forget").setDescription("Listens for specific phrases"),
    ];
    this.registerCommands(commands);
  }

  getModuleName(): string {
    return 'CoolGuyModule';
  }
}
