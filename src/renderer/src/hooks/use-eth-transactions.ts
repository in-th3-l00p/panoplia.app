/**
 * useEthTransactions – convenience hook for transaction list
 *
 * @example
 * ```tsx
 * const { transactions, pending, refresh } = useEthTransactions()
 * ```
 */

import { useEthWalletContext } from '../contexts/eth-wallet/EthWalletContext'
import type { Transaction } from '@renderer/types'

export interface UseEthTransactionsReturn {
  /** All transactions for the active wallet */
  transactions: Transaction[]
  /** Only pending transactions */
  pending: Transaction[]
  /** Re-generate mock transactions */
  refresh: () => void
}

export function useEthTransactions(): UseEthTransactionsReturn {
  const { transactions, pendingTransactions, refreshTransactions } = useEthWalletContext()

  return {
    transactions,
    pending: pendingTransactions,
    refresh: refreshTransactions
  }
}
