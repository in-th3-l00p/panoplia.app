/**
 * useWallet Hook
 * Provides access to the current active wallet and wallet operations
 */

import { useCallback } from 'react'
import { useWalletStore, type WalletWithBalance } from '@renderer/store/wallet-store'
import type { Chain } from '@renderer/types'

/**
 * Hook return type
 */
export interface UseWalletReturn {
  // Current wallet state
  wallet: WalletWithBalance | null
  wallets: WalletWithBalance[]
  isLoading: boolean
  error: Error | null

  // Wallet selection
  selectWallet: (wallet: WalletWithBalance) => void
  clearSelection: () => void

  // Address helpers
  getAddress: (chain: Chain) => string | undefined
  primaryAddress: string | undefined

  // Wallet info helpers
  shortAddress: string | undefined
  displayName: string | undefined
}

/**
 * useWallet - Access the currently selected wallet
 *
 * @example
 * ```tsx
 * function WalletHeader() {
 *   const { wallet, shortAddress, displayName } = useWallet()
 *
 *   if (!wallet) return <div>No wallet selected</div>
 *
 *   return (
 *     <div>
 *       <h1>{displayName}</h1>
 *       <p>{shortAddress}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useWallet(): UseWalletReturn {
  const {
    wallets,
    activeWallet,
    isLoading,
    error,
    setActiveWallet
  } = useWalletStore()

  const selectWallet = useCallback((wallet: WalletWithBalance) => {
    setActiveWallet(wallet)
  }, [setActiveWallet])

  const clearSelection = useCallback(() => {
    setActiveWallet(null)
  }, [setActiveWallet])

  const getAddress = useCallback((chain: Chain): string | undefined => {
    return activeWallet?.addresses.find(a => a.chain === chain)?.address
  }, [activeWallet])

  const primaryAddress = activeWallet?.primaryAddress

  const shortAddress = primaryAddress
    ? `${primaryAddress.slice(0, 6)}...${primaryAddress.slice(-4)}`
    : undefined

  const displayName = activeWallet?.name

  return {
    wallet: activeWallet,
    wallets,
    isLoading,
    error,
    selectWallet,
    clearSelection,
    getAddress,
    primaryAddress,
    shortAddress,
    displayName
  }
}
