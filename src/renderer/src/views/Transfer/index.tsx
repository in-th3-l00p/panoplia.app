import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { useEthWallet } from '@renderer/hooks/use-eth-wallet'
import { useEthBalance } from '@renderer/hooks/use-eth-balance'
import {
  TransferModeToggle,
  AmountInput,
  BalanceInfoBar,
  TransferActions,
  InsufficientBalanceWarning,
  type TransferMode
} from './components'

export function Transfer() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { activeWallet } = useEthWallet()
  const { ethBalance, ethPriceUsd } = useEthBalance()

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

  const numericAmount = parseFloat(amount) || 0
  const isValidAmount =
    numericAmount > 0 &&
    (mode === 'deposit' || numericAmount <= parseFloat(ethBalance))
  const isOverBalance =
    mode === 'withdraw' && numericAmount > parseFloat(ethBalance)

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

      <div className="flex flex-col items-center w-full max-w-sm px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white mb-8"
        >
          Transfer Funds
        </motion.h1>

        <TransferModeToggle mode={mode} onModeChange={setMode} />
        <AmountInput
          amount={amount}
          onAmountChange={setAmount}
          ethPriceUsd={ethPriceUsd}
        />
        <BalanceInfoBar
          balance={ethBalance}
          mode={mode}
          onMaxClick={() => setAmount(ethBalance)}
        />
        <TransferActions
          mode={mode}
          isValid={isValidAmount}
          onCancel={() => navigate('/dashboard')}
          onSubmit={() => {
            /* TODO: execute transfer via useEthWallet or MPC */
          }}
        />
        <InsufficientBalanceWarning show={isOverBalance} />
      </div>
    </div>
  )
}
