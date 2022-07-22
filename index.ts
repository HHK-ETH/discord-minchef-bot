import dotenv from 'dotenv';
import { Client, Intents, TextChannel } from 'discord.js';
import {
  checkBalanceRoutine,
  slashBalance,
  slashChains,
  slashRewards,
  StorageHelper,
  fetchPendingSushiRoutine,
} from './src';
dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });
const storageHelper = StorageHelper.getInstance();

//discord api setup
client.login(process.env.DISCORD_TOKEN).then(
  async () => {
    if (!process.env.GUILDS || !process.env.CHANNELS) throw Error('.env files missing guild or channel id.');

    const guilds = process.env.GUILDS.split(' ');
    const channels = process.env.CHANNELS.split(' ');
    //check channels
    const textChannels = await Promise.all(
      guilds.map(async (guildId, index) => {
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
          throw Error('Impossible to connect to guild: ' + guildId);
        }
        const channel = await guild.channels.fetch(channels[index]);
        if (!channel) {
          throw Error("Can't connect to this channel.");
        }
        const textChannel = await channel.fetch();
        if (!(textChannel instanceof TextChannel)) {
          throw Error('This channel is not a text channel.');
        }
        return textChannel;
      })
    );

    //add routines
    if (!process.env.BALANCE_ROUTINE || !process.env.REWARDS_ROUTINE) {
      throw Error('.env files missing routine times.');
    }
    setInterval(() => checkBalanceRoutine(textChannels, storageHelper), parseInt(process.env.BALANCE_ROUTINE, 10));
    setInterval(() => fetchPendingSushiRoutine(storageHelper), parseInt(process.env.REWARDS_ROUTINE, 10));

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
        return await slashRewards(interaction, storageHelper);
      }
    });
  },
  (err) => {
    console.log(err);
    throw Error("Can't connect to discord api.");
  }
);
