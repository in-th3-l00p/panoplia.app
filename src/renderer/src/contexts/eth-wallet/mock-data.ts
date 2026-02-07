/**
 * Mock data generators for ETH wallet development
 * Provides realistic-looking data without connecting to any blockchain
 */

import type { Chain, Token, NFT, Transaction, BalanceHistoryPoint } from '@renderer/types'

// ─── Mock ETH price ──────────────────────────────────────────────────────────

export const MOCK_ETH_PRICE_USD = 3_357.42
export const MOCK_ETH_PRICE_CHANGE_24H = 2.34 // percent

/** Generates a fluctuating ETH price around base */
export function generateMockPrice(basePriceUsd = MOCK_ETH_PRICE_USD): {
  usd: number
  change24h: number
} {
  const jitter = (Math.random() - 0.5) * basePriceUsd * 0.02
  return {
    usd: basePriceUsd + jitter,
    change24h: MOCK_ETH_PRICE_CHANGE_24H + (Math.random() - 0.5) * 2
  }
}

// ─── Mock addresses ──────────────────────────────────────────────────────────

export function generateMockAddress(): string {
  const hex = Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
  return `0x${hex}`
}

// ─── Mock tokens ─────────────────────────────────────────────────────────────

export const MOCK_TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: '2.4521', usdValue: 8_234.56, decimals: 18, chain: 'Ethereum' as Chain },
  { symbol: 'USDC', name: 'USD Coin', balance: '1500.00', usdValue: 1_500.0, decimals: 6, chain: 'Ethereum' as Chain },
  { symbol: 'LINK', name: 'Chainlink', balance: '150.00', usdValue: 2_100.0, decimals: 18, chain: 'Ethereum' as Chain },
  { symbol: 'UNI', name: 'Uniswap', balance: '75.50', usdValue: 567.0, decimals: 18, chain: 'Ethereum' as Chain },
  { symbol: 'AAVE', name: 'Aave', balance: '12.25', usdValue: 3_920.0, decimals: 18, chain: 'Ethereum' as Chain },
  { symbol: 'DAI', name: 'Dai Stablecoin', balance: '2500.00', usdValue: 2_500.0, decimals: 18, chain: 'Ethereum' as Chain }
]

export const MOCK_NFTS: NFT[] = [
  { id: '1', name: 'Bored Ape #1234', collection: 'BAYC', image: '', chain: 'Ethereum' as Chain },
  { id: '2', name: 'Azuki #5678', collection: 'Azuki', image: '', chain: 'Ethereum' as Chain },
  { id: '3', name: 'Pudgy Penguin #999', collection: 'Pudgy Penguins', image: '', chain: 'Ethereum' as Chain }
]

// ─── Mock transactions ───────────────────────────────────────────────────────

export function generateMockTransactions(address: string, count = 10): Transaction[] {
  const types: Transaction['type'][] = ['send', 'receive', 'swap', 'approve']
  const statuses: Transaction['status'][] = ['confirmed', 'confirmed', 'confirmed', 'pending']

  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length]!
    const isSend = type === 'send'
    const timestamp = new Date(Date.now() - i * 3_600_000 * (1 + Math.random() * 12))

    return {
      id: `tx-${i}`,
      hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      type,
      status: statuses[i % statuses.length]!,
      chain: 'Ethereum' as Chain,
      from: isSend ? address : generateMockAddress(),
      to: isSend ? generateMockAddress() : address,
      value: (Math.random() * 2).toFixed(4),
      fee: (Math.random() * 0.005).toFixed(6),
      timestamp: timestamp.toISOString(),
      blockNumber: 19_000_000 - i * 100
    }
  })
}

// ─── Mock balance history ────────────────────────────────────────────────────

export function generateMockBalanceHistory(
  currentUsd: number,
  days = 30
): BalanceHistoryPoint[] {
  const points: BalanceHistoryPoint[] = []
  let value = currentUsd * 0.7

  for (let i = 0; i < days; i++) {
    const volatility = value * 0.06
    const change = (Math.random() - 0.4) * volatility
    value = Math.max(value + change, value * 0.92)
    if (i === days - 1) value = currentUsd

    const timestamp = new Date(Date.now() - (days - 1 - i) * 86_400_000)
    points.push({
      timestamp: timestamp.toISOString(),
      usdValue: Math.round(value * 100) / 100
    })
  }

  return points
}

// ─── Mock gas estimates ──────────────────────────────────────────────────────

export interface MockGasEstimate {
  gasLimit: string
  gasPrice: string
  maxFeePerGas: string
  maxPriorityFeePerGas: string
  estimatedFeeEth: string
  estimatedFeeUsd: number
}

export function generateMockGasEstimate(): MockGasEstimate {
  const gasLimit = '21000'
  const gasPriceGwei = 15 + Math.random() * 30
  const gasPriceWei = Math.round(gasPriceGwei * 1e9)
  const feeWei = 21000 * gasPriceWei
  const feeEth = feeWei / 1e18

  return {
    gasLimit,
    gasPrice: gasPriceWei.toString(),
    maxFeePerGas: Math.round(gasPriceGwei * 1.2 * 1e9).toString(),
    maxPriorityFeePerGas: Math.round(2 * 1e9).toString(),
    estimatedFeeEth: feeEth.toFixed(6),
    estimatedFeeUsd: feeEth * MOCK_ETH_PRICE_USD
  }
}
