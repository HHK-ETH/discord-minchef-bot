import { Contract, ethers } from 'ethers';
import { MINICHEF_ADDRESS, SUSHI_ADDRESS, RPC, ChainId } from './constants';
import { ERC20_ABI } from './../imports';
import { formatUnits } from 'ethers/lib/utils';

export async function queryMinichefSushiBalance(chainId: number): Promise<number> {
  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC[chainId]);
    const sushiToken = new Contract(SUSHI_ADDRESS[chainId], ERC20_ABI, provider);
    const sushiAmount = await sushiToken.balanceOf(MINICHEF_ADDRESS[chainId]);
    return parseFloat(formatUnits(sushiAmount, 18));
  } catch (e) {
    return -1;
  }
}

export async function queryAllMinichefSushiBalance(): Promise<any[]> {
  const amounts = [];
  for (const id in MINICHEF_ADDRESS) {
    const sushiAmount = await queryMinichefSushiBalance(id as any);
    const label = ChainId[id as any];
    amounts.push({
      label: label,
      amount: sushiAmount,
    });
  }
  return amounts;
}
