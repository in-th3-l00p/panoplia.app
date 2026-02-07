/**
 * Wallet Service
 * Business logic layer for wallet operations
 * Orchestrates API calls and data transformations
 */

import { getApiClient } from './api-client'
import { DEFAULT_CHAINS, PRIMARY_CHAIN, STORAGE_KEYS } from '@renderer/config'
import type {
  Wallet,
  WalletAddress,
  CreateWalletRequest,
  VerifyWalletRequest,
  Chain,
  VaultType,
  WalletExport
} from '@renderer/types'
import type { VaultMetadata, SecureVaultSession } from '@renderer/types/api'

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

/**
 * Wallet creation result
 */
export interface CreateWalletResult {
  vaultId: string
  requiresVerification: boolean
}

/**
 * Service class events
 */
export type WalletServiceEvent =
  | { type: 'wallet_created'; vaultId: string }
  | { type: 'wallet_verified'; wallet: Wallet }
  | { type: 'wallet_deleted'; vaultId: string }
  | { type: 'addresses_loaded'; vaultId: string; addresses: WalletAddress[] }
  | { type: 'error'; error: Error }

type EventListener = (event: WalletServiceEvent) => void

/**
 * Wallet Service
 * Handles all wallet-related business logic
 */
export class WalletService {
  private api = getApiClient()
  private listeners: Set<EventListener> = new Set()

  // ============================================
  // Event System
  // ============================================

  /**
   * Subscribe to wallet events
   */
  subscribe(listener: EventListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private emit(event: WalletServiceEvent): void {
    this.listeners.forEach(listener => listener(event))
  }

  // ============================================
  // Wallet Creation
  // ============================================

  /**
   * Create a new wallet (fast vault)
   */
  async createWallet(request: CreateWalletRequest): Promise<Result<CreateWalletResult>> {
    try {
      if (request.type === 'secure') {
        return this.createSecureWallet(request)
      }

      const response = await this.api.createFastVault({
        name: request.name,
        email: request.email,
        password: request.password,
        userId: request.userId || this.getUserId()
      })

      this.emit({ type: 'wallet_created', vaultId: response.vaultId })

      return {
        success: true,
        data: {
          vaultId: response.vaultId,
          requiresVerification: true
        }
      }
    } catch (error) {
      this.emit({ type: 'error', error: error as Error })
      return {
        success: false,
        error: error as Error
      }
    }
  }

  /**
   * Create a secure wallet (N-of-M threshold)
   */
  private async createSecureWallet(
    request: CreateWalletRequest
  ): Promise<Result<CreateWalletResult>> {
    try {
      const session = await this.api.createSecureVault({
        name: request.name,
        devices: 2, // Default to 2-of-2
        threshold: 2,
        password: request.password,
        userId: request.userId || this.getUserId()
      })

      return {
        success: true,
        data: {
          vaultId: session.vaultId,
          requiresVerification: false
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
  // Wallet Verification
  // ============================================

  /**
   * Verify a wallet with email code
   */
  async verifyWallet(request: VerifyWalletRequest): Promise<Result<Wallet>> {
    try {
      const { vaultId, code } = request

      // Verify with server
      const verifyResponse = await this.api.verifyVault(vaultId, code)

      if (!verifyResponse.verified) {
        return {
          success: false,
          error: new Error('Verification failed')
        }
      }

      // Get vault metadata
      const metadata = await this.api.getVault(vaultId)

      // Fetch addresses for default chains
      const addresses = await this.fetchAddresses(vaultId, DEFAULT_CHAINS)

      // Construct wallet object
      const wallet = this.constructWallet(metadata, addresses)

      this.emit({ type: 'wallet_verified', wallet })

      return {
        success: true,
        data: wallet
      }
    } catch (error) {
      this.emit({ type: 'error', error: error as Error })
      return {
        success: false,
        error: error as Error
      }
    }
  }

  // ============================================
  // Wallet Loading
  // ============================================

  /**
   * Load all wallets for the current user
   */
  async loadWallets(): Promise<Result<Wallet[]>> {
    try {
      const userId = this.getUserId()
      const vaults = await this.api.listVaults(userId)

      // Only load verified vaults
      const verifiedVaults = vaults.filter(v => v.verified)

      // Load addresses for each vault in parallel
      const wallets = await Promise.all(
        verifiedVaults.map(async metadata => {
          try {
            const addresses = await this.fetchAddresses(metadata.vaultId, DEFAULT_CHAINS)
            return this.constructWallet(metadata, addresses)
          } catch {
            // Return wallet without addresses if fetch fails
            return this.constructWallet(metadata, [])
          }
        })
      )

      return {
        success: true,
        data: wallets
      }
    } catch (error) {
      return {
        success: false,
        error: error as Error
      }
    }
  }

  /**
   * Load a single wallet by ID
   */
  async loadWallet(vaultId: string): Promise<Result<Wallet>> {
    try {
      const metadata = await this.api.getVault(vaultId)
      const addresses = await this.fetchAddresses(vaultId, DEFAULT_CHAINS)
      const wallet = this.constructWallet(metadata, addresses)

      return {
        success: true,
        data: wallet
      }
    } catch (error) {
      return {
        success: false,
        error: error as Error
      }
    }
  }

  // ============================================
  // Address Operations
  // ============================================

  /**
   * Fetch addresses for multiple chains
   */
  async fetchAddresses(vaultId: string, chains: Chain[]): Promise<WalletAddress[]> {
    const addressMap = await this.api.getAddresses(vaultId, chains)
    const addresses: WalletAddress[] = []

    addressMap.forEach((address, chain) => {
      addresses.push({
        chain: chain as Chain,
        address
      })
    })

    this.emit({ type: 'addresses_loaded', vaultId, addresses })

    return addresses
  }

  /**
   * Get address for a specific chain
   */
  async getAddress(vaultId: string, chain: Chain): Promise<Result<string>> {
    try {
      const response = await this.api.getAddress(vaultId, chain)
      return {
        success: true,
        data: response.address
      }
    } catch (error) {
      return {
        success: false,
        error: error as Error
      }
    }
  }

  // ============================================
  // Wallet Export/Import
  // ============================================

  /**
   * Export wallet backup
   */
  async exportWallet(vaultId: string, password: string): Promise<Result<WalletExport>> {
    try {
      const response = await this.api.exportVault(vaultId, password)

      return {
        success: true,
        data: {
          vaultId,
          encryptedData: response.encryptedData,
          exportedAt: response.exportedAt
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
  // Secure Vault Session
  // ============================================

  /**
   * Get secure vault session status
   */
  async getSecureVaultSession(vaultId: string): Promise<Result<SecureVaultSession>> {
    try {
      const session = await this.api.getSecureVaultSession(vaultId)
      return {
        success: true,
        data: session
      }
    } catch (error) {
      return {
        success: false,
        error: error as Error
      }
    }
  }

  // ============================================
  // Health Check
  // ============================================

  /**
   * Check if server is available
   */
  async checkServerHealth(): Promise<boolean> {
    try {
      const response = await this.api.healthCheck()
      return response.status === 'ok'
    } catch {
      return false
    }
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Construct a Wallet object from metadata and addresses
   */
  private constructWallet(metadata: VaultMetadata, addresses: WalletAddress[]): Wallet {
    // Find primary address (Ethereum by default)
    const primaryAddress = addresses.find(a => a.chain === PRIMARY_CHAIN)?.address ||
                          addresses[0]?.address ||
                          ''

    return {
      id: metadata.vaultId,
      vaultId: metadata.vaultId,
      name: metadata.name,
      type: (metadata.type as VaultType) || 'fast',
      status: metadata.verified ? 'verified' : 'pending',
      addresses,
      primaryAddress,
      createdAt: metadata.createdAt,
      // These will be populated by the balance service
      balance: undefined,
      usdBalance: undefined,
      tokens: undefined,
      nfts: undefined
    }
  }

  /**
   * Get or generate user ID for this device
   */
  private getUserId(): string {
    let userId = localStorage.getItem(STORAGE_KEYS.userId)

    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem(STORAGE_KEYS.userId, userId)
    }

    return userId
  }
}

// ============================================
// Singleton Instance
// ============================================

let walletServiceInstance: WalletService | null = null

/**
 * Get or create WalletService instance
 */
export function getWalletService(): WalletService {
  if (!walletServiceInstance) {
    walletServiceInstance = new WalletService()
  }
  return walletServiceInstance
}

/**
 * Reset service (for testing)
 */
export function resetWalletService(): void {
  walletServiceInstance = null
}
