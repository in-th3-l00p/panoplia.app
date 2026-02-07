/**
 * useBalance Hook
 * Fetches and manages balance data for a wallet
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getBalanceService } from '@renderer/services'
import type { Wallet, Chain, Balance, BalanceHistoryPoint } from '@renderer/types'

/**
 * Hook return type
 */
export interface UseBalanceReturn {
  // Balance data
  totalUsdBalance: number
  balances: Map<Chain, Balance>
  isLoading: boolean
  error: Error | null

  // Individual chain balance
  getChainBalance: (chain: Chain) => Balance | undefined

  // Formatted values
  formattedTotal: string
  change24h: number

  // History for charts
  history: BalanceHistoryPoint[]
  historyLoading: boolean

  // Actions
  refresh: () => Promise<void>
  loadHistory: (days?: number) => Promise<void>
}

/**
 * useBalance - Fetch and manage wallet balance
 *
 * @param wallet - The wallet to fetch balance for
 * @param autoFetch - Whether to auto-fetch on mount (default: true)
 *
 * @example
 * ```tsx
 * function BalanceDisplay() {
 *   const { wallet } = useWallet()
 *   const { formattedTotal, change24h, isLoading } = useBalance(wallet)
 *
 *   if (isLoading) return <Spinner />
 *
 *   return (
 *     <div>
 *       <h2>{formattedTotal}</h2>
 *       <span>{change24h > 0 ? '+' : ''}{change24h}%</span>
 *     </div>
 *   )
 * }
 * ```
 */
export function useBalance(
  wallet: Wallet | null,
  autoFetch: boolean = true
): UseBalanceReturn {
  const balanceService = getBalanceService()

  const [totalUsdBalance, setTotalUsdBalance] = useState(0)
  const [balances, setBalances] = useState<Map<Chain, Balance>>(new Map())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const [history, setHistory] = useState<BalanceHistoryPoint[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  // Build addresses array from wallet
  const addresses = useMemo(() => {
    if (!wallet) return []
    return wallet.addresses.map(a => ({
      chain: a.chain,
      address: a.address
    }))
  }, [wallet])

  // Fetch balances
  const refresh = useCallback(async () => {
    if (!wallet || addresses.length === 0) return

    setIsLoading(true)
    setError(null)

    const result = await balanceService.getTotalBalance(addresses)

    if (result.success) {
      setTotalUsdBalance(result.data.totalUsd)
      setBalances(result.data.balances)
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }, [balanceService, wallet, addresses])

  // Load balance history for charts
  const loadHistory = useCallback(async (days: number = 30) => {
    if (!wallet || addresses.length === 0) return

    setHistoryLoading(true)

    const result = await balanceService.getBalanceHistory(addresses, days)

    if (result.success) {
      setHistory(result.data)
    }

    setHistoryLoading(false)
  }, [balanceService, wallet, addresses])

  // Get balance for a specific chain
  const getChainBalance = useCallback((chain: Chain): Balance | undefined => {
    return balances.get(chain)
  }, [balances])

  // Format total balance as USD string
  const formattedTotal = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(totalUsdBalance)
  }, [totalUsdBalance])

  // Calculate 24h change (mock for now)
  const change24h = useMemo(() => {
    if (history.length < 2) return 0
    const yesterday = history[history.length - 2]?.usdValue || totalUsdBalance
    const today = totalUsdBalance
    if (yesterday === 0) return 0
    return ((today - yesterday) / yesterday) * 100
  }, [history, totalUsdBalance])

  // Auto-fetch on mount/wallet change
  useEffect(() => {
    if (autoFetch && wallet) {
      refresh()
      loadHistory()
    }
  }, [autoFetch, wallet?.id]) // Only re-fetch when wallet ID changes

  return {
    totalUsdBalance,
    balances,
    isLoading,
    error,
    getChainBalance,
    formattedTotal,
    change24h,
    history,
    historyLoading,
    refresh,
    loadHistory
  }
}
