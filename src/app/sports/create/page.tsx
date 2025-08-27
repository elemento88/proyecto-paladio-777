'use client'

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BetType, ResolutionMode } from '@/types/betting';

interface MatchData {
  id: string;
  title: string;
  teams: {
    home: string;
    away: string;
  };
  date: string;
  time: string;
  league: string;
  sport: string;
}

interface BetConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  betType: string;
  resolutionMode: string;
  timestamp: number;
}

interface BetOption {
  id: string;
  label: string;
  description: string;
  type: 'prediction' | 'number' | 'boolean';
  options?: string[];
}

const footballBetOptions: BetOption[] = [
  {
    id: 'match_result',
    label: 'Resultado del Partido (1X2)',
    description: '¿Quién ganará el partido?',
    type: 'prediction',
    options: ['Victoria Local', 'Empate', 'Victoria Visitante']
  },
  {
    id: 'double_chance',
    label: 'Doble Oportunidad',
    description: 'Apuesta por dos resultados posibles',
    type: 'prediction',
    options: ['Local o Empate', 'Visitante o Empate', 'Local o Visitante']
  },
  {
    id: 'total_goals_over_under',
    label: 'Total de Goles (Más/Menos)',
    description: '¿Habrá más o menos de X goles?',
    type: 'prediction',
    options: ['Más de 0.5', 'Menos de 0.5', 'Más de 1.5', 'Menos de 1.5', 'Más de 2.5', 'Menos de 2.5', 'Más de 3.5', 'Menos de 3.5', 'Más de 4.5', 'Menos de 4.5']
  },
  {
    id: 'exact_goals',
    label: 'Número Exacto de Goles',
    description: '¿Cuántos goles exactos habrá?',
    type: 'prediction',
    options: ['0 Goles', '1 Gol', '2 Goles', '3 Goles', '4 Goles', '5+ Goles']
  },
  {
    id: 'both_teams_score',
    label: 'Ambos Equipos Anotan',
    description: '¿Marcarán gol ambos equipos?',
    type: 'prediction',
    options: ['Sí', 'No']
  },
  {
    id: 'correct_score',
    label: 'Marcador Correcto',
    description: '¿Cuál será el resultado exacto?',
    type: 'prediction',
    options: ['0-0', '1-0', '0-1', '1-1', '2-0', '0-2', '2-1', '1-2', '2-2', '3-0', '0-3', '3-1', '1-3', '3-2', '2-3', 'Otro']
  },
  {
    id: 'first_goal_team',
    label: 'Primer Gol',
    description: '¿Qué equipo marcará el primer gol?',
    type: 'prediction',
    options: ['Equipo Local', 'Equipo Visitante', 'Sin Goles']
  },
  {
    id: 'last_goal_team',
    label: 'Último Gol',
    description: '¿Qué equipo marcará el último gol?',
    type: 'prediction',
    options: ['Equipo Local', 'Equipo Visitante', 'Sin Goles']
  },
  {
    id: 'half_time_result',
    label: 'Resultado al Descanso',
    description: '¿Cómo terminará el primer tiempo?',
    type: 'prediction',
    options: ['Local Gana', 'Empate', 'Visitante Gana']
  },
  {
    id: 'half_time_full_time',
    label: 'Descanso/Final',
    description: 'Resultado al descanso y al final',
    type: 'prediction',
    options: ['Local/Local', 'Local/Empate', 'Local/Visitante', 'Empate/Local', 'Empate/Empate', 'Empate/Visitante', 'Visitante/Local', 'Visitante/Empate', 'Visitante/Visitante']
  },
  {
    id: 'total_corners',
    label: 'Total de Córners',
    description: '¿Cuántos córners habrá en total?',
    type: 'prediction',
    options: ['Más de 3.5', 'Menos de 3.5', 'Más de 5.5', 'Menos de 5.5', 'Más de 6.5', 'Menos de 6.5', 'Más de 9.5', 'Menos de 9.5', 'Más de 10.5', 'Menos de 10.5']
  },
  {
    id: 'corner_range',
    label: 'Rango de Córners',
    description: 'Número de córners en un rango',
    type: 'prediction',
    options: ['0-5 Córners', '6-10 Córners', '11-15 Córners', '16+ Córners']
  },
  {
    id: 'first_corner',
    label: 'Primer Córner',
    description: '¿Qué equipo sacará el primer córner?',
    type: 'prediction',
    options: ['Equipo Local', 'Equipo Visitante', 'Sin Córners']
  },
  {
    id: 'corner_race',
    label: 'Carrera de Córners',
    description: '¿Qué equipo llegará primero a X córners?',
    type: 'prediction',
    options: ['Local 3 Córners', 'Visitante 3 Córners', 'Local 5 Córners', 'Visitante 5 Córners', 'Local 7 Córners', 'Visitante 7 Córners']
  },
  {
    id: 'total_cards',
    label: 'Total de Tarjetas',
    description: '¿Cuántas tarjetas habrá?',
    type: 'prediction',
    options: ['Más de 1.5', 'Menos de 1.5', 'Más de 2.5', 'Menos de 2.5', 'Más de 3.5', 'Menos de 3.5', 'Más de 4.5', 'Menos de 4.5']
  },
  {
    id: 'red_cards',
    label: 'Tarjetas Rojas',
    description: '¿Habrá tarjetas rojas?',
    type: 'prediction',
    options: ['Sí', 'No', 'Más de 1.5 Rojas', 'Menos de 1.5 Rojas']
  },
  {
    id: 'first_card',
    label: 'Primera Tarjeta',
    description: '¿Qué equipo recibirá la primera tarjeta?',
    type: 'prediction',
    options: ['Equipo Local', 'Equipo Visitante', 'Sin Tarjetas']
  },
  {
    id: 'penalty_awarded',
    label: 'Penalti en el Partido',
    description: '¿Se pitará algún penalti?',
    type: 'prediction',
    options: ['Sí', 'No']
  },
  {
    id: 'own_goal',
    label: 'Gol en Propia Meta',
    description: '¿Habrá algún autogol?',
    type: 'prediction',
    options: ['Sí', 'No']
  },
  {
    id: 'goals_odd_even',
    label: 'Goles Par/Impar',
    description: '¿El total de goles será par o impar?',
    type: 'prediction',
    options: ['Par', 'Impar']
  }
];

const basketballBetOptions: BetOption[] = [
  {
    id: 'match_result',
    label: 'Ganador del Partido',
    description: '¿Quién ganará el partido?',
    type: 'prediction',
    options: ['Equipo Local', 'Equipo Visitante']
  },
  {
    id: 'total_points',
    label: 'Puntos Totales',
    description: '¿Cuántos puntos se anotarán en total?',
    type: 'number'
  },
  {
    id: 'point_difference',
    label: 'Diferencia de Puntos',
    description: '¿Por cuántos puntos ganará?',
    type: 'number'
  }
];

export default function CreateBetFromSports() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [betConfig, setBetConfig] = useState<BetConfig | null>(null);
  const [selectedBetOption, setSelectedBetOption] = useState<string>('');
  const [selectedPrediction, setSelectedPrediction] = useState<string>('');
  const [numberValue, setNumberValue] = useState<string>('');
  const [betAmount, setBetAmount] = useState<string>('50');
  const [maxParticipants, setMaxParticipants] = useState<string>('20');
  const [endDateTime, setEndDateTime] = useState<string>('');

  useEffect(() => {
    // Obtener datos del partido desde la URL
    const matchId = searchParams.get('matchId');
    const matchTitle = searchParams.get('matchTitle');
    const teams = searchParams.get('teams');
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const league = searchParams.get('league');
    const sport = searchParams.get('sport');

    if (matchId && matchTitle && teams && date && time && league && sport) {
      const [home, away] = teams.split(' vs ');
      setMatchData({
        id: matchId,
        title: matchTitle,
        teams: { home, away },
        date,
        time,
        league,
        sport
      });

      // Establecer fecha límite por defecto (1 hora antes del partido)
      const matchDateTime = new Date(`${date} ${time}`);
      matchDateTime.setHours(matchDateTime.getHours() - 1);
      setEndDateTime(matchDateTime.toISOString().slice(0, 16));
    }

    // Obtener configuración completa de apuesta guardada
    const savedCompleteBetConfig = localStorage.getItem('completeBetConfig');
    if (savedCompleteBetConfig) {
      try {
        const config: any = JSON.parse(savedCompleteBetConfig);
        // Verificar que no sea muy antigua (24 horas)
        if (Date.now() - config.timestamp < 24 * 60 * 60 * 1000) {
          setBetConfig({
            id: config.id,
            title: config.title,
            description: config.description,
            icon: config.icon,
            betType: config.betType,
            resolutionMode: config.resolutionMode,
            timestamp: config.timestamp
          });
          
          // Usar la configuración completa guardada
          setBetAmount(config.betAmount || '50');
          setMaxParticipants(config.maxParticipants || '20');
          if (config.endDateTime) {
            setEndDateTime(config.endDateTime);
          }
        } else {
          // Eliminar configuración antigua
          localStorage.removeItem('completeBetConfig');
        }
      } catch (error) {
        console.error('Error parsing complete bet config:', error);
        localStorage.removeItem('completeBetConfig');
      }
    } else {
      // Fallback: intentar obtener configuración básica
      const savedBetConfig = localStorage.getItem('selectedBetConfig');
      if (savedBetConfig) {
        try {
          const config: BetConfig = JSON.parse(savedBetConfig);
          // Verificar que no sea muy antigua (24 horas)
          if (Date.now() - config.timestamp < 24 * 60 * 60 * 1000) {
            setBetConfig(config);
            
            // Configurar valores por defecto basados en el tipo de apuesta
            if (config.id === 'battle-royal') {
              setMaxParticipants('20');
              setBetAmount('50');
            } else if (config.id === 'pool-grupal') {
              setMaxParticipants('15');
              setBetAmount('25');
            } else if (config.id === 'desafio-1v1') {
              setMaxParticipants('2');
              setBetAmount('100');
            } else if (config.id === 'liga-por-puntos') {
              setMaxParticipants('50');
              setBetAmount('25');
            }
          } else {
            // Eliminar configuración antigua
            localStorage.removeItem('selectedBetConfig');
          }
        } catch (error) {
          console.error('Error parsing bet config:', error);
          localStorage.removeItem('selectedBetConfig');
        }
      }
    }
  }, [searchParams]);

  const getBetOptionsForSport = (sport: string): BetOption[] => {
    switch (sport.toLowerCase()) {
      case 'fútbol':
        return footballBetOptions;
      case 'baloncesto':
        return basketballBetOptions;
      default:
        return footballBetOptions; // Fallback
    }
  };

  const getCurrentBetOption = (): BetOption | null => {
    if (!matchData || !selectedBetOption) return null;
    const options = getBetOptionsForSport(matchData.sport);
    return options.find(option => option.id === selectedBetOption) || null;
  };

  const handleCreateBet = () => {
    if (!matchData || !selectedBetOption) return;

    const betData = {
      matchId: matchData.id,
      title: `${matchData.title} - ${getCurrentBetOption()?.label}`,
      sport: matchData.sport,
      league: matchData.league,
      teams: matchData.teams,
      betOption: selectedBetOption,
      prediction: selectedPrediction,
      numberValue: numberValue,
      betAmount: betAmount,
      maxParticipants: parseInt(maxParticipants),
      endDateTime: endDateTime
    };

    console.log('Crear apuesta:', betData);
    
    // Aquí iría la lógica para crear la apuesta
    // Por ahora, redirigimos de vuelta a deportes
    router.push('/sports');
  };

  if (!matchData) {
    return (
      <div className="min-h-screen bg-[#1a1d29] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Cargando información del partido...</p>
        </div>
      </div>
    );
  }

  if (!betConfig) {
    return (
      <div className="min-h-screen bg-[#1a1d29] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold mb-4">Configuración no encontrada</h2>
          <p className="text-gray-400 mb-6">No se encontró una configuración de apuesta seleccionada.</p>
          <Link href="/">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              Volver a Inicio
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const currentBetOption = getCurrentBetOption();
  const betOptions = getBetOptionsForSport(matchData.sport);

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white">
      {/* Header */}
      <div className="bg-[#1a1d29] border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-xl">Crear Reto: {betConfig?.title}</h1>
            <p className="text-sm text-gray-400">Configura tu apuesta para este partido</p>
          </div>
          <Link href="/sports">
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
              ← Volver
            </button>
          </Link>
        </div>
      </div>

      <div className="flex gap-6 p-6">
        {/* Panel Izquierdo - Resumen de Configuración */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600 sticky top-6">
            <h3 className="text-lg font-semibold text-white mb-4">📋 Resumen de tu Apuesta</h3>
            
            {/* Tipo de apuesta */}
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Tipo de Reto</div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">{betConfig?.icon}</span>
                <span className="text-white font-medium">{betConfig?.title}</span>
              </div>
            </div>

            {/* Información del partido */}
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Partido</div>
              <div className="text-white font-medium">{matchData?.title}</div>
              <div className="text-sm text-gray-400">{matchData?.date} - {matchData?.time}</div>
            </div>

            {/* Predicción seleccionada */}
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Tu Predicción</div>
              <div className="text-white">
                {currentBetOption ? (
                  <>
                    <div className="font-medium">{currentBetOption.label}</div>
                    <div className="text-sm text-gray-300">
                      {selectedPrediction || numberValue || 'Sin seleccionar'}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500">Selecciona un tipo de predicción</div>
                )}
              </div>
            </div>

            {/* Configuración de apuesta */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Apuesta:</span>
                <span className="text-white font-medium">${betAmount} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Participantes:</span>
                <span className="text-white">Máximo {maxParticipants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Cierre:</span>
                <span className="text-white text-sm">
                  {endDateTime ? new Date(endDateTime).toLocaleDateString() : 'Sin definir'}
                </span>
              </div>
            </div>

            {/* Estado de validación */}
            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="flex items-center">
                {selectedBetOption && (selectedPrediction || numberValue) ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-green-400 text-sm">Listo para crear</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-yellow-400 text-sm">Configuración incompleta</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Panel Central - Configuración Principal */}
        <div className="flex-1 max-w-4xl">
        {/* Configuración de apuesta seleccionada */}
        <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600 mb-6">
          <div className="flex items-center mb-4">
            <div className="text-4xl mr-4">{betConfig.icon}</div>
            <div>
              <h2 className="text-xl font-semibold text-white">{betConfig.title}</h2>
              <p className="text-gray-400">{betConfig.description}</p>
            </div>
            <div className="ml-auto bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
              Configuración Activa
            </div>
          </div>
        </div>

        {/* Información del partido */}
        <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">{matchData.title}</h2>
              <p className="text-gray-400">{matchData.league} • {matchData.sport}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Fecha del partido</div>
              <div className="text-lg font-medium text-white">{matchData.date} - {matchData.time}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-lg font-semibold text-white">{matchData.teams.home}</div>
              <div className="text-sm text-gray-400">Local</div>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-400">VS</span>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-lg font-semibold text-white">{matchData.teams.away}</div>
              <div className="text-sm text-gray-400">Visitante</div>
            </div>
          </div>
        </div>

        {/* Configuración de la apuesta */}
        <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
          <h3 className="text-xl font-semibold text-white mb-6">Configurar Apuesta</h3>
          
          {/* Selección de tipo de apuesta */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Tipo de Predicción *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {betOptions.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedBetOption === option.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => {
                    setSelectedBetOption(option.id);
                    setSelectedPrediction('');
                    setNumberValue('');
                  }}
                >
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      checked={selectedBetOption === option.id}
                      onChange={() => {}}
                      className="mr-2"
                    />
                    <span className="text-white font-medium">{option.label}</span>
                  </div>
                  <p className="text-sm text-gray-400">{option.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Configuración específica según el tipo de apuesta */}
          {currentBetOption && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Tu Predicción *
              </label>
              
              {currentBetOption.type === 'prediction' && currentBetOption.options && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentBetOption.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedPrediction(option)}
                      className={`p-3 rounded-lg border transition-colors ${
                        selectedPrediction === option
                          ? 'border-green-500 bg-green-500/10 text-green-400'
                          : 'border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {currentBetOption.type === 'number' && (
                <input
                  type="number"
                  value={numberValue}
                  onChange={(e) => setNumberValue(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder={`Ingresa tu predicción numérica`}
                  min="0"
                />
              )}

              {currentBetOption.type === 'boolean' && currentBetOption.options && (
                <div className="grid grid-cols-2 gap-3">
                  {currentBetOption.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedPrediction(option)}
                      className={`p-3 rounded-lg border transition-colors ${
                        selectedPrediction === option
                          ? 'border-green-500 bg-green-500/10 text-green-400'
                          : 'border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Configuración de apuesta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Apuesta (USDC) *
              </label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Máx. Participantes *
              </label>
              <input
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                min="2"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cierre de Apuesta *
              </label>
              <input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-medium text-white mb-3">Resumen de tu Apuesta</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Partido:</span>
                <span className="text-white">{matchData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Predicción:</span>
                <span className="text-white">
                  {currentBetOption?.label} - {selectedPrediction || numberValue || 'Sin seleccionar'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Apuesta:</span>
                <span className="text-white">${betAmount} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Participantes:</span>
                <span className="text-white">Máximo {maxParticipants}</span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-4">
            <Link href="/sports" className="flex-1">
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                Cancelar
              </button>
            </Link>
            <button
              onClick={handleCreateBet}
              disabled={!selectedBetOption || (!selectedPrediction && !numberValue)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Crear Apuesta
            </button>
          </div>
        </div>
        </div>

        {/* Panel Derecho - Apuestas del Evento */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600 sticky top-6">
            <h3 className="text-lg font-semibold text-white mb-4">🎯 Apuestas en este Evento</h3>
            
            {/* Lista de apuestas existentes */}
            <div className="space-y-3">
              {/* Apuesta ejemplo 1 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Battle Royal</span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Activa</span>
                </div>
                <div className="text-xs text-gray-400">Resultado del Partido (1X2)</div>
                <div className="text-sm text-white">Victoria Local</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">12/20 participantes</span>
                  <span className="text-xs text-yellow-400">$50 USDC</span>
                </div>
              </div>

              {/* Apuesta ejemplo 2 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Pool Grupal</span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Llenándose</span>
                </div>
                <div className="text-xs text-gray-400">Total de Goles (Más/Menos)</div>
                <div className="text-sm text-white">Más de 2.5</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">8/15 participantes</span>
                  <span className="text-xs text-yellow-400">$25 USDC</span>
                </div>
              </div>

              {/* Apuesta ejemplo 3 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Desafío 1v1</span>
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Cerrada</span>
                </div>
                <div className="text-xs text-gray-400">Ambos Equipos Anotan</div>
                <div className="text-sm text-white">Sí</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">2/2 participantes</span>
                  <span className="text-xs text-yellow-400">$100 USDC</span>
                </div>
              </div>

              {/* Apuesta ejemplo 4 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Pool Grupal</span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Activa</span>
                </div>
                <div className="text-xs text-gray-400">Total de Córners</div>
                <div className="text-sm text-white">Más de 6.5</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">5/15 participantes</span>
                  <span className="text-xs text-yellow-400">$25 USDC</span>
                </div>
              </div>
            </div>

            {/* Estadísticas del evento */}
            <div className="mt-6 pt-4 border-t border-gray-600">
              <div className="text-sm text-gray-400 mb-2">Estadísticas del Evento</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total apuestas:</span>
                  <span className="text-white">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Participantes:</span>
                  <span className="text-white">27</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Volumen total:</span>
                  <span className="text-yellow-400">$1,250 USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Más popular:</span>
                  <span className="text-white">Resultado 1X2</span>
                </div>
              </div>
            </div>

            {/* Botón ver todas */}
            <button className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
              Ver Todas las Apuestas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}