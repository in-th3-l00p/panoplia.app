import { motion } from 'motion/react'
import { Shield, Bell, Palette, Globe, Key, Phone } from 'lucide-react'
import { SettingItem } from './SettingItem'

export function SettingsList() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full space-y-3"
    >
      <SettingItem
        icon={<Shield className="w-5 h-5" />}
        label="Social Recovery"
        description="Enhance wallet security with trusted contacts"
      />
      <SettingItem
        icon={<Phone className="w-5 h-5" />}
        label="MPC Devices"
        description="Add multiple devices for secure access and recovery"
      />
      <SettingItem
        icon={<Globe className="w-5 h-5" />}
        label="Network"
        description="Switch between networks"
      />
    </motion.div>
  )
}
