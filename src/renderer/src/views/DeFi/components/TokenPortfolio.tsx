import { motion } from 'motion/react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface PortfolioToken {
  symbol: string
  name: string
  icon: string
  balance: string
  usdValue: number
  change24h: number
  color: string
}

const PORTFOLIO: PortfolioToken[] = [
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', balance: '2.4521', usdValue: 8_234.56, change24h: 2.34, color: '#a78bfa' },
  { symbol: 'USDC', name: 'USD Coin', icon: '$', balance: '1,250.00', usdValue: 1_250.00, change24h: 0.01, color: '#3b82f6' },
  { symbol: 'WBTC', name: 'Wrapped BTC', icon: '₿', balance: '0.0450', usdValue: 3_034.44, change24h: -0.87, color: '#f97316' },
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄', balance: '45.00', usdValue: 577.80, change24h: 5.67, color: '#ec4899' },
  { symbol: 'LINK', name: 'Chainlink', icon: '⬡', balance: '32.50', usdValue: 603.20, change24h: 3.45, color: '#2563eb' },
  { symbol: 'AAVE', name: 'Aave', icon: '👻', balance: '2.10', usdValue: 353.68, change24h: -1.23, color: '#8b5cf6' }
]

interface TokenPortfolioProps {
  search: string
}

export function TokenPortfolio({ search }: TokenPortfolioProps) {
  const filtered = PORTFOLIO.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase())
  )
  const totalValue = PORTFOLIO.reduce((sum, t) => sum + t.usdValue, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Portfolio
        </h2>
        <p className="text-sm text-white font-semibold">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((token, i) => (
          <motion.div
            key={token.symbol}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.04 * i }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-border bg-muted/20 p-4 cursor-pointer hover:border-purple-500/30 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: token.color + '20', color: token.color }}
              >
                {token.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{token.symbol}</p>
                <p className="text-xs text-muted-foreground truncate">{token.name}</p>
              </div>
            </div>

            <p className="text-lg font-bold text-white">
              {token.balance}
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                ${token.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
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
