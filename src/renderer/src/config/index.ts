/**
 * Application configuration
 */

import type { ChainConfig, Chain } from '@renderer/types'

// API configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 30000,
  retries: 3
} as const

// Supported chains configuration
export const SUPPORTED_CHAINS: Record<Chain, ChainConfig> = {
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
  },
  Polygon: {
    id: 'Polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    decimals: 18,
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com'
  },
  Avalanche: {
    id: 'Avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io'
  },
  Arbitrum: {
    id: 'Arbitrum',
    name: 'Arbitrum',
    symbol: 'ETH',
    decimals: 18,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io'
  },
  Optimism: {
    id: 'Optimism',
    name: 'Optimism',
    symbol: 'ETH',
    decimals: 18,
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io'
  },
  BSC: {
    id: 'BSC',
    name: 'BNB Chain',
    symbol: 'BNB',
    decimals: 18,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com'
  },
  THORChain: {
    id: 'THORChain',
    name: 'THORChain',
    symbol: 'RUNE',
    decimals: 8,
    explorerUrl: 'https://thorchain.net'
  },
  Cosmos: {
    id: 'Cosmos',
    name: 'Cosmos',
    symbol: 'ATOM',
    decimals: 6,
    rpcUrl: 'https://cosmos-rpc.polkachu.com',
    explorerUrl: 'https://www.mintscan.io/cosmos'
  }
} as const

// Default chains to fetch addresses for
export const DEFAULT_CHAINS: Chain[] = ['Ethereum', 'Bitcoin', 'Solana']

// Primary chain for balance display
export const PRIMARY_CHAIN: Chain = 'Ethereum'

// App constants
export const APP_CONFIG = {
  name: 'panoplia.eth',
  version: '0.1.0',
  testMode: import.meta.env.VITE_TEST_MODE === 'true'
} as const

// Local storage keys
export const STORAGE_KEYS = {
  activeWalletId: 'panoplia_active_wallet_id',
  theme: 'panoplia_theme',
  recentChains: 'panoplia_recent_chains'
} as const
