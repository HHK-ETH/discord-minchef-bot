import { CacheType, CommandInteraction, MessageEmbed } from 'discord.js';
import { ChainId, MINICHEF_ADDRESS } from './constants';
import StorageHelper from './storageHelper';
import { queryAllMinichefSushiBalance, queryMinichefSushiBalance } from './web3';

export async function slashBalance(interaction: CommandInteraction<CacheType>): Promise<void> {
  const chain = interaction.options.getString('chain')?.toUpperCase();
  //all chains
  if (chain === undefined || chain === 'ALL') {
    const amounts = await queryAllMinichefSushiBalance();
    const msg = new MessageEmbed()
      .setTitle('Sushi availables')
      .setDescription('Amount of sushi available on each minichef.');
    for (const amount of amounts) {
      if (amount.amount === -1) {
        msg.addField(amount.label, 'RPC for this chain unreachable, retry later.', false);
      } else {
        const text = amount.amount > 1000 ? ' SUSHI' : ' SUSHI <!>LOW<!>';
        msg.addField(amount.label, amount.amount.toFixed(2) + text, false);
      }
    }
    await interaction.editReply({ embeds: [msg] });
    return;
  }
  //chain in particular
  const chainId = ChainId[chain as any];
  if (chainId !== undefined) {
    const amount = await queryMinichefSushiBalance(chainId as any);
    if (amount === -1) {
      await interaction.editReply({ content: 'RPC for this chain unreachable, retry later.' });
      return;
    }
    const text = amount > 1000 ? ' SUSHI' : ' SUSHI <!>LOW<!>';
    await interaction.editReply({ content: 'Sushi available on ' + chain + ' minichef: ' + amount.toFixed(2) + text });
    return;
  }
  //unknow chain
  await interaction.editReply({
    content: 'No minichef contract for the chain given, see /chains.',
  });
}

export async function slashRewards(
  interaction: CommandInteraction<CacheType>,
  storageHelper: StorageHelper
): Promise<void> {
  const storage = await storageHelper.read();
  const chain = interaction.options.getString('chain')?.toUpperCase();
  if (chain === undefined || chain === 'ALL') {
    const msg = new MessageEmbed()
      .setTitle('Sushi Rewards')
      .setDescription('Amount of sushi claimable on each minichef.');
    for (const chainId in MINICHEF_ADDRESS) {
      const label = ChainId[chainId as any];
      const data = storage[label];
      const text = data.amount > data.rewards ? ' SUSHI' : ' SUSHI <!>Current balance inferior<!>';
      msg.addField(label, data.rewards.toFixed(2) + text, false);
    }
    await interaction.editReply({ embeds: [msg] });
    return;
  }
  const chainId = ChainId[chain as any];
  if (chainId !== undefined) {
    const label = ChainId[chainId as any];
    const data = storage[label];
    const text = data.amount > data.rewards ? ' SUSHI' : ' SUSHI <!>Current balance inferior<!>';
    await interaction.editReply({
      content: 'Sushi claimable on ' + chain + ' minichef: ' + data.rewards.toFixed(2) + text,
    });
    return;
  }
  await interaction.editReply({
    content: 'No minichef contract for the chain given, see /chains.',
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
