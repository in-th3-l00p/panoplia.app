import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import type { Contact } from '../types'
import { getInitials, randomColor } from '../types'

interface AddContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (contact: Contact) => void
}

export function AddContactDialog({ open, onOpenChange, onAdd }: AddContactDialogProps) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')

  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address)

  const handleAdd = () => {
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    if (!isValidAddress) {
      setError('Enter a valid Ethereum address (0x…)')
      return
    }

    const color = randomColor()
    const contact: Contact = {
      id: `c_${Date.now()}`,
      name: name.trim(),
      address,
      color,
      lastMessage: 'New contact',
      lastTimestamp: 'Now'
    }

    onAdd(contact)
    setName('')
    setAddress('')
    setError('')
    onOpenChange(false)
  }

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      setName('')
      setAddress('')
      setError('')
    }
    onOpenChange(v)
  }

  // Preview initials
  const previewColor = randomColor()

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-400" />
            Add Contact
          </DialogTitle>
          <DialogDescription>
            Add a new person to send and receive ETH with
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Preview */}
          {name.trim() && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                style={{ backgroundColor: previewColor + '30', color: previewColor }}
              >
                {getInitials(name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{name}</p>
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {address || '0x…'}
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Name</label>
            <Input
              placeholder="Alice.eth"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Ethereum Address
            </label>
            <Input
              placeholder="0x…"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
                setError('')
              }}
              className="font-mono text-sm"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <Button
            className="w-full bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
            onClick={handleAdd}
          >
            Add Contact
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
