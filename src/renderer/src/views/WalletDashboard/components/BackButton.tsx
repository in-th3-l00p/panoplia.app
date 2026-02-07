import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'

interface BackButtonProps {
  to?: string
}

export function BackButton({ to = '/wallets' }: BackButtonProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-6 left-6"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(to)}
        className="text-muted-foreground hover:text-white"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
    </motion.div>
  )
}
