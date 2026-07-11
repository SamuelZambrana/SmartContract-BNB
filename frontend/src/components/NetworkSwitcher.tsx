import { useNetwork, useSwitchNetwork } from 'wagmi'
import { bscTestnet } from '../config/chains'

const NetworkSwitcher = () => {
  const { chain } = useNetwork()
  const { switchNetwork, isLoading } = useSwitchNetwork()

  const isCorrectNetwork = chain?.id === bscTestnet.id || chain?.id === 31337

  if (!chain || isCorrectNetwork) {
    return (
      <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 ring-1 ring-primary-200">
        {chain?.id === 31337 ? 'Localhost' : 'BSC Testnet'}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => switchNetwork?.(bscTestnet.id)}
      disabled={isLoading}
      className="btn btn-sm bg-amber-500 hover:bg-amber-600 text-secondary-900 border-0"
    >
      {isLoading ? 'Switching...' : 'Switch to BSC Testnet'}
    </button>
  )
}

export default NetworkSwitcher
