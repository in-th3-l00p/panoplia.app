import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ChevronLeft, Loader2, CheckCircle2, Send as SendIcon } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Card } from '@renderer/components/ui/card'
import * as api from '@renderer/services/api-client'

export function Transfer() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const stored = localStorage.getItem('panoplia_active_wallet')
  const activeWallet = stored ? JSON.parse(stored) : null

  const [chain, setChain] = useState('Ethereum')
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<'form' | 'signing' | 'done' | 'error'>('form')
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const chainParam = searchParams.get('chain')
    if (chainParam) setChain(chainParam)
  }, [searchParams])

  if (!activeWallet) {
    navigate('/wallets')
    return null
  }

  const handleSubmit = async () => {
    if (!to.trim() || !amount.trim()) return
    setStep('signing')
    setError('')
    try {
      const res = await api.signTransaction(activeWallet.vaultId, {
        chain,
        to: to.trim(),
        amount: amount.trim()
      })
      // In demo mode, the tx is signed + broadcast after ~2s
      // Poll to see if a transaction appeared
      await new Promise((r) => setTimeout(r, 2500))
      const txRes = await api.listTransactions(activeWallet.vaultId)
      const latest = txRes.transactions?.[0]
      setTxHash(latest?.tx_hash || res.sessionId)
      setStep('done')
    } catch (err: any) {
      setError(err.message || 'Transaction failed')
      setStep('error')
    }
  }

  const chains = activeWallet.addresses?.map((a: any) => a.chain) || ['Ethereum']

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-background overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="text-muted-foreground hover:text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </motion.div>

      <div className="flex flex-col items-center w-full max-w-sm px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white mb-8"
        >
          Send Transaction
        </motion.h1>

        {step === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-4"
          >
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Chain</label>
              <select
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-white"
              >
                {chains.map((c: string) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Recipient Address</label>
              <Input
                placeholder="0x..."
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Amount</label>
              <Input
                type="number"
                step="0.0001"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              className="w-full gap-2"
              onClick={handleSubmit}
              disabled={!to.trim() || !amount.trim()}
            >
              <SendIcon className="w-4 h-4" />
              Sign & Send
            </Button>
          </motion.div>
        )}

        {step === 'signing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
            <p className="text-white font-medium">MPC Co-signing...</p>
            <p className="text-sm text-muted-foreground mt-1">
              Server is co-signing with its key share
            </p>
          </motion.div>
        )}

        {step === 'done' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <div>
              <p className="text-white font-medium">Transaction Sent!</p>
              <p className="text-sm text-muted-foreground mt-1">
                {amount} on {chain}
              </p>
            </div>

            {txHash && (
              <Card className="p-3">
                <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                <p className="font-mono text-xs text-white break-all">{txHash}</p>
              </Card>
            )}

            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </motion.div>
        )}

        {step === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 space-y-4"
          >
            <p className="text-destructive font-medium">Transaction Failed</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="secondary" onClick={() => setStep('form')}>
              Try Again
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
