import { SlashCommandBuilder } from '@discordjs/builders';

export default {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('test'),
  async execute(interaction) {
    await interaction.reply('working.');
  }
}