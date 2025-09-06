import { useState } from 'react'
import { useSports } from '@/hooks/useSports'
import { LiveScore } from '@/types/sports'

interface LiveScoresProps {
  showHeader?: boolean
  maxItems?: number
  showRefresh?: boolean
}

export default function LiveScores({ 
  showHeader = true, 
  maxItems = 10,
  showRefresh = true 
}: LiveScoresProps) {
  const { 
    liveScores, 
    todaysFixtures, 
    loadingLive, 
    loadingFixtures,
    error, 
    fetchLiveScores, 
    fetchTodaysFixtures,
    remainingRequests,
    canMakeRequest 
  } = useSports()
  
  const [activeTab, setActiveTab] = useState<'live' | 'today'>('today')

  const currentData = activeTab === 'live' ? liveScores : todaysFixtures
  const isLoading = activeTab === 'live' ? loadingLive : loadingFixtures
  const displayData = currentData.slice(0, maxItems)

  const handleRefresh = () => {
    if (!canMakeRequest) return
    
    if (activeTab === 'live') {
      fetchLiveScores()
    } else {
      fetchTodaysFixtures()
    }
  }

  const formatTime = (time: string, status: string) => {
    if (status === 'Not Started') return 'VS'
    if (status === 'Match Finished') return 'FT'
    if (status === 'Halftime') return 'HT'
    if (time.includes("'")) return time
    return status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Match Finished':
        return 'text-gray-400'
      case 'Not Started':
        return 'text-blue-400'
      case 'Halftime':
        return 'text-yellow-400'
      default:
        return 'text-green-400' // Live
    }
  }

  const isLive = (status: string) => {
    return !['Match Finished', 'Not Started', 'Halftime'].includes(status)
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span>Error: {error}</span>
          {showRefresh && canMakeRequest && (
            <button 
              onClick={handleRefresh}
              className="text-red-300 hover:text-red-100 text-sm underline"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-white">⚽ Deportes en Vivo</h3>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <span>API calls restantes:</span>
              <span className={remainingRequests < 10 ? 'text-red-400' : 'text-green-400'}>
                {remainingRequests}
              </span>
            </div>
          </div>
          
          {showRefresh && (
            <button 
              onClick={handleRefresh}
              disabled={isLoading || !canMakeRequest}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed text-sm transition-colors"
            >
              <span className={isLoading ? 'animate-spin' : ''}>↻</span>
              <span>{isLoading ? 'Actualizando...' : 'Actualizar'}</span>
            </button>
          )}
        </div>
      )}

      {/* API Status Notice */}
      <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-400 p-3 rounded-lg text-sm">
        <div className="flex items-start space-x-2">
          <span className="text-yellow-400">ℹ️</span>
          <div>
            <p className="font-medium">Datos de demostración</p>
            <p className="text-xs text-yellow-300 mt-1">
              API key no suscrita a API-Football. Mostrando datos mock realistas para pruebas.
              Para datos reales, suscríbete en RapidAPI a la API-Football.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'today' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          Hoy ({todaysFixtures.length})
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'live' 
              ? 'bg-green-600 text-white' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          En Vivo ({liveScores.length})
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Cargando datos deportivos...</p>
        </div>
      )}

      {/* No Data State */}
      {!isLoading && displayData.length === 0 && (
        <div className="text-center py-6">
          <div className="text-4xl mb-2">⚽</div>
          <p className="text-gray-400">
            {activeTab === 'live' 
              ? 'No hay partidos en vivo ahora' 
              : 'No hay partidos programados para hoy'}
          </p>
          {canMakeRequest && (
            <button 
              onClick={handleRefresh}
              className="mt-2 text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Actualizar datos
            </button>
          )}
        </div>
      )}

      {/* Scores Grid */}
      {!isLoading && displayData.length > 0 && (
        <div className="space-y-2">
          {displayData.map((match) => (
            <div
              key={match.id}
              className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors"
            >
              {/* League and Status */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                  {match.league}
                </span>
                <div className="flex items-center space-x-2">
                  {isLive(match.status) && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                  <span className={`text-xs font-medium ${getStatusColor(match.status)}`}>
                    {formatTime(match.time, match.status)}
                  </span>
                </div>
              </div>

              {/* Teams and Score */}
              <div className="grid grid-cols-3 items-center gap-4">
                {/* Home Team */}
                <div className="text-right">
                  <p className="text-white font-medium truncate">{match.homeTeam}</p>
                </div>

                {/* Score */}
                <div className="text-center">
                  <div className="bg-gray-800 rounded px-3 py-1">
                    <span className="text-lg font-bold text-white">
                      {match.homeScore ?? '-'} - {match.awayScore ?? '-'}
                    </span>
                  </div>
                </div>

                {/* Away Team */}
                <div className="text-left">
                  <p className="text-white font-medium truncate">{match.awayTeam}</p>
                </div>
              </div>

              {/* Match Time */}
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-700">
                <span className="text-xs text-gray-400">
                  {new Date(match.date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {isLive(match.status) && (
                  <span className="text-xs text-green-400 font-medium">
                    🔴 EN VIVO
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Show More */}
          {currentData.length > maxItems && (
            <div className="text-center pt-2">
              <p className="text-sm text-gray-400">
                Mostrando {maxItems} de {currentData.length} partidos
              </p>
            </div>
          )}
        </div>
      )}

      {/* Rate Limit Warning */}
      {remainingRequests < 10 && (
        <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-400 p-3 rounded-lg text-sm">
          <div className="flex items-center space-x-2">
            <span>⚠️</span>
            <span>Quedan pocas consultas API disponibles hoy ({remainingRequests})</span>
          </div>
        </div>
      )}
    </div>
  )
}