import { Client, GatewayIntentBits, Collection } from "discord.js";
const client = new Client({intents: [GatewayIntentBits.Guilds]});
import config from "./config.json" assert { type: "json" };
import { readdirSync } from "fs";
import moment from "moment";

const token = config.token;

client.commands = new Collection()
client.slashcommands = new Collection()
client.commandaliases = new Collection()

const log = x => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`) };

const slashcommands = [];
readdirSync('./commands/').forEach(async file => {
  const command = await import(`./commands/${file}`).then(c => c.default)
  slashcommands.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
})

client.on("ready", async () => {
    log(`${client.user.username} is ready!`);

    // Set the client user's activity
    client.user.setActivity("with slash commands", { type: "PLAYING" });
})

client.on("interactionCreate", async interaction => {
  log(`${interaction.user.tag} in #${interaction.guild} triggered ${interaction.commandName}`);
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

process.on("unhandledRejection", e => { 
   console.log(e)
 }) 
process.on("uncaughtException", e => { 
   console.log(e)
 })  
process.on("uncaughtExceptionMonitor", e => { 
   console.log(e)
 })

client.login(token)