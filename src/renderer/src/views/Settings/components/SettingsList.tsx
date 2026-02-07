import { motion } from 'motion/react'
import { Shield, Bell, Palette, Globe, Key } from 'lucide-react'
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
        label="Security"
        description="Manage your wallet security settings"
      />
      <SettingItem
        icon={<Key className="w-5 h-5" />}
        label="Backup & Recovery"
        description="Export your recovery phrase"
      />
      <SettingItem
        icon={<Bell className="w-5 h-5" />}
        label="Notifications"
        description="Configure alerts and notifications"
      />
      <SettingItem
        icon={<Palette className="w-5 h-5" />}
        label="Appearance"
        description="Customize the app look and feel"
      />
      <SettingItem
        icon={<Globe className="w-5 h-5" />}
        label="Network"
        description="Switch between networks"
      />
    </motion.div>
  )
}
