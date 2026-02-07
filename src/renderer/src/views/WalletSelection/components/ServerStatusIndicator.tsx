import { motion } from 'motion/react'
import { Loader2, Server, ServerOff } from 'lucide-react'
import type { ServerStatus } from '@renderer/hooks'

interface ServerStatusIndicatorProps {
  status: ServerStatus
  isConnected: boolean
}

export function ServerStatusIndicator({ status, isConnected }: ServerStatusIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center gap-2 mb-4"
    >
      {status === 'checking' ? (
        <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
      ) : isConnected ? (
        <Server className="w-4 h-4 text-green-500" />
      ) : (
        <ServerOff className="w-4 h-4 text-yellow-500" />
      )}
      <span className="text-xs text-muted-foreground">
        {status === 'checking'
          ? 'Connecting...'
          : isConnected
            ? 'MPC Server Connected'
            : 'Offline Mode'}
      </span>
    </motion.div>
  )
}
