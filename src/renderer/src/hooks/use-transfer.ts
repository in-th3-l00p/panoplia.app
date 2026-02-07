/**
 * useTransfer Hook
 * Handles deposit and withdrawal operations
 */

import { useState, useCallback } from 'react'
import { getTransactionService } from '@renderer/services'
import { validateAddress, getBlockchainAdapter } from '@renderer/adapters'
import type { Wallet, Chain, Transaction } from '@renderer/types'

/**
 * Transfer mode
 */
export type TransferMode = 'deposit' | 'withdraw'

/**
 * Transfer state
 */
export interface TransferState {
  mode: TransferMode
  amount: string
  recipient: string
  chain: Chain
  isValid: boolean
  isPreparing: boolean
  isSigning: boolean
  error: Error | null
}

/**
 * Prepared transaction info
 */
export interface PreparedTransfer {
  estimatedGas: string
  gasPrice: string
  estimatedFee: string
  estimatedFeeUsd: number
  total: string
}

/**
 * Hook return type
 */
export interface UseTransferReturn {
  // State
  state: TransferState

  // Actions
  setMode: (mode: TransferMode) => void
  setAmount: (amount: string) => void
  setRecipient: (recipient: string) => void
  setChain: (chain: Chain) => void
  reset: () => void

  // Validation
  validateAmount: (balance: string) => boolean
  validateRecipient: () => boolean

  // Transaction
  prepareTransfer: () => Promise<PreparedTransfer | null>
  executeTransfer: (password?: string) => Promise<Transaction | null>

  // Deposit helpers (for receiving)
  getDepositAddress: () => string | undefined
  getDepositQRData: () => string | undefined
}

const initialState: TransferState = {
  mode: 'deposit',
  amount: '',
  recipient: '',
  chain: 'Ethereum',
  isValid: false,
  isPreparing: false,
  isSigning: false,
  error: null
}

/**
 * useTransfer - Handle transfer operations
 *
 * @param wallet - The wallet to transfer from/to
 *
 * @example
 * ```tsx
 * function TransferForm() {
 *   const { wallet } = useWallet()
 *   const {
 *     state,
 *     setMode,
 *     setAmount,
 *     setRecipient,
 *     executeTransfer
 *   } = useTransfer(wallet)
 *
 *   const handleSubmit = async () => {
 *     const tx = await executeTransfer()
 *     if (tx) {
 *       console.log('Transaction sent:', tx.hash)
 *     }
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         type="number"
 *         value={state.amount}
 *         onChange={e => setAmount(e.target.value)}
 *       />
 *       {state.mode === 'withdraw' && (
 *         <input
 *           value={state.recipient}
 *           onChange={e => setRecipient(e.target.value)}
 *         />
 *       )}
 *       <button disabled={!state.isValid}>
 *         {state.mode === 'deposit' ? 'Deposit' : 'Withdraw'}
 *       </button>
 *     </form>
 *   )
 * }
 * ```
 */
export function useTransfer(wallet: Wallet | null): UseTransferReturn {
  const transactionService = getTransactionService()

  const [state, setState] = useState<TransferState>(initialState)

  // Update validation when state changes
  const updateValidation = useCallback((newState: Partial<TransferState>) => {
    setState(prev => {
      const updated = { ...prev, ...newState }

      // For deposit, just need amount
      if (updated.mode === 'deposit') {
        updated.isValid = parseFloat(updated.amount) > 0
      } else {
        // For withdraw, need amount and valid recipient
        const hasAmount = parseFloat(updated.amount) > 0
        const hasValidRecipient = updated.recipient
          ? validateAddress(updated.chain, updated.recipient)
          : false
        updated.isValid = hasAmount && hasValidRecipient
      }

      return updated
    })
  }, [])

  const setMode = useCallback((mode: TransferMode) => {
    updateValidation({ mode, error: null })
  }, [updateValidation])

  const setAmount = useCallback((amount: string) => {
    // Only allow valid numeric input
    const sanitized = amount.replace(/[^0-9.]/g, '')
    const parts = sanitized.split('.')
    if (parts.length > 2) return
    if (parts[1]?.length > 8) return

    updateValidation({ amount: sanitized, error: null })
  }, [updateValidation])

  const setRecipient = useCallback((recipient: string) => {
    updateValidation({ recipient, error: null })
  }, [updateValidation])

  const setChain = useCallback((chain: Chain) => {
    updateValidation({ chain, error: null })
  }, [updateValidation])

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  // Validate amount against balance
  const validateAmount = useCallback((balance: string): boolean => {
    const amount = parseFloat(state.amount)
    const available = parseFloat(balance)
    return amount > 0 && (state.mode === 'deposit' || amount <= available)
  }, [state.amount, state.mode])

  // Validate recipient address
  const validateRecipient = useCallback((): boolean => {
    if (!state.recipient) return false
    return validateAddress(state.chain, state.recipient)
  }, [state.recipient, state.chain])

  // Prepare transfer (get gas estimates)
  const prepareTransfer = useCallback(async (): Promise<PreparedTransfer | null> => {
    if (!wallet || !state.isValid) return null

    setState(prev => ({ ...prev, isPreparing: true, error: null }))

    try {
      const fromAddress = wallet.addresses.find(a => a.chain === state.chain)?.address
      if (!fromAddress) {
        throw new Error(`No ${state.chain} address found`)
      }

      const result = await transactionService.prepareSendTransaction(
        state.chain,
        state.recipient,
        state.amount,
        fromAddress
      )

      setState(prev => ({ ...prev, isPreparing: false }))

      if (!result.success) {
        setState(prev => ({ ...prev, error: result.error }))
        return null
      }

      const adapter = getBlockchainAdapter(state.chain)
      const feeWei = BigInt(result.data.gasLimit) * BigInt(result.data.gasPrice)
      const feeEth = adapter.fromBaseUnit(feeWei.toString())

      return {
        estimatedGas: result.data.gasLimit,
        gasPrice: result.data.gasPrice,
        estimatedFee: feeEth,
        estimatedFeeUsd: parseFloat(feeEth) * 3357.42, // Mock ETH price
        total: (parseFloat(state.amount) + parseFloat(feeEth)).toFixed(8)
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isPreparing: false,
        error: error as Error
      }))
      return null
    }
  }, [wallet, state, transactionService])

  // Execute the transfer
  const executeTransfer = useCallback(async (
    password?: string
  ): Promise<Transaction | null> => {
    if (!wallet || !state.isValid) return null

    setState(prev => ({ ...prev, isSigning: true, error: null }))

    try {
      const fromAddress = wallet.addresses.find(a => a.chain === state.chain)?.address
      if (!fromAddress) {
        throw new Error(`No ${state.chain} address found`)
      }

      const adapter = getBlockchainAdapter(state.chain)
      const valueWei = adapter.toBaseUnit(state.amount)

      const result = await transactionService.signTransaction(
        wallet.vaultId,
        {
          vaultId: wallet.vaultId,
          chain: state.chain,
          to: state.recipient,
          value: valueWei
        },
        password
      )

      setState(prev => ({ ...prev, isSigning: false }))

      if (!result.success) {
        setState(prev => ({ ...prev, error: result.error }))
        return null
      }

      // Create transaction record
      const tx = transactionService.formatTransaction(
        result.data.txHash || result.data.signature,
        state.chain,
        fromAddress,
        state.recipient,
        state.amount,
        'send',
        'pending'
      )

      return tx
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSigning: false,
        error: error as Error
      }))
      return null
    }
  }, [wallet, state, transactionService])

  // Get deposit address for current chain
  const getDepositAddress = useCallback((): string | undefined => {
    return wallet?.addresses.find(a => a.chain === state.chain)?.address
  }, [wallet, state.chain])

  // Get QR code data for deposit
  const getDepositQRData = useCallback((): string | undefined => {
    const address = getDepositAddress()
    if (!address) return undefined

    // Format as EIP-681 URI for Ethereum-like chains
    if (['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC', 'Avalanche'].includes(state.chain)) {
      return `ethereum:${address}`
    }

    // For other chains, just return the address
    return address
  }, [getDepositAddress, state.chain])

  return {
    state,
    setMode,
    setAmount,
    setRecipient,
    setChain,
    reset,
    validateAmount,
    validateRecipient,
    prepareTransfer,
    executeTransfer,
    getDepositAddress,
    getDepositQRData
  }
}
