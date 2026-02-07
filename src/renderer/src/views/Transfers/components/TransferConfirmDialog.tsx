import { motion } from 'motion/react'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import type { Contact } from '../types'
import { getInitials, shortAddr, ETH_PRICE_USD } from '../types'

interface TransferConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact
  amountEth: number
  onConfirm: () => void
}

export function TransferConfirmDialog({
  open,
  onOpenChange,
  contact,
  amountEth,
  onConfirm
}: TransferConfirmDialogProps) {
  const usdValue = amountEth * ETH_PRICE_USD

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            Confirm Transfer
          </DialogTitle>
          <DialogDescription>
            Review the details before sending
          </DialogDescription>
        </DialogHeader>

        <div className="pt-2 space-y-4">
          {/* Recipient */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
              style={{ backgroundColor: contact.color + '30', color: contact.color }}
            >
              {getInitials(contact.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{contact.name}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {shortAddr(contact.address)}
              </p>
            </div>
          </div>

          {/* Amount breakdown */}
          <div className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-lg font-bold text-white">{amountEth.toFixed(6)} ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">USD Value</span>
              <span className="text-sm text-white">
                ≈ ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Network Fee</span>
              <span className="text-xs text-muted-foreground">~ $2.40 (est.)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Network</span>
              <span className="text-xs text-white">Ethereum Mainnet</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
              <Button
                className="w-full gap-2 bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
                onClick={onConfirm}
              >
                <ArrowUpRight className="w-4 h-4" />
                Send
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
