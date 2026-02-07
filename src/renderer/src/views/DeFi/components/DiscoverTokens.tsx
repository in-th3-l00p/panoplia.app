import { motion } from 'motion/react'
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'

interface DiscoverToken {
  symbol: string
  name: string
  icon: string
  price: number
  change24h: number
  marketCap: string
  color: string
}

const DISCOVER_TOKENS: DiscoverToken[] = [
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄', price: 12.84, change24h: 5.67, marketCap: '$9.7B', color: '#ec4899' },
  { symbol: 'AAVE', name: 'Aave', icon: '👻', price: 168.42, change24h: -1.23, marketCap: '$2.5B', color: '#8b5cf6' },
  { symbol: 'LINK', name: 'Chainlink', icon: '⬡', price: 18.56, change24h: 3.45, marketCap: '$11.2B', color: '#2563eb' },
  { symbol: 'MKR', name: 'Maker', icon: '🏛️', price: 2_847.33, change24h: 0.89, marketCap: '$2.6B', color: '#14b8a6' },
  { symbol: 'LDO', name: 'Lido DAO', icon: '🌊', price: 2.34, change24h: -2.11, marketCap: '$2.1B', color: '#f97316' },
  { symbol: 'ARB', name: 'Arbitrum', icon: '🔵', price: 1.12, change24h: 4.22, marketCap: '$4.3B', color: '#3b82f6' },
  { symbol: 'OP', name: 'Optimism', icon: '🔴', price: 3.45, change24h: 1.56, marketCap: '$3.8B', color: '#ef4444' },
  { symbol: 'CRV', name: 'Curve DAO', icon: '🔄', price: 0.87, change24h: -0.34, marketCap: '$1.1B', color: '#eab308' },
  { symbol: 'SNX', name: 'Synthetix', icon: '⚡', price: 4.12, change24h: 2.89, marketCap: '$1.3B', color: '#06b6d4' }
]

interface DiscoverTokensProps {
  search: string
}

export function DiscoverTokens({ search }: DiscoverTokensProps) {
  const filtered = DISCOVER_TOKENS.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Discover Tokens
      </h2>

      <div className="grid grid-cols-3 lg:grid-cols-3 gap-3">
        {filtered.map((token, i) => (
          <motion.div
            key={token.symbol}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.04 * i }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-border bg-muted/20 p-4 cursor-pointer hover:border-purple-500/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
                  style={{ backgroundColor: token.color + '20' }}
                >
                  {token.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{token.symbol}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{token.name}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full border border-border opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>

            <p className="text-lg font-bold text-white">
              ${token.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-muted-foreground">{token.marketCap}</p>
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {token.change24h >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {token.change24h >= 0 ? '+' : ''}
                {token.change24h}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
