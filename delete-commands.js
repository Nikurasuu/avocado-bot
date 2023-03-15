import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import config from "./config.json" assert { type: "json" };
import moment from "moment";
import { Client, GatewayIntentBits } from "discord.js";
const client = new Client({intents: [GatewayIntentBits.Guilds]});

const token = config.token;
const clientId = config.clientId;

const rest = new REST({ version: '10' }).setToken(token);
const log = x => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`) };

client.login(token);
client.on("ready", async () => {
  log(`${client.user.username} is ready!`);

  const guilds = client.guilds.cache.map(guild => guild.id);
  log(`Loaded guilds ${guilds}`);

  log(`Loaded clientId ${clientId}`);

  (async () => {
    try {
      log('Started deleting application (/) commands.');
      for (const guildId of guilds) {
        log(`Refreshing application (/) commands for guild ${guildId}`);
        await rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          { body: [ ] },
        );
      }   
      log('Successfully deleted application (/) commands.');
      process.exit(0);
    } catch (error) {
      console.error(error);
    }
  })();
})