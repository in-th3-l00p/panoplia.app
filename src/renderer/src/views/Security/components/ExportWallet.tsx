import { useState } from 'react'
import { motion } from 'motion/react'
import { FileJson, KeyRound, Eye, EyeOff, Download, Copy, Check } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Card } from '@renderer/components/ui/card'

/** Hardcoded seed phrase for display — will be replaced by real derivation */
const HARDCODED_SEED =
  'abandon ability able about above absent absorb abstract absurd abuse access accident'

export function ExportWallet() {
  const [showSeed, setShowSeed] = useState(false)
  const [seedPassword, setSeedPassword] = useState('')
  const [seedRevealed, setSeedRevealed] = useState(false)
  const [copiedSeed, setCopiedSeed] = useState(false)

  const [jsonPassword, setJsonPassword] = useState('')
  const [jsonExported, setJsonExported] = useState(false)

  const handleRevealSeed = () => {
    if (!seedPassword) return
    setSeedRevealed(true)
  }

  const handleCopySeed = () => {
    navigator.clipboard.writeText(HARDCODED_SEED)
    setCopiedSeed(true)
    setTimeout(() => setCopiedSeed(false), 2000)
  }

  const handleExportJSON = () => {
    if (!jsonPassword) return
    // Simulate download
    setJsonExported(true)
    setTimeout(() => setJsonExported(false), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full space-y-4"
    >
      {/* Export as JSON */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1 mb-3">
          Export as JSON
        </h2>
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Encrypted Keystore</p>
              <p className="text-xs text-muted-foreground">
                Download your wallet as an encrypted JSON file
              </p>
            </div>
          </div>
          <Input
            type="password"
            placeholder="Enter password to encrypt"
            value={jsonPassword}
            onChange={(e) => setJsonPassword(e.target.value)}
          />
          <Button
            className="w-full gap-2"
            variant="secondary"
            disabled={!jsonPassword}
            onClick={handleExportJSON}
          >
            <Download className="w-4 h-4" />
            {jsonExported ? 'Exported!' : 'Export JSON'}
          </Button>
        </Card>
      </div>

      {/* Export Seed Phrase */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1 mb-3">
          Export Seed Phrase
        </h2>
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Recovery Phrase</p>
              <p className="text-xs text-muted-foreground">
                Reveal your 12-word seed phrase — keep it safe!
              </p>
            </div>
          </div>

          {!seedRevealed ? (
            <>
              <Input
                type="password"
                placeholder="Enter wallet password"
                value={seedPassword}
                onChange={(e) => setSeedPassword(e.target.value)}
              />
              <Button
                className="w-full gap-2"
                variant="secondary"
                disabled={!seedPassword}
                onClick={handleRevealSeed}
              >
                <Eye className="w-4 h-4" />
                Reveal Seed Phrase
              </Button>
            </>
          ) : (
            <>
              <div className="relative">
                <div
                  className={`grid grid-cols-3 gap-2 p-3 rounded-lg border border-border bg-muted/30 ${
                    !showSeed ? 'blur-md select-none' : ''
                  }`}
                >
                  {HARDCODED_SEED.split(' ').map((word, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground w-4 text-right">
                        {i + 1}.
                      </span>
                      <span className="text-sm text-white font-mono">{word}</span>
                    </div>
                  ))}
                </div>
                {!showSeed && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setShowSeed(true)}
                    >
                      <Eye className="w-4 h-4" />
                      Show
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => setShowSeed(!showSeed)}
                >
                  {showSeed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showSeed ? 'Hide' : 'Show'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={handleCopySeed}
                >
                  {copiedSeed ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copiedSeed ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Warning */}
      <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
        <p className="text-xs text-orange-400 font-medium mb-1">⚠ Security Notice</p>
        <p className="text-xs text-muted-foreground">
          Never share your seed phrase or JSON keystore with anyone. Anyone with
          access to these can steal your funds.
        </p>
      </div>
    </motion.div>
  )
}
