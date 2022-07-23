import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';
dotenv.config();
const [clientId, token] = [process.env.DISCORD_APP_ID, process.env.DISCORD_TOKEN];
if (!token || !clientId) {
  throw Error('Incomplete env file.');
}

const commands = [
  new SlashCommandBuilder()
    .setName('minichefs-balance')
    .setDescription('/minichefs-balance <chain | all> => Returns amount of sushi on the corresponding minichef.')
    .addStringOption((option) => option.setName('chain').setDescription('Chain name or all').setRequired(true)),
  new SlashCommandBuilder()
    .setName('rewarders-balance')
    .setDescription('/rewarders-balance <chain> => Returns the amount of reward tokens on the corresponding rewarders.')
    .addStringOption((option) => option.setName('chain').setDescription('Chain name or all').setRequired(true)),
  new SlashCommandBuilder()
    .setName('minichefs-rewards')
    .setDescription('/rewards <chain | all> => Returns the amount of sushi due to users.')
    .addStringOption((option) => option.setName('chain').setDescription('Chain name or all').setRequired(true)),
  new SlashCommandBuilder()
    .setName('rewarders-rewards')
    .setDescription('/rewards <chain> => Returns the amount of reward tokens needed due to users.')
    .addStringOption((option) => option.setName('chain').setDescription('Chain name or all').setRequired(true)),
  new SlashCommandBuilder()
    .setName('chains')
    .setDescription('Returns the chains available for /balance and /rewards commands.'),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
