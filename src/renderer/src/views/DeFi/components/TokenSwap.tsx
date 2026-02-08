import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowDownUp, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import * as api from '@renderer/services/api-client'

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
  const [swapState, setSwapState] = useState<'idle' | 'signing' | 'done'>('idle')

  const numericFrom = parseFloat(fromAmount) || 0
  const estimatedTo = numericFrom > 0 ? (numericFrom * fromToken.price) / toToken.price : 0

  const swapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount('')
  }

  const handleSwap = async () => {
    if (numericFrom <= 0) return
    setSwapState('signing')

    // Use MPC signing to authorize the swap
    const stored = localStorage.getItem('panoplia_active_wallet')
    const activeWallet = stored ? JSON.parse(stored) : null
    if (activeWallet?.vaultId) {
      try {
        await api.signTransaction(activeWallet.vaultId, {
          chain: 'Ethereum',
          to: '0x0000000000000000000000000000000000000000', // Swap contract placeholder
          amount: fromAmount
        })
      } catch {
        // Demo mode: proceed anyway
      }
    }

    await new Promise((r) => setTimeout(r, 1500))
    setSwapState('done')
    setTimeout(() => {
      setSwapState('idle')
      setFromAmount('')
    }, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Swap Tokens
      </h2>

      <div className="flex items-start gap-4">
        {/* From */}
        <div className="flex-1 space-y-1.5">
          <label className="text-xs text-muted-foreground">You pay</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="text-lg h-12 flex-1 bg-muted/30 border-border"
              disabled={swapState !== 'idle'}
            />
            <select
              className="h-12 bg-muted border border-border rounded-lg px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              value={fromToken.symbol}
              onChange={(e) => {
                const t = TOKENS.find((tk) => tk.symbol === e.target.value)
                if (t) setFromToken(t)
              }}
              disabled={swapState !== 'idle'}
            >
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.icon} {t.symbol}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted-foreground">
            Balance: {fromToken.balance} {fromToken.symbol}
          </p>
        </div>

        {/* Swap arrow */}
        <div className="pt-8">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-border h-10 w-10"
            onClick={swapTokens}
            disabled={swapState !== 'idle'}
          >
            <ArrowDownUp className="w-4 h-4" />
          </Button>
        </div>

        {/* To */}
        <div className="flex-1 space-y-1.5">
          <label className="text-xs text-muted-foreground">You receive</label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              readOnly
              value={estimatedTo > 0 ? estimatedTo.toFixed(6) : ''}
              placeholder="0.00"
              className="text-lg h-12 flex-1 bg-muted/30 border-border"
            />
            <select
              className="h-12 bg-muted border border-border rounded-lg px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              value={toToken.symbol}
              onChange={(e) => {
                const t = TOKENS.find((tk) => tk.symbol === e.target.value)
                if (t) setToToken(t)
              }}
              disabled={swapState !== 'idle'}
            >
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.icon} {t.symbol}
                </option>
              ))}
            </select>
          </div>
          {numericFrom > 0 && swapState === 'idle' && (
            <p className="text-xs text-muted-foreground">
              1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(6)}{' '}
              {toToken.symbol}
            </p>
          )}
        </div>

        {/* Swap button */}
        <div className="pt-7">
          <Button
            className="h-12 px-8 bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 gap-2"
            disabled={numericFrom <= 0 || swapState !== 'idle'}
            onClick={handleSwap}
          >
            {swapState === 'signing' && <Loader2 className="w-4 h-4 animate-spin" />}
            {swapState === 'done' && <CheckCircle2 className="w-4 h-4 text-green-300" />}
            {swapState === 'idle' ? 'Swap' : swapState === 'signing' ? 'Signing...' : 'Done!'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
