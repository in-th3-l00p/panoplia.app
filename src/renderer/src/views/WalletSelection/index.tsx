/**
 * WalletSelection View
 * Lists wallets and handles wallet creation/import.
 * Uses hardcoded wallet data — a real wallet library will be integrated later.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

import type { Wallet } from './types'
import {
  WalletListHeader,
  WalletList,
  WalletActionButtons,
  CreateWalletDialog,
  ImportWalletDialog
} from './components'

/** Hardcoded demo wallets */
const HARDCODED_WALLETS: Wallet[] = [
  {
    id: '1',
    name: 'Main Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f4a23F',
    balance: '2.4521',
    usdBalance: 8_234.56
  },
  {
    id: '2',
    name: 'Trading Wallet',
    address: '0x8B3392483BA26D65E331dB86D4F430E9B3814E5e',
    balance: '0.8234',
    usdBalance: 2_765.12
  }
]

export function WalletSelection() {
  const navigate = useNavigate()

  const [wallets, setWallets] = useState<Wallet[]>(HARDCODED_WALLETS)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [newWalletName, setNewWalletName] = useState('')

  const handleSelectWallet = (wallet: Wallet) => {
    // Store selected wallet id so other views can read it
    localStorage.setItem('panoplia_active_wallet', JSON.stringify(wallet))
    navigate('/dashboard')
  }

  const handleCreateWallet = () => {
    if (!newWalletName.trim()) return

    const wallet: Wallet = {
      id: Date.now().toString(),
      name: newWalletName,
      address: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      balance: '0.0000',
      usdBalance: 0
    }

    setWallets((prev) => [...prev, wallet])
    setNewWalletName('')
    setShowCreateDialog(false)
  }

  const handleCreateDialogChange = (open: boolean) => {
    setShowCreateDialog(open)
    if (!open) setNewWalletName('')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <WalletListHeader />
        <WalletList
          wallets={wallets}
          isLoading={false}
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
        isCreating={false}
        error={null}
        onSubmit={handleCreateWallet}
      />

      <ImportWalletDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
      />
    </div>
  )
}
