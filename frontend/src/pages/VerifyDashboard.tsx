import { useCallback, useEffect, useState } from 'react'
import {
  CheckCircle2,
  Circle,
  Loader2,
  Server,
  Shield,
  Wallet,
  XCircle,
} from 'lucide-react'
import { useAccount, useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from 'wagmi'
import { formatEther } from 'viem'
import clsx from 'clsx'

import { contractAddresses, STAKING_ABI } from '../config/contracts'
import { apiService } from '../utils/api'

type TabId = 'contracts' | 'backend' | 'frontend' | 'payments'
type Status = 'pass' | 'fail' | 'pending' | 'idle'

interface CheckItem {
  label: string
  status: Status
  detail?: string
}

const statusIcon = (status: Status) => {
  if (status === 'pass') return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
  if (status === 'fail') return <XCircle className="h-5 w-5 text-red-600" />
  if (status === 'pending') return <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
  return <Circle className="h-5 w-5 text-secondary-400" />
}

const statusCardClass = (connected: boolean | null) =>
  clsx(
    'rounded-xl border p-4 text-center shadow-sm transition-colors',
    connected === null && 'border-secondary-200 bg-secondary-50 text-secondary-600',
    connected === true && 'border-emerald-200 bg-emerald-50 text-emerald-800',
    connected === false && 'border-red-200 bg-red-50 text-red-800'
  )

const VerifyDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabId>('contracts')
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null)
  const [paymentsConnected, setPaymentsConnected] = useState<boolean | null>(null)
  const [tokenId, setTokenId] = useState('1')
  const [historyNftId, setHistoryNftId] = useState('1')
  const [bidNftId, setBidNftId] = useState('1')
  const [bidAmount, setBidAmount] = useState('0.05')
  const [historyResult, setHistoryResult] = useState('')
  const [bidResult, setBidResult] = useState('')
  const [paymentEvents, setPaymentEvents] = useState<unknown[]>([])
  const [paymentResult, setPaymentResult] = useState('')
  const [frontendChecks, setFrontendChecks] = useState<Record<string, boolean>>({
    wallet: false,
    stakeLoading: false,
    unstakeLoading: false,
    rewardsRefresh: false,
    errorDisplay: false,
    disableButtons: false,
    buyNft: false,
    bidSubmit: false,
  })

  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  const stakingDeployed =
    contractAddresses.staking !== '0x0000000000000000000000000000000000000000'

  const { data: pendingRewardsData, refetch: refetchRewards } = useContractRead({
    address: contractAddresses.staking,
    abi: STAKING_ABI,
    functionName: 'pendingRewards',
    args: [BigInt(Number(tokenId) || 1)],
    enabled: stakingDeployed,
    watch: true,
  })

  const { data: stakedTokensData, refetch: refetchStaked } = useContractRead({
    address: contractAddresses.staking,
    abi: STAKING_ABI,
    functionName: 'getStakedTokens',
    args: [address || '0x0000000000000000000000000000000000000000'],
    enabled: stakingDeployed && !!address,
  })

  const { data: stakeTx, write: stakeWrite, isLoading: stakeLoading } = useContractWrite({
    address: contractAddresses.staking,
    abi: STAKING_ABI,
    functionName: 'stake',
  })

  const { data: unstakeTx, write: unstakeWrite, isLoading: unstakeLoading } = useContractWrite({
    address: contractAddresses.staking,
    abi: STAKING_ABI,
    functionName: 'unstake',
  })

  const { isLoading: stakeWaiting, isSuccess: stakeSuccess } = useWaitForTransaction({
    hash: stakeTx?.hash,
  })

  const { isLoading: unstakeWaiting, isSuccess: unstakeSuccess } = useWaitForTransaction({
    hash: unstakeTx?.hash,
  })

  const checkServices = useCallback(async () => {
    try {
      await apiService.healthCheck()
      setBackendConnected(true)
    } catch {
      setBackendConnected(false)
    }

    try {
      await apiService.paymentsHealthCheck()
      setPaymentsConnected(true)
    } catch {
      setPaymentsConnected(false)
    }
  }, [])

  useEffect(() => {
    checkServices()
    const interval = setInterval(checkServices, 15000)
    return () => clearInterval(interval)
  }, [checkServices])

  useEffect(() => {
    const loadEvents = async () => {
      if (!paymentsConnected) return
      try {
        const data = await apiService.getPaymentEvents()
        setPaymentEvents(data.events || [])
      } catch {
        setPaymentEvents([])
      }
    }

    loadEvents()
    const interval = setInterval(loadEvents, 5000)
    return () => clearInterval(interval)
  }, [paymentsConnected])

  useEffect(() => {
    if (!stakingDeployed) return
    const interval = setInterval(() => {
      refetchRewards()
    }, 10000)
    return () => clearInterval(interval)
  }, [stakingDeployed, refetchRewards, tokenId])

  const contractChecks: CheckItem[] = [
    {
      label: 'Staking contract deployed',
      status: stakingDeployed ? 'pass' : 'fail',
      detail: contractAddresses.staking,
    },
    {
      label: 'stake() works — NFT transferred',
      status: stakeSuccess ? 'pass' : stakeTx?.hash ? 'pending' : 'idle',
      detail: stakeTx?.hash,
    },
    {
      label: 'pendingRewards() returns increasing value',
      status:
        pendingRewardsData !== undefined && pendingRewardsData !== null
          ? Number(pendingRewardsData) > 0
            ? 'pass'
            : 'fail'
          : 'idle',
      detail:
        pendingRewardsData !== undefined
          ? `${formatEther(pendingRewardsData as bigint)} NTE`
          : 'Not implemented yet',
    },
    {
      label: 'unstake() works — NFT returned + rewards paid',
      status: unstakeSuccess ? 'pass' : unstakeTx?.hash ? 'pending' : 'idle',
      detail: unstakeTx?.hash,
    },
  ]

  const fetchHistory = async () => {
    setHistoryResult('Loading...')
    try {
      const data = await apiService.getNFTHistory(Number(historyNftId))
      setHistoryResult(JSON.stringify(data, null, 2))
    } catch (error: unknown) {
      const err = error as { response?: { status: number; data?: unknown }; message?: string }
      setHistoryResult(
        JSON.stringify(
          { status: err.response?.status, error: err.response?.data || err.message },
          null,
          2
        )
      )
    }
  }

  const submitBid = async () => {
    setBidResult('Submitting...')
    try {
      const data = await apiService.submitBid(
        Number(bidNftId),
        address || '0x0000000000000000000000000000000000000000',
        bidAmount
      )
      setBidResult(JSON.stringify(data, null, 2))
    } catch (error: unknown) {
      const err = error as { response?: { status: number; data?: unknown }; message?: string }
      setBidResult(
        JSON.stringify(
          { status: err.response?.status, error: err.response?.data || err.message },
          null,
          2
        )
      )
    }
  }

  const fetchUserTransactions = async () => {
    if (!address) return
    setHistoryResult('Loading user transactions...')
    try {
      const data = await apiService.getTransactionsByUser(address)
      setHistoryResult(JSON.stringify(data, null, 2))
    } catch (error: unknown) {
      const err = error as { response?: { status: number; data?: unknown }; message?: string }
      setHistoryResult(
        JSON.stringify(
          { status: err.response?.status, error: err.response?.data || err.message },
          null,
          2
        )
      )
    }
  }

  const simulatePayment = async (type: 'valid' | 'slippage' | 'duplicate' | 'fail') => {
    const base = {
      orderId: type === 'fail' ? 'order_FAIL' : 'order_verify_001',
      tokenAmount: type === 'slippage' ? 50 : 100,
      tokenPriceAtOrderTime: type === 'slippage' ? 0.001 : 0.0023,
      expectedAmount: 0.23,
      token: 'NTE',
      timestamp: Date.now(),
    }

    try {
      const result = await apiService.sendPaymentWebhook(base)
      setPaymentResult(JSON.stringify(result, null, 2))

      if (type === 'duplicate') {
        const dup = await apiService.sendPaymentWebhook(base)
        setPaymentResult((prev) => `${prev}\n\nDuplicate:\n${JSON.stringify(dup, null, 2)}`)
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: unknown }; message?: string }
      setPaymentResult(JSON.stringify(err.response?.data || err.message, null, 2))
    }
  }

  const tabs: { id: TabId; label: string; icon: typeof Shield }[] = [
    { id: 'contracts', label: 'Smart Contract', icon: Shield },
    { id: 'backend', label: 'Backend', icon: Server },
    { id: 'frontend', label: 'Frontend', icon: Wallet },
    { id: 'payments', label: 'Payments', icon: Server },
  ]

  const toggleFrontendCheck = (key: string) => {
    setFrontendChecks((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const mustHaveChecks = {
    wallet: 'Wallet connects and shows address',
    stakeLoading: 'Stake button shows loading state during transaction',
    unstakeLoading: 'Unstake button shows loading state during transaction',
    rewardsRefresh: 'Pending rewards display updates every 10 seconds',
    errorDisplay: 'Error message appears when transaction is rejected',
    disableButtons: 'Buttons are disabled during in-flight transactions',
  }

  const niceToHaveChecks = {
    buyNft: 'Buy NFT works from marketplace page',
    bidSubmit: 'Bid submission works and shows response',
  }

  return (
    <div className="@container animate-in fade-in duration-500 space-y-8">
      <header className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-4 aspect-video max-w-xs overflow-hidden rounded-xl bg-gradient-to-br from-primary-100 via-white to-primary-50 ring-1 ring-primary-100">
          <div className="flex h-full items-center justify-center">
            <img src="/nodemeta.png" alt="NodeMeta" className="h-16 w-auto object-contain" />
          </div>
        </div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-600">
          NodeMeta Assessment
        </p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-secondary-900">
          Verification Dashboard
        </h1>
        <p className="text-base text-secondary-600">
          Test your implementation by role. Green means working; red means not connected or not
          implemented yet.
        </p>
      </header>

      <div className="grid gap-4 @md:grid-cols-3">
        <div className={clsx(statusCardClass(backendConnected), 'animate-in slide-in-from-bottom-2 duration-300')}>
          <p className="font-semibold">Backend</p>
          <p className="mt-1 text-sm opacity-80">localhost:8080</p>
        </div>
        <div className={clsx(statusCardClass(paymentsConnected), 'animate-in slide-in-from-bottom-2 duration-500')}>
          <p className="font-semibold">Payments</p>
          <p className="mt-1 text-sm opacity-80">localhost:3003</p>
        </div>
        <div className={clsx(statusCardClass(isConnected), 'animate-in slide-in-from-bottom-2 duration-700')}>
          <p className="font-semibold">Wallet</p>
          <p className="mt-1 text-sm opacity-80">
            {chain?.name || 'Not connected'} (ID: {chain?.id ?? '—'})
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-nm-sm">
        <div className="flex flex-wrap gap-1 border-b border-secondary-200 bg-secondary-50/80 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-white text-primary-700 shadow-sm ring-1 ring-primary-200'
                    : 'text-secondary-600 hover:bg-white/70 hover:text-secondary-900'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="space-y-6 p-6">
          {activeTab === 'contracts' && (
            <>
              {!isConnected && (
                <p className="rounded-xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-700">
                  Connect MetaMask to Hardhat localhost to sign Stake / Unstake (frontend tooling —
                  not part of the Solidity task).
                </p>
              )}
              <ul className="space-y-3">
                {contractChecks.map((check) => (
                  <li
                    key={check.label}
                    className="flex items-start gap-3 rounded-xl border border-secondary-100 bg-secondary-50 p-4"
                  >
                    {statusIcon(check.status)}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-secondary-900">{check.label}</p>
                      {check.detail && (
                        <p className="mt-1 break-all font-mono text-xs text-secondary-500">
                          {check.detail}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="grid gap-4 @lg:grid-cols-2">
                <div className="space-y-4 rounded-xl border border-secondary-200 bg-white p-5">
                  <label className="block text-sm font-medium text-secondary-800">
                    Token ID
                    <input
                      type="number"
                      min={1}
                      className="form-input mt-1.5 w-full rounded-lg border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      value={tokenId}
                      onChange={(e) => setTokenId(e.target.value)}
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary flex-1"
                      disabled={!isConnected || !stakingDeployed || stakeLoading || stakeWaiting}
                      onClick={() => stakeWrite?.({ args: [BigInt(Number(tokenId) || 1)] })}
                    >
                      {stakeLoading || stakeWaiting ? 'Staking...' : 'Stake NFT'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline flex-1"
                      disabled={!isConnected || !stakingDeployed || unstakeLoading || unstakeWaiting}
                      onClick={() => unstakeWrite?.({ args: [BigInt(Number(tokenId) || 1)] })}
                    >
                      {unstakeLoading || unstakeWaiting ? 'Unstaking...' : 'Unstake NFT'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 rounded-xl border border-primary-100 bg-primary-50 p-5">
                  <p className="text-sm text-secondary-600">Pending Rewards (auto-refresh 10s)</p>
                  <p className="text-3xl font-bold text-primary-700">
                    {pendingRewardsData !== undefined
                      ? `${formatEther(pendingRewardsData as bigint)} NTE`
                      : '—'}
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => refetchRewards()}
                  >
                    Check Rewards
                  </button>
                  <div>
                    <p className="mb-1 text-sm font-medium text-secondary-800">My Staked NFTs</p>
                    <p className="text-sm text-secondary-600">
                      {Array.isArray(stakedTokensData) && stakedTokensData.length > 0
                        ? (stakedTokensData as bigint[]).map((t) => `#${t.toString()}`).join(', ')
                        : 'None'}
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm mt-2"
                      onClick={() => refetchStaked()}
                    >
                      Refresh Staked
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'backend' && (
            <div className="grid gap-6 @lg:grid-cols-2">
              {!isConnected && (
                <p className="@lg:col-span-2 rounded-xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-700">
                  Optional: connect a wallet so Bid / User Transactions use your address. No wallet
                  auth to implement — addresses are request strings.
                </p>
              )}
              <div className="space-y-3 rounded-xl border border-secondary-200 p-5">
                <h3 className="text-lg font-semibold text-secondary-900">NFT History</h3>
                <input
                  type="number"
                  min={1}
                  className="form-input w-full rounded-lg border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={historyNftId}
                  onChange={(e) => setHistoryNftId(e.target.value)}
                  placeholder="NFT ID"
                />
                <button type="button" className="btn btn-primary w-full" onClick={fetchHistory}>
                  Fetch History
                </button>
              </div>

              <div className="space-y-3 rounded-xl border border-secondary-200 p-5">
                <h3 className="text-lg font-semibold text-secondary-900">Place Bid</h3>
                <input
                  type="number"
                  min={1}
                  className="form-input w-full rounded-lg border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={bidNftId}
                  onChange={(e) => setBidNftId(e.target.value)}
                  placeholder="NFT ID"
                />
                <input
                  type="number"
                  step="0.001"
                  min={0}
                  className="form-input w-full rounded-lg border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Bid amount (BNB)"
                />
                <button type="button" className="btn btn-primary w-full" onClick={submitBid}>
                  Submit Bid
                </button>
              </div>

              <div className="space-y-3 @lg:col-span-2">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={fetchUserTransactions}
                  disabled={!address}
                >
                  Fetch User Transactions
                </button>
                <pre className="prose prose-sm max-h-64 max-w-none overflow-auto rounded-xl bg-secondary-50 p-4 text-xs text-secondary-800 scrollbar-thin scrollbar-track-secondary-100 scrollbar-thumb-primary-300">
                  {historyResult || bidResult || 'Run a test to see results'}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'frontend' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-base font-semibold text-secondary-900">
                  Must-have (60 min)
                </h3>
                <div className="grid gap-3 @md:grid-cols-2">
                  {Object.entries(mustHaveChecks).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-secondary-200 bg-secondary-50 p-4 hover:border-primary-200"
                    >
                      <input
                        type="checkbox"
                        checked={frontendChecks[key]}
                        onChange={() => toggleFrontendCheck(key)}
                        className="form-checkbox mt-0.5 h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-secondary-900">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-base font-semibold text-secondary-500">
                  Nice-to-have (if time remains)
                </h3>
                <div className="grid gap-3 @md:grid-cols-2">
                  {Object.entries(niceToHaveChecks).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-dashed border-secondary-300 bg-white p-4"
                    >
                      <input
                        type="checkbox"
                        checked={frontendChecks[key]}
                        onChange={() => toggleFrontendCheck(key)}
                        className="form-checkbox mt-0.5 h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-secondary-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <p className="prose prose-sm max-w-none text-secondary-600">
                Test stake/unstake primarily on{' '}
                <a href="/nft/1" className="font-medium text-primary-600 no-underline hover:underline">
                  /nft/1
                </a>
                . Must-have items are enough to pass the 60-minute assessment.
              </p>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="grid gap-3 @md:grid-cols-2">
                <button type="button" className="btn btn-primary" onClick={() => simulatePayment('valid')}>
                  Simulate Valid Payment
                </button>
                <button type="button" className="btn btn-outline" onClick={() => simulatePayment('slippage')}>
                  Simulate Over-Slippage Payment
                </button>
                <button type="button" className="btn btn-outline" onClick={() => simulatePayment('duplicate')}>
                  Simulate Duplicate Payment
                </button>
                <button type="button" className="btn btn-outline" onClick={() => simulatePayment('fail')}>
                  Simulate Fulfillment Failure
                </button>
              </div>

              {paymentResult && (
                <pre className="prose prose-sm max-h-48 max-w-none overflow-auto rounded-xl bg-secondary-50 p-4 text-xs text-secondary-800 scrollbar-thin scrollbar-track-secondary-100 scrollbar-thumb-primary-300">
                  {paymentResult}
                </pre>
              )}

              <div>
                <h3 className="mb-3 text-lg font-semibold text-secondary-900">
                  Recent Webhook Events
                </h3>
                <pre className="prose prose-sm max-h-64 max-w-none overflow-auto rounded-xl bg-secondary-50 p-4 text-xs text-secondary-800 scrollbar-thin scrollbar-track-secondary-100 scrollbar-thumb-primary-300">
                  {paymentEvents.length > 0
                    ? JSON.stringify(paymentEvents.slice(0, 5), null, 2)
                    : 'No events yet — payments server logs samples every 30s'}
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default VerifyDashboard
