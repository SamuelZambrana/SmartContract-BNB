import { Filter, Grid, List, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import NFTCard from '../components/NFTCard'
import { apiService, NFT } from '../utils/api'

const Marketplace = () => {
  const { isConnected } = useAccount()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [filteredNFTs, setFilteredNFTs] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceFilter, setPriceFilter] = useState<'all' | 'listed'>('all')
  const [buyingId, setBuyingId] = useState<number | null>(null)

  useEffect(() => {
    const loadNfts = async () => {
      try {
        const response = await apiService.getNFTs(1, 20)
        setNfts(response.nfts)
        setFilteredNFTs(response.nfts)
      } catch (error) {
        console.error('Failed to load NFTs:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNfts()
  }, [])

  useEffect(() => {
    let filtered = nfts

    if (searchTerm) {
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nft.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (priceFilter === 'listed') {
      filtered = filtered.filter((nft) => nft.isListed)
    }

    setFilteredNFTs(filtered)
  }, [nfts, searchTerm, priceFilter])

  const handleBuy = async (nft: NFT) => {
    setBuyingId(nft.id)
  }

  const handleList = (nft: NFT) => {
    console.log('Listing NFT:', nft)
    alert(`Listing ${nft.name} for sale on BSC Testnet`)
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
      <div className="text-center">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          NFT Marketplace
        </h1>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          Discover, collect, and trade unique digital assets on BNB Smart Chain Testnet
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-600 w-5 h-5" />
            <input
              type="text"
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-secondary-600" />
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as 'all' | 'listed')}
                className="input"
              >
                <option value="all">All NFTs</option>
                <option value="listed">Listed Only</option>
              </select>
            </div>

            <div className="flex items-center bg-secondary-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-secondary-500 hover:text-secondary-900'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-secondary-500 hover:text-secondary-900'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-secondary-600">
          Showing {filteredNFTs.length} of {nfts.length} NFTs
        </p>
        {!isConnected && (
          <p className="text-sm text-secondary-500">
            Connect your wallet to buy and sell NFTs on BSC Testnet
          </p>
        )}
      </div>

      {filteredNFTs.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-secondary-600" />
          </div>
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">
            No NFTs Found
          </h3>
          <p className="text-secondary-600">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {filteredNFTs.map((nft) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              onBuy={handleBuy}
              onList={handleList}
              isBuying={buyingId === nft.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Marketplace
