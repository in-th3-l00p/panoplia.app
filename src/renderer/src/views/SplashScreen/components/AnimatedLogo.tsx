import { motion } from 'motion/react'

/** Animated glow + wallet icon logo */
export function AnimatedLogo() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, duration: 0.6 }}
      className="relative"
    >
      {/* Glow ring */}
      <motion.div
        className="absolute inset-0 bg-purple-600/30 blur-3xl rounded-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: [0, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* Icon box */}
      <motion.div
        className="relative z-10 w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-2xl shadow-purple-600/50"
        animate={{
          boxShadow: [
            '0 25px 50px -12px rgba(139, 92, 246, 0.5)',
            '0 25px 50px -12px rgba(139, 92, 246, 0.8)',
            '0 25px 50px -12px rgba(139, 92, 246, 0.5)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      >
        <svg
          className="w-16 h-16 text-white"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <motion.path
            d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          <motion.circle
            cx="12"
            cy="13"
            r="2"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          />
        </svg>
      </motion.div>
    </motion.div>
  )
}
