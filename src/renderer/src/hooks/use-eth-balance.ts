/**
 * useEthBalance – convenience hook for balance & price data
 *
 * @example
 * ```tsx
 * const { formattedUsd, ethBalance, change24h, history } = useEthBalance()
 * ```
 */

import { useMemo } from 'react'
import { useEthWalletContext } from '../contexts/eth-wallet/EthWalletContext'
import { formatUSD } from '@renderer/lib/utils'
import type { BalanceHistoryPoint } from '@renderer/types'

export interface UseEthBalanceReturn {
  /** Raw USD balance */
  usdBalance: number
  /** ETH balance string */
  ethBalance: string
  /** Formatted USD string ($8,234.56) */
  formattedUsd: string
  /** 24-hour change percentage */
  change24h: number
  /** Current ETH price in USD */
  ethPriceUsd: number
  /** Historical balance points for charting */
  history: BalanceHistoryPoint[]
  /** Trigger a mock balance refresh */
  refresh: () => void
}

export function useEthBalance(): UseEthBalanceReturn {
  const { activeWallet, ethPrice, balanceHistory, refreshBalance } = useEthWalletContext()

  const usdBalance = activeWallet?.usdBalance ?? 0
  const ethBalance = activeWallet?.balance ?? '0.0000'

  const formattedUsd = useMemo(() => formatUSD(usdBalance), [usdBalance])

  return {
    usdBalance,
    ethBalance,
    formattedUsd,
    change24h: ethPrice.change24h,
    ethPriceUsd: ethPrice.usd,
    history: balanceHistory,
    refresh: refreshBalance
  }
}
