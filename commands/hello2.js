import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder()
        .setName('hello2')
        .setDescription('Hello world test'),
    async execute(interaction) {
        await interaction.reply('Hello world2!');
    }
}