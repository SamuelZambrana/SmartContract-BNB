export const STAKING_ABI = [
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'pendingRewards',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'getStakedTokens',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const MARKETPLACE_ABI = [
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'buyNFT',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

export const contractAddresses = {
  marketplace: (import.meta.env.VITE_MARKETPLACE_ADDRESS ||
    import.meta.env.VITE_CONTRACT_ADDRESS ||
    '0x0000000000000000000000000000000000000000') as `0x${string}`,
  nftToken: (import.meta.env.VITE_NFT_TOKEN_ADDRESS ||
    '0x0000000000000000000000000000000000000000') as `0x${string}`,
  staking: (import.meta.env.VITE_STAKING_ADDRESS ||
    '0x0000000000000000000000000000000000000000') as `0x${string}`,
  rewardToken: (import.meta.env.VITE_REWARD_TOKEN_ADDRESS ||
    '0x0000000000000000000000000000000000000000') as `0x${string}`,
}
