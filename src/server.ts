import { Client, Intents } from "discord.js";
import { REST } from "@discordjs/rest";

import { DISCORD_CLIENT_TOKEN } from "./config";
import { RunnerConfig, setupRunner } from "./job-runner";
import { ModuleFactory } from "./infrastructure/module-factory";
import { ModuleLoader } from "./infrastructure/module-loader";
import { createLogger } from "./infrastructure/logger";
import { createPersistent } from "./infrastructure/persistence";

const isDebug = true;
const shouldRunJobs = true;

const bootstrap = async () => {
	// Core Dependencies 
	const logger = createLogger({
		isProduction: false,	
	});
	const persistence = await createPersistent({
		connectionConfig: {
			type: "sqlite",
  		database: `local.sqlite`,
  		logging: true,
			synchronize: true,
		}
	});
	// Create Client & Server
	const client = new Client({
		intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
	});
	const server = new REST({ version: "9" }).setToken(DISCORD_CLIENT_TOKEN);
	client.login(DISCORD_CLIENT_TOKEN);
	
	// Register All Modules
	const factory = new ModuleFactory(client, server, logger);
	const moduleLoader = new ModuleLoader(server, logger);
	if (isDebug) {
		moduleLoader.registerModule(factory.createDiagnostics());
		moduleLoader.registerModule(factory.createPing());
		moduleLoader.registerModule(factory.createServerInfo());
	}
	moduleLoader.registerModule(factory.createCoolGuy(persistence.selectedUsersRepository));
	await moduleLoader.load();

	// Setup Job Runner
	const runnerConfig: RunnerConfig = {
		birthdayJob: {
			//cron: '*/15 * * * *',
			cron: '* * * * *',
		}
	}
	if (shouldRunJobs) {
		await setupRunner(runnerConfig);
	}
}

bootstrap().catch(console.error);
