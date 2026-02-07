/**
 * Transaction Service
 * Handles transaction signing and broadcasting
 */

import { getApiClient } from './api-client'
import type {
  Chain,
  Transaction,
  TransactionRequest,
  TransactionStatus,
  TransactionType
} from '@renderer/types'
import type { Result } from './wallet-service'

/**
 * Transaction preparation result
 */
export interface PreparedTransaction {
  to: string
  value: string
  data?: string
  gasLimit: string
  gasPrice: string
  nonce: number
  chain: Chain
}

/**
 * Sign result
 */
export interface SignResult {
  signature: string
  txHash?: string
}

/**
 * Transaction Service
 * Handles all transaction-related operations
 */
export class TransactionService {
  private api = getApiClient()

  // ============================================
  // Transaction Signing
  // ============================================

  /**
   * Sign a transaction using MPC
   */
  async signTransaction(
    vaultId: string,
    request: TransactionRequest,
    password?: string
  ): Promise<Result<SignResult>> {
    try {
      const response = await this.api.signTransaction(vaultId, {
        transaction: {
          to: request.to,
          value: request.value,
          data: request.data,
          gasLimit: request.gasLimit,
          gasPrice: request.gasPrice,
          nonce: request.nonce
        },
        chain: request.chain,
        options: password ? { password } : undefined
      })

      return {
        success: true,
        data: {
          signature: response.signature,
          txHash: response.txHash
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error as Error
      }
    }
  }

  /**
   * Prepare a send transaction
   */
  async prepareSendTransaction(
    _chain: Chain,
    to: string,
    amount: string,
    fromAddress: string
  ): Promise<Result<PreparedTransaction>> {
    try {
      // For EVM chains
      if (this.isEVMChain(_chain)) {
        const gasPrice = await this.estimateGasPrice(_chain)
        const gasLimit = '21000' // Standard ETH transfer
        const nonce = await this.getNonce(_chain, fromAddress)

        return {
          success: true,
          data: {
            to,
            value: this.toWei(amount),
            gasLimit,
            gasPrice,
            nonce,
            chain: _chain
          }
        }
      }

      // For other chains, return basic transaction
      return {
        success: true,
        data: {
          to,
          value: amount,
          gasLimit: '0',
          gasPrice: '0',
          nonce: 0,
          chain: _chain
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error as Error
      }
    }
  }

  // ============================================
  // Gas Estimation
  // ============================================

  /**
   * Estimate gas price for a chain
   */
  async estimateGasPrice(chain: Chain): Promise<string> {
    // TODO: Implement actual gas price fetching from RPC
    // For now, return default values
    const defaultGasPrices: Partial<Record<Chain, string>> = {
      Ethereum: '30000000000', // 30 Gwei
      Polygon: '50000000000', // 50 Gwei
      Arbitrum: '100000000', // 0.1 Gwei
      Optimism: '1000000', // 0.001 Gwei
      BSC: '3000000000', // 3 Gwei
      Avalanche: '25000000000' // 25 nAVAX
    }

    return defaultGasPrices[chain] || '20000000000'
  }

  /**
   * Estimate gas limit for a transaction
   */
  async estimateGasLimit(
    _chain: Chain,
    _to: string,
    _value: string,
    data?: string
  ): Promise<string> {
    // TODO: Implement actual gas estimation via RPC eth_estimateGas
    // For now, return defaults
    if (data && data !== '0x') {
      return '100000' // Contract interaction
    }
    return '21000' // Simple transfer
  }

  /**
   * Get nonce for an address
   */
  async getNonce(_chain: Chain, _address: string): Promise<number> {
    // TODO: Implement actual nonce fetching via RPC eth_getTransactionCount
    return 0
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Check if chain is EVM compatible
   */
  private isEVMChain(chain: Chain): boolean {
    const evmChains: Chain[] = [
      'Ethereum',
      'Polygon',
      'Arbitrum',
      'Optimism',
      'BSC',
      'Avalanche'
    ]
    return evmChains.includes(chain)
  }

  /**
   * Convert ETH amount to Wei
   */
  private toWei(amount: string): string {
    const [whole, decimal = ''] = amount.split('.')
    const paddedDecimal = decimal.padEnd(18, '0').slice(0, 18)
    return BigInt(whole + paddedDecimal).toString()
  }

  /**
   * Convert Wei to ETH (for future use)
   */
  // private _fromWei(_wei: string): string {
  //   const value = BigInt(_wei)
  //   const divisor = BigInt(10 ** 18)
  //   const whole = value / divisor
  //   const remainder = value % divisor
  //   const decimal = remainder.toString().padStart(18, '0')
  //   return `${whole}.${decimal}`.replace(/\.?0+$/, '')
  // }

  /**
   * Format transaction for display
   */
  formatTransaction(
    txHash: string,
    chain: Chain,
    from: string,
    to: string,
    value: string,
    type: TransactionType = 'send',
    status: TransactionStatus = 'pending'
  ): Transaction {
    return {
      id: txHash,
      hash: txHash,
      type,
      status,
      chain,
      from,
      to,
      value,
      timestamp: new Date().toISOString()
    }
  }
}

// ============================================
// Singleton Instance
// ============================================

let transactionServiceInstance: TransactionService | null = null

/**
 * Get or create TransactionService instance
 */
export function getTransactionService(): TransactionService {
  if (!transactionServiceInstance) {
    transactionServiceInstance = new TransactionService()
  }
  return transactionServiceInstance
}

/**
 * Reset service (for testing)
 */
export function resetTransactionService(): void {
  transactionServiceInstance = null
}
