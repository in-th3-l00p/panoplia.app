import { motion } from 'motion/react'
import { formatUSD } from '@renderer/lib/utils'

interface BalanceDisplayProps {
  usdBalance: number
  ethBalance: string
  changePercent?: number
}

export function BalanceDisplay({ usdBalance, ethBalance, changePercent = 12.5 }: BalanceDisplayProps) {
  const isPositive = changePercent >= 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      className="text-center mb-12"
    >
      <motion.p
        className="text-6xl font-bold text-white mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {formatUSD(usdBalance)}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-2"
      >
        <span className="text-lg text-muted-foreground">
          {ethBalance} ETH
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            isPositive
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {isPositive ? '+' : ''}{changePercent}%
        </span>
      </motion.div>
    </motion.div>
  )
}
