import { gql } from 'graphql-request';

export enum ChainId {
  ETHEREUM = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  POLYGON = 137,
  MATIC_TESTNET = 80001,
  FANTOM = 250,
  FANTOM_TESTNET = 4002,
  GNOSIS = 100,
  BSC = 56,
  BSC_TESTNET = 97,
  ARBITRUM = 42161,
  ARBITRUM_TESTNET = 79377087078960,
  MOONBEAM_TESTNET = 1287,
  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,
  HECO = 128,
  HECO_TESTNET = 256,
  HARMONY = 1666600000,
  HARMONY_TESTNET = 1666700000,
  OKEX = 66,
  OKEX_TESTNET = 65,
  CELO = 42220,
  PALM = 11297108109,
  PALM_TESTNET = 11297108099,
  MOONRIVER = 1285,
  FUSE = 122,
  TELOS = 40,
  HARDHAT = 31337,
  MOONBEAM = 1284,
  OPTIMISM = 10,
  KAVA = 2222,
  METIS = 1088,
  BOBA = 288,
  BTTC = 199,
}

export const SUSHI_ADDRESS: { [chainId: number]: string } = {
  [ChainId.ETHEREUM]: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
  [ChainId.ROPSTEN]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  [ChainId.RINKEBY]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  [ChainId.GÖRLI]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  [ChainId.KOVAN]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  [ChainId.FANTOM]: '0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC',
  [ChainId.POLYGON]: '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a',
  [ChainId.GNOSIS]: '0x2995D1317DcD4f0aB89f4AE60F3f020A4F17C7CE',
  [ChainId.BSC]: '0x947950BcC74888a40Ffa2593C5798F11Fc9124C4',
  [ChainId.ARBITRUM]: '0xd4d42F0b6DEF4CE0383636770eF773390d85c61A',
  [ChainId.AVALANCHE]: '0x37B608519F91f70F2EeB0e5Ed9AF4061722e4F76',
  [ChainId.HECO]: '0x52E00B2dA5Bd7940fFe26B609A42F957f31118D5',
  [ChainId.HARMONY]: '0xBEC775Cb42AbFa4288dE81F387a9b1A3c4Bc552A',
  [ChainId.OKEX]: '0x2218E0D5E0173769F5b4939a3aE423f7e5E4EAB7',
  [ChainId.OKEX_TESTNET]: '',
  [ChainId.PALM]: '',
  [ChainId.PALM_TESTNET]: '',
  [ChainId.MOONRIVER]: '0xf390830DF829cf22c53c8840554B98eafC5dCBc2',
  [ChainId.CELO]: '0x29dFce9c22003A4999930382Fd00f9Fd6133Acd1',
  [ChainId.TELOS]: '0x922D641a426DcFFaeF11680e5358F34d97d112E1',
  [ChainId.FUSE]: '0x90708b20ccC1eb95a4FA7C8b18Fd2C22a0Ff9E78',
  [ChainId.MOONBEAM]: '0x2C78f1b70Ccf63CDEe49F9233e9fAa99D43AA07e',
  [ChainId.KAVA]: '0x7C598c96D02398d89FbCb9d41Eab3DF0C16F227D',
  [ChainId.METIS]: '0x17Ee7E4dA37B01FC1bcc908fA63DF343F23B4B7C',
  [ChainId.BOBA]: '0x5ffccc55c0d2fd6d3ac32c26c020b3267e933f1b',
  [ChainId.OPTIMISM]: '0x3eaeb77b03dbc0f6321ae1b72b2e9adb0f60112b',
  [ChainId.BTTC]: '0x53c56ece35f8cab135e13d6d00499dfc7c07a92e',
};

export const RPC: { [chainId: number]: string } = {
  [ChainId.ETHEREUM]: 'https://eth-mainnet.g.alchemy.com/v2/Y1q21D8WUrAEbkgvEIcnAv5V1R8DN6XL',
  [ChainId.POLYGON]: 'https://polygon-mainnet.g.alchemy.com/v2/m0kQLZbwksQS9RBhzCEAnUFW2Vtb6gpQ',
  [ChainId.GNOSIS]: 'https://rpc.ankr.com/gnosis',
  [ChainId.HARMONY]: 'https://harmony.public-rpc.com',
  [ChainId.ARBITRUM]: 'https://arb-mainnet.g.alchemy.com/v2/1R6qdXuz8FqXgbaEaatn596u4tnTMfNS',
  [ChainId.CELO]: 'https://rpc.ankr.com/celo',
  [ChainId.MOONRIVER]: 'https://moonriver.public.blastapi.io',
  [ChainId.FUSE]: 'https://rpc.fuse.io/',
  [ChainId.FANTOM]: 'https://rpc.ankr.com/fantom',
  [ChainId.MOONBEAM]: 'https://moonbeam.public-rpc.com',
  [ChainId.KAVA]: 'https://evm.kava.io',
  [ChainId.METIS]: 'https://andromeda.metis.io/?owner=1088',
  [ChainId.BOBA]: 'https://mainnet.boba.network',
  [ChainId.OPTIMISM]: 'https://mainnet.optimism.io',
  [ChainId.BTTC]: 'https://rpc.bittorrentchain.io',
};

export const MINICHEF_ADDRESS: { [chainId: number]: string } = {
  [ChainId.ETHEREUM]: '0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d',
  [ChainId.POLYGON]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  [ChainId.GNOSIS]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
  [ChainId.HARMONY]: '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287',
  [ChainId.ARBITRUM]: '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3',
  [ChainId.CELO]: '0x8084936982D089130e001b470eDf58faCA445008',
  [ChainId.MOONRIVER]: '0x3dB01570D97631f69bbb0ba39796865456Cf89A5',
  [ChainId.FUSE]: '0x182CD0C6F1FaEc0aED2eA83cd0e160c8Bd4cb063',
  [ChainId.FANTOM]: '0xf731202A3cf7EfA9368C2d7bD613926f7A144dB5',
  [ChainId.MOONBEAM]: '0x011E52E4E40CF9498c79273329E8827b21E2e581',
  [ChainId.KAVA]: '0xf731202A3cf7EfA9368C2d7bD613926f7A144dB5',
  [ChainId.METIS]: '0x1334c8e873E1cae8467156e2A81d1C8b566B2da1',
  [ChainId.BOBA]: '0x75f52766a6a23f736edefcd69dfbe6153a48c3f3',
  [ChainId.OPTIMISM]: '0xb25157bf349295a7cd31d1751973f426182070d6',
  [ChainId.BTTC]: '0xc09756432dad2ff50b2d40618f7b04546dd20043',
};

export const MINICHEF_SUBGRAPH: { [chainId: number]: string } = {
  [ChainId.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/master-chefv2',
  [ChainId.POLYGON]: 'https://api.thegraph.com/subgraphs/name/sushiswap/matic-minichef',
  [ChainId.GNOSIS]: 'https://api.thegraph.com/subgraphs/name/sushiswap/xdai-minichef',
  [ChainId.HARMONY]: 'https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-minichef',
  [ChainId.ARBITRUM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-minichef',
  [ChainId.CELO]: 'https://api.thegraph.com/subgraphs/name/sushiswap/celo-minichef-v2',
  [ChainId.MOONRIVER]: 'https://api.thegraph.com/subgraphs/name/sushiswap/moonriver-minichef',
  [ChainId.FUSE]: 'https://api.thegraph.com/subgraphs/name/sushiswap/fuse-minichef',
  [ChainId.FANTOM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/fantom-minichef',
  [ChainId.MOONBEAM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/moonbeam-minichef',
  [ChainId.KAVA]: 'https://pvt.graph.kava.io/sushiswap/kava-minichef',
  [ChainId.METIS]: 'https://andromeda.thegraph.metis.io/subgraphs/name/sushiswap/metis-minichef',
  [ChainId.BOBA]: 'https://api.thegraph.com/subgraphs/name/sushiswap/minichef-boba',
  [ChainId.OPTIMISM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/minichef-optimism',
  [ChainId.BTTC]: 'https://subgraphs.sushi.com/subgraphs/name/sushiswap/minichef-bttc',
};

export const MULTICALL: { [chainId: number]: string } = {
  [ChainId.ETHEREUM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.POLYGON]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.GNOSIS]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.HARMONY]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.ARBITRUM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.CELO]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.MOONRIVER]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.FUSE]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.FANTOM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.MOONBEAM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.KAVA]: '0x30A62aA52Fa099C4B227869EB6aeaDEda054d121',
  [ChainId.METIS]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.BOBA]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.OPTIMISM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.BTTC]: '0x3D80B2f148F22Ec150A5dA78e86f479dc1E34b9F',
};

export const QUERY = gql`
  query queryUsers($skip1: Int!, $skip2: Int!, $skip3: Int!, $skip4: Int!, $skip5: Int!, $lastId: ID!) {
    u1: users(skip: $skip1, first: 1000, where: { rewardDebt_gt: 0, id_gt: $lastId }) {
      address
      pool {
        id
        rewarder {
          id
          rewardToken
          rewardPerSecond
        }
      }
    }
    u2: users(skip: $skip2, first: 1000, where: { rewardDebt_gt: 0, id_gt: $lastId }) {
      address
      pool {
        id
        rewarder {
          id
          rewardToken
          rewardPerSecond
        }
      }
    }
    u3: users(skip: $skip3, first: 1000, where: { rewardDebt_gt: 0, id_gt: $lastId }) {
      address
      pool {
        id
        rewarder {
          id
          rewardToken
          rewardPerSecond
        }
      }
    }
    u4: users(skip: $skip4, first: 1000, where: { rewardDebt_gt: 0, id_gt: $lastId }) {
      address
      pool {
        id
        rewarder {
          id
          rewardToken
          rewardPerSecond
        }
      }
    }
    u5: users(skip: $skip5, first: 1000, where: { rewardDebt_gt: 0, id_gt: $lastId }) {
      id
      address
      pool {
        id
        rewarder {
          id
          rewardToken
          rewardPerSecond
        }
      }
    }
  }
`;
