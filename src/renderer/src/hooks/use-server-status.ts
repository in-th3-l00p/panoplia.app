/**
 * useServerStatus Hook
 * Monitors MPC server connectivity
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getWalletService } from '@renderer/services'

/**
 * Server status
 */
export type ServerStatus = 'connected' | 'disconnected' | 'checking'

/**
 * Hook return type
 */
export interface UseServerStatusReturn {
  status: ServerStatus
  isConnected: boolean
  lastChecked: Date | null
  checkNow: () => Promise<boolean>
}

/**
 * useServerStatus - Monitor MPC server connectivity
 *
 * @param pollInterval - How often to check (ms), 0 to disable polling
 *
 * @example
 * ```tsx
 * function ServerIndicator() {
 *   const { status, isConnected } = useServerStatus(30000)
 *
 *   return (
 *     <div className={isConnected ? 'bg-green-500' : 'bg-red-500'}>
 *       {status}
 *     </div>
 *   )
 * }
 * ```
 */
export function useServerStatus(pollInterval: number = 30000): UseServerStatusReturn {
  const walletService = getWalletService()

  const [status, setStatus] = useState<ServerStatus>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const checkNow = useCallback(async (): Promise<boolean> => {
    setStatus('checking')

    const isHealthy = await walletService.checkServerHealth()

    setStatus(isHealthy ? 'connected' : 'disconnected')
    setLastChecked(new Date())

    return isHealthy
  }, [walletService])

  // Initial check and polling
  useEffect(() => {
    // Initial check
    checkNow()

    // Set up polling if interval > 0
    if (pollInterval > 0) {
      intervalRef.current = setInterval(checkNow, pollInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [pollInterval, checkNow])

  return {
    status,
    isConnected: status === 'connected',
    lastChecked,
    checkNow
  }
}
