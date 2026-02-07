/**
 * Hooks barrel export
 */

// ── Original hooks (zustand / service-backed) ──────────────────────────────
export { useWallet } from './use-wallet'
export type { UseWalletReturn } from './use-wallet'

export { useWallets } from './use-wallets'
export type { UseWalletsReturn, CreateWalletState } from './use-wallets'

export { useBalance } from './use-balance'
export type { UseBalanceReturn } from './use-balance'

export { useTransfer } from './use-transfer'
export type { UseTransferReturn, TransferMode, TransferState, PreparedTransfer } from './use-transfer'

export { useServerStatus } from './use-server-status'
export type { UseServerStatusReturn, ServerStatus } from './use-server-status'

// ── New context-backed ETH wallet hooks (mocked) ───────────────────────────
export { useEthWallet } from './use-eth-wallet'
export type { UseEthWalletReturn } from './use-eth-wallet'

export { useEthBalance } from './use-eth-balance'
export type { UseEthBalanceReturn } from './use-eth-balance'

export { useEthTransactions } from './use-eth-transactions'
export type { UseEthTransactionsReturn } from './use-eth-transactions'

export { useEthNetwork } from './use-eth-network'
export type { UseEthNetworkReturn } from './use-eth-network'

export { useEthGas } from './use-eth-gas'
export type { UseEthGasReturn } from './use-eth-gas'
