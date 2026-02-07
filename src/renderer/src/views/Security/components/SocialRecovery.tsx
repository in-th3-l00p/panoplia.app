import { useState } from 'react'
import { motion } from 'motion/react'
import { Users, Plus, Trash2 } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Card } from '@renderer/components/ui/card'
import { shortenAddress } from '@renderer/lib/utils'

interface Guardian {
  id: string
  name: string
  address: string
  status: 'active' | 'pending'
}

const HARDCODED_GUARDIANS: Guardian[] = [
  { id: '1', name: 'Alice', address: '0xAbC1230000000000000000000000000000004567', status: 'active' },
  { id: '2', name: 'Bob', address: '0xDeF4560000000000000000000000000000007890', status: 'active' },
  { id: '3', name: 'Carol', address: '0x1111111111111111111111111111111111111111', status: 'pending' }
]

export function SocialRecovery() {
  const [guardians, setGuardians] = useState<Guardian[]>(HARDCODED_GUARDIANS)
  const [newName, setNewName] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const threshold = Math.max(2, Math.ceil(guardians.length / 2))

  const handleAdd = () => {
    if (!newName.trim() || !newAddress.trim()) return
    setGuardians((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newName,
        address: newAddress,
        status: 'pending' as const
      }
    ])
    setNewName('')
    setNewAddress('')
    setShowAdd(false)
  }

  const handleRemove = (id: string) => {
    setGuardians((prev) => prev.filter((g) => g.id !== id))
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
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => setShowAdd(!showAdd)}
        >
          <Plus className="w-3.5 h-3.5" />
          Add Guardian
        </Button>
      </div>

      {/* Threshold info */}
      <Card className="p-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {threshold} of {guardians.length} required
            </p>
            <p className="text-xs text-muted-foreground">
              Recovery threshold — guardians needed to restore access
            </p>
          </div>
        </div>
      </Card>

      {/* Add guardian form */}
      {showAdd && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-3"
        >
          <Card className="p-4 space-y-3 border-purple-500/30">
            <Input
              placeholder="Guardian name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Input
              placeholder="0x… guardian address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleAdd}>
                Add
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Guardian list */}
      <div className="space-y-2">
        {guardians.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card className="p-3 hover:border-purple-500/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-white">
                    {g.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{g.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {shortenAddress(g.address)}
                      {g.status === 'pending' && (
                        <span className="ml-2 text-yellow-400">· Pending</span>
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-400"
                  onClick={() => handleRemove(g.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
