import fs from 'fs';
import fsPromise from 'fs/promises';
import { ChainId, MINICHEF_ADDRESS } from './constants';

export default class StorageHelper {
  private static instance: StorageHelper;

  private constructor() {
    fs.access('./src/storage.json', fs.constants.R_OK, (err) => {
      if (!err) return;
      const storage: any = {};
      for (const id in MINICHEF_ADDRESS) {
        const label = ChainId[id as any];
        storage[label] = { rewards: 0, amount: 0, pingedRefill: false };
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

  public async read(): Promise<any> {
    const content = await fsPromise.readFile('./src/storage.json', 'utf-8');
    return JSON.parse(content);
  }

  public async write(content: Object): Promise<void> {
    await fsPromise.writeFile('./src/storage.json', JSON.stringify(content));
  }
}
