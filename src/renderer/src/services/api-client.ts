/**
 * API Client Service
 * Handles all HTTP communication with the MPC server
 */

import { API_CONFIG } from '@renderer/config'
import type {
  HealthCheckResponse,
  VaultMetadata,
  CreateFastVaultRequest,
  CreateFastVaultResponse,
  CreateSecureVaultRequest,
  SecureVaultSession,
  VerifyVaultResponse,
  GetAddressResponse,
  SignTransactionRequest,
  SignTransactionResponse,
  ExportVaultResponse,
  RequestConfig
} from '@renderer/types'

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

/**
 * API Client class for MPC server communication
 * Implements the adapter pattern for HTTP requests
 */
export class ApiClient {
  private baseUrl: string
  private defaultTimeout: number
  private defaultRetries: number

  constructor(config?: Partial<typeof API_CONFIG>) {
    this.baseUrl = config?.baseUrl || API_CONFIG.baseUrl
    this.defaultTimeout = config?.timeout || API_CONFIG.timeout
    this.defaultRetries = config?.retries || API_CONFIG.retries
  }

  /**
   * Generic request method with retry logic
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    config?: RequestConfig
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const timeout = config?.timeout || this.defaultTimeout
    const retries = config?.retries ?? this.defaultRetries

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const fetchOptions: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...config?.headers
      }
    }

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, fetchOptions)
        clearTimeout(timeoutId)

        const data = await response.json()

        if (!response.ok) {
          throw new ApiClientError(
            data.error || `Request failed with status ${response.status}`,
            response.status,
            data.code,
            data.details
          )
        }

        // Handle API response wrapper
        if ('success' in data) {
          if (!data.success) {
            throw new ApiClientError(data.error || 'Request failed')
          }
          return data.data as T
        }

        return data as T
      } catch (error) {
        lastError = error as Error

        if (error instanceof ApiClientError) {
          throw error
        }

        if ((error as Error).name === 'AbortError') {
          throw new ApiClientError('Request timeout', 408, 'TIMEOUT')
        }

        // Retry on network errors
        if (attempt < retries) {
          await this.delay(Math.pow(2, attempt) * 1000) // Exponential backoff
          continue
        }
      }
    }

    throw lastError || new ApiClientError('Request failed after retries')
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // ============================================
  // Health & Info Endpoints
  // ============================================

  /**
   * Check server health
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    return this.request<HealthCheckResponse>('/health')
  }

  /**
   * Get API info
   */
  async getApiInfo(): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>('/')
  }

  // ============================================
  // Fast Vault Endpoints
  // ============================================

  /**
   * Create a new fast vault (2-of-2 MPC)
   */
  async createFastVault(data: CreateFastVaultRequest): Promise<CreateFastVaultResponse> {
    return this.request<CreateFastVaultResponse>('/api/vaults/fast', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * Verify a vault with email code
   */
  async verifyVault(vaultId: string, code: string): Promise<VerifyVaultResponse> {
    return this.request<VerifyVaultResponse>(`/api/vaults/${vaultId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ code })
    })
  }

  /**
   * Get vault address for a specific chain
   */
  async getAddress(vaultId: string, chain: string): Promise<GetAddressResponse> {
    return this.request<GetAddressResponse>(`/api/vaults/${vaultId}/address/${chain}`)
  }

  /**
   * Get addresses for multiple chains
   */
  async getAddresses(vaultId: string, chains: string[]): Promise<Map<string, string>> {
    const addresses = new Map<string, string>()

    // Fetch addresses in parallel
    const results = await Promise.allSettled(
      chains.map(chain => this.getAddress(vaultId, chain))
    )

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        addresses.set(chains[index], result.value.address)
      }
    })

    return addresses
  }

  /**
   * Sign a transaction
   */
  async signTransaction(
    vaultId: string,
    data: SignTransactionRequest
  ): Promise<SignTransactionResponse> {
    return this.request<SignTransactionResponse>(`/api/vaults/${vaultId}/sign`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * Export vault backup
   */
  async exportVault(vaultId: string, password: string): Promise<ExportVaultResponse> {
    return this.request<ExportVaultResponse>(`/api/vaults/${vaultId}/export`, {
      method: 'POST',
      body: JSON.stringify({ password })
    })
  }

  /**
   * Get vault metadata
   */
  async getVault(vaultId: string): Promise<VaultMetadata> {
    return this.request<VaultMetadata>(`/api/vaults/${vaultId}`)
  }

  /**
   * List all vaults, optionally filtered by userId
   */
  async listVaults(userId?: string): Promise<VaultMetadata[]> {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : ''
    return this.request<VaultMetadata[]>(`/api/vaults${query}`)
  }

  // ============================================
  // Secure Vault Endpoints
  // ============================================

  /**
   * Create a secure vault (N-of-M threshold)
   */
  async createSecureVault(data: CreateSecureVaultRequest): Promise<SecureVaultSession> {
    return this.request<SecureVaultSession>('/api/vaults/secure', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * Get secure vault session status
   */
  async getSecureVaultSession(vaultId: string): Promise<SecureVaultSession> {
    return this.request<SecureVaultSession>(`/api/vaults/${vaultId}/session`)
  }
}

// Singleton instance
let apiClientInstance: ApiClient | null = null

/**
 * Get or create API client instance
 */
export function getApiClient(config?: Partial<typeof API_CONFIG>): ApiClient {
  if (!apiClientInstance || config) {
    apiClientInstance = new ApiClient(config)
  }
  return apiClientInstance
}

/**
 * Reset API client (for testing)
 */
export function resetApiClient(): void {
  apiClientInstance = null
}
