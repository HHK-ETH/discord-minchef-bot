import fs from 'fs';
import fsPromise from 'fs/promises';
import { ChainId, MINICHEF_ADDRESS } from './constants';

type Storage = {
  [label: string]: {
    rewards: {
      sushiRewards: number;
      tokenRewards: { [address: string]: { rewards: number; amount: number; token: string; tokenName: string } };
    };
    amount: number;
    pingedRefill: boolean;
  };
};

export default class StorageHelper {
  private static instance: StorageHelper;

  private constructor() {
    fs.access('./src/storage.json', fs.constants.R_OK, (err) => {
      if (!err) return;
      const storage: any = {};
      for (const id in MINICHEF_ADDRESS) {
        const label = ChainId[id as any];
        storage[label] = { rewards: { sushiRewards: 0, tokenRewards: {} }, amount: 0, pingedRefill: false };
      }
      fs.writeFile('./src/storage.json', JSON.stringify(storage), (err) => {
        if (!err) return;
        console.log(err);
        throw Error('Impossible to open nor create storage.json.');
      });
    });
  }

  public static getInstance(): StorageHelper {
    if (StorageHelper.instance === undefined) {
      StorageHelper.instance = new StorageHelper();
    }
    return StorageHelper.instance;
  }

  public async read(): Promise<Storage> {
    const content = await fsPromise.readFile('./src/storage.json', 'utf-8');
    return JSON.parse(content);
  }

  public async write(content: Storage): Promise<void> {
    await fsPromise.writeFile('./src/storage.json', JSON.stringify(content));
  }
}
