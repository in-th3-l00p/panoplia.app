import { motion } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { Card } from '@renderer/components/ui/card'

export interface SettingItemProps {
  icon: React.ReactNode
  label: string
  description?: string
  onClick?: () => void
  danger?: boolean
}

export function SettingItem({ icon, label, description, onClick, danger }: SettingItemProps) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
      <Card
        className={`p-4 cursor-pointer transition-all duration-200 ${
          danger
            ? 'hover:border-red-500/50 hover:bg-red-500/5'
            : 'hover:border-purple-500/50'
        }`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                danger
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-purple-500/10 text-purple-400'
              }`}
            >
              {icon}
            </div>
            <div>
              <h3 className={`font-medium ${danger ? 'text-red-400' : 'text-white'}`}>
                {label}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </Card>
    </motion.div>
  )
}
