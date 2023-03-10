import { Client, Partials, GatewayIntentBits, Collection } from "discord.js";
const client = new Client({intents: [GatewayIntentBits.Guilds]});
import config from "./config.json" assert { type: "json" };
import { readdirSync } from "fs";
import moment from "moment";
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

const token = config.token;

client.commands = new Collection()
client.slashcommands = new Collection()
client.commandaliases = new Collection()

const rest = new REST({ version: '10' }).setToken(token);

const log = x => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`) };

//slash-command-handler
const slashcommands = [];
readdirSync('./commands/').forEach(async file => {
  const command = await import(`./commands/${file}`).then(c => c.default)
  slashcommands.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
})

client.on("ready", async () => {
        try {
            console.log('Started refreshing application (/) commands.');
            console.log(slashcommands)
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: slashcommands },
            );
        } catch (error) {
            console.error(error);
        }
    log(`${client.user.username} is ready!`);
})

client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;
  const command = client.slashcommands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

//nodejs-events
process.on("unhandledRejection", e => { 
   console.log(e)
 }) 
process.on("uncaughtException", e => { 
   console.log(e)
 })  
process.on("uncaughtExceptionMonitor", e => { 
   console.log(e)
 })
//

client.login(token)