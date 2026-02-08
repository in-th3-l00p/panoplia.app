import { useState } from 'react'
import { motion } from 'motion/react'
import { FileJson, Download, Copy, Check, Loader2 } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Card } from '@renderer/components/ui/card'
import * as api from '@renderer/services/api-client'

export function ExportWallet() {
  const stored = localStorage.getItem('panoplia_active_wallet')
  const activeWallet = stored ? JSON.parse(stored) : null
  const vaultId = activeWallet?.vaultId

  const [exporting, setExporting] = useState(false)
  const [exportData, setExportData] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleExport = async () => {
    if (!vaultId) return
    setExporting(true)
    setError('')
    try {
      const res = await api.exportVault(vaultId)
      setExportData(res.vaultContent)
    } catch (err: any) {
      setError(err.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  const handleCopy = () => {
    if (!exportData) return
    navigator.clipboard.writeText(exportData)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!exportData) return
    const blob = new Blob([exportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `panoplia-vault-${vaultId?.slice(0, 8)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full space-y-4"
    >
      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1 mb-3">
          Export Vault
        </h2>
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Vault Backup</p>
              <p className="text-xs text-muted-foreground">
                Export your vault data for backup or migration
              </p>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {!exportData ? (
            <Button
              className="w-full gap-2"
              variant="secondary"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {exporting ? 'Exporting...' : 'Export Vault'}
            </Button>
          ) : (
            <>
              <div className="bg-muted/30 rounded-lg p-3 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Vault content (base64)</p>
                <p className="font-mono text-xs text-white break-all line-clamp-3">
                  {exportData.slice(0, 120)}...
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1 gap-1.5" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button variant="secondary" className="flex-1 gap-1.5" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
        <p className="text-xs text-orange-400 font-medium mb-1">Security Notice</p>
        <p className="text-xs text-muted-foreground">
          This is an MPC vault backup. The server holds one key share, your device holds the other.
          Neither can sign alone. Keep your export safe for recovery purposes.
        </p>
      </div>
    </motion.div>
  )
}
