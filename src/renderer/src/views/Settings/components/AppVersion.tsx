import { motion } from 'motion/react'

export function AppVersion() {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-xs text-muted-foreground mt-8"
    >
      panoplia.eth v0.1.0
    </motion.p>
  )
}
