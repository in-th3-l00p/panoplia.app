/**
 * WalletSelection View
 * Lists wallets from MPC server and handles creation.
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { LogOut } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { useWalletStore } from '@renderer/store/wallet-store'
import { useAuthStore } from '@renderer/store/auth-store'

import {
  WalletListHeader,
  WalletList,
  WalletActionButtons,
  CreateWalletDialog,
  ImportWalletDialog
} from './components'

export function WalletSelection() {
  const navigate = useNavigate()
  const { wallets, isLoading, fetchWallets, createWallet, setActiveWallet } = useWalletStore()
  const { user, logout } = useAuthStore()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [newWalletName, setNewWalletName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<Error | null>(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    fetchWallets()
  }, [user, navigate, fetchWallets])

  const handleSelectWallet = (wallet: any) => {
    // Adapt the local WalletSelection Wallet type to store type
    const storeWallet = wallets.find((w) => w.vaultId === wallet.id)
    if (storeWallet) {
      setActiveWallet(storeWallet)
      localStorage.setItem('panoplia_active_wallet', JSON.stringify(storeWallet))
    }
    navigate('/dashboard')
  }

  const handleCreateWallet = async () => {
    if (!newWalletName.trim()) return

    setIsCreating(true)
    setCreateError(null)
    try {
      const wallet = await createWallet(newWalletName)
      setActiveWallet(wallet)
      localStorage.setItem('panoplia_active_wallet', JSON.stringify(wallet))
      setNewWalletName('')
      setShowCreateDialog(false)
      navigate('/dashboard')
    } catch (err: any) {
      setCreateError(err)
    } finally {
      setIsCreating(false)
    }
  }

  const handleCreateDialogChange = (open: boolean) => {
    setShowCreateDialog(open)
    if (!open) {
      setNewWalletName('')
      setCreateError(null)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  // Map store wallets to component format
  const displayWallets = wallets
    .filter((w) => w.status === 'active')
    .map((w) => ({
      id: w.vaultId,
      name: w.name,
      address: w.address || w.vaultId.slice(0, 10) + '...',
      balance: w.balance,
      usdBalance: w.usdBalance
    }))

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      {/* User info + logout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-5 right-5 flex items-center gap-2"
      >
        <span className="text-xs text-muted-foreground">{user?.email}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-white h-8 w-8"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <WalletListHeader />
        <WalletList
          wallets={displayWallets}
          isLoading={isLoading}
          onSelect={handleSelectWallet}
        />
        <WalletActionButtons
          onCreateClick={() => setShowCreateDialog(true)}
          onImportClick={() => setShowImportDialog(true)}
        />
      </motion.div>

      <CreateWalletDialog
        open={showCreateDialog}
        onOpenChange={handleCreateDialogChange}
        walletName={newWalletName}
        onWalletNameChange={setNewWalletName}
        isCreating={isCreating}
        error={createError}
        onSubmit={handleCreateWallet}
      />

      <ImportWalletDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImported={() => fetchWallets()}
      />
    </div>
  )
}
