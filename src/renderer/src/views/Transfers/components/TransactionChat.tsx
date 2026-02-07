import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  Send,
  ArrowUpRight,
  ArrowDownLeft,
  HandCoins,
  DollarSign,
  XCircle,
  ArrowLeftRight
} from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import type { Contact, ChatMessage } from '../types'
import { getInitials, shortAddr, ETH_PRICE_USD } from '../types'
import { TransferConfirmDialog } from './TransferConfirmDialog'

interface TransactionChatProps {
  contact: Contact
  messages: ChatMessage[]
  onSendMessage: (msg: ChatMessage) => void
}

function MessageBubble({ msg, contact }: { msg: ChatMessage; contact: Contact }) {
  const isMe = msg.sender === 'me'

  // Transfer bubble
  if (msg.type === 'transfer') {
    return (
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={`max-w-[280px] rounded-2xl p-4 ${
            isMe
              ? 'bg-gradient-to-br from-purple-500/20 to-purple-700/20 border border-purple-500/30'
              : 'bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                isMe
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-green-500/20 text-green-400'
              }`}
            >
              {isMe ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownLeft className="w-3.5 h-3.5" />
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {isMe ? 'You sent' : `${contact.name} sent`}
            </span>
          </div>
          <p className="text-xl font-bold text-white">{msg.amount} ETH</p>
          {msg.usdValue !== undefined && (
            <p className="text-xs text-muted-foreground mt-0.5">
              ≈ ${msg.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
            {msg.status === 'pending' ? (
              <span className="text-[10px] text-yellow-400 font-medium">Pending</span>
            ) : (
              <span className="text-[10px] text-green-400 font-medium">Confirmed</span>
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  // Request bubble
  if (msg.type === 'request') {
    return (
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-[280px] rounded-2xl p-4 bg-orange-500/10 border border-orange-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <HandCoins className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-muted-foreground">
              {isMe ? 'You requested' : `${contact.name} requested`}
            </span>
          </div>
          <p className="text-xl font-bold text-white">{msg.amount} ETH</p>
          {msg.text && (
            <p className="text-xs text-muted-foreground mt-1">"{msg.text}"</p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
            {msg.status === 'declined' ? (
              <span className="flex items-center gap-1 text-[10px] text-red-400 font-medium">
                <XCircle className="w-3 h-3" /> Declined
              </span>
            ) : (
              <div className="flex gap-1.5">
                <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px]">
                  Decline
                </Button>
                <Button size="sm" className="h-6 px-2 text-[10px] bg-purple-600 hover:bg-purple-700">
                  Pay
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  // Text message bubble
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`max-w-[280px] rounded-2xl px-4 py-2.5 ${
          isMe
            ? 'bg-purple-600 text-white'
            : 'bg-muted text-white'
        }`}
      >
        <p className="text-sm">{msg.text}</p>
        <p className={`text-[10px] mt-1 ${isMe ? 'text-purple-200' : 'text-muted-foreground'}`}>
          {msg.timestamp}
        </p>
      </motion.div>
    </div>
  )
}

export function TransactionChat({ contact, messages, onSendMessage }: TransactionChatProps) {
  const [inputText, setInputText] = useState('')
  const [sendMode, setSendMode] = useState<'message' | 'eth'>('message')
  const [ethInputUnit, setEthInputUnit] = useState<'eth' | 'usd'>('eth')
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingAmountEth, setPendingAmountEth] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const numericInput = parseFloat(inputText) || 0
  const ethEquivalent = ethInputUnit === 'eth' ? numericInput : numericInput / ETH_PRICE_USD
  const displayConversion =
    numericInput > 0
      ? ethInputUnit === 'eth'
        ? `≈ $${(numericInput * ETH_PRICE_USD).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : `≈ ${ethEquivalent.toFixed(6)} ETH`
      : ''

  const handleSend = () => {
    if (!inputText.trim()) return

    if (sendMode === 'message') {
      const now = new Date()
      const ts = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      const msg: ChatMessage = {
        id: `m_${Date.now()}`,
        sender: 'me',
        type: 'text',
        text: inputText.trim(),
        timestamp: ts,
        status: 'confirmed'
      }
      onSendMessage(msg)
      setInputText('')
    } else {
      if (numericInput <= 0) return
      setPendingAmountEth(ethEquivalent)
      setShowConfirm(true)
    }
  }

  const handleConfirmTransfer = () => {
    const now = new Date()
    const ts = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const msg: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: 'me',
      type: 'transfer',
      amount: pendingAmountEth.toFixed(4),
      usdValue: pendingAmountEth * ETH_PRICE_USD,
      timestamp: ts,
      status: 'pending'
    }
    onSendMessage(msg)
    setShowConfirm(false)
    setInputText('')
    setPendingAmountEth(0)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
          style={{ backgroundColor: contact.color + '30', color: contact.color }}
        >
          {getInitials(contact.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{contact.name}</p>
          <p className="text-xs text-muted-foreground font-mono">
            {shortAddr(contact.address)}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-6 space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} contact={contact} />
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-border shrink-0">
        {/* Mode toggle */}
        <div className="flex items-center gap-1 mb-2">
          <Button
            variant={sendMode === 'message' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 px-3 text-xs rounded-full"
            onClick={() => setSendMode('message')}
          >
            Message
          </Button>
          <Button
            variant={sendMode === 'eth' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 px-3 text-xs rounded-full gap-1"
            onClick={() => setSendMode('eth')}
          >
            <DollarSign className="w-3 h-3" />
            Send ETH
          </Button>

          {/* ETH / USD toggle — only in eth mode */}
          {sendMode === 'eth' && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center ml-2 rounded-full border border-border overflow-hidden"
            >
              <button
                className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  ethInputUnit === 'eth'
                    ? 'bg-purple-600 text-white'
                    : 'text-muted-foreground hover:text-white'
                }`}
                onClick={() => {
                  setEthInputUnit('eth')
                  setInputText('')
                }}
              >
                ETH
              </button>
              <button
                className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  ethInputUnit === 'usd'
                    ? 'bg-purple-600 text-white'
                    : 'text-muted-foreground hover:text-white'
                }`}
                onClick={() => {
                  setEthInputUnit('usd')
                  setInputText('')
                }}
              >
                USD
              </button>
            </motion.div>
          )}
        </div>

        {/* Conversion hint */}
        {sendMode === 'eth' && displayConversion && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground mb-1.5 px-1 flex items-center gap-1"
          >
            <ArrowLeftRight className="w-3 h-3" />
            {displayConversion}
          </motion.p>
        )}

        <div className="flex items-center gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              sendMode === 'message'
                ? 'Type a message…'
                : ethInputUnit === 'eth'
                  ? 'Amount in ETH…'
                  : 'Amount in USD…'
            }
            type={sendMode === 'eth' ? 'number' : 'text'}
            className="flex-1 h-10 bg-muted/50 border-none rounded-full px-4 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend()
            }}
          />
          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700 shrink-0"
            disabled={!inputText.trim() || (sendMode === 'eth' && numericInput <= 0)}
            onClick={handleSend}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Confirm dialog */}
      <TransferConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        contact={contact}
        amountEth={pendingAmountEth}
        onConfirm={handleConfirmTransfer}
      />
    </div>
  )
}
