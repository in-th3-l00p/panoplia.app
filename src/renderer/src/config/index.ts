/**
 * Application configuration
 */

import type { ChainConfig, Chain } from '@renderer/types'

// API configuration — points to the MPC co-signer server
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 30000,
  retries: 2
} as const

// Supported chains configuration
export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  Ethereum: {
    id: 'Ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io'
  },
  Bitcoin: {
    id: 'Bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    explorerUrl: 'https://blockstream.info'
  },
  Solana: {
    id: 'Solana',
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io'
  }
} as const

// Default chains to fetch addresses for
export const DEFAULT_CHAINS: Chain[] = ['Ethereum', 'Bitcoin', 'Solana']

// Primary chain for balance display
export const PRIMARY_CHAIN: Chain = 'Ethereum'

// App constants
export const APP_CONFIG = {
  name: 'Panoplia',
  version: '0.1.0',
  demoMode: true
} as const

// Local storage keys
export const STORAGE_KEYS = {
  token: 'panoplia_token',
  user: 'panoplia_user',
  activeWalletId: 'panoplia_active_wallet_id',
  activeWallet: 'panoplia_active_wallet',
  theme: 'panoplia_theme',
  recentChains: 'panoplia_recent_chains'
} as const
