/**
 * useEthNetwork – convenience hook for network / chain switching
 *
 * @example
 * ```tsx
 * const { network, isTestnet, switchNetwork, availableNetworks } = useEthNetwork()
 * ```
 */

import { useMemo } from 'react'
import {
  useEthWalletContext,
  type NetworkInfo,
  type NetworkName
} from '../contexts/eth-wallet/EthWalletContext'

export interface UseEthNetworkReturn {
  /** Active network info */
  network: NetworkInfo
  /** Convenience boolean */
  isTestnet: boolean
  /** Switch to a named network */
  switchNetwork: (name: NetworkName) => void
  /** All available networks */
  availableNetworks: NetworkInfo[]
  /** Block explorer link for a tx hash */
  explorerTxUrl: (hash: string) => string
  /** Block explorer link for an address */
  explorerAddressUrl: (address: string) => string
}

export function useEthNetwork(): UseEthNetworkReturn {
  const { network, switchNetwork, availableNetworks } = useEthWalletContext()

  const explorerTxUrl = useMemo(
    () => (hash: string) =>
      network.blockExplorerUrl ? `${network.blockExplorerUrl}/tx/${hash}` : '#',
    [network.blockExplorerUrl]
  )

  const explorerAddressUrl = useMemo(
    () => (address: string) =>
      network.blockExplorerUrl ? `${network.blockExplorerUrl}/address/${address}` : '#',
    [network.blockExplorerUrl]
  )

  return {
    network,
    isTestnet: network.isTestnet,
    switchNetwork,
    availableNetworks,
    explorerTxUrl,
    explorerAddressUrl
  }
}
