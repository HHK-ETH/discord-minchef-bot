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
    .setName('balance')
    .setDescription('/balance <chain-name> (See /chains) => return the amount of sushi on the corresponding minichef.'),
  new SlashCommandBuilder()
    .setName('rewards')
    .setDescription(
      '/rewards <chain-name> (See /chains) => return the amount of sushi needed to fullfil users rewards.'
    ),
  new SlashCommandBuilder()
    .setName('chains')
    .setDescription('Return the chains available for /balance and /rewards commands.'),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
