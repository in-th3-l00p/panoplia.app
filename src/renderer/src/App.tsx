import { Routes, Route } from 'react-router-dom'
import { SplashScreen } from './views/SplashScreen'
import { WalletSelection } from './views/WalletSelection'
import { WalletDashboard } from './views/WalletDashboard'
import { Transfer } from './views/Transfer'
import { Transfers } from './views/Transfers'
import { DeFi } from './views/DeFi'
import { Security } from './views/Security'

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/wallets" element={<WalletSelection />} />
      <Route path="/dashboard" element={<WalletDashboard />} />
      <Route path="/transfer" element={<Transfer />} />
      <Route path="/transfers" element={<Transfers />} />
      <Route path="/defi" element={<DeFi />} />
      <Route path="/security" element={<Security />} />
    </Routes>
  )
}

export default App
