import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import {
  SettingsHeader,
  SettingsList,
  DangerZone,
  DeleteWalletDialog,
  AppVersion
} from './components'

export function Settings() {
  const navigate = useNavigate()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Read the active wallet from localStorage (stored by WalletSelection)
  const stored = localStorage.getItem('panoplia_active_wallet')
  const activeWallet = stored ? JSON.parse(stored) : null

  if (!activeWallet) {
    navigate('/wallets')
    return null
  }

  const handleDelete = () => {
    localStorage.removeItem('panoplia_active_wallet')
    setShowDeleteDialog(false)
    navigate('/wallets')
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen h-full w-full bg-background py-12">
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

      <div className="flex flex-col items-center w-full max-w-md px-6 h-full">
        <SettingsHeader walletName={activeWallet.name} />
        <SettingsList />
        <DangerZone onDeleteClick={() => setShowDeleteDialog(true)} />
        <AppVersion />
      </div>

      <DeleteWalletDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        walletName={activeWallet.name}
        onConfirm={handleDelete}
      />
    </div>
  )
}
