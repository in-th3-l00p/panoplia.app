import { useState } from 'react'
import { motion } from 'motion/react'
import { Copy, Check } from 'lucide-react'
import { shortenAddress } from '@renderer/lib/utils'
import type { WalletWithBalance } from '@renderer/store/wallet-store'

interface WalletInfoProps {
  wallet: WalletWithBalance
}

export function WalletInfo({ wallet }: WalletInfoProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(wallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Check if wallet has ENS (mock check for demo)
  const hasENS = wallet.address.toLowerCase().includes('742d35')
  const ensName = hasENS ? 'vitalik.eth' : null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-center mb-8"
    >
      {/* Wallet Avatar & Name */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-600/20">
          <span className="text-white font-bold text-sm">
            {wallet.name.charAt(0)}
          </span>
        </div>
        <h2 className="text-lg font-semibold text-white">{wallet.name}</h2>
      </div>

      {/* ENS Name */}
      {ensName && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-purple-400 text-sm font-medium mb-1"
        >
          {ensName}
        </motion.p>
      )}

      {/* Address with Copy */}
      <motion.button
        onClick={handleCopyAddress}
        className="flex items-center gap-2 text-muted-foreground hover:text-purple-400 transition-colors mx-auto"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-sm font-mono">
          {shortenAddress(wallet.address, 6)}
        </span>
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </motion.button>
    </motion.div>
  )
}
