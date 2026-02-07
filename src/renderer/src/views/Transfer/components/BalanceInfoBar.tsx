import { motion } from 'motion/react'
import type { TransferMode } from './TransferModeToggle'

interface BalanceInfoBarProps {
  balance: string
  mode: TransferMode
  onMaxClick: () => void
}

export function BalanceInfoBar({ balance, mode, onMaxClick }: BalanceInfoBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex items-center justify-between w-full px-4 py-3 bg-secondary/50 rounded-xl mb-8"
    >
      <span className="text-sm text-muted-foreground">Available Balance</span>
      <button
        onClick={() => mode === 'withdraw' && onMaxClick()}
        className={`text-sm font-medium ${
          mode === 'withdraw'
            ? 'text-purple-400 hover:text-purple-300 cursor-pointer'
            : 'text-white'
        }`}
      >
        {balance} ETH
      </button>
    </motion.div>
  )
}
