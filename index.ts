import dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';
import { slashBalance, slashChains, slashRewards } from './src';
dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });

//discord api setup
client.login(process.env.DISCORD_TOKEN).then(
  async () => {
    if (!process.env.GUILDS || !process.env.CHANNELS) throw Error('.env files missing guild or channel id.');

    //add commands
    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) return;

      const { commandName } = interaction;

      if (commandName === 'chains') {
        return await slashChains(interaction);
      }
      if (commandName === 'balance') {
        await interaction.deferReply({ ephemeral: true });
        return await slashBalance(interaction);
      }
      if (commandName === 'rewards') {
        await interaction.deferReply({ ephemeral: true });
        return await slashBalance(interaction);
      }
    });
  },
  (err) => {
    console.log(err);
    throw Error("Can't connect to discord api.");
  }
);
