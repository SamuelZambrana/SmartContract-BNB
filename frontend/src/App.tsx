import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Route, Routes } from 'react-router-dom'
import { useAccount } from 'wagmi'

import Header from './components/Header'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import MyNFTs from './pages/MyNFTs'
import NFTDetail from './pages/NFTDetail'
import VerifyDashboard from './pages/VerifyDashboard'

function App() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/nft/:id" element={<NFTDetail />} />
          <Route path="/verify" element={<VerifyDashboard />} />
          <Route path="/dashboard" element={<VerifyDashboard />} />
          <Route
            path="/my-nfts"
            element={
              isConnected ? <MyNFTs /> : (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                    Connect Your Wallet
                  </h2>
                  <p className="text-secondary-500 mb-8">
                    Please connect your wallet to view your NFTs
                  </p>
                  <ConnectButton />
                </div>
              )
            }
          />
        </Routes>
      </main>

      <footer className="border-t border-secondary-200 bg-secondary-50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-secondary-700 text-sm">
          <p>
            &copy; 2025 NodeMeta Assessment. Built on BNB Smart Chain Testnet.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
