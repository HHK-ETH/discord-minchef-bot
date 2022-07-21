import { TextChannel } from 'discord.js';
import { ChainId, MINICHEF_ADDRESS } from './constants';
import StorageHelper from './storageHelper';
import { fetchTheGraphUsers, queryAllMinichefSushiBalance, queryMinichefRewards } from './web3';

export async function checkBalanceRoutine(textChannels: TextChannel[], storageHelper: StorageHelper): Promise<void> {
  const balances = await queryAllMinichefSushiBalance();
  const storage = await storageHelper.read();
  for (const balance of balances) {
    if (balance.amount !== -1) {
      storage[balance.label].amount = balance.amount;
      if (balance.amount < 1000 && storage[balance.label].pingedRefill === false) {
        for (const textChannel of textChannels) {
          textChannel.send({
            content:
              'Warning! ' +
              balance.label +
              ' minichef balance is under 1000 SUSHI, only ' +
              balance.amount.toFixed(2) +
              ' SUSHI left!',
          });
        }
        storage[balance.label].pingedRefill = true;
      }
      if (balance.amount > 1000 && storage[balance.label].pingedRefill === true) {
        storage[balance.label].pingedRefill = false;
      }
    }
  }
  storageHelper.write(storage);
}

export async function fetchPendingSushiRoutine(storageHelper: StorageHelper): Promise<void> {
  const memory: any = {};
  for (const chainId in MINICHEF_ADDRESS) {
    const users = await fetchTheGraphUsers(chainId as any);
    const rewards = await queryMinichefRewards(chainId as any, users);
    memory[ChainId[chainId]] = rewards;
  }
  const storage = await storageHelper.read();
  for (const chainId in MINICHEF_ADDRESS) {
    storage[ChainId[chainId]].rewards = memory[ChainId[chainId]];
  }
  await storageHelper.write(storage);
}
