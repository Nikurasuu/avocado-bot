import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Replies with information about the bot!'),
  async execute(interaction) {
    await interaction.reply('currently serving ' + interaction.client.guilds.cache.size + ' servers!');
  }
}