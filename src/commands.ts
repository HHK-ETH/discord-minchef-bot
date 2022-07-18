import { CacheType, CommandInteraction } from 'discord.js';
import { ChainId, MINICHEF_ADDRESS } from './constants';

export async function slashBalance(interaction: CommandInteraction<CacheType>): Promise<void> {
  const chain = interaction.options.getString('chain')?.toUpperCase();
  if (chain === undefined || chain === 'ALL') {
    return await interaction.reply({ content: 'ALL BALANCES', ephemeral: true });
  }
  const chainId = ChainId[chain as any];
  if (chainId !== undefined) {
    return await interaction.reply({ content: MINICHEF_ADDRESS[chainId as any], ephemeral: true });
  }
  return await interaction.reply({
    content: 'No minichef contract for the chain given, see /chains.',
    ephemeral: true,
  });
}

export async function slashRewards(interaction: CommandInteraction<CacheType>): Promise<void> {
  const chain = interaction.options.getString('chain')?.toUpperCase();
  if (chain === undefined || chain === 'ALL') {
    return await interaction.reply({ content: 'ALL rewards', ephemeral: true });
  }
  const chainId = ChainId[chain as any];
  if (chainId !== undefined) {
    return await interaction.reply({ content: MINICHEF_ADDRESS[chainId as any], ephemeral: true });
  }
  return await interaction.reply({
    content: 'No minichef contract for the chain given, see /chains.',
    ephemeral: true,
  });
}

export async function slashChains(interaction: CommandInteraction<CacheType>): Promise<void> {
  let labels: string[] = [];
  for (const id in MINICHEF_ADDRESS) {
    const label = ChainId[id as any];
    labels.push(label);
  }
  interaction.reply({ content: 'Chains availables: ' + labels.join(', ') + '.', ephemeral: true });
}
