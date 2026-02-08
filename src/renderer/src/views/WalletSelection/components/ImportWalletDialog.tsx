import { useState } from 'react'
import { Download, FileJson, Users, Loader2 } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import * as api from '@renderer/services/api-client'

interface ImportWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImported?: () => void
}

export function ImportWalletDialog({ open, onOpenChange, onImported }: ImportWalletDialogProps) {
  const [walletName, setWalletName] = useState('')
  const [vaultContent, setVaultContent] = useState('')
  const [recoveryVaultId, setRecoveryVaultId] = useState('')
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')

  const handleJsonImport = async () => {
    if (!vaultContent.trim()) return
    setImporting(true)
    setError('')
    try {
      await api.importVault(vaultContent.trim(), walletName || 'Imported Wallet')
      onOpenChange(false)
      setVaultContent('')
      setWalletName('')
      onImported?.()
    } catch (err: any) {
      setError(err.message || 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  const handleSocialRecovery = async () => {
    if (!recoveryVaultId.trim()) return
    setImporting(true)
    setError('')
    try {
      const res = await api.completeRecovery(recoveryVaultId.trim())
      if (res.vaultContent) {
        await api.importVault(res.vaultContent, walletName || 'Recovered Wallet')
      }
      onOpenChange(false)
      setRecoveryVaultId('')
      setWalletName('')
      onImported?.()
    } catch (err: any) {
      setError(err.message || 'Recovery failed')
    } finally {
      setImporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-purple-400" />
            Import Wallet
          </DialogTitle>
          <DialogDescription>
            Restore a vault from a backup or via social recovery
          </DialogDescription>
        </DialogHeader>

        {/* Shared wallet name field */}
        <div className="pt-2">
          <label className="text-sm text-muted-foreground mb-2 block">
            Wallet Name
          </label>
          <Input
            placeholder="Imported Wallet"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Tabs defaultValue="json" className="w-full mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="json" className="flex-1 gap-1.5 text-xs">
              <FileJson className="w-3.5 h-3.5" />
              Vault Backup
            </TabsTrigger>
            <TabsTrigger value="social" className="flex-1 gap-1.5 text-xs">
              <Users className="w-3.5 h-3.5" />
              Social Recovery
            </TabsTrigger>
          </TabsList>

          {/* JSON/Vault Import */}
          <TabsContent value="json" className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Vault Content (base64)
              </label>
              <textarea
                className="w-full min-h-[100px] rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
                placeholder="Paste your exported vault content here..."
                value={vaultContent}
                onChange={(e) => setVaultContent(e.target.value)}
              />
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleJsonImport}
              disabled={importing || !vaultContent.trim()}
            >
              {importing && <Loader2 className="w-4 h-4 animate-spin" />}
              {importing ? 'Importing...' : 'Import Vault'}
            </Button>
          </TabsContent>

          {/* Social Recovery Import */}
          <TabsContent value="social" className="space-y-4 mt-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-purple-400" />
                <h4 className="text-sm font-medium text-white">
                  Recover via Guardians
                </h4>
              </div>
              <p className="text-xs text-muted-foreground">
                If your guardians have submitted enough shares, complete the
                recovery to restore your vault.
              </p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Vault ID to Recover
              </label>
              <Input
                placeholder="vault-id..."
                value={recoveryVaultId}
                onChange={(e) => setRecoveryVaultId(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleSocialRecovery}
              disabled={importing || !recoveryVaultId.trim()}
            >
              {importing && <Loader2 className="w-4 h-4 animate-spin" />}
              {importing ? 'Recovering...' : 'Complete Recovery'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
