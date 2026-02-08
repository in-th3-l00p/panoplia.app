import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatedLogo, AppTitle, LoadingDots } from './components'
import { useAuthStore } from '@renderer/store/auth-store'
import * as api from '@renderer/services/api-client'

export function SplashScreen() {
  const navigate = useNavigate()
  const { token, validateToken } = useAuthStore()
  const [status, setStatus] = useState('Connecting to server...')

  useEffect(() => {
    const init = async () => {
      // Wait for the animation to play
      await new Promise((r) => setTimeout(r, 1500))

      // Check server health
      try {
        await api.checkHealth()
        setStatus('Server connected')
      } catch {
        setStatus('Starting in demo mode...')
        await new Promise((r) => setTimeout(r, 500))
      }

      // Check if user has a valid token
      if (token) {
        setStatus('Restoring session...')
        const valid = await validateToken()
        if (valid) {
          navigate('/wallets')
          return
        }
      }

      // No valid session — go to auth
      navigate('/auth')
    }

    init()
  }, [navigate, token, validateToken])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <AnimatedLogo />
      <AppTitle />
      <LoadingDots />
      <p className="mt-6 text-xs text-muted-foreground/50 animate-pulse">{status}</p>
    </div>
  )
}
