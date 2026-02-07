import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ChevronLeft, MessageSquare } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { ContactList, TransactionChat, MyAddressPanel, AddContactDialog } from './components'
import { CONTACTS, CHAT_HISTORIES } from './types'
import type { Contact, ChatMessage } from './types'

export function Transfers() {
  const navigate = useNavigate()

  const stored = localStorage.getItem('panoplia_active_wallet')
  const activeWallet = stored ? JSON.parse(stored) : null

  const [contacts, setContacts] = useState<Contact[]>([...CONTACTS])
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({
    ...CHAT_HISTORIES
  })
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showMyAddress, setShowMyAddress] = useState(false)
  const [showAddContact, setShowAddContact] = useState(false)

  if (!activeWallet) {
    navigate('/wallets')
    return null
  }

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact)
    setShowMyAddress(false)
  }

  const handleShowMyAddress = () => {
    setSelectedContact(null)
    setShowMyAddress(true)
  }

  const handleAddContact = (contact: Contact) => {
    setContacts((prev) => [contact, ...prev])
    setChatHistories((prev) => ({ ...prev, [contact.id]: [] }))
    setSelectedContact(contact)
    setShowMyAddress(false)
  }

  const handleSendMessage = useCallback(
    (msg: ChatMessage) => {
      if (!selectedContact) return
      setChatHistories((prev) => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] ?? []), msg]
      }))

      // Update last message preview on contact
      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContact.id
            ? {
                ...c,
                lastMessage:
                  msg.type === 'transfer'
                    ? `You sent ${msg.amount} ETH`
                    : msg.text ?? c.lastMessage,
                lastTimestamp: 'Now'
              }
            : c
        )
      )
    },
    [selectedContact]
  )

  const chatMessages = selectedContact
    ? chatHistories[selectedContact.id] ?? []
    : []

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Back button floating */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 left-4 z-20"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="text-muted-foreground hover:text-white h-8 w-8"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Left panel — contacts */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-[340px] shrink-0 pt-12"
      >
        <ContactList
          contacts={contacts}
          selectedId={showMyAddress ? '__my_address__' : selectedContact?.id ?? null}
          myAddress={activeWallet.address}
          onSelectContact={handleSelectContact}
          onShowMyAddress={handleShowMyAddress}
          onAddContact={() => setShowAddContact(true)}
        />
      </motion.div>

      {/* Right panel — chat or my address or empty state */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 min-w-0"
      >
        {selectedContact ? (
          <TransactionChat
            contact={selectedContact}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
          />
        ) : showMyAddress ? (
          <MyAddressPanel address={activeWallet.address} />
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Select a conversation
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Choose a contact on the left to view your transaction history and send or request ETH
            </p>
          </div>
        )}
      </motion.div>

      {/* Add Contact Dialog */}
      <AddContactDialog
        open={showAddContact}
        onOpenChange={setShowAddContact}
        onAdd={handleAddContact}
      />
    </div>
  )
}

