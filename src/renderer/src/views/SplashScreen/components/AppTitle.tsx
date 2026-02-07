import { motion } from 'motion/react'

/** App name + subtitle */
export function AppTitle() {
  return (
    <>
      <motion.h1
        className="mt-8 text-4xl font-bold text-white"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          panoplia
        </span>
        <span className="text-white">.eth</span>
      </motion.h1>

      <motion.p
        className="mt-2 text-muted-foreground text-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        MPC-Secured Multi-Chain Wallet
      </motion.p>
    </>
  )
}
