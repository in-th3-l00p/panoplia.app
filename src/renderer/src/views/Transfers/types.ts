import { shortenAddress } from '@renderer/lib/utils'

/** A contact (person) you've transacted with */
export interface Contact {
  id: string
  name: string
  address: string
  /** Avatar color for the fallback initial circle */
  color: string
  /** Preview of last interaction */
  lastMessage: string
  lastTimestamp: string
  unread?: boolean
}

/** A single chat-style transaction message */
export interface ChatMessage {
  id: string
  /** Who sent it — 'me' or the contact */
  sender: 'me' | 'them'
  type: 'transfer' | 'request' | 'text'
  amount?: string
  /** ETH amount */
  usdValue?: number
  text?: string
  timestamp: string
  status: 'confirmed' | 'pending' | 'declined'
}

// ── Hardcoded data ──────────────────────────────────────────────────────────

export const CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Alice.eth',
    address: '0xAbC1230000000000000000000000000000004567',
    color: '#a78bfa',
    lastMessage: 'Sent you 0.5 ETH',
    lastTimestamp: '2h',
    unread: true
  },
  {
    id: 'c2',
    name: 'Bob',
    address: '0xDeF4560000000000000000000000000000007890',
    color: '#f97316',
    lastMessage: 'You sent 0.12 ETH',
    lastTimestamp: '5h'
  },
  {
    id: 'c3',
    name: 'Charlie.eth',
    address: '0x1111111111111111111111111111111111111111',
    color: '#22d3ee',
    lastMessage: 'Sent you 1.25 ETH',
    lastTimestamp: '1d'
  },
  {
    id: 'c4',
    name: 'Diana',
    address: '0x2222222222222222222222222222222222222222',
    color: '#f472b6',
    lastMessage: 'You sent 0.05 ETH',
    lastTimestamp: '1d'
  },
  {
    id: 'c5',
    name: 'Eve.eth',
    address: '0x3333333333333333333333333333333333333333',
    color: '#34d399',
    lastMessage: 'Sent you 0.30 ETH',
    lastTimestamp: '3d'
  }
]

/** Per-contact chat histories keyed by contact id */
export const CHAT_HISTORIES: Record<string, ChatMessage[]> = {
  c1: [
    {
      id: 'm1',
      sender: 'them',
      type: 'text',
      text: "Hey! Here's that ETH I owe you 🙌",
      timestamp: '2:12 PM',
      status: 'confirmed'
    },
    {
      id: 'm2',
      sender: 'them',
      type: 'transfer',
      amount: '0.5000',
      usdValue: 1678.71,
      timestamp: '2:12 PM',
      status: 'confirmed'
    },
    {
      id: 'm3',
      sender: 'me',
      type: 'text',
      text: 'Got it, thanks! 🎉',
      timestamp: '2:15 PM',
      status: 'confirmed'
    }
  ],
  c2: [
    {
      id: 'm4',
      sender: 'me',
      type: 'transfer',
      amount: '0.1200',
      usdValue: 402.89,
      timestamp: '11:30 AM',
      status: 'confirmed'
    },
    {
      id: 'm5',
      sender: 'them',
      type: 'text',
      text: 'Received, thank you!',
      timestamp: '11:45 AM',
      status: 'confirmed'
    }
  ],
  c3: [
    {
      id: 'm6',
      sender: 'them',
      type: 'transfer',
      amount: '1.2500',
      usdValue: 4196.78,
      timestamp: 'Yesterday',
      status: 'confirmed'
    },
    {
      id: 'm7',
      sender: 'me',
      type: 'text',
      text: 'Wow, thanks for the contribution!',
      timestamp: 'Yesterday',
      status: 'confirmed'
    }
  ],
  c4: [
    {
      id: 'm8',
      sender: 'me',
      type: 'transfer',
      amount: '0.0500',
      usdValue: 167.87,
      timestamp: 'Yesterday',
      status: 'pending'
    },
    {
      id: 'm9',
      sender: 'me',
      type: 'text',
      text: 'For the NFT mint 👀',
      timestamp: 'Yesterday',
      status: 'confirmed'
    }
  ],
  c5: [
    {
      id: 'm10',
      sender: 'them',
      type: 'transfer',
      amount: '0.3000',
      usdValue: 1007.23,
      timestamp: '3 days ago',
      status: 'confirmed'
    },
    {
      id: 'm11',
      sender: 'them',
      type: 'request',
      amount: '0.1000',
      usdValue: 335.74,
      text: 'Can you send the rest?',
      timestamp: '3 days ago',
      status: 'declined'
    }
  ]
}

/** Generate initials from a name */
export function getInitials(name: string): string {
  return name
    .replace('.eth', '')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Format an address as a short label */
export function shortAddr(address: string): string {
  return shortenAddress(address, 4)
}

/** Hardcoded ETH price — will be replaced by a real feed later */
export const ETH_PRICE_USD = 3_357.42

/** Random pastel-ish colors for new contacts */
const CONTACT_COLORS = ['#a78bfa', '#f97316', '#22d3ee', '#f472b6', '#34d399', '#facc15', '#fb923c', '#38bdf8']
export function randomColor(): string {
  return CONTACT_COLORS[Math.floor(Math.random() * CONTACT_COLORS.length)]
}
