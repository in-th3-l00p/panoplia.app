import { useState } from 'react'
import { motion } from 'motion/react'
import { Search, UserPlus, QrCode, Copy, Check } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { shortenAddress } from '@renderer/lib/utils'
import type { Contact } from '../types'
import { getInitials } from '../types'

interface ContactListProps {
  contacts: Contact[]
  selectedId: string | null
  myAddress: string
  onSelectContact: (contact: Contact) => void
  onShowMyAddress: () => void
}

export function ContactList({
  contacts,
  selectedId,
  myAddress,
  onSelectContact,
  onShowMyAddress
}: ContactListProps) {
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  )

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(myAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full border-r border-border">
      {/* Header */}
      <div className="p-4 pb-3 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Transfers</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <UserPlus className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search people…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm bg-muted/50 border-none"
          />
        </div>
      </div>

      {/* My Address card */}
      <div className="px-3 pb-2 shrink-0">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onShowMyAddress}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
            selectedId === '__my_address__'
              ? 'bg-purple-500/10 border border-purple-500/30'
              : 'hover:bg-muted/50'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shrink-0">
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-white truncate">Your Address</p>
            <p className="text-xs text-muted-foreground font-mono truncate">
              {shortenAddress(myAddress, 6)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
        </motion.button>
      </div>

      {/* Separator */}
      <div className="px-4">
        <div className="h-px bg-border" />
      </div>

      {/* Contact list */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 space-y-0.5">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No contacts found
            </p>
          )}
          {filtered.map((contact) => (
            <motion.button
              key={contact.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectContact(contact)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                selectedId === contact.id
                  ? 'bg-purple-500/10 border border-purple-500/30'
                  : 'hover:bg-muted/50'
              }`}
            >
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold text-white"
                style={{ backgroundColor: contact.color + '30', color: contact.color }}
              >
                {getInitials(contact.name)}
              </div>

              {/* Info */}
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white truncate">{contact.name}</p>
                  <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                    {contact.lastTimestamp}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
              </div>

              {/* Unread dot */}
              {contact.unread && (
                <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
              )}
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
