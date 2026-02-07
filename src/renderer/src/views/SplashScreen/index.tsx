import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatedLogo, AppTitle, LoadingDots } from './components'

export function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/wallets'), 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <AnimatedLogo />
      <AppTitle />
      <LoadingDots />
    </div>
  )
}
