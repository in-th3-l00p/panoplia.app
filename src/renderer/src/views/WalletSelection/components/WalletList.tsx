import { motion, AnimatePresence } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { WalletCard } from './WalletCard'
import type { EthWallet } from '@renderer/contexts/eth-wallet'

interface WalletListProps {
  wallets: EthWallet[]
  isLoading: boolean
  onSelect: (wallet: EthWallet) => void
}

export function WalletList({ wallets, isLoading, onSelect }: WalletListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-3 mb-6">
      <AnimatePresence>
        {wallets.map((wallet, index) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            index={index}
            onSelect={onSelect}
          />
        ))}
      </AnimatePresence>

      {/* Empty state */}
      {wallets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-muted-foreground">No wallets yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first wallet to get started
          </p>
        </motion.div>
      )}
    </div>
  )
}
