const OWNER = "0xEA454CBA3F72d0bc966C80875053fd8cb26ae80B";
const CREATOR = "0xEA454CBA3F72d0bc966C80875053fd8cb26ae80B";
const BUYER = "0x1234567890123456789012345678901234567890";

const nftTemplates = [
  {
    name: "Cosmic Explorer #1",
    description: "A rare cosmic explorer NFT with unique attributes",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop",
    price: "0.01",
    isListed: true,
  },
  {
    name: "Digital Art Masterpiece",
    description: "An exquisite piece of digital art",
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&auto=format&fit=crop",
    price: "0.02",
    isListed: true,
  },
  {
    name: "Blockchain Warrior",
    description: "A fierce warrior from the BNB Smart Chain realm",
    imageUrl: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&auto=format&fit=crop",
    price: "0.015",
    isListed: false,
  },
  {
    name: "Abstract Dreams",
    description: "A beautiful abstract digital artwork",
    imageUrl: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&auto=format&fit=crop",
    price: "0.03",
    isListed: true,
  },
  {
    name: "Cyberpunk City",
    description: "A futuristic cityscape in cyberpunk style",
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&auto=format&fit=crop",
    price: "0.025",
    isListed: true,
  },
  {
    name: "Nature's Harmony",
    description: "A peaceful nature scene with vibrant colors",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop",
    price: "0.018",
    isListed: false,
  },
  {
    name: "Neon Genesis",
    description: "Neon-lit genesis artwork on BSC Testnet",
    imageUrl: "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=400&auto=format&fit=crop",
    price: "0.022",
    isListed: true,
  },
  {
    name: "Meta Portal",
    description: "A portal into the NodeMeta universe",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&auto=format&fit=crop",
    price: "0.028",
    isListed: true,
  },
  {
    name: "Golden Validator",
    description: "Honoring BNB Smart Chain validators",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&auto=format&fit=crop",
    price: "0.035",
    isListed: false,
  },
  {
    name: "Node Guardian",
    description: "Guardian of the NodeMeta network",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop",
    price: "0.04",
    isListed: true,
  },
];

function buildHistory(id) {
  const baseTime = 1640995200 + id * 3600;
  return [
    {
      id: id * 10 + 1,
      type: "mint",
      from: "0x0000000000000000000000000000000000000000",
      to: CREATOR,
      price: "0",
      txHash: `0x${String(id).padStart(2, "0")}mint000000000000000000000000000000000000000000000000000000000`,
      timestamp: baseTime,
    },
    {
      id: id * 10 + 2,
      type: "list",
      from: CREATOR,
      to: CREATOR,
      price: nftTemplates[id - 1].price,
      txHash: `0x${String(id).padStart(2, "0")}list000000000000000000000000000000000000000000000000000000000`,
      timestamp: baseTime + 1800,
    },
    {
      id: id * 10 + 3,
      type: id % 2 === 0 ? "transfer" : "bid",
      from: CREATOR,
      to: id % 2 === 0 ? BUYER : OWNER,
      price: nftTemplates[id - 1].price,
      txHash: `0x${String(id).padStart(2, "0")}hist000000000000000000000000000000000000000000000000000000000`,
      timestamp: baseTime + 3600,
    },
  ];
}

const baseNfts = nftTemplates.map((template, index) => {
  const id = index + 1;
  return {
    id,
    tokenId: id,
    ...template,
    tokenUri: `ipfs://QmNodeMeta${id}`,
    owner: OWNER,
    creator: CREATOR,
    history: buildHistory(id),
  };
});

const baseTransactions = [
  {
    id: 1,
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    type: "mint",
    tokenId: 1,
    from: "0x0000000000000000000000000000000000000000",
    to: OWNER,
    price: "0",
    blockNum: 12345678,
    timestamp: 1640995200,
  },
  {
    id: 2,
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    type: "list",
    tokenId: 1,
    from: OWNER,
    to: OWNER,
    price: "0.01",
    blockNum: 12345679,
    timestamp: 1640995260,
  },
  {
    id: 3,
    txHash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
    type: "buy",
    tokenId: 1,
    from: BUYER,
    to: OWNER,
    price: "0.01",
    blockNum: 12345680,
    timestamp: 1640995320,
  },
];

module.exports = {
  baseNfts,
  baseTransactions,
  OWNER,
  BUYER,
};
