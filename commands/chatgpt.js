import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatGPTAPI } from 'chatgpt';
import fetch from 'node-fetch';
import config from '../config.json' assert { type: "json" };
const openaiKey = config.openaiKey;

const question = 'What is the meaning of life?';

async function askQuestion(question) {
  const api = new ChatGPTAPI({
    apiKey: openaiKey,
    fetch: fetch
  });

  const response = await api.sendMessage(question);
  return response.text;
}

export default {
    data: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('Replies with the power of GPT-3!'),
    async execute(interaction) {
        await interaction.reply(askQuestion(question));
    }
}
