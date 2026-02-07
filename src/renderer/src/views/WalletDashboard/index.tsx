import { useNavigate } from 'react-router-dom'
import { useWalletStore } from '@renderer/store/wallet-store'
import {
  BalanceChart,
  WalletInfo,
  BalanceDisplay,
  ActionButtons,
  BackButton
} from './components'

export function WalletDashboard() {
  const navigate = useNavigate()
  const { activeWallet } = useWalletStore()

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
          <BalanceChart currentBalance={activeWallet.usdBalance} />
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6">
        <BackButton />
        <WalletInfo wallet={activeWallet} />
        <BalanceDisplay
          usdBalance={activeWallet.usdBalance}
          ethBalance={activeWallet.balance}
        />
        <ActionButtons />
      </div>
    </div>
  )
}
