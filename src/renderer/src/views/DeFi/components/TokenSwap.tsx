import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowDownUp } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Card } from '@renderer/components/ui/card'

interface Token {
  symbol: string
  name: string
  icon: string
  balance: string
  price: number
}

const TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', balance: '2.4521', price: 3357.42 },
  { symbol: 'USDC', name: 'USD Coin', icon: '$', balance: '1,250.00', price: 1.0 },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '₿', balance: '0.0000', price: 67_432.10 },
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄', balance: '0.0000', price: 12.84 },
  { symbol: 'LINK', name: 'Chainlink', icon: '⬡', balance: '0.0000', price: 18.56 }
]

export function TokenSwap() {
  const [fromToken, setFromToken] = useState(TOKENS[0])
  const [toToken, setToToken] = useState(TOKENS[1])
  const [fromAmount, setFromAmount] = useState('')

  const numericFrom = parseFloat(fromAmount) || 0
  const estimatedTo = numericFrom > 0 ? (numericFrom * fromToken.price) / toToken.price : 0

  const swapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full"
    >
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1 mb-3">
        Swap Tokens
      </h2>

      <Card className="p-4 space-y-3">
        {/* From */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">You pay</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="text-lg flex-1"
            />
            <select
              className="bg-muted border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              value={fromToken.symbol}
              onChange={(e) => {
                const t = TOKENS.find((tk) => tk.symbol === e.target.value)
                if (t) setFromToken(t)
              }}
            >
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.icon} {t.symbol}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Balance: {fromToken.balance} {fromToken.symbol}
          </p>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-border h-8 w-8"
            onClick={swapTokens}
          >
            <ArrowDownUp className="w-4 h-4" />
          </Button>
        </div>

        {/* To */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">You receive</label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              readOnly
              value={estimatedTo > 0 ? estimatedTo.toFixed(6) : ''}
              placeholder="0.00"
              className="text-lg flex-1 bg-muted/50"
            />
            <select
              className="bg-muted border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              value={toToken.symbol}
              onChange={(e) => {
                const t = TOKENS.find((tk) => tk.symbol === e.target.value)
                if (t) setToToken(t)
              }}
            >
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.icon} {t.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rate info */}
        {numericFrom > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(6)}{' '}
            {toToken.symbol}
          </p>
        )}

        <Button
          className="w-full bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
          disabled={numericFrom <= 0}
        >
          Swap
        </Button>
      </Card>
    </motion.div>
  )
}
