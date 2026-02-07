import { motion } from 'motion/react'
import { Button } from '@renderer/components/ui/button'
import type { TransferMode } from './TransferModeToggle'

interface TransferActionsProps {
  mode: TransferMode
  isValid: boolean
  onCancel: () => void
  onSubmit: () => void
}

export function TransferActions({ mode, isValid, onCancel, onSubmit }: TransferActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex gap-3 w-full"
    >
      <Button variant="secondary" size="lg" className="flex-1" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        size="lg"
        disabled={!isValid}
        className="flex-1 bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onSubmit}
      >
        {mode === 'deposit' ? 'Deposit' : 'Withdraw'}
      </Button>
    </motion.div>
  )
}
