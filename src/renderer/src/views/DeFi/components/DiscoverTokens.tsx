import { motion } from 'motion/react'
import { Plus, TrendingUp } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Card } from '@renderer/components/ui/card'

interface DiscoverToken {
  symbol: string
  name: string
  icon: string
  price: number
  change24h: number
  marketCap: string
}

const DISCOVER_TOKENS: DiscoverToken[] = [
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄', price: 12.84, change24h: 5.67, marketCap: '$9.7B' },
  { symbol: 'AAVE', name: 'Aave', icon: '👻', price: 168.42, change24h: -1.23, marketCap: '$2.5B' },
  { symbol: 'LINK', name: 'Chainlink', icon: '⬡', price: 18.56, change24h: 3.45, marketCap: '$11.2B' },
  { symbol: 'MKR', name: 'Maker', icon: '🏛️', price: 2_847.33, change24h: 0.89, marketCap: '$2.6B' },
  { symbol: 'LDO', name: 'Lido DAO', icon: '🌊', price: 2.34, change24h: -2.11, marketCap: '$2.1B' },
  { symbol: 'ARB', name: 'Arbitrum', icon: '🔵', price: 1.12, change24h: 4.22, marketCap: '$4.3B' }
]

export function DiscoverTokens() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full"
    >
      <div className="flex items-center justify-between px-1 mb-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Discover Tokens
        </h2>
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        {DISCOVER_TOKENS.map((token, i) => (
          <motion.div
            key={token.symbol}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card className="p-3 hover:border-purple-500/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-base">
                    {token.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{token.symbol}</p>
                    <p className="text-xs text-muted-foreground">{token.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-white">
                      ${token.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <span
                      className={`text-xs ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {token.change24h >= 0 ? '+' : ''}
                      {token.change24h}%
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-border">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
