/**
 * Auth Store — manages login/register + JWT persistence
 */

import { create } from 'zustand'
import { STORAGE_KEYS } from '@renderer/config'
import * as api from '@renderer/services/api-client'

interface User {
  id: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  validateToken: () => Promise<boolean>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: (() => {
    try {
      const u = localStorage.getItem(STORAGE_KEYS.user)
      return u ? JSON.parse(u) : null
    } catch {
      return null
    }
  })(),
  token: localStorage.getItem(STORAGE_KEYS.token),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.login(email, password)
      localStorage.setItem(STORAGE_KEYS.token, res.token)
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(res.user))
      set({ user: res.user, token: res.token, isLoading: false })
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false })
      throw err
    }
  },

  register: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.register(email, password)
      localStorage.setItem(STORAGE_KEYS.token, res.token)
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(res.user))
      set({ user: res.user, token: res.token, isLoading: false })
    } catch (err: any) {
      set({ error: err.message || 'Registration failed', isLoading: false })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.token)
    localStorage.removeItem(STORAGE_KEYS.user)
    localStorage.removeItem(STORAGE_KEYS.activeWallet)
    localStorage.removeItem(STORAGE_KEYS.activeWalletId)
    set({ user: null, token: null, error: null })
  },

  validateToken: async () => {
    const { token } = get()
    if (!token) return false
    try {
      const user = await api.getMe()
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
      set({ user })
      return true
    } catch {
      // Token is invalid
      get().logout()
      return false
    }
  },

  clearError: () => set({ error: null })
}))
