import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowDownToLine, ArrowUpFromLine, Settings } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'

export function ActionButtons() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex gap-4"
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="lg"
          onClick={() => navigate('/transfer?mode=deposit')}
          className="flex flex-col items-center gap-1 h-auto py-4 px-8 bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-lg shadow-purple-600/30"
        >
          <ArrowDownToLine className="w-6 h-6" />
          <span className="text-sm font-medium">Deposit</span>
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => navigate('/transfer?mode=withdraw')}
          className="flex flex-col items-center gap-1 h-auto py-4 px-8"
        >
          <ArrowUpFromLine className="w-6 h-6" />
          <span className="text-sm font-medium">Withdraw</span>
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="lg"
          variant="ghost"
          onClick={() => navigate('/settings')}
          className="flex flex-col items-center gap-1 h-auto py-4 px-8 border border-border"
        >
          <Settings className="w-6 h-6" />
          <span className="text-sm font-medium">Settings</span>
        </Button>
      </motion.div>
    </motion.div>
  )
}
