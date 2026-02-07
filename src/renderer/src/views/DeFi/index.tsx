import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { TokenSwap, TokenPortfolio, DiscoverTokens } from './components'

export function DeFi() {
  const navigate = useNavigate()

  const stored = localStorage.getItem('panoplia_active_wallet')
  const activeWallet = stored ? JSON.parse(stored) : null

  if (!activeWallet) {
    navigate('/wallets')
    return null
  }

  return (
    <div className="relative flex flex-col items-center min-h-screen w-full bg-background py-12">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="text-muted-foreground hover:text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </motion.div>

      <div className="flex flex-col items-center w-full max-w-md px-6 gap-6 pb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white"
        >
          DeFi
        </motion.h1>

        <TokenSwap />
        <TokenPortfolio />
        <DiscoverTokens />
      </div>
    </div>
  )
}
