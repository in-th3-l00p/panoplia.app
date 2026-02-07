import { motion } from 'motion/react'

interface SettingsHeaderProps {
  walletName: string
}

export function SettingsHeader({ walletName }: SettingsHeaderProps) {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-2"
      >
        Settings
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-muted-foreground mb-8"
      >
        {walletName}
      </motion.p>
    </>
  )
}
