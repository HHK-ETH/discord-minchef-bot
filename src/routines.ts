import { TextChannel } from 'discord.js';
import StorageHelper from './storageHelper';
import { queryAllMinichefSushiBalance } from './web3';

export async function checkBalanceRoutine(textChannels: TextChannel[], storageHelper: StorageHelper) {
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
