import { Routes, Route } from 'react-router-dom'
import { SplashScreen } from './views/SplashScreen'
import { WalletSelection } from './views/WalletSelection'
import { WalletDashboard } from './views/WalletDashboard'
import { Transfer } from './views/Transfer'
import { Settings } from './views/Settings'

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/wallets" element={<WalletSelection />} />
      <Route path="/dashboard" element={<WalletDashboard />} />
      <Route path="/transfer" element={<Transfer />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App
