/**
 * useWallets Hook
 * Manages wallet list operations (load, create, delete)
 */

import { useCallback, useEffect, useState } from 'react'
import { useWalletStore, type WalletWithBalance } from '@renderer/store/wallet-store'
import { getWalletService } from '@renderer/services'
import type { CreateWalletRequest, VerifyWalletRequest } from '@renderer/types'

/**
 * Wallet creation state
 */
export interface CreateWalletState {
  isCreating: boolean
  vaultId: string | null
  requiresVerification: boolean
  error: Error | null
}

/**
 * Hook return type
 */
export interface UseWalletsReturn {
  // Wallet list
  wallets: WalletWithBalance[]
  isLoading: boolean
  error: Error | null

  // Load operations
  loadWallets: () => Promise<void>
  refreshWallets: () => Promise<void>

  // Create operations
  createWallet: (request: CreateWalletRequest) => Promise<string | null>
  verifyWallet: (request: VerifyWalletRequest) => Promise<WalletWithBalance | null>
  createState: CreateWalletState

  // Server status
  isServerAvailable: boolean
  checkServer: () => Promise<boolean>
}

/**
 * useWallets - Manage the wallet list and creation
 *
 * @example
 * ```tsx
 * function WalletList() {
 *   const { wallets, isLoading, loadWallets, createWallet } = useWallets()
 *
 *   useEffect(() => {
 *     loadWallets()
 *   }, [])
 *
 *   const handleCreate = async () => {
 *     const vaultId = await createWallet({
 *       name: 'My Wallet',
 *       email: 'user@example.com',
 *       password: 'secret',
 *       type: 'fast'
 *     })
 *   }
 *
 *   return (
 *     <div>
 *       {wallets.map(w => <WalletCard key={w.id} wallet={w} />)}
 *       <button onClick={handleCreate}>Create Wallet</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useWallets(): UseWalletsReturn {
  const walletService = getWalletService()
  const {
    wallets,
    isLoading,
    error,
    setWallets,
    addWallet,
    setLoading,
    setError
  } = useWalletStore()

  const [createState, setCreateState] = useState<CreateWalletState>({
    isCreating: false,
    vaultId: null,
    requiresVerification: false,
    error: null
  })

  const [isServerAvailable, setIsServerAvailable] = useState(false)

  // Check server availability
  const checkServer = useCallback(async (): Promise<boolean> => {
    const available = await walletService.checkServerHealth()
    setIsServerAvailable(available)
    return available
  }, [walletService])

  // Load wallets from server
  const loadWallets = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await walletService.loadWallets()

    if (result.success) {
      setWallets(result.data)
    } else {
      setError(result.error)
    }

    setLoading(false)
  }, [walletService, setWallets, setLoading, setError])

  // Refresh wallets
  const refreshWallets = useCallback(async () => {
    await loadWallets()
  }, [loadWallets])

  // Create a new wallet
  const createWallet = useCallback(async (
    request: CreateWalletRequest
  ): Promise<string | null> => {
    setCreateState(prev => ({
      ...prev,
      isCreating: true,
      error: null
    }))

    const result = await walletService.createWallet(request)

    if (result.success) {
      setCreateState({
        isCreating: false,
        vaultId: result.data.vaultId,
        requiresVerification: result.data.requiresVerification,
        error: null
      })
      return result.data.vaultId
    } else {
      setCreateState(prev => ({
        ...prev,
        isCreating: false,
        error: result.error
      }))
      return null
    }
  }, [walletService])

  // Verify a wallet with email code
  const verifyWallet = useCallback(async (
    request: VerifyWalletRequest
  ): Promise<WalletWithBalance | null> => {
    setCreateState(prev => ({
      ...prev,
      isCreating: true,
      error: null
    }))

    const result = await walletService.verifyWallet(request)

    if (result.success) {
      // Add the verified wallet to the store
      addWallet(result.data)

      setCreateState({
        isCreating: false,
        vaultId: null,
        requiresVerification: false,
        error: null
      })

      // Convert to WalletWithBalance
      const walletWithBalance: WalletWithBalance = {
        ...result.data,
        address: result.data.primaryAddress,
        balance: result.data.balance || '0.0000',
        usdBalance: result.data.usdBalance || 0,
        tokens: result.data.tokens || [],
        nfts: result.data.nfts || []
      }

      return walletWithBalance
    } else {
      setCreateState(prev => ({
        ...prev,
        isCreating: false,
        error: result.error
      }))
      return null
    }
  }, [walletService, addWallet])

  // Check server on mount
  useEffect(() => {
    checkServer()
  }, [checkServer])

  return {
    wallets,
    isLoading,
    error,
    loadWallets,
    refreshWallets,
    createWallet,
    verifyWallet,
    createState,
    isServerAvailable,
    checkServer
  }
}
