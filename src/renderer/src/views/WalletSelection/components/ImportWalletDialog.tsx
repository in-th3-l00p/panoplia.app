import { Download } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'

interface ImportWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportWalletDialog({ open, onOpenChange }: ImportWalletDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  )
}
