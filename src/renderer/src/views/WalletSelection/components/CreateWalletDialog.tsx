import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'

interface CreateWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isConnected: boolean
  walletName: string
  onWalletNameChange: (value: string) => void
  email: string
  onEmailChange: (value: string) => void
  password: string
  onPasswordChange: (value: string) => void
  isCreating: boolean
  error: Error | null
  onSubmit: () => void
}

export function CreateWalletDialog({
  open,
  onOpenChange,
  isConnected,
  walletName,
  onWalletNameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  isCreating,
  error,
  onSubmit
}: CreateWalletDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          {/* Wallet Name */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Wallet Name
            </label>
            <Input
              placeholder="My Wallet"
              value={walletName}
              onChange={(e) => onWalletNameChange(e.target.value)}
            />
          </div>

          {/* Email + Password — only when server is connected */}
          {isConnected && (
            <>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Email (for verification)
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Secure password"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                />
              </div>
            </>
          )}

          <Button
            className="w-full"
            onClick={onSubmit}
            disabled={!walletName.trim() || isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Wallet'
            )}
          </Button>

          {error && (
            <p className="text-sm text-red-400 text-center">
              {error.message}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
