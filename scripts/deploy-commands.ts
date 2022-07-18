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
    .setDescription(
      '/balance <chain-name> (polygon, gnosis, harmony, arbitrum, celo, moonriver, moonbeam, fuse, fantom, kava) => return the amount of sushi available on the corresponding minichef.'
    ),
  new SlashCommandBuilder()
    .setName('rewards')
    .setDescription(
      '/rewards <chain-name> (polygon, gnosis, harmony, arbitrum, celo, moonriver, moonbeam, fuse, fantom, kava) => return the amount of sushi needed to fullfil users rewards.'
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
