/**
 * API Client for the Panoplia MPC server
 * Maps to the actual REST endpoints at localhost:3000
 */

import { API_CONFIG, STORAGE_KEYS } from '@renderer/config'

// ── Response types ──────────────────────────────────────────

export interface AuthResponse {
  token: string
  user: { id: string; email: string }
}

export interface VaultResponse {
  vaultId: string
  sessionId: string
  qrPayload: string
  status: string
}

export interface VaultDetail {
  id: string
  user_id: string
  name: string
  threshold: number
  total_parties: number
  status: 'pending' | 'active' | 'archived'
  ecdsa_pubkey: string | null
  eddsa_pubkey: string | null
  created_at: string
  addresses: Array<{ vault_id: string; chain: string; address: string }>
}

export interface TransactionRecord {
  id: string
  vault_id: string
  chain: string
  to_address: string
  amount: string
  tx_hash: string | null
  status: string
  created_at: string
}

export interface RecoveryConfig {
  id: string
  vault_id: string
  threshold: number
  total_guardians: number
  status: string
  guardians: Array<{
    id: string
    identifier: string
    name: string | null
    status: string
  }>
}

// ── Error class ─────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ── Core request helper ─────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.token)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {})
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout)

  try {
    const res = await fetch(`${API_CONFIG.baseUrl}/api${path}`, {
      ...options,
      headers,
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: res.statusText }))
      throw new ApiError(res.status, body.message || body.error || res.statusText)
    }
    if (res.status === 204) return undefined as T
    return res.json()
  } catch (err) {
    clearTimeout(timeoutId)
    if ((err as Error).name === 'AbortError') {
      throw new ApiError(408, 'Request timeout')
    }
    throw err
  }
}

// ── Auth ────────────────────────────────────────────────────

export async function register(email: string, password: string): Promise<AuthResponse> {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
}

export async function getMe(): Promise<{ id: string; email: string }> {
  return request('/auth/me')
}

// ── Vaults ──────────────────────────────────────────────────

export async function createVault(name: string): Promise<VaultResponse> {
  return request('/vaults', {
    method: 'POST',
    body: JSON.stringify({ name })
  })
}

export async function listVaults(): Promise<{ vaults: VaultDetail[] }> {
  return request('/vaults')
}

export async function getVault(id: string): Promise<VaultDetail> {
  return request(`/vaults/${id}`)
}

export async function archiveVault(id: string): Promise<void> {
  return request(`/vaults/${id}`, { method: 'DELETE' })
}

export async function exportVault(id: string): Promise<{ vaultContent: string }> {
  return request(`/vaults/${id}/export`)
}

export async function importVault(fileContent: string): Promise<{ vaultId: string }> {
  return request('/vaults/import', {
    method: 'POST',
    body: JSON.stringify({ fileContent })
  })
}

// ── Transactions ────────────────────────────────────────────

export async function signTransaction(
  vaultId: string,
  params: { chain: string; to: string; amount: string; memo?: string }
): Promise<{ sessionId: string; signingPayload: string }> {
  return request(`/vaults/${vaultId}/transactions/sign`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

export async function listTransactions(
  vaultId: string
): Promise<{ transactions: TransactionRecord[] }> {
  return request(`/vaults/${vaultId}/transactions`)
}

// ── Recovery ────────────────────────────────────────────────

export async function setupRecovery(
  vaultId: string,
  guardians: Array<{ identifier: string; name?: string }>,
  threshold: number
): Promise<{ recoveryId: string; guardianIds: string[] }> {
  return request(`/vaults/${vaultId}/recovery/setup`, {
    method: 'POST',
    body: JSON.stringify({ guardians, threshold })
  })
}

export async function getRecoveryConfig(vaultId: string): Promise<RecoveryConfig | null> {
  try {
    return await request(`/vaults/${vaultId}/recovery`)
  } catch (e) {
    if (e instanceof ApiError && e.statusCode === 404) return null
    throw e
  }
}

export async function revokeRecovery(vaultId: string): Promise<void> {
  return request(`/vaults/${vaultId}/recovery`, { method: 'DELETE' })
}

export async function initiateRecovery(
  vaultId: string,
  email: string
): Promise<{ attemptId: string; sharesNeeded: number }> {
  return request('/recovery/initiate', {
    method: 'POST',
    body: JSON.stringify({ vaultId, email })
  })
}

export async function submitShare(
  attemptId: string,
  guardianId: string,
  shareData: string
): Promise<{ collected: number; needed: number }> {
  return request(`/recovery/submit-share?attemptId=${attemptId}`, {
    method: 'POST',
    body: JSON.stringify({ guardianId, shareData })
  })
}

export async function completeRecovery(
  attemptId: string
): Promise<{ vaultContent: string }> {
  return request(`/recovery/${attemptId}/complete`, { method: 'POST' })
}

// ── Health ──────────────────────────────────────────────────

export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  return request('/health')
}
