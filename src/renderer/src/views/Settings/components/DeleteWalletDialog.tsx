import { Trash2 } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'

interface DeleteWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  walletName: string
  onConfirm: () => void
}

export function DeleteWalletDialog({
  open,
  onOpenChange,
  walletName,
  onConfirm
}: DeleteWalletDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400">
            <Trash2 className="w-5 h-5" />
            Delete Wallet
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{walletName}"? This action cannot be undone.
            Make sure you have backed up your recovery phrase.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button variant="destructive" className="flex-1" onClick={onConfirm}>
            Delete Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
