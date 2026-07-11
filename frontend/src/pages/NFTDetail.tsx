import {
  ArrowLeft,
  Calendar,
  Coins,
  ExternalLink,
  ShoppingCart,
  Tag,
  User,
} from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { apiService, NFT, NFTMetadata } from '../utils/api'

const NFTDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const [nft, setNft] = useState<NFT | null>(null)
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(false)
  const [staking, setStaking] = useState(false)
  const [unstaking, setUnstaking] = useState(false)
  const [pendingRewards, setPendingRewards] = useState<string | null>(null)
  const [bidAmount, setBidAmount] = useState('')
  const [bidMessage, setBidMessage] = useState<string | null>(null)
  const [txError, setTxError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const loadNft = async () => {
      try {
        const nftId = parseInt(id, 10)
        const [nftData, metadataData] = await Promise.all([
          apiService.getNFT(nftId),
          apiService.getNFTMetadata(nftId),
        ])
        setNft(nftData)
        setMetadata(metadataData)
      } catch (error) {
        console.error('Failed to load NFT:', error)
        setNft(null)
      } finally {
        setLoading(false)
      }
    }

    loadNft()
  }, [id])

  const isOwner = address?.toLowerCase() === nft?.owner.toLowerCase()
  const isTxInFlight = buying || staking || unstaking

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

  const handleBuy = async () => {
    if (!nft || !isConnected) return

    setBuying(true)
    setTxError(null)
    try {
      // TODO: Candidate implements — call marketplace contract's buyNFT(tokenId) with correct msg.value, show loading state, refresh listing after confirmation
      console.log('Buy NFT stub:', nft.tokenId)
    } catch (error) {
      // TODO: Candidate implements — catch and display user-friendly error messages (user rejected, tx reverted, insufficient gas)
      setTxError(error instanceof Error ? error.message : 'Transaction failed')
    } finally {
      setBuying(false)
    }
  }

  const handleStake = async () => {
    if (!nft) return

    setStaking(true)
    setTxError(null)
    try {
      // TODO: Candidate implements — call staking contract's stake(tokenId), show pending/loading state while tx is unconfirmed, refresh data after confirmation
      console.log('Stake NFT stub:', nft.tokenId)
    } catch (error) {
      // TODO: Candidate implements — catch and display user-friendly error messages (user rejected, tx reverted, insufficient gas)
      setTxError(error instanceof Error ? error.message : 'Stake failed')
    } finally {
      setStaking(false)
    }
  }

  const handleUnstake = async () => {
    if (!nft) return

    setUnstaking(true)
    setTxError(null)
    try {
      // TODO: Candidate implements — call staking contract's unstake(tokenId), show pending/loading state, refresh data after confirmation
      console.log('Unstake NFT stub:', nft.tokenId)
    } catch (error) {
      // TODO: Candidate implements — catch and display user-friendly error messages (user rejected, tx reverted, insufficient gas)
      setTxError(error instanceof Error ? error.message : 'Unstake failed')
    } finally {
      setUnstaking(false)
    }
  }

  useEffect(() => {
    if (!nft) return

  // TODO: Candidate implements — call pendingRewards(tokenId) and display the result, auto-refresh every 10 seconds
    const refreshRewards = () => {
      setPendingRewards(null)
    }

    refreshRewards()
    const interval = setInterval(refreshRewards, 10000)
    return () => clearInterval(interval)
  }, [nft])

  const handleBidSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!nft || !address) return

    setBidMessage(null)
    try {
      // TODO: Candidate implements — POST to backend /api/v1/nfts/:id/bid with bidder address and amount, display success or error response
      console.log('Bid stub:', { nftId: nft.id, bidder: address, amount: bidAmount })
      setBidMessage('Bid submission not implemented yet')
    } catch (error) {
      setBidMessage(error instanceof Error ? error.message : 'Bid failed')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    )
  }

  if (!nft) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-secondary-900 mb-4">
          NFT Not Found
        </h2>
        <p className="text-secondary-600 mb-8">
          The NFT you&apos;re looking for doesn&apos;t exist.
        </p>
        <button
          onClick={() => navigate('/marketplace')}
          className="btn btn-primary"
        >
          Back to Marketplace
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="aspect-square rounded-2xl overflow-hidden bg-secondary-100">
            <img
              src={nft.imageUrl}
              alt={nft.name}
              className="w-full h-full object-cover bg-secondary-100"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop'
              }}
            />
          </div>

          {metadata?.external_url && (
            <a
              href={metadata.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline w-full flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on External Site</span>
            </a>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-secondary-900 mb-4">
              {nft.name}
            </h1>
            <p className="text-secondary-600 text-lg leading-relaxed">
              {nft.description}
            </p>
          </div>

          {nft.isListed && (
            <div className="bg-primary-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-secondary-600">Current Price</span>
                <span className="text-3xl font-bold text-primary-600">
                  {formatPrice(nft.price)}
                </span>
              </div>

              {isConnected && !isOwner ? (
                <button
                  onClick={handleBuy}
                  disabled={buying || isTxInFlight}
                  className="btn btn-primary btn-lg w-full flex items-center justify-center space-x-2"
                >
                  {buying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Buy Now</span>
                    </>
                  )}
                </button>
              ) : !isConnected ? (
                <div className="text-center">
                  <p className="text-secondary-600 mb-4">
                    Connect your wallet to buy this NFT on BSC Testnet
                  </p>
                </div>
              ) : null}
            </div>
          )}

          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200 space-y-4">
            <h3 className="text-xl font-semibold text-secondary-900 flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary-600" />
              Staking
            </h3>

            <div className="bg-secondary-50 rounded-lg p-4">
              <p className="text-sm text-secondary-500 mb-1">Pending Rewards</p>
              <p className="text-2xl font-bold text-primary-600">
                {pendingRewards ?? '— NTE'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStake}
                disabled={isTxInFlight}
                className="btn btn-primary flex-1"
              >
                {staking ? 'Staking...' : 'Stake'}
              </button>
              <button
                onClick={handleUnstake}
                disabled={isTxInFlight}
                className="btn btn-outline flex-1"
              >
                {unstaking ? 'Unstaking...' : 'Unstake'}
              </button>
            </div>
            {/* TODO: Candidate implements — prevent double-submission */}
            {txError && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{txError}</p>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200 space-y-4">
            <h3 className="text-xl font-semibold text-secondary-900">Place a Bid</h3>
            <form onSubmit={handleBidSubmit} className="space-y-3">
              <input
                type="number"
                step="0.001"
                min="0"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Bid amount in BNB"
                className="input w-full"
                required
              />
              <button type="submit" className="btn btn-primary w-full">
                Submit Bid
              </button>
            </form>
            {bidMessage && (
              <p className="text-sm text-secondary-600 bg-secondary-50 rounded-lg p-3">
                {bidMessage}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-secondary-900">
              NFT Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5 text-secondary-600" />
                <div>
                  <p className="text-sm text-secondary-500">Token ID</p>
                  <p className="font-medium text-secondary-900">#{nft.tokenId}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-secondary-600" />
                <div>
                  <p className="text-sm text-secondary-500">Owner</p>
                  <p className="font-medium text-secondary-900">
                    {truncateAddress(nft.owner)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-secondary-600" />
                <div>
                  <p className="text-sm text-secondary-500">Creator</p>
                  <p className="font-medium text-secondary-900">
                    {truncateAddress(nft.creator)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-secondary-600" />
                <div>
                  <p className="text-sm text-secondary-500">Chain</p>
                  <p className="font-medium text-secondary-900">BSC Testnet</p>
                </div>
              </div>
            </div>
          </div>

          {metadata?.attributes && metadata.attributes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-secondary-900">
                Attributes
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {metadata.attributes.map((attr, index) => (
                  <div
                    key={index}
                    className="bg-secondary-50 rounded-lg p-3 text-center"
                  >
                    <p className="text-xs text-secondary-500 mb-1">
                      {attr.trait_type}
                    </p>
                    <p className="font-medium text-secondary-900">
                      {attr.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NFTDetail
