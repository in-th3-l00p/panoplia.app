/**
 * API types for MPC server communication
 */

import type { VaultType } from './wallet'

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Health check response
export interface HealthCheckResponse {
  status: string
  timestamp?: string
}

// Vault metadata from server
export interface VaultMetadata {
  vaultId: string
  name: string
  email: string
  userId?: string
  createdAt: string
  verified: boolean
  chains?: string[]
  type?: VaultType
}

// Create fast vault request
export interface CreateFastVaultRequest {
  name: string
  email: string
  password: string
  userId?: string
}

// Create fast vault response
export interface CreateFastVaultResponse {
  vaultId: string
}

// Create secure vault request
export interface CreateSecureVaultRequest {
  name: string
  devices: number
  threshold: number
  password?: string
  userId?: string
}

// Secure vault session
export interface SecureVaultSession {
  vaultId: string
  status: 'pending' | 'pairing' | 'ready' | 'completed' | 'failed'
  qrCode?: string
  devicesJoined?: number
  devicesRequired?: number
  message?: string
}

// Verify vault request
export interface VerifyVaultRequest {
  code: string
}

// Verify vault response
export interface VerifyVaultResponse {
  verified: boolean
  vaultId: string
}

// Get address response
export interface GetAddressResponse {
  chain: string
  address: string
}

// Sign transaction request
export interface SignTransactionRequest {
  transaction: {
    to: string
    value: string
    data?: string
    gasLimit?: string
    gasPrice?: string
    nonce?: number
  }
  chain: string
  options?: {
    password?: string
  }
}

// Sign transaction response
export interface SignTransactionResponse {
  signature: string
  txHash?: string
}

// Export vault request
export interface ExportVaultRequest {
  password: string
}

// Export vault response
export interface ExportVaultResponse {
  encryptedData: string
  exportedAt: string
}

// Import vault request
export interface ImportVaultRequest {
  encryptedData: string
  password: string
  name?: string
}

// List vaults query params
export interface ListVaultsParams {
  userId?: string
}

// API error
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

// Request config
export interface RequestConfig {
  timeout?: number
  retries?: number
  headers?: Record<string, string>
}
