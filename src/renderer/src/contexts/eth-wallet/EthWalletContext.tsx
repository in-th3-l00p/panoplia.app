/**
 * EthWalletContext
 *
 * Central React context that provides mocked ETH wallet state
 * to the entire application tree. Wraps all wallet-related concerns:
 * – active wallet selection
 * – wallet list CRUD
 * – balance & price data
 * – network / chain info
 * – transaction list
 *
 * Every value exposed here is mocked so the UI can be developed
 * without a live blockchain connection.
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode
} from 'react'
import type {
  Chain,
  Token,
  NFT,
  Transaction,
  BalanceHistoryPoint
} from '@renderer/types'
import {
  MOCK_ETH_PRICE_USD,
  MOCK_ETH_PRICE_CHANGE_24H,
  MOCK_TOKENS,
  MOCK_NFTS,
  generateMockAddress,
  generateMockTransactions,
  generateMockBalanceHistory,
  generateMockGasEstimate,
  type MockGasEstimate
} from './mock-data'

// ─── Public types ────────────────────────────────────────────────────────────

/** Minimal wallet representation used throughout the context */
export interface EthWallet {
  id: string
  name: string
  address: string
  balance: string // ETH
  usdBalance: number
  tokens: Token[]
  nfts: NFT[]
  createdAt: string
}

export type NetworkName = 'mainnet' | 'goerli' | 'sepolia' | 'localhost'

export interface NetworkInfo {
  name: NetworkName
  chainId: number
  rpcUrl: string
  blockExplorerUrl: string
  isTestnet: boolean
}

export interface EthPriceInfo {
  usd: number
  change24h: number
  lastUpdated: Date
}

/** Everything the context exposes */
export interface EthWalletContextValue {
  // --- wallet list ---
  wallets: EthWallet[]
  activeWallet: EthWallet | null
  isLoading: boolean
  selectWallet: (wallet: EthWallet) => void
  clearSelection: () => void
  createWallet: (name: string) => EthWallet
  removeWallet: (id: string) => void
  importWallet: (name: string, address: string) => EthWallet

  // --- balance & price ---
  ethPrice: EthPriceInfo
  balanceHistory: BalanceHistoryPoint[]
  refreshBalance: () => void

  // --- transactions ---
  transactions: Transaction[]
  pendingTransactions: Transaction[]
  refreshTransactions: () => void

  // --- network ---
  network: NetworkInfo
  switchNetwork: (name: NetworkName) => void
  availableNetworks: NetworkInfo[]

  // --- gas ---
  gasEstimate: MockGasEstimate | null
  estimateGas: () => MockGasEstimate
}

// ─── Networks ────────────────────────────────────────────────────────────────

const NETWORKS: Record<NetworkName, NetworkInfo> = {
  mainnet: {
    name: 'mainnet',
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
    blockExplorerUrl: 'https://etherscan.io',
    isTestnet: false
  },
  goerli: {
    name: 'goerli',
    chainId: 5,
    rpcUrl: 'https://rpc.ankr.com/eth_goerli',
    blockExplorerUrl: 'https://goerli.etherscan.io',
    isTestnet: true
  },
  sepolia: {
    name: 'sepolia',
    chainId: 11155111,
    rpcUrl: 'https://rpc.ankr.com/eth_sepolia',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    isTestnet: true
  },
  localhost: {
    name: 'localhost',
    chainId: 31337,
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorerUrl: '',
    isTestnet: true
  }
}

// ─── State & Reducer ─────────────────────────────────────────────────────────

interface State {
  wallets: EthWallet[]
  activeWallet: EthWallet | null
  isLoading: boolean
  ethPrice: EthPriceInfo
  balanceHistory: BalanceHistoryPoint[]
  transactions: Transaction[]
  network: NetworkInfo
  gasEstimate: MockGasEstimate | null
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_WALLETS'; payload: EthWallet[] }
  | { type: 'SELECT_WALLET'; payload: EthWallet | null }
  | { type: 'ADD_WALLET'; payload: EthWallet }
  | { type: 'REMOVE_WALLET'; payload: string }
  | { type: 'SET_PRICE'; payload: EthPriceInfo }
  | { type: 'SET_BALANCE_HISTORY'; payload: BalanceHistoryPoint[] }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_NETWORK'; payload: NetworkInfo }
  | { type: 'SET_GAS_ESTIMATE'; payload: MockGasEstimate }
  | { type: 'UPDATE_WALLET_BALANCE'; payload: { id: string; balance: string; usdBalance: number } }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_WALLETS':
      return { ...state, wallets: action.payload }

    case 'SELECT_WALLET':
      return { ...state, activeWallet: action.payload }

    case 'ADD_WALLET':
      return { ...state, wallets: [...state.wallets, action.payload] }

    case 'REMOVE_WALLET': {
      const wallets = state.wallets.filter((w) => w.id !== action.payload)
      const activeWallet =
        state.activeWallet?.id === action.payload ? null : state.activeWallet
      return { ...state, wallets, activeWallet }
    }

    case 'SET_PRICE':
      return { ...state, ethPrice: action.payload }

    case 'SET_BALANCE_HISTORY':
      return { ...state, balanceHistory: action.payload }

    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload }

    case 'SET_NETWORK':
      return { ...state, network: action.payload }

    case 'SET_GAS_ESTIMATE':
      return { ...state, gasEstimate: action.payload }

    case 'UPDATE_WALLET_BALANCE': {
      const wallets = state.wallets.map((w) =>
        w.id === action.payload.id
          ? { ...w, balance: action.payload.balance, usdBalance: action.payload.usdBalance }
          : w
      )
      const activeWallet =
        state.activeWallet?.id === action.payload.id
          ? { ...state.activeWallet, balance: action.payload.balance, usdBalance: action.payload.usdBalance }
          : state.activeWallet
      return { ...state, wallets, activeWallet }
    }

    default:
      return state
  }
}

// ─── Default mock wallets ────────────────────────────────────────────────────

const DEFAULT_WALLETS: EthWallet[] = [
  {
    id: '1',
    name: 'Main Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f4a23F',
    balance: '2.4521',
    usdBalance: 8_234.56,
    tokens: MOCK_TOKENS,
    nfts: MOCK_NFTS,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Trading Wallet',
    address: '0x8B3392483BA26D65E331dB86D4F430E9B3814E5e',
    balance: '0.8234',
    usdBalance: 2_765.12,
    tokens: [MOCK_TOKENS[0]!, MOCK_TOKENS[1]!],
    nfts: [],
    createdAt: new Date().toISOString()
  }
]

// ─── Initial state ───────────────────────────────────────────────────────────

const initialState: State = {
  wallets: DEFAULT_WALLETS,
  activeWallet: null,
  isLoading: false,
  ethPrice: {
    usd: MOCK_ETH_PRICE_USD,
    change24h: MOCK_ETH_PRICE_CHANGE_24H,
    lastUpdated: new Date()
  },
  balanceHistory: [],
  transactions: [],
  network: NETWORKS.mainnet,
  gasEstimate: null
}

// ─── Context ─────────────────────────────────────────────────────────────────

const EthWalletContext = createContext<EthWalletContextValue | null>(null)

// ─── Provider ────────────────────────────────────────────────────────────────

export function EthWalletProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // ── wallet CRUD ──────────────────────────────────────────────────────────

  const selectWallet = useCallback((wallet: EthWallet) => {
    dispatch({ type: 'SELECT_WALLET', payload: wallet })
  }, [])

  const clearSelection = useCallback(() => {
    dispatch({ type: 'SELECT_WALLET', payload: null })
  }, [])

  const createWallet = useCallback(
    (name: string): EthWallet => {
      const wallet: EthWallet = {
        id: Date.now().toString(),
        name,
        address: generateMockAddress(),
        balance: '0.0000',
        usdBalance: 0,
        tokens: [],
        nfts: [],
        createdAt: new Date().toISOString()
      }
      dispatch({ type: 'ADD_WALLET', payload: wallet })
      return wallet
    },
    []
  )

  const removeWallet = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_WALLET', payload: id })
  }, [])

  const importWallet = useCallback(
    (name: string, address: string): EthWallet => {
      const wallet: EthWallet = {
        id: Date.now().toString(),
        name,
        address,
        // Imported wallets get a random balance for mock
        balance: (Math.random() * 5).toFixed(4),
        usdBalance: Math.random() * 15_000,
        tokens: MOCK_TOKENS.slice(0, 2),
        nfts: [],
        createdAt: new Date().toISOString()
      }
      dispatch({ type: 'ADD_WALLET', payload: wallet })
      return wallet
    },
    []
  )

  // ── balance & price ──────────────────────────────────────────────────────

  const refreshBalance = useCallback(() => {
    if (!state.activeWallet) return

    // Simulate tiny balance fluctuation
    const currentEth = parseFloat(state.activeWallet.balance)
    const fluctuation = currentEth * (Math.random() - 0.5) * 0.001
    const newBalance = (currentEth + fluctuation).toFixed(4)
    const newUsd = parseFloat(newBalance) * MOCK_ETH_PRICE_USD

    dispatch({
      type: 'UPDATE_WALLET_BALANCE',
      payload: { id: state.activeWallet.id, balance: newBalance, usdBalance: newUsd }
    })

    dispatch({
      type: 'SET_PRICE',
      payload: {
        usd: MOCK_ETH_PRICE_USD + (Math.random() - 0.5) * 40,
        change24h: MOCK_ETH_PRICE_CHANGE_24H + (Math.random() - 0.5) * 0.5,
        lastUpdated: new Date()
      }
    })
  }, [state.activeWallet])

  // ── transactions ─────────────────────────────────────────────────────────

  const refreshTransactions = useCallback(() => {
    if (!state.activeWallet) return
    const txs = generateMockTransactions(state.activeWallet.address, 15)
    dispatch({ type: 'SET_TRANSACTIONS', payload: txs })
  }, [state.activeWallet])

  // ── network ──────────────────────────────────────────────────────────────

  const switchNetwork = useCallback((name: NetworkName) => {
    const net = NETWORKS[name]
    if (net) dispatch({ type: 'SET_NETWORK', payload: net })
  }, [])

  const availableNetworks = useMemo(() => Object.values(NETWORKS), [])

  // ── gas ──────────────────────────────────────────────────────────────────

  const estimateGas = useCallback((): MockGasEstimate => {
    const est = generateMockGasEstimate()
    dispatch({ type: 'SET_GAS_ESTIMATE', payload: est })
    return est
  }, [])

  // ── effects ──────────────────────────────────────────────────────────────

  // When active wallet changes, load its history & transactions
  useEffect(() => {
    if (state.activeWallet) {
      const history = generateMockBalanceHistory(state.activeWallet.usdBalance)
      dispatch({ type: 'SET_BALANCE_HISTORY', payload: history })

      const txs = generateMockTransactions(state.activeWallet.address, 15)
      dispatch({ type: 'SET_TRANSACTIONS', payload: txs })
    } else {
      dispatch({ type: 'SET_BALANCE_HISTORY', payload: [] })
      dispatch({ type: 'SET_TRANSACTIONS', payload: [] })
    }
  }, [state.activeWallet?.id])

  // ── derived ──────────────────────────────────────────────────────────────

  const pendingTransactions = useMemo(
    () => state.transactions.filter((tx) => tx.status === 'pending'),
    [state.transactions]
  )

  // ── value ────────────────────────────────────────────────────────────────

  const value: EthWalletContextValue = useMemo(
    () => ({
      wallets: state.wallets,
      activeWallet: state.activeWallet,
      isLoading: state.isLoading,
      selectWallet,
      clearSelection,
      createWallet,
      removeWallet,
      importWallet,
      ethPrice: state.ethPrice,
      balanceHistory: state.balanceHistory,
      refreshBalance,
      transactions: state.transactions,
      pendingTransactions,
      refreshTransactions,
      network: state.network,
      switchNetwork,
      availableNetworks,
      gasEstimate: state.gasEstimate,
      estimateGas
    }),
    [
      state.wallets,
      state.activeWallet,
      state.isLoading,
      state.ethPrice,
      state.balanceHistory,
      state.transactions,
      state.network,
      state.gasEstimate,
      selectWallet,
      clearSelection,
      createWallet,
      removeWallet,
      importWallet,
      refreshBalance,
      pendingTransactions,
      refreshTransactions,
      switchNetwork,
      availableNetworks,
      estimateGas
    ]
  )

  return (
    <EthWalletContext.Provider value={value}>
      {children}
    </EthWalletContext.Provider>
  )
}

// ─── Consumer hook ───────────────────────────────────────────────────────────

export function useEthWalletContext(): EthWalletContextValue {
  const ctx = useContext(EthWalletContext)
  if (!ctx) {
    throw new Error('useEthWalletContext must be used within an <EthWalletProvider>')
  }
  return ctx
}
