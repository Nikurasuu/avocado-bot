import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import config from "./config.json" assert { type: "json" };
import moment from "moment";

const token = config.token;
const guildId = config.guildId;
const clientId = config.clientId;

const rest = new REST({ version: '10' }).setToken(token);
const log = x => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`) };

log(`Loaded guildId ${guildId}`);
log(`Loaded clientId ${clientId}`);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);