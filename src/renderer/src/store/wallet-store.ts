/**
 * Wallet Store — Zustand store for vault/wallet state
 * Fetches real data from the MPC server
 */

import { create } from 'zustand'
import { STORAGE_KEYS } from '@renderer/config'
import * as api from '@renderer/services/api-client'
import type { VaultDetail, TransactionRecord } from '@renderer/services/api-client'

export interface WalletWithBalance {
  id: string
  vaultId: string
  name: string
  status: string
  address: string // Primary ETH address
  addresses: Array<{ chain: string; address: string }>
  balance: string
  usdBalance: number
  created_at: string
}

interface WalletState {
  wallets: WalletWithBalance[]
  activeWallet: WalletWithBalance | null
  transactions: TransactionRecord[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchWallets: () => Promise<void>
  setActiveWallet: (w: WalletWithBalance | null) => void
  createWallet: (name: string) => Promise<WalletWithBalance>
  fetchTransactions: (vaultId: string) => Promise<void>
  archiveWallet: (vaultId: string) => Promise<void>
  clearError: () => void
}

function vaultToWallet(v: VaultDetail): WalletWithBalance {
  const ethAddr = v.addresses?.find((a) => a.chain === 'Ethereum')?.address || ''
  return {
    id: v.id,
    vaultId: v.id,
    name: v.name,
    status: v.status,
    address: ethAddr,
    addresses: v.addresses || [],
    balance: '0.0000',
    usdBalance: 0,
    created_at: v.created_at
  }
}

export const useWalletStore = create<WalletState>()((set) => ({
  wallets: [],
  activeWallet: null,
  transactions: [],
  isLoading: false,
  error: null,

  fetchWallets: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.listVaults()
      const wallets = res.vaults.map(vaultToWallet)
      set({ wallets, isLoading: false })

      // Restore active wallet if stored
      const storedId = localStorage.getItem(STORAGE_KEYS.activeWalletId)
      if (storedId) {
        const match = wallets.find((w) => w.vaultId === storedId)
        if (match) set({ activeWallet: match })
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to load wallets', isLoading: false })
    }
  },

  setActiveWallet: (wallet) => {
    set({ activeWallet: wallet, transactions: [] })
    if (wallet) {
      localStorage.setItem(STORAGE_KEYS.activeWalletId, wallet.vaultId)
      localStorage.setItem(STORAGE_KEYS.activeWallet, JSON.stringify(wallet))
    } else {
      localStorage.removeItem(STORAGE_KEYS.activeWalletId)
      localStorage.removeItem(STORAGE_KEYS.activeWallet)
    }
  },

  createWallet: async (name: string) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.createVault(name)
      // Poll for vault to become active (keygen takes ~2s in demo mode)
      let vault: VaultDetail | null = null
      for (let i = 0; i < 10; i++) {
        await new Promise((r) => setTimeout(r, 500))
        try {
          vault = await api.getVault(res.vaultId)
          if (vault.status === 'active') break
        } catch {
          // ignore
        }
      }

      if (!vault) throw new Error('Vault creation timed out')

      const wallet = vaultToWallet(vault)
      set((s) => ({
        wallets: [...s.wallets, wallet],
        isLoading: false
      }))
      return wallet
    } catch (err: any) {
      set({ error: err.message || 'Failed to create wallet', isLoading: false })
      throw err
    }
  },

  fetchTransactions: async (vaultId: string) => {
    try {
      const res = await api.listTransactions(vaultId)
      set({ transactions: res.transactions || [] })
    } catch {
      set({ transactions: [] })
    }
  },

  archiveWallet: async (vaultId: string) => {
    try {
      await api.archiveVault(vaultId)
      set((s) => ({
        wallets: s.wallets.filter((w) => w.vaultId !== vaultId),
        activeWallet: s.activeWallet?.vaultId === vaultId ? null : s.activeWallet
      }))
    } catch (err: any) {
      set({ error: err.message })
    }
  },

  clearError: () => set({ error: null })
}))
