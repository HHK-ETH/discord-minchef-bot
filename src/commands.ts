import { CacheType, CommandInteraction, MessageEmbed } from 'discord.js';
import { ChainId, MINICHEF_ADDRESS } from './constants';
import StorageHelper from './storageHelper';
import { queryAllMinichefSushiBalance, queryMinichefSushiBalance, queryRewardersbalance } from './web3';

export async function slashMinichefsBalance(interaction: CommandInteraction<CacheType>): Promise<void> {
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

export async function slashRewardersBalance(
  interaction: CommandInteraction<CacheType>,
  storageHelper: StorageHelper
): Promise<void> {
  const chain = interaction.options.getString('chain')?.toUpperCase();
  const chainId = ChainId[chain as any];
  if (chainId !== undefined && chain !== undefined) {
    const storage = await storageHelper.read();
    const rewardersData = storage[chain].rewards.tokenRewards;
    const msg = new MessageEmbed()
      .setTitle('Tokens availables')
      .setDescription('Amount of reward tokens available on each rewarder.');
    for (const rewarderAddress in rewardersData) {
      const data = rewardersData[rewarderAddress];
      if (data.amount === -1) {
        msg.addField(
          data.tokenName + ' rewarder (' + rewarderAddress + ')',
          'Error while querying this rewarder, retry later.',
          false
        );
      } else {
        msg.addField(
          data.tokenName + ' rewarder (' + rewarderAddress + ')',
          data.amount.toFixed(2) + ' ' + data.tokenName,
          false
        );
      }
    }
    await interaction.editReply({ embeds: [msg] });
    return;
  }
  //unknow chain
  await interaction.editReply({
    content: 'No rewarders for the chain given, see /chains.',
  });
}

export async function slashMinichefsRewards(
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
      const text = data.amount > data.rewards.sushiRewards ? ' SUSHI' : ' SUSHI <!>Current balance inferior<!>';
      msg.addField(label, data.rewards.sushiRewards.toFixed(2) + text, false);
    }
    await interaction.editReply({ embeds: [msg] });
    return;
  }
  const chainId = ChainId[chain as any];
  if (chainId !== undefined) {
    const label = ChainId[chainId as any];
    const data = storage[label];
    const text = data.amount > data.rewards.sushiRewards ? ' SUSHI' : ' SUSHI <!>Current balance inferior<!>';
    await interaction.editReply({
      content: 'Sushi claimable on ' + chain + ' minichef: ' + data.rewards.sushiRewards.toFixed(2) + text,
    });
    return;
  }
  await interaction.editReply({
    content: 'No minichef contract for the chain given, see /chains.',
  });
}

export async function slashRewardersRewards(
  interaction: CommandInteraction<CacheType>,
  storageHelper: StorageHelper
): Promise<void> {
  const chain = interaction.options.getString('chain')?.toUpperCase();
  const chainId = ChainId[chain as any];
  if (chainId !== undefined && chain !== undefined) {
    const storage = await storageHelper.read();
    const msg = new MessageEmbed()
      .setTitle('Tokens rewards')
      .setDescription('Amount of reward tokens due on each rewarder.');
    for (const rewarderAddress in storage[chain].rewards.tokenRewards) {
      const data = storage[chain].rewards.tokenRewards[rewarderAddress];
      if (data.rewards === -1) {
        msg.addField(
          data.tokenName + ' rewarder (' + rewarderAddress + ')',
          'Error while querying this rewarder, retry later.',
          false
        );
      } else {
        const text = data.rewards > data.amount ? ' <!>Current balance inferior<!>' : '';
        msg.addField(
          data.tokenName + ' rewarder (' + rewarderAddress + ')',
          data.rewards.toFixed(2) + ' ' + data.tokenName + text,
          false
        );
      }
    }
    await interaction.editReply({ embeds: [msg] });
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

export async function slashNotifyRewarder(
  interaction: CommandInteraction<CacheType>,
  storageHelper: StorageHelper
): Promise<void> {
  const chain = interaction.options.getString('chain')?.toUpperCase();
  const chainId = ChainId[chain as any];
  const address = interaction.options.getString('address')?.toLowerCase();
  const activate = interaction.options.getBoolean('activate');
  if (address === undefined || activate === null) {
    return interaction.reply({ content: 'Please specify: chain-name rewarder-address true|false.', ephemeral: true });
  }
  if (chainId === undefined || chain === undefined) {
    return interaction.reply({ content: 'Invalid chain.', ephemeral: true });
  }
  const storage = await storageHelper.read();
  const rewarder = storage[chain].rewards.tokenRewards[address];
  if (rewarder !== undefined) {
    interaction.reply({
      content:
        'Notifications turned ' + (activate === true ? 'on' : 'off') + ' for rewarder: ' + address + ' on ' + chain,
      ephemeral: false,
    });
    storage[chain].rewards.tokenRewards[address].notify = activate;
    return await storageHelper.write(storage);
  }
  return interaction.reply({ content: 'Cannot find the rewarder address on the chain given.', ephemeral: true });
}
