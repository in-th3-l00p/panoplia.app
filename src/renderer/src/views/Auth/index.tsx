/**
 * Auth View — Login / Register
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Loader2, Eye, EyeOff, Shield } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { useAuthStore } from '@renderer/store/auth-store'

export function Auth() {
  const navigate = useNavigate()
  const { login, register, isLoading, error, clearError } = useAuthStore()

  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    clearError()

    if (!email.trim() || !password.trim()) {
      setLocalError('Email and password are required')
      return
    }

    if (isRegister) {
      if (password.length < 8) {
        setLocalError('Password must be at least 8 characters')
        return
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match')
        return
      }
    }

    try {
      if (isRegister) {
        await register(email, password)
      } else {
        await login(email, password)
      }
      navigate('/wallets')
    } catch {
      // Error is set in the store
    }
  }

  const displayError = localError || error

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-600/30 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Panoplia
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl px-4 py-3"
            >
              {displayError}
            </motion.div>
          )}

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={isRegister ? 'Min 8 characters' : 'Enter password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="text-sm text-muted-foreground mb-1.5 block">Confirm Password</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </motion.div>
          )}

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isRegister ? 'Creating account...' : 'Signing in...'}
              </>
            ) : (
              isRegister ? 'Create Account' : 'Sign In'
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister)
              setLocalError('')
              clearError()
            }}
            className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
