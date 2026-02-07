import { useState } from 'react'
import { motion } from 'motion/react'
import { Copy, Check, QrCode } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { shortenAddress } from '@renderer/lib/utils'

interface MyAddressPanelProps {
  address: string
}

export function MyAddressPanel({ address }: MyAddressPanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center max-w-sm w-full"
      >
        {/* Large QR placeholder */}
        <div className="w-56 h-56 bg-white rounded-2xl p-4 mb-6 flex items-center justify-center shadow-lg shadow-purple-500/10">
          <div className="w-full h-full border-4 border-black rounded-lg flex items-center justify-center">
            <div className="text-center">
              <QrCode className="w-16 h-16 text-black mx-auto mb-2" />
              <p className="text-[7px] text-black font-mono leading-tight break-all px-2">
                {address}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-white mb-1">Your Public Address</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Share this address to receive ETH and tokens
        </p>

        {/* Address box */}
        <div className="w-full rounded-xl border border-border bg-muted/30 p-4 mb-4">
          <p className="text-sm font-mono text-white break-all text-center leading-relaxed">
            {address}
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1.5">
            {shortenAddress(address, 6)} · Ethereum Mainnet
          </p>
        </div>

        <Button
          onClick={handleCopy}
          className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Address
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}
