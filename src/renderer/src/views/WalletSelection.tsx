/**
 * WalletSelection View
 * Lists wallets and handles wallet creation/import
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Download, Wallet, ChevronRight, Sparkles, Server, ServerOff, Loader2 } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Card } from '@renderer/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { useWallet, useWallets, useServerStatus } from '@renderer/hooks'
import { shortenAddress, formatUSD } from '@renderer/lib/utils'
import type { WalletWithBalance } from '@renderer/store/wallet-store'

export function WalletSelection() {
  const navigate = useNavigate()

  // Use hooks for wallet management
  const { selectWallet } = useWallet()
  const { wallets, isLoading, createWallet, verifyWallet, createState } = useWallets()
  const { isConnected, status } = useServerStatus(30000)

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showVerifyDialog, setShowVerifyDialog] = useState(false)

  // Form states
  const [newWalletName, setNewWalletName] = useState('')
  const [newWalletEmail, setNewWalletEmail] = useState('')
  const [newWalletPassword, setNewWalletPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')

  // Handle wallet selection
  const handleSelectWallet = (wallet: WalletWithBalance) => {
    selectWallet(wallet)
    navigate('/dashboard')
  }

  // Handle wallet creation
  const handleCreateWallet = async () => {
    if (!newWalletName.trim()) return

    // If server is not connected, create a mock wallet
    if (!isConnected) {
      // Use mock wallet creation from the store
      const { addWallet } = await import('@renderer/store/wallet-store').then(m => m.useWalletStore.getState())

      const mockWallet = {
        id: Date.now().toString(),
        vaultId: `mock-vault-${Date.now()}`,
        name: newWalletName,
        type: 'fast' as const,
        status: 'verified' as const,
        addresses: [
          { chain: 'Ethereum' as const, address: `0x${Math.random().toString(16).slice(2, 42)}` }
        ],
        primaryAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
        createdAt: new Date().toISOString(),
        balance: '0.0000',
        usdBalance: 0,
        tokens: [],
        nfts: []
      }

      addWallet(mockWallet as any)
      setNewWalletName('')
      setShowCreateDialog(false)
      return
    }

    // Create wallet via MPC server
    const vaultId = await createWallet({
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

  // Handle wallet verification
  const handleVerifyWallet = async () => {
    if (!createState.vaultId || !verificationCode) return

    const wallet = await verifyWallet({
      vaultId: createState.vaultId,
      code: verificationCode
    })

    if (wallet) {
      setShowVerifyDialog(false)
      setVerificationCode('')
      setNewWalletName('')
      setNewWalletEmail('')
      setNewWalletPassword('')
    }
  }

  // Reset form when dialog closes
  const handleCreateDialogChange = (open: boolean) => {
    setShowCreateDialog(open)
    if (!open) {
      setNewWalletName('')
      setNewWalletEmail('')
      setNewWalletPassword('')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Server Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          {status === 'checking' ? (
            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
          ) : isConnected ? (
            <Server className="w-4 h-4 text-green-500" />
          ) : (
            <ServerOff className="w-4 h-4 text-yellow-500" />
          )}
          <span className="text-xs text-muted-foreground">
            {status === 'checking'
              ? 'Connecting...'
              : isConnected
                ? 'MPC Server Connected'
                : 'Offline Mode'}
          </span>
        </motion.div>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 mb-4 shadow-lg shadow-purple-600/30"
          >
            <Wallet className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">Your Wallets</h1>
          <p className="text-muted-foreground text-sm">
            Select a wallet or create a new one
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          </div>
        )}

        {/* Wallet List */}
        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {wallets.map((wallet, index) => (
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="p-4 cursor-pointer hover:border-purple-500/50 transition-all duration-200 group"
                  onClick={() => handleSelectWallet(wallet)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {wallet.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{wallet.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {shortenAddress(wallet.address)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          {wallet.balance} ETH
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatUSD(wallet.usdBalance)}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {!isLoading && wallets.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-muted-foreground">No wallets yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first wallet to get started
              </p>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="w-5 h-5" />
              Create New
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => setShowImportDialog(true)}
            >
              <Download className="w-5 h-5" />
              Import
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Create Wallet Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={handleCreateDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Create New Wallet
            </DialogTitle>
            <DialogDescription>
              {isConnected
                ? 'Your wallet will be secured using MPC technology'
                : 'Creating wallet in offline mode (mock)'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Wallet Name
              </label>
              <Input
                placeholder="My Wallet"
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
              />
            </div>

            {/* Only show email/password when server is connected */}
            {isConnected && (
              <>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Email (for verification)
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={newWalletEmail}
                    onChange={(e) => setNewWalletEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Secure password"
                    value={newWalletPassword}
                    onChange={(e) => setNewWalletPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            <Button
              className="w-full"
              onClick={handleCreateWallet}
              disabled={!newWalletName.trim() || createState.isCreating}
            >
              {createState.isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Wallet'
              )}
            </Button>

            {createState.error && (
              <p className="text-sm text-red-400 text-center">
                {createState.error.message}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Verify Wallet Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Verify Your Wallet
            </DialogTitle>
            <DialogDescription>
              Enter the verification code sent to your email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Verification Code
              </label>
              <Input
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Use code "000000" for test mode
              </p>
            </div>
            <Button
              className="w-full"
              onClick={handleVerifyWallet}
              disabled={verificationCode.length < 6 || createState.isCreating}
            >
              {createState.isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Create'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Wallet Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-purple-400" />
              Import Wallet
            </DialogTitle>
            <DialogDescription>
              Import an existing wallet using your recovery phrase
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Wallet Name
              </label>
              <Input placeholder="Imported Wallet" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Recovery Phrase or Private Key
              </label>
              <Input
                type="password"
                placeholder="Enter your recovery phrase..."
              />
            </div>
            <Button className="w-full">Import Wallet</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
