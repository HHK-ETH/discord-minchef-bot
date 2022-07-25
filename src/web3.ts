import { Contract, ethers } from 'ethers';
import { MINICHEF_ADDRESS, SUSHI_ADDRESS, RPC, ChainId, MULTICALL } from './constants';
import { ERC20_ABI, MINICHEF_ABI, MULTICALL_ABI, REWARDER_ABI } from './../imports';
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
    rewarder: {
      id: string;
      rewardToken: string;
      rewardPerSecond: string;
    };
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

export async function queryMinichefRewards(
  chainId: number,
  users: IGraphUser[]
): Promise<{
  sushiRewards: number;
  tokenRewards: { [address: string]: { rewards: number; amount: number; token: string; tokenName: string } };
}> {
  const provider = new ethers.providers.JsonRpcProvider(RPC[chainId]);
  const minichef = new Contract(MINICHEF_ADDRESS[chainId], MINICHEF_ABI, provider);
  let sushiRewards = 0;
  let tokenRewards: any = {};
  for (let i = 0; i < users.length; i += 300) {
    const minichefCalls: Call[] = [];
    const rewarderCalls: Call[] = [];
    for (let y = i; y < users.length && y < i + 300; y += 1) {
      const user = users[y];
      const rewarder = new Contract(user.pool.rewarder.id, REWARDER_ABI, provider);
      rewarderCalls.push({
        target: rewarder.address,
        callData: rewarder.interface.encodeFunctionData('pendingToken', [user.pool.id, user.address]),
      });
      minichefCalls.push({
        target: minichef.address,
        callData: minichef.interface.encodeFunctionData('pendingSushi', [user.pool.id, user.address]),
      });
    }
    const minichefResults = await multicall(chainId, minichefCalls, provider);
    const rewarderResults = await multicall(chainId, rewarderCalls, provider);
    for (let a = 0; a < minichefResults.length; a++) {
      const minichefResult = minichefResults[a];
      const rewarderResult = rewarderResults[a];
      if (minichefResult.success === true) {
        const sushiAmount = new AbiCoder().decode(['uint256'], minichefResult.returnData)[0];
        sushiRewards += parseFloat(formatUnits(sushiAmount, 18));
      }
      if (rewarderResult.success === true && rewarderResult.returnData !== '0x') {
        const rewardAmount = new AbiCoder().decode(['uint256'], rewarderResult.returnData)[0];
        const user = users[i + a];
        if (tokenRewards[user.pool.rewarder.id] === undefined) {
          tokenRewards[user.pool.rewarder.id] = {
            rewards: 0,
            token: user.pool.rewarder.rewardToken,
            rewardPerSecond: parseFloat(formatUnits(user.pool.rewarder.rewardPerSecond, 18)),
            tokenName: '',
            amount: 0,
            pingedRefill: false,
          };
        }
        tokenRewards[user.pool.rewarder.id].rewards += parseFloat(formatUnits(rewardAmount, 18)); //TODO query token decimals
      }
    }
  }
  return { sushiRewards, tokenRewards };
}

async function queryRewarderBalance(
  provider: ethers.providers.JsonRpcProvider,
  rewarder: { address: string; token: string }
): Promise<{ amount: number; tokenName: string }> {
  try {
    const rewarderContract = new Contract(rewarder.address, REWARDER_ABI, provider);
    let rewardToken = rewarder.token;
    if (rewardToken === '0x0000000000000000000000000000000000000000') {
      rewardToken = await rewarderContract.rewardToken();
    }
    const rewardTokenContract = new Contract(rewardToken, ERC20_ABI, provider);
    const rewardAmount = await rewardTokenContract.balanceOf(rewarder.address);
    const tokenName = await rewardTokenContract.symbol();
    return { amount: parseFloat(formatUnits(rewardAmount, 18)), tokenName: tokenName };
  } catch (e) {
    return { amount: -1, tokenName: 'Unknown' };
  }
}

export async function queryRewardersbalance(
  chainId: number,
  rewarders: { [address: string]: { rewards: number; token: string; tokenName: string; amount: number } }
): Promise<{ [address: string]: { amount: number; tokenName: string } }> {
  const provider = new ethers.providers.JsonRpcProvider(RPC[chainId]);
  const result: any = {};
  for (const rewarderAddress in rewarders) {
    const res = await queryRewarderBalance(provider, {
      address: rewarderAddress,
      token: rewarders[rewarderAddress].token,
    });
    result[rewarderAddress] = res;
  }
  return result;
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
