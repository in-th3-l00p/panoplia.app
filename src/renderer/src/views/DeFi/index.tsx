import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Search } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { TokenSwap, TokenPortfolio, DiscoverTokens } from './components'

export function DeFi() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const stored = localStorage.getItem('panoplia_active_wallet')
  const activeWallet = stored ? JSON.parse(stored) : null

  if (!activeWallet) {
    navigate('/wallets')
    return null
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="text-muted-foreground hover:text-white h-8 w-8"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-white">DeFi</h1>
        <div className="flex-1" />
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tokens…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm bg-muted/50 border-none"
          />
        </div>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-6 py-6 space-y-8">
          <TokenSwap />
          <TokenPortfolio search={search} />
          <DiscoverTokens search={search} />
        </div>
      </ScrollArea>
    </div>
  )
}
