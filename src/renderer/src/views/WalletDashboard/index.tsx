import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWalletStore } from '@renderer/store/wallet-store'
import { useAuthStore } from '@renderer/store/auth-store'
import {
  BalanceChart,
  WalletInfo,
  BalanceDisplay,
  ActionButtons,
  BackButton
} from './components'

export function WalletDashboard() {
  const navigate = useNavigate()
  const { activeWallet, fetchTransactions } = useWalletStore()
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    if (!activeWallet) {
      // Try restoring from localStorage
      const stored = localStorage.getItem('panoplia_active_wallet')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          useWalletStore.getState().setActiveWallet(parsed)
          return
        } catch {
          // fall through
        }
      }
      navigate('/wallets')
      return
    }
    fetchTransactions(activeWallet.vaultId)
  }, [user, activeWallet, navigate, fetchTransactions])

  if (!activeWallet) return null

  const usdBalance = activeWallet.usdBalance ?? 0
  const ethBalance = activeWallet.balance ?? '0.0000'
  const change24h = 0 // demo mode

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-background overflow-hidden">
      {/* Background Chart */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-[60%] max-w-4xl">
          <BalanceChart currentBalance={usdBalance} />
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6">
        <BackButton />
        <WalletInfo wallet={activeWallet} />
        <BalanceDisplay
          usdBalance={usdBalance}
          ethBalance={ethBalance}
          changePercent={change24h}
        />
        <ActionButtons />
      </div>
    </div>
  )
}
