/**
 * Balance Service
 * Handles fetching and caching balance data
 */

import { SUPPORTED_CHAINS } from '@renderer/config'
import type {
  Chain,
  Balance,
  PriceData,
  BalanceHistoryPoint
} from '@renderer/types'
import type { Result } from './wallet-service'

/**
 * Cache entry with TTL
 */
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

/**
 * Balance Service
 * Fetches and caches balance information
 */
export class BalanceService {
  private balanceCache = new Map<string, CacheEntry<Balance>>()
  private priceCache = new Map<string, CacheEntry<PriceData>>()

  private readonly BALANCE_TTL = 30_000 // 30 seconds
  private readonly PRICE_TTL = 60_000 // 1 minute

  // ============================================
  // Balance Fetching
  // ============================================

  /**
   * Get balance for a specific chain and address
   */
  async getBalance(chain: Chain, address: string): Promise<Result<Balance>> {
    const cacheKey = `${chain}:${address}`

    // Check cache
    const cached = this.getFromCache(this.balanceCache, cacheKey)
    if (cached) {
      return { success: true, data: cached }
    }

    try {
      const balance = await this.fetchBalance(chain, address)
      this.setCache(this.balanceCache, cacheKey, balance, this.BALANCE_TTL)

      return { success: true, data: balance }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  }

  /**
   * Get balances for multiple chains
   */
  async getBalances(
    addresses: Array<{ chain: Chain; address: string }>
  ): Promise<Map<Chain, Balance>> {
    const results = new Map<Chain, Balance>()

    await Promise.all(
      addresses.map(async ({ chain, address }) => {
        const result = await this.getBalance(chain, address)
        if (result.success) {
          results.set(chain, result.data)
        }
      })
    )

    return results
  }

  /**
   * Get total USD balance across all chains
   */
  async getTotalBalance(
    addresses: Array<{ chain: Chain; address: string }>
  ): Promise<Result<{ totalUsd: number; balances: Map<Chain, Balance> }>> {
    try {
      const balances = await this.getBalances(addresses)

      let totalUsd = 0
      balances.forEach(balance => {
        totalUsd += balance.totalUsdValue
      })

      return {
        success: true,
        data: { totalUsd, balances }
      }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  }

  // ============================================
  // Price Data
  // ============================================

  /**
   * Get current price for a token
   */
  async getPrice(symbol: string): Promise<Result<PriceData>> {
    // Check cache
    const cached = this.getFromCache(this.priceCache, symbol)
    if (cached) {
      return { success: true, data: cached }
    }

    try {
      const price = await this.fetchPrice(symbol)
      this.setCache(this.priceCache, symbol, price, this.PRICE_TTL)

      return { success: true, data: price }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  }

  /**
   * Get prices for multiple tokens
   */
  async getPrices(symbols: string[]): Promise<Map<string, PriceData>> {
    const results = new Map<string, PriceData>()

    await Promise.all(
      symbols.map(async symbol => {
        const result = await this.getPrice(symbol)
        if (result.success) {
          results.set(symbol, result.data)
        }
      })
    )

    return results
  }

  // ============================================
  // Historical Data
  // ============================================

  /**
   * Get balance history for charts (mock implementation)
   */
  async getBalanceHistory(
    addresses: Array<{ chain: Chain; address: string }>,
    days: number = 30
  ): Promise<Result<BalanceHistoryPoint[]>> {
    try {
      // TODO: Implement actual historical data fetching
      // For now, generate mock data based on current balance
      const totalResult = await this.getTotalBalance(addresses)

      if (!totalResult.success) {
        return { success: false, error: totalResult.error }
      }

      const currentValue = totalResult.data.totalUsd
      const history = this.generateMockHistory(currentValue, days)

      return { success: true, data: history }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  }

  // ============================================
  // Private Methods
  // ============================================

  /**
   * Fetch balance from blockchain RPC
   */
  private async fetchBalance(chain: Chain, address: string): Promise<Balance> {
    const config = SUPPORTED_CHAINS[chain]

    // TODO: Implement actual RPC calls based on chain type
    // For now, return mock data

    // Mock balance based on address hash for consistency
    const addressHash = this.hashString(address)
    const mockBalance = (addressHash % 10000) / 1000 // 0-10 range

    const priceResult = await this.getPrice(config.symbol)
    const price = priceResult.success ? priceResult.data.usd : this.getMockPrice(config.symbol)
    const usdValue = mockBalance * price

    return {
      chain,
      native: {
        balance: mockBalance.toFixed(4),
        symbol: config.symbol,
        usdValue
      },
      tokens: [], // TODO: Fetch ERC-20 tokens
      totalUsdValue: usdValue
    }
  }

  /**
   * Fetch price from price API
   */
  private async fetchPrice(symbol: string): Promise<PriceData> {
    // TODO: Implement actual price fetching (CoinGecko, etc.)
    // For now, return mock prices
    const price = this.getMockPrice(symbol)

    return {
      symbol,
      usd: price,
      change24h: (Math.random() - 0.5) * 10, // -5% to +5%
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * Get mock price for a symbol
   */
  private getMockPrice(symbol: string): number {
    const mockPrices: Record<string, number> = {
      ETH: 3357.42,
      BTC: 95234.56,
      SOL: 178.32,
      MATIC: 0.52,
      AVAX: 35.67,
      BNB: 612.45,
      ATOM: 8.92,
      RUNE: 4.56
    }
    return mockPrices[symbol] || 1
  }

  /**
   * Generate mock history data
   */
  private generateMockHistory(currentValue: number, days: number): BalanceHistoryPoint[] {
    const history: BalanceHistoryPoint[] = []
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000

    let value = currentValue * 0.7 // Start at 70% of current

    for (let i = days; i >= 0; i--) {
      const timestamp = new Date(now - i * dayMs).toISOString()

      // Add some volatility
      const volatility = value * 0.05
      const change = (Math.random() - 0.4) * volatility
      value = Math.max(value + change, value * 0.9)

      // Ensure we end at current value
      if (i === 0) value = currentValue

      history.push({ timestamp, usdValue: value })
    }

    return history
  }

  /**
   * Simple string hash for consistent mock data
   */
  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  // ============================================
  // Cache Helpers
  // ============================================

  private getFromCache<T>(cache: Map<string, CacheEntry<T>>, key: string): T | null {
    const entry = cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > entry.ttl) {
      cache.delete(key)
      return null
    }

    return entry.data
  }

  private setCache<T>(
    cache: Map<string, CacheEntry<T>>,
    key: string,
    data: T,
    ttl: number
  ): void {
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.balanceCache.clear()
    this.priceCache.clear()
  }
}

// ============================================
// Singleton Instance
// ============================================

let balanceServiceInstance: BalanceService | null = null

/**
 * Get or create BalanceService instance
 */
export function getBalanceService(): BalanceService {
  if (!balanceServiceInstance) {
    balanceServiceInstance = new BalanceService()
  }
  return balanceServiceInstance
}

/**
 * Reset service (for testing)
 */
export function resetBalanceService(): void {
  balanceServiceInstance = null
}
