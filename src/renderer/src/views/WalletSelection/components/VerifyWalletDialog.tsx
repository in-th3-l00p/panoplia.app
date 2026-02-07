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

interface VerifyWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  code: string
  onCodeChange: (value: string) => void
  isVerifying: boolean
  onSubmit: () => void
}

export function VerifyWalletDialog({
  open,
  onOpenChange,
  code,
  onCodeChange,
  isVerifying,
  onSubmit
}: VerifyWalletDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Use code "000000" for test mode
            </p>
          </div>

          <Button
            className="w-full"
            onClick={onSubmit}
            disabled={code.length < 6 || isVerifying}
          >
            {isVerifying ? (
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
  )
}
