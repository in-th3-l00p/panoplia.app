import { useState } from 'react'
import { Download, FileJson, KeyRound, Users } from 'lucide-react'
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

interface ImportWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportWalletDialog({ open, onOpenChange }: ImportWalletDialogProps) {
  const [walletName, setWalletName] = useState('')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-purple-400" />
            Import Wallet
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to import your wallet
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

        <Tabs defaultValue="json" className="w-full mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="json" className="flex-1 gap-1.5 text-xs">
              <FileJson className="w-3.5 h-3.5" />
              JSON File
            </TabsTrigger>
            <TabsTrigger value="seed" className="flex-1 gap-1.5 text-xs">
              <KeyRound className="w-3.5 h-3.5" />
              Seed Phrase
            </TabsTrigger>
            <TabsTrigger value="social" className="flex-1 gap-1.5 text-xs">
              <Users className="w-3.5 h-3.5" />
              Social Recovery
            </TabsTrigger>
          </TabsList>

          {/* JSON Import */}
          <TabsContent value="json" className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Wallet JSON File
              </label>
              <div className="border border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-purple-500/50 transition-colors">
                <FileJson className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to select or drag &amp; drop your JSON keystore file
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Password
              </label>
              <Input type="password" placeholder="JSON file password" />
            </div>
            <Button className="w-full">Import from JSON</Button>
          </TabsContent>

          {/* Seed Phrase Import */}
          <TabsContent value="seed" className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Recovery Phrase
              </label>
              <textarea
                className="w-full min-h-[100px] rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
                placeholder="Enter your 12 or 24 word recovery phrase, separated by spaces…"
              />
            </div>
            <Button className="w-full">Import from Seed Phrase</Button>
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
                Request recovery from your trusted guardians. They will need to
                approve the recovery on their devices.
              </p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Wallet Address to Recover
              </label>
              <Input placeholder="0x…" />
            </div>
            <Button className="w-full">Start Recovery</Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
