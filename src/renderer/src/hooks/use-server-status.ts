/**
 * useServerStatus Hook
 * Monitors MPC server connectivity
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import * as api from '@renderer/services/api-client'

export type ServerStatus = 'connected' | 'disconnected' | 'checking'

export interface UseServerStatusReturn {
  status: ServerStatus
  isConnected: boolean
  lastChecked: Date | null
  checkNow: () => Promise<boolean>
}

export function useServerStatus(pollInterval: number = 30000): UseServerStatusReturn {
  const [status, setStatus] = useState<ServerStatus>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const checkNow = useCallback(async (): Promise<boolean> => {
    setStatus('checking')
    try {
      await api.checkHealth()
      setStatus('connected')
      setLastChecked(new Date())
      return true
    } catch {
      setStatus('disconnected')
      setLastChecked(new Date())
      return false
    }
  }, [])

  useEffect(() => {
    checkNow()
    if (pollInterval > 0) {
      intervalRef.current = setInterval(checkNow, pollInterval)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [pollInterval, checkNow])

  return {
    status,
    isConnected: status === 'connected',
    lastChecked,
    checkNow
  }
}
