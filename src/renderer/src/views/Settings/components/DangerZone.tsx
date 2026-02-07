import { motion } from 'motion/react'
import { Trash2 } from 'lucide-react'
import { SettingItem } from './SettingItem'

interface DangerZoneProps {
  onDeleteClick: () => void
}

export function DangerZone({ onDeleteClick }: DangerZoneProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="w-full mt-8"
    >
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-1">
        Danger Zone
      </p>
      <SettingItem
        icon={<Trash2 className="w-5 h-5" />}
        label="Delete Wallet"
        description="Permanently remove this wallet"
        onClick={onDeleteClick}
        danger
      />
    </motion.div>
  )
}
