import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import AuthModal from './AuthModal'

interface LoginButtonProps {
  variant?: 'primary' | 'secondary' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function LoginButton({ 
  variant = 'primary', 
  size = 'md', 
  showText = true 
}: LoginButtonProps) {
  const { user, signOut, profile } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  const buttonSizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }

  const buttonVariants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    minimal: 'text-blue-400 hover:text-blue-300 underline'
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`${buttonSizes[size]} ${buttonVariants[variant]} rounded-lg flex items-center space-x-2 transition-colors`}
        >
          <span className="text-xl">{profile?.avatar_url || '👤'}</span>
          {showText && (
            <span>{profile?.username || user.email?.split('@')[0] || 'Usuario'}</span>
          )}
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {showUserMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#2a2d3a] border border-gray-600 rounded-lg shadow-lg z-50">
            <div className="p-3 border-b border-gray-600">
              <p className="text-sm text-white font-medium">{profile?.username || 'Usuario'}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
              {profile && (
                <p className="text-xs text-green-400 mt-1">
                  Balance: ${profile.balance_usdc.toFixed(2)} USDC
                </p>
              )}
            </div>
            <div className="py-1">
              <button
                onClick={() => {
                  setShowUserMenu(false)
                  // Open profile modal or navigate to profile
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                Mi Perfil
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false)
                  // Open wallet connection modal
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                Conectar Wallet
              </button>
              <hr className="border-gray-600 my-1" />
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}

        {/* Click outside to close menu */}
        {showUserMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowAuthModal(true)}
        className={`${buttonSizes[size]} ${buttonVariants[variant]} rounded-lg flex items-center space-x-2 transition-colors`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        {showText && <span>Iniciar Sesión</span>}
      </button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}