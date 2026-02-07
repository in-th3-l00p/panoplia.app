import { motion } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { Card } from '@renderer/components/ui/card'
import { shortenAddress, formatUSD } from '@renderer/lib/utils'
import type { EthWallet } from '@renderer/contexts/eth-wallet'

interface WalletCardProps {
  wallet: EthWallet
  index: number
  onSelect: (wallet: EthWallet) => void
}

export function WalletCard({ wallet, index, onSelect }: WalletCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        className="p-4 cursor-pointer hover:border-purple-500/50 transition-all duration-200 group"
        onClick={() => onSelect(wallet)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {wallet.name.charAt(0)}
              </span>
            </div>
            {/* Name + Address */}
            <div>
              <h3 className="font-semibold text-white">{wallet.name}</h3>
              <p className="text-sm text-muted-foreground">
                {shortenAddress(wallet.address)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Balance */}
            <div className="text-right">
              <p className="font-semibold text-white">{wallet.balance} ETH</p>
              <p className="text-sm text-muted-foreground">
                {formatUSD(wallet.usdBalance)}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-400 transition-colors" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
