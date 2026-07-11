import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ArrowRight, Shield, Sparkles, Users, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'

import NFTCard from '../components/NFTCard'
import { apiService, NFT } from '../utils/api'

const Home = () => {
  const { isConnected } = useAccount()
  const [featuredNFTs, setFeaturedNFTs] = useState<NFT[]>([])

  useEffect(() => {
    apiService
      .getNFTs(1, 3)
      .then((res) => setFeaturedNFTs(res.nfts))
      .catch(() => setFeaturedNFTs([]))
  }, [])

  const features = [
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'All transactions are secured by smart contracts on BNB Smart Chain Testnet',
    },
    {
      icon: Zap,
      title: 'Fast & Efficient',
      description: 'Built with modern Web3 technologies for the best user experience',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a growing community of NFT enthusiasts and creators',
    },
    {
      icon: Sparkles,
      title: 'Unique Collections',
      description: 'Discover and collect unique digital assets from talented artists',
    },
  ]

  return (
    <div className="space-y-16">
      <section className="text-center py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <img
            src="/nodemeta.png"
            alt="NodeMeta"
            className="w-24 h-24 mx-auto mb-8 rounded-2xl object-cover ring-2 ring-primary-200 shadow-nm"
          />
          <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6 tracking-tight">
            Discover, Collect & Trade
            <span className="block text-primary-500 mt-2">Unique NFTs</span>
          </h1>
          <p className="text-xl text-secondary-500 mb-8 max-w-2xl mx-auto">
            NodeMeta assessment marketplace on BNB Smart Chain Testnet. Buy, sell,
            and trade unique NFTs in a secure, user-friendly environment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isConnected ? (
              <Link
                to="/marketplace"
                className="btn btn-primary btn-lg flex items-center space-x-2"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <ConnectButton />
            )}
            <Link to="/verify" className="btn btn-outline btn-lg">
              Verification Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Why Choose NodeMeta?
          </h2>
          <p className="text-secondary-500 max-w-2xl mx-auto">
            Built with cutting-edge Web3 technologies for the best NFT trading experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="text-center p-6 rounded-xl border border-secondary-200 bg-white hover:border-primary-300 hover:shadow-nm-sm transition-all"
              >
                <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-primary-100">
                  <Icon className="w-7 h-7 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-500 text-sm">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-secondary-900 mb-2">
              Featured NFTs
            </h2>
            <p className="text-secondary-500">
              Discover the latest and most popular NFTs
            </p>
          </div>
          <Link
            to="/marketplace"
            className="btn btn-outline flex items-center space-x-2"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredNFTs.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl p-12 text-center text-white bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 shadow-nm">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your NFT Journey?
        </h2>
        <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
          Connect your wallet on BSC Testnet and start exploring unique NFTs.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isConnected ? (
            <Link
              to="/marketplace"
              className="btn bg-white text-primary-700 hover:bg-primary-50 btn-lg"
            >
              Start Trading
            </Link>
          ) : (
            <ConnectButton />
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
