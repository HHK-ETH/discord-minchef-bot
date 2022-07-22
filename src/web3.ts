import { BigNumber, Contract, ethers } from 'ethers';
import { MINICHEF_ADDRESS, SUSHI_ADDRESS, RPC, ChainId, MULTICALL } from './constants';
import { ERC20_ABI, MINICHEF_ABI, MULTICALL_ABI } from './../imports';
import { AbiCoder, formatUnits } from 'ethers/lib/utils';
import request from 'graphql-request';
import { QUERY, MINICHEF_SUBGRAPH } from './constants';

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

export async function queryMinichefSushiPerSecond(chainId: number): Promise<number> {
  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC[chainId]);
    const minichef = new Contract(MINICHEF_ADDRESS[chainId], MINICHEF_ABI, provider);
    const sushiPerSecond = await minichef.sushiPerSecond();
    return parseFloat(formatUnits(sushiPerSecond, 18));
  } catch (e) {
    return -1;
  }
}

export async function queryAllMinichefSushiBalance(): Promise<{ label: string; amount: number }[]> {
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

export async function queryAllMinichefSushiPerSecond(): Promise<number[]> {
  const sushiPerSecond = [];
  for (const id in MINICHEF_ADDRESS) {
    sushiPerSecond.push(await queryMinichefSushiPerSecond(id as any));
  }
  return sushiPerSecond;
}

export interface IGraphUser {
  pool: {
    id: string;
  };
  address: string;
}

export async function fetchTheGraphUsers(chainId: number): Promise<IGraphUser[]> {
  const users: IGraphUser[] = [];
  let i = 0;
  let lastId = '';
  while (true) {
    try {
      const query = await request(MINICHEF_SUBGRAPH[chainId], QUERY, {
        skip1: 0,
        skip2: 1000,
        skip3: 2000,
        skip4: 3000,
        skip5: 4000,
        lastId: lastId,
      });
      users.push(...query.u1, ...query.u2, ...query.u3, ...query.u4, ...query.u5);
      if (query.u5.length < 1000) {
        break;
      }
      lastId = query.u5[query.u5.length - 1].id;
    } catch (e) {
      console.log(ChainId[chainId]);
      console.log(e);
      break;
    }
    i += 5000;
  }
  return users;
}

export async function queryMinichefRewards(chainId: number, users: IGraphUser[]): Promise<number> {
  const provider = new ethers.providers.JsonRpcProvider(RPC[chainId]);
  const minichef = new Contract(MINICHEF_ADDRESS[chainId], MINICHEF_ABI, provider);
  let rewards = 0;
  for (let i = 0; i < users.length; i += 300) {
    const calls: Call[] = [];
    for (let y = i; y < users.length && y < i + 300; y += 1) {
      const user = users[y];
      calls.push({
        target: minichef.address,
        callData: minichef.interface.encodeFunctionData('pendingSushi', [user.pool.id, user.address]),
      });
    }
    const results = await multicall(chainId, calls, provider);
    results.map((res) => {
      if (res.success === false) return;
      const amount = new AbiCoder().decode(['uint256'], res.returnData)[0];
      rewards += parseFloat(formatUnits(amount, 18));
    });
  }
  return rewards;
}

type Call = {
  target: string;
  callData: string;
};

type Result = {
  success: boolean;
  returnData: string;
};

export async function multicall(
  chainId: number,
  calls: Call[],
  provider: ethers.providers.JsonRpcProvider
): Promise<Result[]> {
  const multicall = new Contract(MULTICALL[chainId], MULTICALL_ABI, provider);
  return await multicall.tryAggregate(false, calls);
}
