import { motion } from 'motion/react'
import { Input } from '@renderer/components/ui/input'
import { formatUSD } from '@renderer/lib/utils'

interface AmountInputProps {
  amount: string
  onAmountChange: (value: string) => void
  ethPriceUsd: number
}

export function AmountInput({ amount, onAmountChange, ethPriceUsd }: AmountInputProps) {
  const handleChange = (value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, '')
    const parts = sanitized.split('.')
    if (parts.length > 2) return
    if (parts[1]?.length > 6) return
    onAmountChange(sanitized)
  }

  const numericAmount = parseFloat(amount) || 0
  const usdValue = numericAmount * ethPriceUsd

  return (
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
          onChange={(e) => handleChange(e.target.value)}
          className="text-center text-5xl font-bold h-auto py-4 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-muted-foreground/30"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground font-medium">
          ETH
        </span>
      </div>
      <p className="text-muted-foreground mt-2">≈ {formatUSD(usdValue)}</p>
    </motion.div>
  )
}
