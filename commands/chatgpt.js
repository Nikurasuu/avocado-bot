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
  return response.text;
}

async function startConversation(prompt, interaction) {
  let chatHistory = [prompt];
  let conversationEnded = false;

  while (!conversationEnded) {
    // Send prompt to ChatGPT and wait for response
    const response = await sendPrompt(chatHistory.join('\n'));
    log('received response: ' + response);

    // Send response to user and wait for their reply
    await interaction.followUp(response);
    const reply = await interaction.channel.awaitMessages({
      max: 1,
      time: 10000
    });

    if (!reply.size) {
      // User didn't reply in time
      await interaction.followUp("I'm sorry, I didn't receive a reply. The conversation has ended.");
      conversationEnded = true;
    } else {
      // Add user's reply to chat history and continue conversation
      const userReply = reply.first().content.trim();
      if (userReply.toLowerCase() === 'end conversation') {
        await interaction.followUp("Goodbye!");
        conversationEnded = true;
      } else {
        chatHistory.push(userReply);
        log('added user reply to chat history: ' + userReply);
      }
    }
  }
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
      interaction.deferReply();
      try {
        await startConversation(prompt, interaction);
      } catch (error) {
        console.error(error);
        await interaction.followUp('There was an error while processing your request.');
      }
    }
}
