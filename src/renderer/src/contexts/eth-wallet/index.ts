/**
 * ETH wallet context barrel export
 */

export { EthWalletProvider, useEthWalletContext } from './EthWalletContext'
export type {
  EthWallet,
  NetworkName,
  NetworkInfo,
  EthPriceInfo,
  EthWalletContextValue
} from './EthWalletContext'

export type { MockGasEstimate } from './mock-data'
export {
  MOCK_ETH_PRICE_USD,
  MOCK_TOKENS,
  MOCK_NFTS,
  generateMockAddress,
  generateMockTransactions,
  generateMockBalanceHistory,
  generateMockGasEstimate
} from './mock-data'
