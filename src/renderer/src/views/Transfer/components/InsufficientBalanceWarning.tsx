import { motion } from 'motion/react'

interface InsufficientBalanceWarningProps {
  show: boolean
}

export function InsufficientBalanceWarning({ show }: InsufficientBalanceWarningProps) {
  if (!show) return null

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-red-400 text-sm mt-4"
    >
      Insufficient balance
    </motion.p>
  )
}
