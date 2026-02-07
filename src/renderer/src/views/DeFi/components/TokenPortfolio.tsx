import { motion } from 'motion/react'
import { Card } from '@renderer/components/ui/card'

interface PortfolioToken {
  symbol: string
  name: string
  icon: string
  balance: string
  usdValue: number
  change24h: number
}

const PORTFOLIO: PortfolioToken[] = [
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', balance: '2.4521', usdValue: 8_234.56, change24h: 2.34 },
  { symbol: 'USDC', name: 'USD Coin', icon: '$', balance: '1,250.00', usdValue: 1_250.00, change24h: 0.01 }
]

export function TokenPortfolio() {
  const totalValue = PORTFOLIO.reduce((sum, t) => sum + t.usdValue, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      <div className="flex items-center justify-between px-1 mb-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Portfolio
        </h2>
        <p className="text-sm text-white font-medium">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="space-y-2">
        {PORTFOLIO.map((token, i) => (
          <motion.div
            key={token.symbol}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card className="p-4 hover:border-purple-500/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-lg">
                    {token.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{token.symbol}</p>
                    <p className="text-xs text-muted-foreground">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {token.balance} {token.symbol}
                  </p>
                  <div className="flex items-center gap-1.5 justify-end">
                    <p className="text-xs text-muted-foreground">
                      ${token.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <span
                      className={`text-xs ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {token.change24h >= 0 ? '+' : ''}
                      {token.change24h}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
