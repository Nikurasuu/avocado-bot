import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import config from "./config.json" assert { type: "json" };
import fs from 'node:fs';
import moment from "moment";

const token = config.token;
const guildId = config.guildId;
const clientId = config.clientId;

const rest = new REST({ version: '10' }).setToken(token);
const log = x => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`) };

log(`Loaded guildId ${guildId}`);
log(`Loaded clientId ${clientId}`);

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    console.log(`Loading command ${file}`);
    try {
        const { default: command } = await import(`./commands/${file}`);
        commands.push(command.data.toJSON());
    } catch (error) {
        console.log(`Error loading command ${file}`);
        console.error(error);
    }
}

const commandData = commands.map(command => command);

(async () => {
  try {
    log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commandData },
    );

    log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();