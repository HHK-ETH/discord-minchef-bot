import { TextChannel } from 'discord.js';
import { ChainId, MINICHEF_ADDRESS } from './constants';
import StorageHelper from './storageHelper';
import {
  fetchTheGraphUsers,
  queryAllMinichefSushiBalance,
  queryAllMinichefSushiPerSecond,
  queryMinichefRewards,
  queryRewardersbalance,
} from './web3';

export async function checkRewardersBalanceRoutine(
  textChannels: TextChannel[],
  storageHelper: StorageHelper
): Promise<void> {
  const storage = await storageHelper.read();
  for (const chain in storage) {
    const chainData = storage[chain];
    for (const rewarderAddress in chainData.rewards.tokenRewards) {
      const rewarder = chainData.rewards.tokenRewards[rewarderAddress];
      //todo add 5 days runaway
      if (rewarder.amount < rewarder.rewards && rewarder.pingedRefill === false && rewarder.notify === true) {
        for (const textChannel of textChannels) {
          textChannel.send({
            content:
              'Warning! ' +
              rewarder.tokenName +
              ' rewarder balance is below the rewards due (' +
              rewarder.rewards.toFixed(2) +
              ' ' +
              rewarder.tokenName +
              ', only ' +
              rewarder.amount.toFixed(2) +
              ' ' +
              rewarder.tokenName +
              ' left!',
          });
        }
        storage[chain].rewards.tokenRewards[rewarderAddress].pingedRefill = true;
      } else if (rewarder.amount > rewarder.rewards && rewarder.pingedRefill === true) {
        storage[chain].rewards.tokenRewards[rewarderAddress].pingedRefill = false;
      }
    }
  }
  storageHelper.write(storage);
}

export async function checkBalanceRoutine(textChannels: TextChannel[], storageHelper: StorageHelper): Promise<void> {
  const balances = await queryAllMinichefSushiBalance();
  const sushiPerSecond = await queryAllMinichefSushiPerSecond();
  const storage = await storageHelper.read();
  let i = 0;
  for (const balance of balances) {
    if (balance.amount !== -1 && sushiPerSecond[i] > 0) {
      storage[balance.label].amount = balance.amount;
      if (balance.amount < 1000 && storage[balance.label].pingedRefill === false) {
        for (const textChannel of textChannels) {
          textChannel.send({
            content:
              'Warning! ' +
              balance.label +
              ' minichef balance is below 1000 SUSHI, only ' +
              balance.amount.toFixed(2) +
              ' SUSHI left!',
          });
        }
        storage[balance.label].pingedRefill = true;
      } else if (balance.amount > 1000 && storage[balance.label].pingedRefill === true) {
        storage[balance.label].pingedRefill = false;
      }
    }
    i += 1;
  }
  storageHelper.write(storage);
}

export async function fetchPendingSushiRoutine(storageHelper: StorageHelper): Promise<void> {
  const memory: any = {};
  for (const chainId in MINICHEF_ADDRESS) {
    console.log(chainId + ' start');
    const users = await fetchTheGraphUsers(chainId as any);
    const rewards = await queryMinichefRewards(chainId as any, users);
    const balances = await queryRewardersbalance(chainId as any, rewards.tokenRewards);
    for (const address in balances) {
      rewards.tokenRewards[address].tokenName = balances[address].tokenName;
      rewards.tokenRewards[address].amount = balances[address].amount;
    }
    memory[ChainId[chainId as any]] = rewards;
    console.log(chainId + ' end');
  }
  const storage = await storageHelper.read();
  for (const chainId in MINICHEF_ADDRESS) {
    storage[ChainId[chainId]].rewards = memory[ChainId[chainId]];
  }
  await storageHelper.write(storage);
  console.log('Updated storage.');
}
