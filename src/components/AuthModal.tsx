import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode?: 'login' | 'register'
}

export default function AuthModal({ isOpen, onClose, mode = 'login' }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(mode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const { signIn, signUp, signInWithProvider } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (authMode === 'login') {
        const { data, error } = await signIn(email, password)
        if (error) {
          setError(error)
        } else {
          setMessage('¡Inicio de sesión exitoso!')
          setTimeout(() => onClose(), 1000)
        }
      } else {
        const { data, error } = await signUp(email, password, username)
        if (error) {
          setError(error)
        } else {
          setMessage('¡Cuenta creada! Revisa tu email para confirmar.')
        }
      }
    } catch (err) {
      setError('Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login')
    setError('')
    setMessage('')
  }

  const handleSocialLogin = async (provider: 'google' | 'twitter') => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { data, error } = await signInWithProvider(provider)
      if (error) {
        setError(error)
      } else {
        setMessage('Redirigiendo para autenticación...')
        // The OAuth redirect will happen automatically
      }
    } catch (err) {
      setError('Error al conectar con Google')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1d29] border border-gray-700 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#2a2d3a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="Tu nombre de usuario"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#2a2d3a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#2a2d3a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Tu contraseña"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Cargando...' : (authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>

        {/* Social Authentication */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1a1d29] text-gray-400">O continúa con</span>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg bg-white text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Conectando...' : 'Continuar con Gmail'}
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={switchMode}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            {authMode === 'login' 
              ? '¿No tienes cuenta? Crear una'
              : '¿Ya tienes cuenta? Iniciar sesión'
            }
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            Al crear una cuenta, aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    </div>
  )
}