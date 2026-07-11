import { Package, Tag, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import NFTCard from '../components/NFTCard'

interface NFT {
  id: number
  tokenId: number
  name: string
  description: string
  imageUrl: string
  owner: string
  creator: string
  price: string
  isListed: boolean
}

const MyNFTs = () => {
  const { address, isConnected } = useAccount()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'owned' | 'created'>('all')

  useEffect(() => {
    if (!isConnected || !address) {
      setLoading(false)
      return
    }

    // Mock data - in real app, fetch from API
    const mockNFTs: NFT[] = [
      {
        id: 1,
        tokenId: 1,
        name: "Cosmic Explorer #1",
        description: "A rare cosmic explorer NFT with unique attributes",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
        owner: address,
        creator: address,
        price: "0.01",
        isListed: true,
      },
      {
        id: 2,
        tokenId: 2,
        name: "Digital Art Masterpiece",
        description: "An exquisite piece of digital art",
        imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
        owner: address,
        creator: address,
        price: "0.02",
        isListed: true,
      },
      {
        id: 3,
        tokenId: 3,
        name: "Blockchain Warrior",
        description: "A fierce warrior from the blockchain realm",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
        owner: address,
        creator: address,
        price: "0.015",
        isListed: false,
      },
      {
        id: 4,
        tokenId: 4,
        name: "Abstract Dreams",
        description: "A beautiful abstract digital artwork",
        imageUrl: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400",
        owner: address,
        creator: "0x1234567890123456789012345678901234567890",
        price: "0.03",
        isListed: true,
      },
    ]

    setNfts(mockNFTs)
    setLoading(false)
  }, [address, isConnected])

  const filteredNFTs = nfts.filter(nft => {
    switch (filter) {
      case 'owned':
        return nft.owner.toLowerCase() === address?.toLowerCase()
      case 'created':
        return nft.creator.toLowerCase() === address?.toLowerCase()
      default:
        return true
    }
  })

  const ownedNFTs = nfts.filter(nft =>
    nft.owner.toLowerCase() === address?.toLowerCase()
  )
  const createdNFTs = nfts.filter(nft =>
    nft.creator.toLowerCase() === address?.toLowerCase()
  )
  const listedNFTs = nfts.filter(nft => nft.isListed)

  const handleBuy = (nft: NFT) => {
    console.log('Buying NFT:', nft)
    alert(`Buying ${nft.name} for ${nft.price} ETH`)
  }

  const handleList = (nft: NFT) => {
    console.log('Listing NFT:', nft)
    alert(`Listing ${nft.name} for sale`)
  }

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-secondary-900 mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-secondary-600">
          Please connect your wallet to view your NFTs
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          My NFTs
        </h1>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          Manage your NFT collection, view your creations, and track your listings
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Total NFTs</p>
              <p className="text-2xl font-bold text-secondary-900">{nfts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Owned</p>
              <p className="text-2xl font-bold text-secondary-900">{ownedNFTs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Created</p>
              <p className="text-2xl font-bold text-secondary-900">{createdNFTs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Listed</p>
              <p className="text-2xl font-bold text-secondary-900">{listedNFTs.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-secondary-900">
            Filter NFTs
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all'
                  ? 'bg-primary-600 text-secondary-900'
                  : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('owned')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'owned'
                  ? 'bg-primary-600 text-secondary-900'
                  : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                }`}
            >
              Owned
            </button>
            <button
              onClick={() => setFilter('created')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'created'
                  ? 'bg-primary-600 text-secondary-900'
                  : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                }`}
            >
              Created
            </button>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      {filteredNFTs.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-12 h-12 text-secondary-600" />
          </div>
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">
            No NFTs Found
          </h3>
          <p className="text-secondary-600">
            {filter === 'all'
              ? "You don't have any NFTs yet. Start collecting!"
              : filter === 'owned'
                ? "You don't own any NFTs yet."
                : "You haven't created any NFTs yet."
            }
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNFTs.map((nft) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              onBuy={handleBuy}
              onList={handleList}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyNFTs