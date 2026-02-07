/**
 * Core wallet domain types
 * These types define the data structures used throughout the application
 */

// Supported blockchain chains
export type Chain =
  | 'Bitcoin'
  | 'Ethereum'
  | 'Solana'
  | 'Polygon'
  | 'Avalanche'
  | 'Arbitrum'
  | 'Optimism'
  | 'BSC'
  | 'THORChain'
  | 'Cosmos'

// Chain configuration
export interface ChainConfig {
  id: Chain
  name: string
  symbol: string
  decimals: number
  rpcUrl?: string
  explorerUrl?: string
  isTestnet?: boolean
}

// Token information
export interface Token {
  symbol: string
  name: string
  address?: string
  decimals: number
  balance: string
  usdValue: number
  icon?: string
  chain: Chain
}

// NFT information
export interface NFT {
  id: string
  name: string
  collection: string
  image: string
  chain: Chain
  contractAddress?: string
  tokenId?: string
}

// Wallet address for a specific chain
export interface WalletAddress {
  chain: Chain
  address: string
  derivationPath?: string
}

// Vault types
export type VaultType = 'fast' | 'secure'

// Vault status
export type VaultStatus = 'pending' | 'verified' | 'ready' | 'locked'

// Core wallet/vault representation
export interface Wallet {
  id: string
  vaultId: string
  name: string
  type: VaultType
  status: VaultStatus
  addresses: WalletAddress[]
  primaryAddress: string // Main ETH address for display
  createdAt: string
  updatedAt?: string
  // Computed/fetched data
  balance?: string
  usdBalance?: number
  tokens?: Token[]
  nfts?: NFT[]
}

// Wallet creation request
export interface CreateWalletRequest {
  name: string
  email: string
  password: string
  type: VaultType
  userId?: string
}

// Wallet verification request
export interface VerifyWalletRequest {
  vaultId: string
  code: string
}

// Transaction types
export type TransactionType = 'send' | 'receive' | 'swap' | 'approve' | 'contract'

// Transaction status
export type TransactionStatus = 'pending' | 'confirmed' | 'failed'

// Transaction request
export interface TransactionRequest {
  vaultId: string
  chain: Chain
  to: string
  value: string
  data?: string
  gasLimit?: string
  gasPrice?: string
  nonce?: number
}

// Transaction record
export interface Transaction {
  id: string
  hash: string
  type: TransactionType
  status: TransactionStatus
  chain: Chain
  from: string
  to: string
  value: string
  fee?: string
  timestamp: string
  blockNumber?: number
}

// Balance information
export interface Balance {
  chain: Chain
  native: {
    balance: string
    symbol: string
    usdValue: number
  }
  tokens: Token[]
  totalUsdValue: number
}

// Price data
export interface PriceData {
  symbol: string
  usd: number
  change24h?: number
  lastUpdated: string
}

// Historical balance point for charts
export interface BalanceHistoryPoint {
  timestamp: string
  usdValue: number
}

// Wallet export data
export interface WalletExport {
  vaultId: string
  encryptedData: string
  exportedAt: string
}
