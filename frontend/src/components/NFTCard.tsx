import { Eye, Heart, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'

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

interface NFTCardProps {
  nft: NFT
  onBuy?: (nft: NFT) => void
  onList?: (nft: NFT) => void
  isBuying?: boolean
}

const NFTCard = ({ nft, onBuy, onList, isBuying = false }: NFTCardProps) => {
  const { address, isConnected } = useAccount()
  const isOwner = address?.toLowerCase() === nft.owner.toLowerCase()

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    if (numPrice >= 1) {
      return `${numPrice} BNB`
    }
    return `${(numPrice * 1000).toFixed(0)} Gwei`
  }

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleBuyClick = () => {
    // TODO: Candidate implements — call marketplace contract's buyNFT(tokenId) with correct msg.value, show loading state, refresh listing after confirmation
    onBuy?.(nft)
  }

  return (
    <div className="card nft-card overflow-hidden group">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={nft.imageUrl}
          alt={nft.name}
          className="w-full h-full object-cover bg-secondary-100 transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop'
          }}
        />

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              to={`/nft/${nft.id}`}
              className="bg-primary-500/90 p-2 rounded-full mr-2 hover:bg-primary-400 transition-colors"
            >
              <Eye className="w-5 h-5 text-white" />
            </Link>
            <button className="bg-primary-500/90 p-2 rounded-full hover:bg-primary-400 transition-colors">
              <Heart className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {nft.isListed && (
          <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {formatPrice(nft.price)}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-secondary-900 mb-2 truncate">
          {nft.name}
        </h3>

        <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
          {nft.description}
        </p>

        <div className="flex items-center justify-between text-xs text-secondary-500 mb-4">
          <span>Owner: {truncateAddress(nft.owner)}</span>
          <span>Creator: {truncateAddress(nft.creator)}</span>
        </div>

        <div className="flex items-center space-x-2">
          {nft.isListed ? (
            <>
              <Link
                to={`/nft/${nft.id}`}
                className="btn btn-outline btn-sm flex-1"
              >
                View Details
              </Link>
              {isConnected && !isOwner && (
                <button
                  onClick={handleBuyClick}
                  disabled={isBuying}
                  className="btn btn-primary btn-sm flex items-center space-x-1"
                >
                  {isBuying ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Buy</span>
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <>
              <Link
                to={`/nft/${nft.id}`}
                className="btn btn-outline btn-sm flex-1"
              >
                View Details
              </Link>
              {isConnected && isOwner && (
                <button
                  onClick={() => onList?.(nft)}
                  className="btn btn-primary btn-sm"
                >
                  List
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NFTCard
