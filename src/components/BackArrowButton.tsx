'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface BackArrowButtonProps {
  className?: string
  title?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function BackArrowButton({
  className = "",
  title = "Ir atrás",
  size = "md"
}: BackArrowButtonProps) {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const sizeClasses = {
    sm: "p-2 w-4 h-4",
    md: "p-3 w-5 h-5",
    lg: "p-4 w-6 h-6"
  }

  return (
    <button
      onClick={handleGoBack}
      className={`bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur border border-gray-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ${className}`}
      title={title}
    >
      <ArrowLeftIcon className={sizeClasses[size].split(' ').slice(1).join(' ')} />
    </button>
  )
}