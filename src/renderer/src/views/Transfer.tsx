import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ChevronLeft, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { useWalletStore } from '@renderer/store/wallet-store'
import { formatUSD } from '@renderer/lib/utils'

type TransferMode = 'deposit' | 'withdraw'

export function Transfer() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { activeWallet } = useWalletStore()

  const initialMode = (searchParams.get('mode') as TransferMode) || 'deposit'
  const [mode, setMode] = useState<TransferMode>(initialMode)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    const modeParam = searchParams.get('mode') as TransferMode
    if (modeParam && (modeParam === 'deposit' || modeParam === 'withdraw')) {
      setMode(modeParam)
    }
  }, [searchParams])

  if (!activeWallet) {
    navigate('/wallets')
    return null
  }

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimals
    const sanitized = value.replace(/[^0-9.]/g, '')
    // Prevent multiple decimals
    const parts = sanitized.split('.')
    if (parts.length > 2) return
    if (parts[1]?.length > 6) return
    setAmount(sanitized)
  }

  const numericAmount = parseFloat(amount) || 0
  const usdValue = numericAmount * 3357.42 // Mock ETH price

  const isValidAmount = numericAmount > 0 && (mode === 'deposit' || numericAmount <= parseFloat(activeWallet.balance))

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-background overflow-hidden">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="text-muted-foreground hover:text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Content */}
      <div className="flex flex-col items-center w-full max-w-sm px-6">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white mb-8"
        >
          Transfer Funds
        </motion.h1>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex p-1 bg-secondary rounded-xl mb-10"
        >
          <button
            onClick={() => setMode('deposit')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              mode === 'deposit'
                ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-600/30'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <ArrowDownToLine className="w-5 h-5" />
            Deposit
          </button>
          <button
            onClick={() => setMode('withdraw')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              mode === 'withdraw'
                ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-600/30'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <ArrowUpFromLine className="w-5 h-5" />
            Withdraw
          </button>
        </motion.div>

        {/* Amount Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full text-center mb-8"
        >
          <div className="relative">
            <Input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="text-center text-5xl font-bold h-auto py-4 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-muted-foreground/30"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground font-medium">
              ETH
            </span>
          </div>
          <p className="text-muted-foreground mt-2">
            ≈ {formatUSD(usdValue)}
          </p>
        </motion.div>

        {/* Balance Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between w-full px-4 py-3 bg-secondary/50 rounded-xl mb-8"
        >
          <span className="text-sm text-muted-foreground">
            Available Balance
          </span>
          <button
            onClick={() => mode === 'withdraw' && setAmount(activeWallet.balance)}
            className={`text-sm font-medium ${
              mode === 'withdraw' ? 'text-purple-400 hover:text-purple-300 cursor-pointer' : 'text-white'
            }`}
          >
            {activeWallet.balance} ETH
          </button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 w-full"
        >
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            disabled={!isValidAmount}
            className="flex-1 bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'deposit' ? 'Deposit' : 'Withdraw'}
          </Button>
        </motion.div>

        {/* Error message for withdraw */}
        {mode === 'withdraw' && numericAmount > parseFloat(activeWallet.balance) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm mt-4"
          >
            Insufficient balance
          </motion.p>
        )}
      </div>
    </div>
  )
}
