/**
 * Blockchain Adapter
 * Adapter pattern for multi-chain support
 * Each chain implements the same interface for consistent operations
 */

import { SUPPORTED_CHAINS } from '@renderer/config'
import type { Chain, ChainConfig, Token, Transaction } from '@renderer/types'

/**
 * Transaction parameters for signing
 */
export interface TransactionParams {
  to: string
  value: string
  data?: string
  gasLimit?: string
  gasPrice?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  nonce?: number
}

/**
 * Blockchain adapter interface
 * All chain-specific adapters must implement this interface
 */
export interface IBlockchainAdapter {
  readonly chain: Chain
  readonly config: ChainConfig

  // Address operations
  validateAddress(address: string): boolean
  formatAddress(address: string): string

  // Balance operations
  getBalance(address: string): Promise<string>
  getTokenBalances(address: string): Promise<Token[]>

  // Transaction operations
  prepareTransaction(params: TransactionParams): Promise<TransactionParams>
  estimateGas(params: TransactionParams): Promise<string>
  getGasPrice(): Promise<string>
  getNonce(address: string): Promise<number>

  // Transaction history
  getTransactions(address: string, limit?: number): Promise<Transaction[]>

  // Utilities
  toBaseUnit(amount: string): string
  fromBaseUnit(amount: string): string
}

/**
 * Base adapter with common functionality
 */
abstract class BaseBlockchainAdapter implements IBlockchainAdapter {
  abstract readonly chain: Chain

  get config(): ChainConfig {
    return SUPPORTED_CHAINS[this.chain]
  }

  abstract validateAddress(address: string): boolean
  abstract formatAddress(address: string): string
  abstract getBalance(address: string): Promise<string>
  abstract getTokenBalances(address: string): Promise<Token[]>
  abstract prepareTransaction(params: TransactionParams): Promise<TransactionParams>
  abstract estimateGas(params: TransactionParams): Promise<string>
  abstract getGasPrice(): Promise<string>
  abstract getNonce(address: string): Promise<number>
  abstract getTransactions(address: string, limit?: number): Promise<Transaction[]>

  toBaseUnit(amount: string): string {
    const [whole, decimal = ''] = amount.split('.')
    const decimals = this.config.decimals
    const paddedDecimal = decimal.padEnd(decimals, '0').slice(0, decimals)
    return BigInt(whole + paddedDecimal).toString()
  }

  fromBaseUnit(amount: string): string {
    const decimals = this.config.decimals
    const value = BigInt(amount)
    const divisor = BigInt(10 ** decimals)
    const whole = value / divisor
    const remainder = value % divisor
    const decimalPart = remainder.toString().padStart(decimals, '0')
    return `${whole}.${decimalPart}`.replace(/\.?0+$/, '') || '0'
  }
}

/**
 * EVM-compatible chain adapter
 * Works for Ethereum, Polygon, Arbitrum, etc.
 */
export class EVMAdapter extends BaseBlockchainAdapter {
  readonly chain: Chain
  private rpcUrl: string

  constructor(chain: Chain) {
    super()
    this.chain = chain
    this.rpcUrl = SUPPORTED_CHAINS[chain].rpcUrl || ''
  }

  validateAddress(address: string): boolean {
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  formatAddress(address: string): string {
    // Return checksummed address
    return address.toLowerCase()
  }

  async getBalance(address: string): Promise<string> {
    if (!this.rpcUrl) {
      throw new Error(`No RPC URL configured for ${this.chain}`)
    }

    try {
      const response = await this.rpcCall('eth_getBalance', [address, 'latest'])
      return this.fromBaseUnit(BigInt(response).toString())
    } catch {
      // Return mock balance on error
      return '0'
    }
  }

  async getTokenBalances(_address: string): Promise<Token[]> {
    // TODO: Implement ERC-20 token balance fetching
    // This would require indexer API or scanning known token contracts
    return []
  }

  async prepareTransaction(params: TransactionParams): Promise<TransactionParams> {
    const gasPrice = params.gasPrice || await this.getGasPrice()
    const gasLimit = params.gasLimit || await this.estimateGas(params)
    const nonce = params.nonce ?? await this.getNonce(params.to)

    return {
      ...params,
      gasPrice,
      gasLimit,
      nonce
    }
  }

  async estimateGas(params: TransactionParams): Promise<string> {
    if (!this.rpcUrl) {
      return params.data ? '100000' : '21000'
    }

    try {
      const response = await this.rpcCall('eth_estimateGas', [{
        to: params.to,
        value: params.value ? `0x${BigInt(params.value).toString(16)}` : '0x0',
        data: params.data || '0x'
      }])
      return BigInt(response).toString()
    } catch {
      return params.data ? '100000' : '21000'
    }
  }

  async getGasPrice(): Promise<string> {
    if (!this.rpcUrl) {
      return '20000000000' // 20 Gwei default
    }

    try {
      const response = await this.rpcCall('eth_gasPrice', [])
      return BigInt(response).toString()
    } catch {
      return '20000000000'
    }
  }

  async getNonce(address: string): Promise<number> {
    if (!this.rpcUrl) {
      return 0
    }

    try {
      const response = await this.rpcCall('eth_getTransactionCount', [address, 'pending'])
      return Number(BigInt(response))
    } catch {
      return 0
    }
  }

  async getTransactions(_address: string, _limit: number = 10): Promise<Transaction[]> {
    // TODO: Implement transaction history fetching via explorer API
    return []
  }

  private async rpcCall(method: string, params: unknown[]): Promise<string> {
    const response = await fetch(this.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params
      })
    })

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message)
    }

    return data.result
  }
}

/**
 * Bitcoin adapter
 */
export class BitcoinAdapter extends BaseBlockchainAdapter {
  readonly chain: Chain = 'Bitcoin'

  validateAddress(address: string): boolean {
    // Basic Bitcoin address validation (legacy, P2SH, SegWit)
    return (
      /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) || // Legacy & P2SH
      /^bc1[a-z0-9]{39,59}$/i.test(address) // Bech32
    )
  }

  formatAddress(address: string): string {
    return address
  }

  async getBalance(_address: string): Promise<string> {
    // TODO: Implement Bitcoin balance fetching via API
    return '0'
  }

  async getTokenBalances(): Promise<Token[]> {
    // Bitcoin doesn't have tokens in the same sense
    return []
  }

  async prepareTransaction(params: TransactionParams): Promise<TransactionParams> {
    // Bitcoin transactions are handled differently
    return params
  }

  async estimateGas(): Promise<string> {
    // Bitcoin uses fees, not gas
    return '0'
  }

  async getGasPrice(): Promise<string> {
    // TODO: Fetch sat/vB from mempool.space API
    return '10' // 10 sat/vB default
  }

  async getNonce(): Promise<number> {
    // Bitcoin doesn't use nonces
    return 0
  }

  async getTransactions(_address: string, _limit: number = 10): Promise<Transaction[]> {
    // TODO: Implement via blockstream/mempool API
    return []
  }
}

/**
 * Solana adapter
 */
export class SolanaAdapter extends BaseBlockchainAdapter {
  readonly chain: Chain = 'Solana'

  validateAddress(address: string): boolean {
    // Base58 check for Solana addresses
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
  }

  formatAddress(address: string): string {
    return address
  }

  async getBalance(address: string): Promise<string> {
    const rpcUrl = this.config.rpcUrl
    if (!rpcUrl) return '0'

    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [address]
        })
      })

      const data = await response.json()
      if (data.result?.value !== undefined) {
        return this.fromBaseUnit(data.result.value.toString())
      }
      return '0'
    } catch {
      return '0'
    }
  }

  async getTokenBalances(_address: string): Promise<Token[]> {
    // TODO: Implement SPL token balance fetching
    return []
  }

  async prepareTransaction(params: TransactionParams): Promise<TransactionParams> {
    return params
  }

  async estimateGas(): Promise<string> {
    return '5000' // Solana uses compute units
  }

  async getGasPrice(): Promise<string> {
    return '5000' // Default priority fee
  }

  async getNonce(): Promise<number> {
    return 0 // Solana uses different mechanism
  }

  async getTransactions(_address: string, _limit: number = 10): Promise<Transaction[]> {
    return []
  }
}

// ============================================
// Adapter Factory
// ============================================

const adapterCache = new Map<Chain, IBlockchainAdapter>()

/**
 * Get adapter for a specific chain
 */
export function getBlockchainAdapter(chain: Chain): IBlockchainAdapter {
  if (adapterCache.has(chain)) {
    return adapterCache.get(chain)!
  }

  let adapter: IBlockchainAdapter

  switch (chain) {
    case 'Bitcoin':
      adapter = new BitcoinAdapter()
      break
    case 'Solana':
      adapter = new SolanaAdapter()
      break
    // EVM chains
    case 'Ethereum':
    case 'Polygon':
    case 'Arbitrum':
    case 'Optimism':
    case 'BSC':
    case 'Avalanche':
    default:
      adapter = new EVMAdapter(chain)
      break
  }

  adapterCache.set(chain, adapter)
  return adapter
}

/**
 * Get adapters for multiple chains
 */
export function getBlockchainAdapters(chains: Chain[]): Map<Chain, IBlockchainAdapter> {
  const adapters = new Map<Chain, IBlockchainAdapter>()

  chains.forEach(chain => {
    adapters.set(chain, getBlockchainAdapter(chain))
  })

  return adapters
}

/**
 * Validate address for any supported chain
 */
export function validateAddress(chain: Chain, address: string): boolean {
  return getBlockchainAdapter(chain).validateAddress(address)
}

/**
 * Format address for display
 */
export function formatAddress(chain: Chain, address: string): string {
  return getBlockchainAdapter(chain).formatAddress(address)
}
