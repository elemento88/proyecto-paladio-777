import { useState, useEffect } from 'react'
import { useBots } from '@/hooks/useBots'
import { useBetting } from '@/hooks/useBetting'

interface BotSimulatorProps {
  challengeId?: string
  autoSimulate?: boolean
}

export default function BotSimulator({ challengeId, autoSimulate = false }: BotSimulatorProps) {
  const { bots, simulateBotBetting, makeAllBotsBet, getActiveBots } = useBots()
  const { challenges } = useBetting()
  
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationResults, setSimulationResults] = useState<any[]>([])
  const [autoMode, setAutoMode] = useState(autoSimulate)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  // Auto simulation for active challenges
  useEffect(() => {
    if (autoMode && !intervalId) {
      const id = setInterval(async () => {
        await simulateRandomBetting()
      }, 10000) // Every 10 seconds

      setIntervalId(id)
    }

    if (!autoMode && intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [autoMode])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [intervalId])

  const simulateRandomBetting = async () => {
    const activeBots = getActiveBots()
    const activeChallenges = challenges.filter(c => 
      c.status === 'ACTIVE' && 
      c.current_participants < c.max_participants &&
      new Date(c.end_date) > new Date()
    )

    if (activeBots.length === 0 || activeChallenges.length === 0) return

    // Randomly select a bot and challenge
    const randomBot = activeBots[Math.floor(Math.random() * activeBots.length)]
    const randomChallenge = activeChallenges[Math.floor(Math.random() * activeChallenges.length)]

    // 30% chance of betting
    if (Math.random() < 0.3) {
      await simulateBotBetting(randomBot.id, randomChallenge.id)
    }
  }

  const handleSimulateSpecificChallenge = async (targetChallengeId: string) => {
    setIsSimulating(true)
    setSimulationResults([])

    try {
      const results = await makeAllBotsBet(targetChallengeId)
      setSimulationResults(results)
    } catch (error) {
      console.error('Simulation error:', error)
    } finally {
      setIsSimulating(false)
    }
  }

  const handleSimulateRandomBot = async () => {
    const activeBots = getActiveBots()
    const activeChallenges = challenges.filter(c => 
      c.status === 'ACTIVE' && 
      c.current_participants < c.max_participants
    )

    if (activeBots.length === 0 || activeChallenges.length === 0) return

    const randomBot = activeBots[Math.floor(Math.random() * activeBots.length)]
    const randomChallenge = activeChallenges[Math.floor(Math.random() * activeChallenges.length)]

    setIsSimulating(true)
    try {
      const result = await simulateBotBetting(randomBot.id, randomChallenge.id)
      setSimulationResults([{
        botId: randomBot.id,
        botUsername: randomBot.username,
        challengeTitle: randomChallenge.title,
        result
      }])
    } catch (error) {
      console.error('Random simulation error:', error)
    } finally {
      setIsSimulating(false)
    }
  }

  const activeChallenges = challenges.filter(c => 
    c.status === 'ACTIVE' && 
    c.current_participants < c.max_participants
  )
  const activeBots = getActiveBots()

  return (
    <div className="bg-[#2a2d3a] p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Simulador de Bots</h3>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-400">
            Modo Auto:
          </label>
          <button
            onClick={() => setAutoMode(!autoMode)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              autoMode 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-600 text-gray-300'
            }`}
          >
            {autoMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-400">{activeBots.length}</p>
          <p className="text-xs text-gray-400">Bots Activos</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">{activeChallenges.length}</p>
          <p className="text-xs text-gray-400">Desafíos Disponibles</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-400">{simulationResults.length}</p>
          <p className="text-xs text-gray-400">Simulaciones</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleSimulateRandomBot}
          disabled={isSimulating || activeBots.length === 0 || activeChallenges.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-3 py-2 rounded text-sm transition-colors"
        >
          {isSimulating ? 'Simulando...' : 'Bot Aleatorio'}
        </button>

        {challengeId && (
          <button
            onClick={() => handleSimulateSpecificChallenge(challengeId)}
            disabled={isSimulating || activeBots.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            Todos los Bots
          </button>
        )}

        <button
          onClick={() => setSimulationResults([])}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors"
        >
          Limpiar Resultados
        </button>
      </div>

      {/* Auto mode indicator */}
      {autoMode && (
        <div className="bg-green-500/10 border border-green-500 text-green-400 p-2 rounded mb-4 text-sm">
          🤖 Modo automático activado - Los bots apostarán cada 10 segundos
        </div>
      )}

      {/* Results */}
      {simulationResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Resultados de Simulación:</h4>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {simulationResults.map((result, index) => (
              <div key={index} className="bg-[#1a1d29] p-2 rounded text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-400">
                    {result.botUsername}
                  </span>
                  <span className={`px-2 py-1 rounded ${
                    result.result.error 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {result.result.error ? 'Error' : 'Éxito'}
                  </span>
                </div>
                {result.challengeTitle && (
                  <p className="text-gray-400 mt-1">{result.challengeTitle}</p>
                )}
                {result.result.error && (
                  <p className="text-red-400 mt-1">{result.result.error}</p>
                )}
                {result.result.data && (
                  <div className="text-gray-300 mt-1">
                    Predicción: {result.result.data.prediction_value} | 
                    Apuesta: ${result.result.data.stake_amount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No bots/challenges message */}
      {(activeBots.length === 0 || activeChallenges.length === 0) && (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">
            {activeBots.length === 0 
              ? 'No hay bots activos disponibles'
              : 'No hay desafíos disponibles para apostar'
            }
          </p>
        </div>
      )}
    </div>
  )
}