import { motion } from 'motion/react'
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'

export type TransferMode = 'deposit' | 'withdraw'

interface TransferModeToggleProps {
  mode: TransferMode
  onModeChange: (mode: TransferMode) => void
}

export function TransferModeToggle({ mode, onModeChange }: TransferModeToggleProps) {
  const activeClass =
    'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-600/30'
  const inactiveClass = 'text-muted-foreground hover:text-white'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="flex p-1 bg-secondary rounded-xl mb-10"
    >
      <button
        onClick={() => onModeChange('deposit')}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          mode === 'deposit' ? activeClass : inactiveClass
        }`}
      >
        <ArrowDownToLine className="w-5 h-5" />
        Deposit
      </button>
      <button
        onClick={() => onModeChange('withdraw')}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          mode === 'withdraw' ? activeClass : inactiveClass
        }`}
      >
        <ArrowUpFromLine className="w-5 h-5" />
        Withdraw
      </button>
    </motion.div>
  )
}
