import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ChevronLeft, MessageSquare } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { ContactList, TransactionChat, MyAddressPanel } from './components'
import { CONTACTS, CHAT_HISTORIES } from './types'
import type { Contact } from './types'

export function Transfers() {
  const navigate = useNavigate()

  const stored = localStorage.getItem('panoplia_active_wallet')
  const activeWallet = stored ? JSON.parse(stored) : null

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showMyAddress, setShowMyAddress] = useState(false)

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

  const chatMessages = selectedContact
    ? CHAT_HISTORIES[selectedContact.id] ?? []
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
          contacts={CONTACTS}
          selectedId={showMyAddress ? '__my_address__' : selectedContact?.id ?? null}
          myAddress={activeWallet.address}
          onSelectContact={handleSelectContact}
          onShowMyAddress={handleShowMyAddress}
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
          <TransactionChat contact={selectedContact} messages={chatMessages} />
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
    </div>
  )
}

