import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Users, Plus, Trash2, Shield, Loader2, CheckCircle2, Copy } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Card } from '@renderer/components/ui/card'
import * as api from '@renderer/services/api-client'

interface GuardianInput {
  identifier: string
  name: string
}

export function SocialRecovery() {
  const stored = localStorage.getItem('panoplia_active_wallet')
  const activeWallet = stored ? JSON.parse(stored) : null
  const vaultId = activeWallet?.vaultId

  const [config, setConfig] = useState<api.RecoveryConfig | null>(null)
  const [loading, setLoading] = useState(false)
  const [guardians, setGuardians] = useState<GuardianInput[]>([
    { identifier: '', name: '' },
    { identifier: '', name: '' },
    { identifier: '', name: '' }
  ])
  const [threshold, setThreshold] = useState(2)
  const [setupStatus, setSetupStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const [setupError, setSetupError] = useState('')
  const [setupResult, setSetupResult] = useState<{ recoveryId: string; guardianIds: string[] } | null>(null)
  const [showSetup, setShowSetup] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  // Load existing config
  useEffect(() => {
    if (!vaultId) return
    setLoading(true)
    api.getRecoveryConfig(vaultId)
      .then(setConfig)
      .catch(() => setConfig(null))
      .finally(() => setLoading(false))
  }, [vaultId])

  const handleSetup = async () => {
    if (!vaultId) return
    const validGuardians = guardians.filter((g) => g.identifier.trim())
    if (validGuardians.length < 2) {
      setSetupError('At least 2 guardians required')
      return
    }
    setSetupStatus('saving')
    setSetupError('')
    try {
      const result = await api.setupRecovery(vaultId, validGuardians, threshold)
      setSetupResult(result)
      setSetupStatus('done')
      const newConfig = await api.getRecoveryConfig(vaultId)
      setConfig(newConfig)
    } catch (err: any) {
      setSetupError(err.message || 'Setup failed')
      setSetupStatus('error')
    }
  }

  const handleRevoke = async () => {
    if (!vaultId) return
    await api.revokeRecovery(vaultId)
    setConfig(null)
    setSetupResult(null)
    setSetupStatus('idle')
  }

  const addGuardian = () => setGuardians([...guardians, { identifier: '', name: '' }])
  const removeGuardian = (i: number) => {
    if (guardians.length <= 2) return
    setGuardians(guardians.filter((_, idx) => idx !== i))
  }
  const updateGuardian = (i: number, field: 'identifier' | 'name', value: string) => {
    setGuardians(guardians.map((g, idx) => (idx === i ? { ...g, [field]: value } : g)))
  }

  const validCount = guardians.filter((g) => g.identifier.trim()).length

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-center py-8"
      >
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full"
    >
      <div className="flex items-center justify-between px-1 mb-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Social Recovery
        </h2>
        {!config && !showSetup && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => setShowSetup(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            Setup
          </Button>
        )}
      </div>

      {/* Existing config display */}
      {config && (
        <div className="space-y-3">
          <Card className="p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Recovery Active — {config.threshold} of {config.total_guardians}
                </p>
                <p className="text-xs text-muted-foreground">
                  Shamir Secret Sharing protects this vault
                </p>
              </div>
            </div>
          </Card>

          {config.guardians.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-white">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{g.name || 'Guardian'}</p>
                      <p className="text-xs text-muted-foreground">{g.identifier}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyText(g.id, g.id)}
                    className="text-xs text-muted-foreground hover:text-white font-mono flex items-center gap-1"
                  >
                    {copied === g.id ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {g.id.slice(0, 8)}
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}

          <Button
            variant="ghost"
            className="w-full text-xs text-destructive hover:text-destructive"
            onClick={handleRevoke}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Revoke Recovery
          </Button>
        </div>
      )}

      {/* Setup form */}
      {!config && showSetup && (
        <Card className="p-4 space-y-4 border-purple-500/30">
          {setupError && (
            <p className="text-sm text-destructive">{setupError}</p>
          )}

          {setupStatus === 'done' && setupResult ? (
            <div className="space-y-3 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm text-white font-medium">Recovery configured!</p>
              <div className="space-y-2">
                {setupResult.guardianIds.map((gId, i) => (
                  <button
                    key={gId}
                    onClick={() => copyText(gId, gId)}
                    className="w-full text-left bg-muted/50 rounded-lg px-3 py-2 flex items-center justify-between"
                  >
                    <span className="text-xs text-muted-foreground">Guardian {i + 1}</span>
                    <span className="font-mono text-xs text-white flex items-center gap-1">
                      {copied === gId ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {gId.slice(0, 12)}...
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Share each guardian's ID with them. They'll need it during recovery.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {guardians.map((g, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="Email"
                      value={g.identifier}
                      onChange={(e) => updateGuardian(i, 'identifier', e.target.value)}
                      className="flex-1 text-sm"
                    />
                    <Input
                      placeholder="Name"
                      value={g.name}
                      onChange={(e) => updateGuardian(i, 'name', e.target.value)}
                      className="w-24 text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeGuardian(i)}
                      disabled={guardians.length <= 2}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <button onClick={addGuardian} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add guardian
              </button>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Threshold</label>
                <select
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-white"
                >
                  {Array.from({ length: Math.max(validCount - 1, 0) }, (_, i) => i + 2).map((n) => (
                    <option key={n} value={n}>
                      {n} of {validCount} guardians
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => setShowSetup(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSetup} disabled={setupStatus === 'saving'}>
                  {setupStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Setup Recovery'}
                </Button>
              </div>
            </>
          )}
        </Card>
      )}

      {/* No config, no form */}
      {!config && !showSetup && (
        <Card className="p-4 text-center">
          <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No recovery configured. Set up guardians to protect your vault with Shamir Secret Sharing.
          </p>
        </Card>
      )}
    </motion.div>
  )
}
