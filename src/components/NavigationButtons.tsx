'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline'

interface NavigationButtonsProps {
  showHome?: boolean
  showBack?: boolean
  className?: string
}

export default function NavigationButtons({
  showHome = true,
  showBack = true,
  className = ""
}: NavigationButtonsProps) {
  const router = useRouter()

  const handleGoHome = () => {
    router.push('/')
  }

  const handleGoBack = () => {
    router.back()
  }

  if (!showHome && !showBack) return null

  return (
    <div className={`fixed top-4 right-4 z-50 flex gap-2 ${className}`}>
      {showHome && (
        <button
          onClick={handleGoHome}
          className="bg-blue-600/90 hover:bg-blue-500/90 backdrop-blur border border-blue-500 text-white p-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          title="Ir al inicio"
        >
          <HomeIcon className="w-5 h-5" />
        </button>
      )}

      {showBack && (
        <button
          onClick={handleGoBack}
          className="bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur border border-gray-600 text-white p-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          title="Ir atrás"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}