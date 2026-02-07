import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Layers,
  ShieldCheck
} from 'lucide-react'
import { Button } from '@renderer/components/ui/button'

const ACTIONS = [
  {
    label: 'Deposit',
    icon: ArrowDownToLine,
    path: '/transfer?mode=deposit',
    variant: 'default' as const,
    className:
      'bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-lg shadow-purple-600/30'
  },
  {
    label: 'Withdraw',
    icon: ArrowUpFromLine,
    path: '/transfer?mode=withdraw',
    variant: 'secondary' as const,
    className: ''
  },
  {
    label: 'Transfers',
    icon: ArrowLeftRight,
    path: '/transfers',
    variant: 'secondary' as const,
    className: ''
  },
  {
    label: 'DeFi',
    icon: Layers,
    path: '/defi',
    variant: 'secondary' as const,
    className: ''
  },
  {
    label: 'Security',
    icon: ShieldCheck,
    path: '/security',
    variant: 'ghost' as const,
    className: 'border border-border'
  }
] as const

export function ActionButtons() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex flex-wrap justify-center gap-3"
    >
      {ACTIONS.map((action) => (
        <motion.div key={action.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            variant={action.variant}
            onClick={() => navigate(action.path)}
            className={`flex flex-col items-center gap-1 h-auto py-3 px-5 ${action.className}`}
          >
            <action.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  )
}
