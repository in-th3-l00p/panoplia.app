import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function formatBalance(balance: string | number, decimals = 4): string {
  const num = typeof balance === 'string' ? parseFloat(balance) : balance
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals
  })
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}
