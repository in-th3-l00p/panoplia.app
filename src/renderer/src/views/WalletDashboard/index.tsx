import { useNavigate } from 'react-router-dom'
import {
  BalanceChart,
  WalletInfo,
  BalanceDisplay,
  ActionButtons,
  BackButton
} from './components'

export function WalletDashboard() {
  const navigate = useNavigate()

  // Read the active wallet from localStorage (stored by WalletSelection)
  const stored = localStorage.getItem('panoplia_active_wallet')
  const activeWallet = stored ? JSON.parse(stored) : null

  if (!activeWallet) {
    navigate('/wallets')
    return null
  }

  const usdBalance: number = activeWallet.usdBalance ?? 0
  const ethBalance: string = activeWallet.balance ?? '0.0000'
  const change24h = 2.34 // hardcoded until a real library is integrated

  // Redirect if no wallet is selected
  if (!activeWallet) {
    navigate('/wallets')
    return null
  }

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
