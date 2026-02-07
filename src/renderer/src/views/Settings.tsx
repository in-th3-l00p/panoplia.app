import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ChevronLeft,
  Shield,
  Bell,
  Palette,
  Globe,
  Key,
  Trash2,
  ChevronRight
} from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Card } from '@renderer/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { useWalletStore } from '@renderer/store/wallet-store'

interface SettingItemProps {
  icon: React.ReactNode
  label: string
  description?: string
  onClick?: () => void
  danger?: boolean
}

function SettingItem({ icon, label, description, onClick, danger }: SettingItemProps) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
      <Card
        className={`p-4 cursor-pointer transition-all duration-200 ${
          danger
            ? 'hover:border-red-500/50 hover:bg-red-500/5'
            : 'hover:border-purple-500/50'
        }`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                danger
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-purple-500/10 text-purple-400'
              }`}
            >
              {icon}
            </div>
            <div>
              <h3 className={`font-medium ${danger ? 'text-red-400' : 'text-white'}`}>
                {label}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </Card>
    </motion.div>
  )
}

export function Settings() {
  const navigate = useNavigate()
  const { activeWallet } = useWalletStore()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  if (!activeWallet) {
    navigate('/wallets')
    return null
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen h-full w-full bg-background overflow-hidden py-12">
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

      {/* Content */}
      <div className="flex flex-col items-center w-full max-w-md px-6">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white mb-2"
        >
          Settings
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mb-8"
        >
          {activeWallet.name}
        </motion.p>

        {/* Settings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full space-y-3"
        >
          <SettingItem
            icon={<Shield className="w-5 h-5" />}
            label="Security"
            description="Manage your wallet security settings"
          />
          <SettingItem
            icon={<Key className="w-5 h-5" />}
            label="Backup & Recovery"
            description="Export your recovery phrase"
          />
          <SettingItem
            icon={<Bell className="w-5 h-5" />}
            label="Notifications"
            description="Configure alerts and notifications"
          />
          <SettingItem
            icon={<Palette className="w-5 h-5" />}
            label="Appearance"
            description="Customize the app look and feel"
          />
          <SettingItem
            icon={<Globe className="w-5 h-5" />}
            label="Network"
            description="Switch between networks"
          />
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full mt-8"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Danger Zone
          </p>
          <SettingItem
            icon={<Trash2 className="w-5 h-5" />}
            label="Delete Wallet"
            description="Permanently remove this wallet"
            onClick={() => setShowDeleteDialog(true)}
            danger
          />
        </motion.div>

        {/* App Version */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-muted-foreground mt-8"
        >
          panoplia.eth v0.1.0
        </motion.p>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <Trash2 className="w-5 h-5" />
              Delete Wallet
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{activeWallet.name}"? This action cannot be undone.
              Make sure you have backed up your recovery phrase.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                setShowDeleteDialog(false)
                navigate('/wallets')
              }}
            >
              Delete Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
