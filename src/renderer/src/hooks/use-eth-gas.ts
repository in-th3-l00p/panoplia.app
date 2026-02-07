/**
 * useEthGas – convenience hook for gas estimation
 *
 * @example
 * ```tsx
 * const { estimate, refresh, feeFormatted } = useEthGas()
 * ```
 */

import { useMemo } from 'react'
import { useEthWalletContext } from '../contexts/eth-wallet/EthWalletContext'
import { formatUSD } from '@renderer/lib/utils'
import type { MockGasEstimate } from '../contexts/eth-wallet/mock-data'

export interface UseEthGasReturn {
  /** Current gas estimate (null until first call) */
  estimate: MockGasEstimate | null
  /** Trigger a new gas estimate */
  refresh: () => MockGasEstimate
  /** Formatted fee string ($1.23) */
  feeFormatted: string
  /** Fee in ETH string */
  feeEth: string
}

export function useEthGas(): UseEthGasReturn {
  const { gasEstimate, estimateGas } = useEthWalletContext()

  const feeFormatted = useMemo(
    () => (gasEstimate ? formatUSD(gasEstimate.estimatedFeeUsd) : '$0.00'),
    [gasEstimate]
  )

  const feeEth = gasEstimate?.estimatedFeeEth ?? '0.000000'

  return {
    estimate: gasEstimate,
    refresh: estimateGas,
    feeFormatted,
    feeEth
  }
}
