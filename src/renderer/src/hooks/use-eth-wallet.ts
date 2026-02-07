/**
 * useEthWallet – convenience hook for the active wallet & wallet list
 *
 * Thin wrapper over EthWalletContext focused on wallet selection.
 *
 * @example
 * ```tsx
 * const { activeWallet, wallets, selectWallet, shortAddress } = useEthWallet()
 * ```
 */

import { useMemo } from 'react'
import { useEthWalletContext, type EthWallet } from '../contexts/eth-wallet/EthWalletContext'
import { shortenAddress } from '@renderer/lib/utils'

export interface UseEthWalletReturn {
  /** Currently selected wallet (null when none) */
  activeWallet: EthWallet | null
  /** All wallets in the context */
  wallets: EthWallet[]
  /** Global loading flag */
  isLoading: boolean
  /** Set active wallet */
  selectWallet: (wallet: EthWallet) => void
  /** Deselect active wallet */
  clearSelection: () => void
  /** Create a new mock wallet */
  createWallet: (name: string) => EthWallet
  /** Import a wallet by address */
  importWallet: (name: string, address: string) => EthWallet
  /** Remove a wallet by id */
  removeWallet: (id: string) => void
  /** Shortened active address (0x742d…a23F) */
  shortAddress: string | undefined
  /** Display name of the active wallet */
  displayName: string | undefined
}

export function useEthWallet(): UseEthWalletReturn {
  const ctx = useEthWalletContext()

  const shortAddress = useMemo(
    () => (ctx.activeWallet ? shortenAddress(ctx.activeWallet.address, 6) : undefined),
    [ctx.activeWallet]
  )

  const displayName = ctx.activeWallet?.name

  return {
    activeWallet: ctx.activeWallet,
    wallets: ctx.wallets,
    isLoading: ctx.isLoading,
    selectWallet: ctx.selectWallet,
    clearSelection: ctx.clearSelection,
    createWallet: ctx.createWallet,
    importWallet: ctx.importWallet,
    removeWallet: ctx.removeWallet,
    shortAddress,
    displayName
  }
}
