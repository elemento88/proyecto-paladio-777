import { useState } from 'react'
import { Tournament, useTournaments } from '@/hooks/useTournaments'
import { useAuth } from '@/hooks/useAuth'

interface TournamentCardProps {
  tournament: Tournament
  onJoin?: (tournamentId: string) => void
  onViewDetails?: (tournamentId: string) => void
}

export default function TournamentCard({ tournament, onJoin, onViewDetails }: TournamentCardProps) {
  const { user } = useAuth()
  const { joinTournament, isUserInTournament, getTournamentTypeInfo, getTournamentDurationInfo } = useTournaments()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const typeInfo = getTournamentTypeInfo(tournament.tournament_type)
  const durationInfo = getTournamentDurationInfo(tournament.tournament_duration)
  const isUserJoined = isUserInTournament(tournament.id)
  const isRegistrationOpen = tournament.tournament_phase === 'REGISTRATION'
  const isFull = tournament.current_participants >= tournament.max_participants

  const handleJoin = async () => {
    if (!user) {
      setError('Debes iniciar sesión para unirte')
      return
    }

    setLoading(true)
    setError('')

    const result = await joinTournament(tournament.id)
    if (result.error) {
      setError(result.error)
    } else {
      if (onJoin) onJoin(tournament.id)
    }
    setLoading(false)
  }

  const getPhaseDisplay = () => {
    const phases = {
      'REGISTRATION': { text: 'Registro Abierto', color: 'text-green-400', bg: 'bg-green-500/10' },
      'ACTIVE': { text: 'En Progreso', color: 'text-blue-400', bg: 'bg-blue-500/10' },
      'PLAYOFFS': { text: 'Playoffs', color: 'text-purple-400', bg: 'bg-purple-500/10' },
      'FINISHED': { text: 'Finalizado', color: 'text-gray-400', bg: 'bg-gray-500/10' }
    }
    return phases[tournament.tournament_phase as keyof typeof phases] || phases.REGISTRATION
  }

  const getPrizeDistributionDisplay = () => {
    const distributions = {
      'WINNER_TAKES_ALL': '🥇 Ganador único',
      'TOP3': '🏆 Top 3',
      'TOP5': '🎖️ Top 5',
      'TOP10_PERCENT': '🌟 Top 10%'
    }
    return distributions[tournament.tournament_prize_distribution as keyof typeof distributions] || 'Premio distribuido'
  }

  const getRegistrationProgress = () => {
    const percentage = (tournament.current_participants / tournament.max_participants) * 100
    return Math.round(percentage)
  }

  const phaseDisplay = getPhaseDisplay()

  return (
    <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{tournament.sport?.icon || '🏆'}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">{tournament.title}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>{tournament.sport?.name}</span>
              {tournament.league && (
                <>
                  <span>•</span>
                  <span>{tournament.league.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${phaseDisplay.bg} ${phaseDisplay.color}`}>
          {phaseDisplay.text}
        </div>
      </div>

      {/* Tournament Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg">{typeInfo?.icon}</span>
            <span className="text-sm text-gray-400">Tipo</span>
          </div>
          <p className="text-white font-medium">{typeInfo?.name}</p>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg">{durationInfo?.icon}</span>
            <span className="text-sm text-gray-400">Duración</span>
          </div>
          <p className="text-white font-medium">{durationInfo?.name}</p>
          <p className="text-xs text-gray-400">{durationInfo?.days}</p>
        </div>
      </div>

      {/* Prize Pool */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-yellow-300 font-medium">💰 Premio Total</p>
            <p className="text-2xl font-bold text-yellow-400">${tournament.total_pool.toLocaleString()} USDC</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-yellow-300">{getPrizeDistributionDisplay()}</p>
            <p className="text-xs text-gray-400">Entry: ${tournament.total_pool / tournament.max_participants} USDC</p>
          </div>
        </div>
      </div>

      {/* Participants Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Participantes</span>
          <span className="text-sm text-white">
            {tournament.current_participants}/{tournament.max_participants}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getRegistrationProgress()}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
          <span>{getRegistrationProgress()}% lleno</span>
          {isFull && <span className="text-red-400">¡Lleno!</span>}
        </div>
      </div>

      {/* Tournament Dates */}
      <div className="text-xs text-gray-400 mb-4 space-y-1">
        <div className="flex justify-between">
          <span>Inicio:</span>
          <span>{new Date(tournament.tournament_start_date).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Fin:</span>
          <span>{new Date(tournament.end_date).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {isUserJoined ? (
          <button
            onClick={() => onViewDetails && onViewDetails(tournament.id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            ✓ Inscrito - Ver Detalles
          </button>
        ) : isRegistrationOpen && !isFull ? (
          <>
            <button
              onClick={handleJoin}
              disabled={loading || !user}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Uniéndose...' : `Unirse (${tournament.total_pool / tournament.max_participants} USDC)`}
            </button>
            <button
              onClick={() => onViewDetails && onViewDetails(tournament.id)}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Ver
            </button>
          </>
        ) : (
          <button
            onClick={() => onViewDetails && onViewDetails(tournament.id)}
            disabled={!isRegistrationOpen && tournament.tournament_phase !== 'FINISHED'}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium cursor-not-allowed"
          >
            {isFull ? 'Torneo Lleno' : tournament.tournament_phase === 'FINISHED' ? 'Ver Resultados' : 'Registro Cerrado'}
          </button>
        )}
      </div>

      {/* Tournament Description */}
      {tournament.description && (
        <div className="mt-3 pt-3 border-t border-gray-600">
          <p className="text-sm text-gray-300">{tournament.description}</p>
        </div>
      )}
    </div>
  )
}