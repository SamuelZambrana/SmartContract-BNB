import { Chain } from 'wagmi'

export const bscTestnet: Chain = {
  id: 97,
  name: 'BNB Smart Chain Testnet',
  network: 'bsc-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: {
      http: [
        import.meta.env.VITE_RPC_URL ||
          'https://data-seed-prebsc-1-s1.bnb.org:8545/',
      ],
    },
    public: {
      http: ['https://data-seed-prebsc-1-s1.bnb.org:8545/'],
    },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
  },
  testnet: true,
}

export const localhost: Chain = {
  id: 31337,
  name: 'Hardhat Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
  testnet: true,
}

export const SUPPORTED_CHAINS = [bscTestnet, localhost] as const
export const DEFAULT_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 97)
