import { SlashCommandBuilder } from '@discordjs/builders';
import moment from "moment";
import { ChatGPTAPI } from 'chatgpt';
import fetch from 'node-fetch';

import config from '../config.json' assert { type: "json" };
const openaiKey = config.openaiKey;

const log = x => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`) };

async function sendPrompt(prompt) {
  log('Fetching response from OpenAI with prompt: ' + prompt);
  const api = new ChatGPTAPI({
    apiKey: openaiKey,
    fetch: fetch
  });

  const response = await api.sendMessage(prompt);
  log('received response.');
  return response.text;
}

export default {
  data: new SlashCommandBuilder()
    .setName('chatgpt')
    .setDescription('Answers a prompt using the OpenAI ChatGPT API.')
    .addStringOption(option => 
      option.setName('prompt')
      .setDescription('The prompt to answer.')),
  async execute(interaction) {
    const prompt = interaction.options.getString('prompt');
    try {
      await interaction.reply('Fetching response from OpenAI...');
      const response = await sendPrompt(prompt);
      await interaction.editReply(response);
    } catch (error) {
      console.error(error);
      await interaction.reply('There was an error while processing your request.');
    }
  }
}