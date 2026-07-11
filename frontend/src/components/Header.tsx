import { Link, useLocation } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Home, Store, User, ClipboardCheck } from 'lucide-react'

import NetworkSwitcher from './NetworkSwitcher'

const Header = () => {
  const { isConnected } = useAccount()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/marketplace', label: 'Marketplace', icon: Store },
    { path: '/verify', label: 'Verify', icon: ClipboardCheck },
    ...(isConnected ? [{ path: '/my-nfts', label: 'My NFTs', icon: User }] : []),
  ]

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/nodemeta.png"
              alt="NodeMeta"
              className="w-10 h-10 rounded-lg object-cover ring-1 ring-primary-200 group-hover:ring-primary-400 transition-all shadow-nm-sm"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-secondary-900 leading-tight tracking-tight">
                Node<span className="text-primary-500">Meta</span>
              </span>
              <span className="text-xs text-secondary-500 -mt-0.5">BSC Testnet</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-3">
            <NetworkSwitcher />
            <ConnectButton />
          </div>
        </div>

        <div className="md:hidden py-3 border-t border-secondary-200">
          <nav className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-secondary-500 hover:text-primary-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
