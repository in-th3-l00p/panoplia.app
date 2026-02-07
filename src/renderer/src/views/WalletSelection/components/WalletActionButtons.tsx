import { motion } from 'motion/react'
import { Plus, Download } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'

interface WalletActionButtonsProps {
  onCreateClick: () => void
  onImportClick: () => void
}

export function WalletActionButtons({ onCreateClick, onImportClick }: WalletActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="default"
          size="lg"
          className="w-full"
          onClick={onCreateClick}
        >
          <Plus className="w-5 h-5" />
          Create New
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={onImportClick}
        >
          <Download className="w-5 h-5" />
          Import
        </Button>
      </motion.div>
    </div>
  )
}
