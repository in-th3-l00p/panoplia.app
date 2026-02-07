/**
 * Wallet Store
 * Zustand store for wallet state management
 * Integrates with services for data fetching
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS } from '@renderer/config'
import type { Wallet, Chain, Token, NFT, BalanceHistoryPoint } from '@renderer/types'

// Re-export types for backwards compatibility
export type { Wallet, Token, NFT }

/**
 * Extended wallet with UI-specific data
 */
export interface WalletWithBalance extends Wallet {
  // For backwards compatibility with existing UI
  address: string // Primary address
  balance: string // Primary balance
  usdBalance: number // Total USD balance
  tokens: Token[]
  nfts: NFT[]
}

/**
 * Wallet state interface
 */
interface WalletState {
  // Wallet data
  wallets: WalletWithBalance[]
  activeWallet: WalletWithBalance | null

  // Loading states
  isLoading: boolean
  isLoadingBalances: boolean
  error: Error | null

  // Balance history for active wallet
  balanceHistory: BalanceHistoryPoint[]

  // Actions - Wallet management
  setWallets: (wallets: Wallet[]) => void
  setActiveWallet: (wallet: WalletWithBalance | null) => void
  addWallet: (wallet: Wallet) => void
  updateWallet: (vaultId: string, updates: Partial<WalletWithBalance>) => void
  removeWallet: (vaultId: string) => void

  // Actions - Loading states
  setLoading: (loading: boolean) => void
  setLoadingBalances: (loading: boolean) => void
  setError: (error: Error | null) => void

  // Actions - Balance data
  updateWalletBalance: (vaultId: string, balance: string, usdBalance: number) => void
  updateWalletTokens: (vaultId: string, tokens: Token[]) => void
  setBalanceHistory: (history: BalanceHistoryPoint[]) => void

  // Selectors
  getWalletById: (id: string) => WalletWithBalance | undefined
  getWalletByVaultId: (vaultId: string) => WalletWithBalance | undefined
}

/**
 * Convert base Wallet to WalletWithBalance
 */
function toWalletWithBalance(wallet: Wallet): WalletWithBalance {
  return {
    ...wallet,
    address: wallet.primaryAddress,
    balance: wallet.balance || '0.0000',
    usdBalance: wallet.usdBalance || 0,
    tokens: wallet.tokens || [],
    nfts: wallet.nfts || []
  }
}

/**
 * Mock wallets for development/demo
 */
const createMockWallets = (): WalletWithBalance[] => [
  {
    id: '1',
    vaultId: 'mock-vault-1',
    name: 'Main Wallet',
    type: 'fast',
    status: 'verified',
    addresses: [
      { chain: 'Ethereum' as Chain, address: '0x742d35Cc6634C0532925a3b844Bc9e7595f4a23F' },
      { chain: 'Bitcoin' as Chain, address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
      { chain: 'Solana' as Chain, address: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV' }
    ],
    primaryAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f4a23F',
    createdAt: new Date().toISOString(),
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f4a23F',
    balance: '2.4521',
    usdBalance: 8234.56,
    tokens: [
      { symbol: 'ETH', name: 'Ethereum', balance: '2.4521', usdValue: 8234.56, decimals: 18, chain: 'Ethereum' as Chain },
      { symbol: 'USDC', name: 'USD Coin', balance: '1500.00', usdValue: 1500.0, decimals: 6, chain: 'Ethereum' as Chain },
      { symbol: 'LINK', name: 'Chainlink', balance: '150.00', usdValue: 2100.0, decimals: 18, chain: 'Ethereum' as Chain },
      { symbol: 'UNI', name: 'Uniswap', balance: '75.50', usdValue: 567.0, decimals: 18, chain: 'Ethereum' as Chain }
    ],
    nfts: [
      { id: '1', name: 'Bored Ape #1234', collection: 'BAYC', image: '', chain: 'Ethereum' as Chain },
      { id: '2', name: 'Azuki #5678', collection: 'Azuki', image: '', chain: 'Ethereum' as Chain }
    ]
  },
  {
    id: '2',
    vaultId: 'mock-vault-2',
    name: 'Trading Wallet',
    type: 'fast',
    status: 'verified',
    addresses: [
      { chain: 'Ethereum' as Chain, address: '0x8B3392483BA26D65E331dB86D4F430E9B3814E5e' }
    ],
    primaryAddress: '0x8B3392483BA26D65E331dB86D4F430E9B3814E5e',
    createdAt: new Date().toISOString(),
    address: '0x8B3392483BA26D65E331dB86D4F430E9B3814E5e',
    balance: '0.8234',
    usdBalance: 2765.12,
    tokens: [
      { symbol: 'ETH', name: 'Ethereum', balance: '0.8234', usdValue: 2765.12, decimals: 18, chain: 'Ethereum' as Chain },
      { symbol: 'WBTC', name: 'Wrapped Bitcoin', balance: '0.05', usdValue: 4250.0, decimals: 8, chain: 'Ethereum' as Chain }
    ],
    nfts: []
  }
]

/**
 * Wallet store with persistence
 */
export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Initial state
      wallets: createMockWallets(),
      activeWallet: null,
      isLoading: false,
      isLoadingBalances: false,
      error: null,
      balanceHistory: [],

      // Wallet management actions
      setWallets: (wallets) => set({
        wallets: wallets.map(toWalletWithBalance)
      }),

      setActiveWallet: (wallet) => {
        set({ activeWallet: wallet })
        // Store active wallet ID for persistence
        if (wallet) {
          localStorage.setItem(STORAGE_KEYS.activeWalletId, wallet.vaultId)
        } else {
          localStorage.removeItem(STORAGE_KEYS.activeWalletId)
        }
      },

      addWallet: (wallet) => set((state) => ({
        wallets: [...state.wallets, toWalletWithBalance(wallet)]
      })),

      updateWallet: (vaultId, updates) => set((state) => ({
        wallets: state.wallets.map(w =>
          w.vaultId === vaultId ? { ...w, ...updates } : w
        ),
        activeWallet: state.activeWallet?.vaultId === vaultId
          ? { ...state.activeWallet, ...updates }
          : state.activeWallet
      })),

      removeWallet: (vaultId) => set((state) => ({
        wallets: state.wallets.filter(w => w.vaultId !== vaultId),
        activeWallet: state.activeWallet?.vaultId === vaultId
          ? null
          : state.activeWallet
      })),

      // Loading state actions
      setLoading: (isLoading) => set({ isLoading }),
      setLoadingBalances: (isLoadingBalances) => set({ isLoadingBalances }),
      setError: (error) => set({ error }),

      // Balance actions
      updateWalletBalance: (vaultId, balance, usdBalance) => set((state) => ({
        wallets: state.wallets.map(w =>
          w.vaultId === vaultId ? { ...w, balance, usdBalance } : w
        ),
        activeWallet: state.activeWallet?.vaultId === vaultId
          ? { ...state.activeWallet, balance, usdBalance }
          : state.activeWallet
      })),

      updateWalletTokens: (vaultId, tokens) => set((state) => ({
        wallets: state.wallets.map(w =>
          w.vaultId === vaultId ? { ...w, tokens } : w
        ),
        activeWallet: state.activeWallet?.vaultId === vaultId
          ? { ...state.activeWallet, tokens }
          : state.activeWallet
      })),

      setBalanceHistory: (balanceHistory) => set({ balanceHistory }),

      // Selectors
      getWalletById: (id) => get().wallets.find(w => w.id === id),
      getWalletByVaultId: (vaultId) => get().wallets.find(w => w.vaultId === vaultId)
    }),
    {
      name: 'easyfi-wallet-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist wallet list, not active wallet or loading states
        wallets: state.wallets
      })
    }
  )
)

/**
 * Restore active wallet from localStorage on app start
 */
export function restoreActiveWallet(): void {
  const activeWalletId = localStorage.getItem(STORAGE_KEYS.activeWalletId)
  if (activeWalletId) {
    const { wallets, setActiveWallet } = useWalletStore.getState()
    const wallet = wallets.find(w => w.vaultId === activeWalletId)
    if (wallet) {
      setActiveWallet(wallet)
    }
  }
}
