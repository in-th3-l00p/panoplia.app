import { motion } from 'motion/react'
import { Wallet } from 'lucide-react'

export function WalletListHeader() {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 mb-4 shadow-lg shadow-purple-600/30"
      >
        <Wallet className="w-8 h-8 text-white" />
      </motion.div>
      <h1 className="text-2xl font-bold text-white mb-2">Your Wallets</h1>
      <p className="text-muted-foreground text-sm">
        Select a wallet or create a new one
      </p>
    </div>
  )
}
