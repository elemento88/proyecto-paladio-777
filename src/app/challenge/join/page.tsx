'use client'

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BackButton from '@/components/BackButton';
import { BetType, ResolutionMode } from '@/types/betting';
import { getResolutionModeInfo, getResolutionModeTheme } from '@/utils/resolutionModes';

export default function JoinChallengePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('id') || 'challenge_001';

  // Estados del formulario para predicciones múltiples
  const [predictions, setPredictions] = useState({
    total_goals: '',
    corners_total: '',
    yellow_cards: '',
    first_goal_min: ''
  });
  const [betAmount, setBetAmount] = useState<string>('150');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Datos del challenge (normalmente vendría de API)
  const challenge = {
    id: challengeId,
    title: 'Real Madrid vs Barcelona - Multi-Apuesta',
    matchDetails: {
      teams: 'Real Madrid vs Barcelona',
      date: 'sáb, 23 ago',
      time: '21:00',
      league: 'La Liga',
      venue: 'Santiago Bernabéu'
    },
    betType: BetType.MULTI,
    resolutionMode: ResolutionMode.CLOSEST,
    betting: {
      fixedStake: 150,
      totalPool: '2,250 USDC',
      participants: '15/25',
      timeLeft: '1 día 8 horas'
    },
    betQuestion: 'Predicciones múltiples del Clásico',
    betOptions: [
      { id: 'total_goals', label: 'Total de Goles', type: 'numeric', range: '0-8', placeholder: 'ej. 3' },
      { id: 'corners_total', label: 'Total de Corners', type: 'numeric', range: '4-20', placeholder: 'ej. 12' },
      { id: 'yellow_cards', label: 'Tarjetas Amarillas', type: 'numeric', range: '0-12', placeholder: 'ej. 6' },
      { id: 'first_goal_min', label: 'Minuto Primer Gol', type: 'numeric', range: '1-90', placeholder: 'ej. 23' }
    ]
  };

  const resolutionInfo = getResolutionModeInfo(challenge.resolutionMode);
  const resolutionTheme = getResolutionModeTheme(challenge.resolutionMode);

  const handleJoinChallenge = async () => {
    // Validar que todas las predicciones estén completas
    const requiredFields = ['total_goals', 'corners_total', 'yellow_cards', 'first_goal_min'];
    const missingFields = requiredFields.filter(field => !predictions[field as keyof typeof predictions]);
    
    if (missingFields.length > 0) {
      alert('Por favor completa todas las predicciones para poder participar');
      return;
    }

    // Validar rangos
    const validationErrors = [];
    if (parseInt(predictions.total_goals) < 0 || parseInt(predictions.total_goals) > 8) {
      validationErrors.push('Total de goles debe estar entre 0 y 8');
    }
    if (parseInt(predictions.corners_total) < 4 || parseInt(predictions.corners_total) > 20) {
      validationErrors.push('Total de corners debe estar entre 4 y 20');
    }
    if (parseInt(predictions.yellow_cards) < 0 || parseInt(predictions.yellow_cards) > 12) {
      validationErrors.push('Tarjetas amarillas debe estar entre 0 y 12');
    }
    if (parseInt(predictions.first_goal_min) < 1 || parseInt(predictions.first_goal_min) > 90) {
      validationErrors.push('Minuto del primer gol debe estar entre 1 y 90');
    }

    if (validationErrors.length > 0) {
      alert('Errores de validación:\n' + validationErrors.join('\n'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la lógica real de unión al reto
      console.log('Joining challenge:', {
        challengeId,
        predictions,
        betAmount,
        userAddress: '0x123...abc'
      });

      // Redirigir a página de confirmación o back al challenge con las predicciones
      const predictionParams = new URLSearchParams({
        goals: predictions.total_goals,
        corners: predictions.corners_total,
        cards: predictions.yellow_cards,
        firstGoal: predictions.first_goal_min
      }).toString();
      
      router.push(`/challenge?id=${challengeId}&joined=true&${predictionParams}`);
      
    } catch (error) {
      console.error('Error joining challenge:', error);
      alert('Error al unirse al reto. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular ganancia potencial (ganador se lleva todo el pool menos fee)
  const totalPool = parseInt(challenge.betting.totalPool.replace(/[^0-9]/g, ''));
  const potentialWinnings = totalPool * 0.96; // 96% para el ganador, 4% fee

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <BackButton fallbackUrl={`/challenge?id=${challengeId}`} />
        </div>

        {/* Información del partido */}
        <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white text-xl mr-4">
              ⚽
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">{challenge.title}</h1>
              <div className="flex items-center mt-1 gap-2">
                <span className="bg-purple-600/20 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-500/30">
                  Apuesta Múltiple
                </span>
                <span className={`${resolutionTheme.badge} ${resolutionTheme.text} text-xs px-2 py-1 rounded-full border ${resolutionTheme.border}/30 flex items-center`}>
                  <span className="mr-1">{resolutionInfo.icon}</span>
                  {resolutionInfo.name}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Fecha y hora</div>
              <div className="text-white">{challenge.matchDetails.date} {challenge.matchDetails.time}</div>
            </div>
            <div>
              <div className="text-gray-400">Liga</div>
              <div className="text-white">{challenge.matchDetails.league}</div>
            </div>
            <div>
              <div className="text-gray-400">Venue</div>
              <div className="text-white">{challenge.matchDetails.venue}</div>
            </div>
            <div>
              <div className="text-gray-400">Participantes</div>
              <div className="text-white">{challenge.betting.participants}</div>
            </div>
          </div>
        </div>

        {/* Formulario de predicciones múltiples */}
        <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{challenge.betQuestion}</h2>
          <div className="text-gray-400 text-sm mb-6">
            Completa las 4 predicciones para participar en el reto. Gana quien tenga menor diferencia total.
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {challenge.betOptions.map((option, index) => {
              const colors = [
                { bg: 'from-blue-900/20 to-blue-800/10', text: 'text-blue-400', border: 'border-blue-600/30', icon: '⚽' },
                { bg: 'from-green-900/20 to-green-800/10', text: 'text-green-400', border: 'border-green-600/30', icon: '🚩' },
                { bg: 'from-yellow-900/20 to-yellow-800/10', text: 'text-yellow-400', border: 'border-yellow-600/30', icon: '🟨' },
                { bg: 'from-purple-900/20 to-purple-800/10', text: 'text-purple-400', border: 'border-purple-600/30', icon: '⏱️' }
              ];
              const color = colors[index];
              
              return (
                <div key={option.id} className={`bg-gradient-to-br ${color.bg} border ${color.border} rounded-xl p-4 hover:scale-105 transition-all`}>
                  {/* Header con icono */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-[#2a2d47] rounded-xl flex items-center justify-center text-xl ${color.text}`}>
                      {color.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Rango</div>
                      <span className={`text-xs px-2 py-1 rounded-full bg-gray-600/20 ${color.text}`}>
                        {option.range}
                      </span>
                    </div>
                  </div>

                  {/* Contenido principal */}
                  <div className="mb-4">
                    <h3 className="text-white font-semibold mb-2">{option.label}</h3>
                    <div className={`w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-center min-h-[60px] flex items-center justify-center ${
                      predictions[option.id as keyof typeof predictions] ? 'border-green-500' : ''
                    }`}>
                      {predictions[option.id as keyof typeof predictions] ? (
                        <span className={`text-2xl font-bold ${color.text}`}>
                          {predictions[option.id as keyof typeof predictions]}{option.id === 'first_goal_min' ? "'" : ''}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Selecciona una opción</span>
                      )}
                    </div>
                  </div>

                  {/* Mini recuadros de opciones */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-1">
                      {(() => {
                        let options = [];
                        if (option.id === 'total_goals') {
                          options = ['0', '1', '2', '3', '4', '5+'];
                        } else if (option.id === 'corners_total') {
                          options = ['4-6', '7-9', '10-12', '13-15', '16-18', '19+'];
                        } else if (option.id === 'yellow_cards') {
                          options = ['0-1', '2-3', '4-5', '6-7', '8-9', '10+'];
                        } else if (option.id === 'first_goal_min') {
                          options = ['1-15', '16-30', '31-45', '46-60', '61-75', '76-90'];
                        }
                        
                        return options.map((optValue, idx) => {
                          const isSelected = (() => {
                            const currentValue = predictions[option.id as keyof typeof predictions];
                            if (!currentValue) return false;
                            
                            if (option.id === 'total_goals') {
                              if (optValue === '5+') return parseInt(currentValue) >= 5;
                              return currentValue === optValue;
                            } else if (option.id === 'corners_total') {
                              if (optValue === '19+') return parseInt(currentValue) >= 19;
                              const [min, max] = optValue.split('-').map(Number);
                              return parseInt(currentValue) >= min && parseInt(currentValue) <= max;
                            } else if (option.id === 'yellow_cards') {
                              if (optValue === '10+') return parseInt(currentValue) >= 10;
                              const [min, max] = optValue.split('-').map(Number);
                              return parseInt(currentValue) >= min && parseInt(currentValue) <= max;
                            } else if (option.id === 'first_goal_min') {
                              const [min, max] = optValue.split('-').map(Number);
                              return parseInt(currentValue) >= min && parseInt(currentValue) <= max;
                            }
                            return false;
                          })();
                          
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                let value = '';
                                if (option.id === 'total_goals') {
                                  value = optValue === '5+' ? '5' : optValue;
                                } else if (option.id === 'corners_total') {
                                  if (optValue === '19+') value = '19';
                                  else value = optValue.split('-')[0]; // Toma el valor mínimo del rango
                                } else if (option.id === 'yellow_cards') {
                                  if (optValue === '10+') value = '10';
                                  else value = optValue.split('-')[0];
                                } else if (option.id === 'first_goal_min') {
                                  value = optValue.split('-')[0];
                                }
                                
                                setPredictions(prev => ({
                                  ...prev,
                                  [option.id]: value
                                }));
                              }}
                              className={`text-xs p-2 rounded-lg border transition-all hover:scale-105 ${
                                isSelected
                                  ? `${color.bg.replace('/20', '/30')} ${color.border} ${color.text} font-bold`
                                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                              }`}
                            >
                              {optValue}
                            </button>
                          );
                        });
                      })()}
                    </div>
                    
                    {/* Input manual como alternativa */}
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-xs">O ingresa manual:</span>
                      <input
                        type="number"
                        value={predictions[option.id as keyof typeof predictions]}
                        onChange={(e) => setPredictions(prev => ({
                          ...prev,
                          [option.id]: e.target.value
                        }))}
                        placeholder="..."
                        className="flex-1 bg-[#1a1d29] border border-gray-700 rounded px-2 py-1 text-white text-xs text-center focus:outline-none focus:border-blue-500"
                        min={option.range.split('-')[0]}
                        max={option.range.split('-')[1]}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumen de predicciones */}
          <div className="mt-6 p-6 bg-gradient-to-r from-gray-900/40 to-gray-800/20 border border-gray-600 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold flex items-center">
                <span className="mr-2">🎯</span>
                Resumen de tu Predicción
              </h4>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                Object.values(predictions).every(v => v) 
                  ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                  : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
              }`}>
                {Object.values(predictions).filter(v => v).length}/4 completado
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="text-blue-400 font-bold text-2xl">{predictions.total_goals || '?'}</div>
                <div className="text-gray-400 text-xs mt-1">Goles Total</div>
              </div>
              <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="text-green-400 font-bold text-2xl">{predictions.corners_total || '?'}</div>
                <div className="text-gray-400 text-xs mt-1">Corners</div>
              </div>
              <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="text-yellow-400 font-bold text-2xl">{predictions.yellow_cards || '?'}</div>
                <div className="text-gray-400 text-xs mt-1">Tarjetas</div>
              </div>
              <div className="text-center p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="text-purple-400 font-bold text-2xl">{predictions.first_goal_min ? `${predictions.first_goal_min}'` : '?'}</div>
                <div className="text-gray-400 text-xs mt-1">Primer Gol</div>
              </div>
            </div>
          </div>
        </div>

        {/* Información de la apuesta */}
        <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tu Apuesta</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Monto a Apostar</label>
              <div className="relative">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white"
                  readOnly
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  USDC
                </span>
              </div>
              <div className="text-yellow-400 text-sm mt-1">
                * Monto fijo establecido por el creador del reto
              </div>
            </div>

            <div className="bg-[#1a1d29] rounded-lg p-4 border border-gray-700">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tipo de reto:</span>
                  <span className="text-white">Predicción múltiple</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Modo de resolución:</span>
                  <span className="text-blue-400">Más Cercano</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pool total:</span>
                  <span className="text-green-400 font-bold">{challenge.betting.totalPool}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ganancia si ganas:</span>
                  <span className="text-green-400 font-bold">{potentialWinnings.toFixed(0)} USDC</span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-2">
                  <span className="text-gray-400">Ganancia neta:</span>
                  <span className="text-green-400 font-bold">+{(potentialWinnings - parseFloat(betAmount)).toFixed(0)} USDC</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información del modo de resolución */}
        <div className="bg-[#2a2d47] rounded-xl p-4 border border-gray-600 mb-6">
          <div className={`${resolutionTheme.bg} border ${resolutionTheme.border}/20 rounded-lg p-4`}>
            <div className="flex items-center mb-2">
              <span className="mr-2 text-lg">{resolutionInfo.icon}</span>
              <span className={`${resolutionTheme.text} font-medium text-sm`}>
                MODO: {resolutionInfo.name.toUpperCase()}
              </span>
            </div>
            <p className="text-white text-sm">{resolutionInfo.description}</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-4">
          <button
            onClick={handleJoinChallenge}
            disabled={!predictions.total_goals || !predictions.corners_total || !predictions.yellow_cards || !predictions.first_goal_min || isSubmitting}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-colors ${
              !predictions.total_goals || !predictions.corners_total || !predictions.yellow_cards || !predictions.first_goal_min || isSubmitting
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Procesando...
              </>
            ) : (
              <>
                🎯 Unirse al Reto
                <span className="ml-2">→</span>
              </>
            )}
          </button>
          
          <div className="text-center">
            <div className="text-xs text-gray-500">
              Al unirte, aceptas las reglas del reto y autorizas el débito de {betAmount} USDC
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}