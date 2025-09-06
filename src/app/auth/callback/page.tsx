'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL fragment
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error during auth callback:', error)
          router.push('/?error=auth_failed')
          return
        }

        if (data.session) {
          // User is authenticated, redirect to home
          router.push('/')
        } else {
          // No session, redirect back to login
          router.push('/?error=no_session')
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        router.push('/?error=unexpected')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-[#1a1d29] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Completando autenticación...</p>
        <p className="text-gray-400 text-sm mt-2">Te redirigiremos en un momento</p>
      </div>
    </div>
  )
}