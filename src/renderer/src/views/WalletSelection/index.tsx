/**
 * WalletSelection View
 * Lists wallets and handles wallet creation/import.
 * Uses the new EthWallet context for local/mock operations
 * and falls back to the original MPC hooks when the server is connected.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

import { useEthWallet } from '@renderer/hooks/use-eth-wallet'
import { useServerStatus } from '@renderer/hooks/use-server-status'
import { useWallets } from '@renderer/hooks/use-wallets'
import type { EthWallet } from '@renderer/contexts/eth-wallet'

import {
  ServerStatusIndicator,
  WalletListHeader,
  WalletList,
  WalletActionButtons,
  CreateWalletDialog,
  VerifyWalletDialog,
  ImportWalletDialog
} from './components'

export function WalletSelection() {
  const navigate = useNavigate()

  // Context-based wallet management (mocked)
  const { wallets, isLoading, selectWallet, createWallet: createMockWallet } = useEthWallet()

  // Original server-backed hooks (still usable when MPC server is live)
  const { createWallet: createMpcWallet, verifyWallet, createState } = useWallets()
  const { isConnected, status } = useServerStatus(30_000)

  // ── Dialog state ───────────────────────────────────────────────────────

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showVerifyDialog, setShowVerifyDialog] = useState(false)

  // ── Form state ─────────────────────────────────────────────────────────

  const [newWalletName, setNewWalletName] = useState('')
  const [newWalletEmail, setNewWalletEmail] = useState('')
  const [newWalletPassword, setNewWalletPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')

  // ── Handlers ───────────────────────────────────────────────────────────

  const handleSelectWallet = (wallet: EthWallet) => {
    selectWallet(wallet)
    navigate('/dashboard')
  }

  const handleCreateWallet = async () => {
    if (!newWalletName.trim()) return

    if (!isConnected) {
      // Use context-based mock creation
      createMockWallet(newWalletName)
      setNewWalletName('')
      setShowCreateDialog(false)
      return
    }

    // MPC server creation flow
    const vaultId = await createMpcWallet({
      name: newWalletName,
      email: newWalletEmail,
      password: newWalletPassword,
      type: 'fast'
    })

    if (vaultId && createState.requiresVerification) {
      setShowCreateDialog(false)
      setShowVerifyDialog(true)
    }
  }

  const handleVerifyWallet = async () => {
    if (!createState.vaultId || !verificationCode) return

    const wallet = await verifyWallet({
      vaultId: createState.vaultId,
      code: verificationCode
    })

    if (wallet) {
      setShowVerifyDialog(false)
      resetForm()
    }
  }

  const resetForm = () => {
    setVerificationCode('')
    setNewWalletName('')
    setNewWalletEmail('')
    setNewWalletPassword('')
  }

  const handleCreateDialogChange = (open: boolean) => {
    setShowCreateDialog(open)
    if (!open) resetForm()
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <ServerStatusIndicator status={status} isConnected={isConnected} />
        <WalletListHeader />
        <WalletList
          wallets={wallets}
          isLoading={isLoading}
          onSelect={handleSelectWallet}
        />
        <WalletActionButtons
          onCreateClick={() => setShowCreateDialog(true)}
          onImportClick={() => setShowImportDialog(true)}
        />
      </motion.div>

      {/* Dialogs */}
      <CreateWalletDialog
        open={showCreateDialog}
        onOpenChange={handleCreateDialogChange}
        isConnected={isConnected}
        walletName={newWalletName}
        onWalletNameChange={setNewWalletName}
        email={newWalletEmail}
        onEmailChange={setNewWalletEmail}
        password={newWalletPassword}
        onPasswordChange={setNewWalletPassword}
        isCreating={createState.isCreating}
        error={createState.error}
        onSubmit={handleCreateWallet}
      />

      <VerifyWalletDialog
        open={showVerifyDialog}
        onOpenChange={setShowVerifyDialog}
        code={verificationCode}
        onCodeChange={setVerificationCode}
        isVerifying={createState.isCreating}
        onSubmit={handleVerifyWallet}
      />

      <ImportWalletDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
      />
    </div>
  )
}
