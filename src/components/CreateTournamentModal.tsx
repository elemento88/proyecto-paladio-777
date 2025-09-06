import { useState, useEffect } from 'react'
import { useTournaments, CreateTournamentData } from '@/hooks/useTournaments'
import { useBetting } from '@/hooks/useBetting'
import { useAuth } from '@/hooks/useAuth'

interface CreateTournamentModalProps {
  isOpen: boolean
  onClose: () => void
  onTournamentCreated?: (tournamentId: string) => void
}

export default function CreateTournamentModal({ isOpen, onClose, onTournamentCreated }: CreateTournamentModalProps) {
  const { user } = useAuth()
  const { createTournament } = useTournaments()
  const { fetchSportsCategories, fetchLeagues } = useBetting()
  
  const [formData, setFormData] = useState<CreateTournamentData>({
    title: '',
    description: '',
    sport_id: '',
    league_id: '',
    stake_amount: 50,
    max_participants: 16,
    end_date: '',
    tournament_type: 'LEAGUE',
    tournament_duration: 'MEDIUM',
    tournament_prize_distribution: 'TOP3',
    allow_spectators: true,
    enable_chat: true
  })

  const [sportsCategories, setSportsCategories] = useState<any[]>([])
  const [leagues, setLeagues] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      loadSportsAndLeagues()
      // Set default end date to 1 month from now
      const defaultEndDate = new Date()
      defaultEndDate.setMonth(defaultEndDate.getMonth() + 1)
      setFormData(prev => ({
        ...prev,
        end_date: defaultEndDate.toISOString().split('T')[0]
      }))
    }
  }, [isOpen])

  const loadSportsAndLeagues = async () => {
    const sportsResult = await fetchSportsCategories()
    if (sportsResult.data) {
      setSportsCategories(sportsResult.data)
    }

    const leaguesResult = await fetchLeagues()
    if (leaguesResult.data) {
      setLeagues(leaguesResult.data)
    }
  }

  const handleInputChange = (field: keyof CreateTournamentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')
    setMessage('')

    // Validate required fields
    if (!formData.title.trim() || !formData.sport_id || !formData.league_id) {
      setError('Por favor completa todos los campos requeridos')
      setLoading(false)
      return
    }

    try {
      const result = await createTournament(formData)
      
      if (result.error) {
        setError(result.error)
      } else {
        setMessage('¡Torneo creado exitosamente!')
        setTimeout(() => {
          onClose()
          if (onTournamentCreated && result.data) {
            onTournamentCreated(result.data.tournament_id)
          }
        }, 1500)
      }
    } catch (err) {
      setError('Error inesperado al crear el torneo')
    } finally {
      setLoading(false)
    }
  }

  const getTournamentTypeInfo = (type: string) => {
    const info = {
      LEAGUE: {
        name: 'Liga',
        icon: '🏁',
        description: 'Todos los participantes compiten entre sí en múltiples rondas. Sistema de ranking por puntos acumulados.',
        example: 'Temporada completa donde cada jugador hace predicciones en cada ronda'
      },
      KNOCKOUT: {
        name: 'Eliminación',
        icon: '⚔️',
        description: 'Brackets de eliminación directa. Los perdedores quedan eliminados del torneo.',
        example: 'Copa del mundo - pierdes una ronda y quedas fuera'
      },
      HYBRID: {
        name: 'Híbrido',
        icon: '🔄',
        description: 'Fase de liga clasificatoria seguida de playoffs de eliminación directa.',
        example: 'Fase de grupos + eliminatorias como en Champions League'
      }
    }
    return info[type as keyof typeof info]
  }

  const getDurationInfo = (duration: string) => {
    const info = {
      FAST: { name: 'Rápido', days: '3-7 días', description: 'Torneo express para resultados rápidos' },
      MEDIUM: { name: 'Medio', days: '1-2 semanas', description: 'Duración balanceada con tiempo para estrategia' },
      LONG: { name: 'Largo', days: '3-4 semanas', description: 'Torneo extenso para verdaderos expertos' },
      SEASON: { name: 'Temporada', days: '1-3 meses', description: 'Torneo de temporada completa' }
    }
    return info[duration as keyof typeof info]
  }

  const getPrizeDistributionInfo = (distribution: string) => {
    const info = {
      WINNER_TAKES_ALL: { name: 'Ganador único', icon: '🥇', description: 'Solo el primer lugar gana todo el premio' },
      TOP3: { name: 'Top 3', icon: '🏆', description: '1°: 60%, 2°: 25%, 3°: 15%' },
      TOP5: { name: 'Top 5', icon: '🎖️', description: 'Premios distribuidos entre los 5 mejores' },
      TOP10_PERCENT: { name: 'Top 10%', icon: '🌟', description: 'Premios para el 10% mejor del torneo' }
    }
    return info[distribution as keyof typeof info]
  }

  const calculateEstimatedPrize = () => {
    return formData.stake_amount * formData.max_participants
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1d29] border border-gray-700 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Crear Torneo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título del Torneo *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full bg-[#2a2d3a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="Ej: Copa Mundial de Predicciones FIFA 2024"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full bg-[#2a2d3a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="Describe tu torneo, reglas especiales, etc."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deporte *
              </label>
              <select
                value={formData.sport_id}
                onChange={(e) => handleInputChange('sport_id', e.target.value)}
                className="w-full bg-[#2a2d3a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Selecciona un deporte</option>
                {sportsCategories.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.icon} {sport.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Liga *
              </label>
              <select
                value={formData.league_id}
                onChange={(e) => handleInputChange('league_id', e.target.value)}
                className="w-full bg-[#2a2d3a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Selecciona una liga</option>
                {leagues.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.icon} {league.name} ({league.country})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tournament Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Configuración del Torneo</h3>
            
            {/* Tournament Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Torneo
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(['LEAGUE', 'KNOCKOUT', 'HYBRID'] as const).map((type) => {
                  const info = getTournamentTypeInfo(type)
                  return (
                    <div key={type}>
                      <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.tournament_type === type
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}>
                        <input
                          type="radio"
                          name="tournament_type"
                          value={type}
                          checked={formData.tournament_type === type}
                          onChange={(e) => handleInputChange('tournament_type', e.target.value)}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">{info.icon}</div>
                          <div className="text-white font-medium">{info.name}</div>
                          <div className="text-xs text-gray-400 mt-1">{info.description}</div>
                        </div>
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duración
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['FAST', 'MEDIUM', 'LONG', 'SEASON'] as const).map((duration) => {
                  const info = getDurationInfo(duration)
                  return (
                    <label key={duration} className={`block p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.tournament_duration === duration
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}>
                      <input
                        type="radio"
                        name="tournament_duration"
                        value={duration}
                        checked={formData.tournament_duration === duration}
                        onChange={(e) => handleInputChange('tournament_duration', e.target.value)}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-white font-medium">{info.name}</div>
                        <div className="text-xs text-gray-400">{info.days}</div>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Prize Distribution */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Distribución de Premios
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['WINNER_TAKES_ALL', 'TOP3', 'TOP5', 'TOP10_PERCENT'] as const).map((distribution) => {
                  const info = getPrizeDistributionInfo(distribution)
                  return (
                    <label key={distribution} className={`block p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.tournament_prize_distribution === distribution
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}>
                      <input
                        type="radio"
                        name="tournament_prize_distribution"
                        value={distribution}
                        checked={formData.tournament_prize_distribution === distribution}
                        onChange={(e) => handleInputChange('tournament_prize_distribution', e.target.value)}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-lg mb-1">{info.icon}</div>
                        <div className="text-white font-medium text-sm">{info.name}</div>
                        <div className="text-xs text-gray-400">{info.description}</div>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Numeric Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Entry Fee (USDC)
              </label>
              <input
                type="number"
                value={formData.stake_amount}
                onChange={(e) => handleInputChange('stake_amount', parseFloat(e.target.value) || 0)}
                className="w-full bg-[#2a2d3a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                min="1"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Máximo Participantes
              </label>
              <select
                value={formData.max_participants}
                onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value))}
                className="w-full bg-[#2a2d3a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value={8}>8 participantes</option>
                <option value={16}>16 participantes</option>
                <option value={32}>32 participantes</option>
                <option value={64}>64 participantes</option>
                <option value={128}>128 participantes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha de Finalización
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="w-full bg-[#2a2d3a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Additional Settings */}
          <div className="space-y-3">
            <h4 className="text-md font-medium text-white">Configuraciones Adicionales</h4>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.allow_spectators}
                  onChange={(e) => handleInputChange('allow_spectators', e.target.checked)}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
                <span className="ml-2 text-sm text-gray-300">Permitir espectadores</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.enable_chat}
                  onChange={(e) => handleInputChange('enable_chat', e.target.checked)}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
                <span className="ml-2 text-sm text-gray-300">Habilitar chat</span>
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-md font-medium text-white mb-3">Resumen del Torneo</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Entry Fee:</span>
                <p className="text-white font-medium">${formData.stake_amount} USDC</p>
              </div>
              <div>
                <span className="text-gray-400">Premio Total:</span>
                <p className="text-yellow-400 font-medium">${calculateEstimatedPrize().toLocaleString()} USDC</p>
              </div>
              <div>
                <span className="text-gray-400">Participantes:</span>
                <p className="text-white font-medium">{formData.max_participants}</p>
              </div>
              <div>
                <span className="text-gray-400">Tipo:</span>
                <p className="text-white font-medium">{getTournamentTypeInfo(formData.tournament_type).name}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.sport_id || !formData.league_id}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Creando Torneo...' : 'Crear Torneo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}