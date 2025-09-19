'use client'

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BetType, ResolutionMode } from '@/types/betting';
import { getResolutionModeInfo, getResolutionModeTheme } from '@/utils/resolutionModes';
import NavigationButtons from '@/components/NavigationButtons';

interface ChallengeDetailProps {
  id?: string;
}

export default function ChallengePage({ id }: ChallengeDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('id') || 'challenge_001';
  const hasJoined = searchParams.get('joined') === 'true';
  
  const [progress] = useState(7);
  const [maxProgress] = useState(10);
  
  const challenge = {
    id: 'challenge_001',
    title: 'Real Madrid vs Barcelona - Multi-Apuesta',
    subtitle: 'Apuesta Compleja',
    status: 'ACTIVE',
    betType: BetType.MULTI,
    resolutionMode: ResolutionMode.CLOSEST,
    matchDetails: {
      teams: 'Real Madrid vs Barcelona',
      date: 'sáb, 23 ago',
      time: '21:00',
      league: 'La Liga',
      venue: 'Santiago Bernabéu'
    },
    betting: {
      totalPool: hasJoined ? '2,400 USDC' : '2,250 USDC', // Pool actualizado si el usuario se unió
      progress: hasJoined ? '16/25' : '15/25', // Contador actualizado
      timeLeft: '1 día 8 horas',
      fixedStake: 150 // Monto fijo que configuró el creador
    },
    creator: {
      username: 'ProFootballBets',
      address: '0x8f2a...3d7b',
      reputation: 98
    },
    createdAt: '2024-08-20T14:30:00Z',
    deadline: '2024-08-23T20:45:00Z',
    betQuestion: 'Predicciones múltiples del Clásico',
    betOptions: [
      { id: 'total_goals', label: 'Total de Goles', participants: 15, type: 'numeric', range: '0-8' },
      { id: 'corners_total', label: 'Total de Corners', participants: 15, type: 'numeric', range: '4-20' },
      { id: 'yellow_cards', label: 'Tarjetas Amarillas', participants: 15, type: 'numeric', range: '0-12' },
      { id: 'first_goal_min', label: 'Minuto Primer Gol', participants: 15, type: 'numeric', range: '1-90' }
    ],
    datasource: 'API-Sports (RapidAPI)',
    networkFee: 4,
    isPublic: true,
    rules: [
      'Se consideran 4 predicciones por participante: Total de Goles, Total de Corners, Tarjetas Amarillas y Minuto del Primer Gol',
      'Solo se considera el tiempo regular de juego (90 minutos + descuento)',
      'La resolución se basa en el modo "MÁS CERCANO" - gana quien tenga la menor diferencia total entre todas las predicciones',
      'Si hay empate en la diferencia total, se considera el timestamp de participación (primero en llegar gana)',
      'Los corners se cuentan para ambos equipos durante todo el partido',
      'Las tarjetas amarillas incluyen ambos equipos, no se cuentan las rojas como amarillas dobles',
      'El minuto del primer gol se redondea al minuto exacto mostrado en pantalla',
      'Los pagos se procesarán automáticamente dentro de 2 horas posterior al resultado oficial',
      'En caso de suspensión del partido, todas las apuestas serán reembolsadas',
      'Cada participante debe hacer las 4 predicciones para poder participar',
      'Los fondos quedan bloqueados en el contrato hasta la resolución final'
    ]
  };

  // Datos de participantes con sus predicciones múltiples
  const baseParticipants = [
    {
      id: 1,
      username: 'AlexBet77',
      avatar: 'A',
      address: '0x8a7b...4c9f',
      bet: {
        amount: 150,
        potential: 450,
        predictions: {
          total_goals: 3,
          corners_total: 12,
          yellow_cards: 6,
          first_goal_min: 23
        }
      },
      joinedTime: '12 min',
      txHash: '0xabc123...def789'
    },
    {
      id: 2,
      username: 'MariaF_Sports',
      avatar: 'M',
      address: '0x3f2a...8b1d',
      bet: {
        amount: 150,
        potential: 450,
        predictions: {
          total_goals: 2,
          corners_total: 9,
          yellow_cards: 5,
          first_goal_min: 34
        }
      },
      joinedTime: '1 hora',
      txHash: '0x456def...abc123'
    },
    {
      id: 3,
      username: 'JorgeBet',
      avatar: 'J',
      address: '0x9c8f...2e5a',
      bet: {
        amount: 150,
        potential: 450,
        predictions: {
          total_goals: 4,
          corners_total: 14,
          yellow_cards: 7,
          first_goal_min: 18
        }
      },
      joinedTime: '2 horas',
      txHash: '0x789abc...456def'
    },
    {
      id: 4,
      username: 'SofiaWins',
      avatar: 'S',
      address: '0x1d7e...6f3c',
      bet: {
        amount: 150,
        potential: 450,
        predictions: {
          total_goals: 1,
          corners_total: 8,
          yellow_cards: 4,
          first_goal_min: 67
        }
      },
      joinedTime: '3 horas',
      txHash: '0xdef456...789abc'
    },
    {
      id: 5,
      username: 'CarlosM88',
      avatar: 'C',
      address: '0x5b9a...4e2f',
      bet: {
        amount: 150,
        potential: 450,
        predictions: {
          total_goals: 3,
          corners_total: 11,
          yellow_cards: 8,
          first_goal_min: 15
        }
      },
      joinedTime: '4 horas',
      txHash: '0x123abc...def456'
    },
    {
      id: 6,
      username: 'Diego_Pro',
      avatar: 'D',
      address: '0x7a3c...9f2e',
      bet: {
        amount: 150,
        potential: 450,
        predictions: {
          total_goals: 5,
          corners_total: 16,
          yellow_cards: 9,
          first_goal_min: 28
        }
      },
      joinedTime: '5 horas',
      txHash: '0xfed321...abc987'
    },
    {
      id: 7,
      username: 'LuciaBets',
      avatar: 'L',
      address: '0x4d8b...1c7a',
      bet: {
        amount: 150,
        potential: 450,
        predictions: {
          total_goals: 2,
          corners_total: 10,
          yellow_cards: 3,
          first_goal_min: 41
        }
      },
      joinedTime: '6 horas',
      txHash: '0x987fed...321cba'
    },
    {
      id: 8,
      username: 'RaulSports',
      avatar: 'R',
      address: '0x6f1e...8d4b',
      bet: {
        amount: 150,
        potential: 450,
        predictions: {
          total_goals: 3,
          corners_total: 13,
          yellow_cards: 6,
          first_goal_min: 12
        }
      },
      joinedTime: '8 horas',
      txHash: '0xcba987...fed321'
    },
    {
      id: 9,
      username: 'AnaPredict',
      avatar: 'A',
      address: '0x2b5f...7e9c',
      bet: {
        amount: 150,
        potential: 450,
        predictions: {
          total_goals: 4,
          corners_total: 15,
          yellow_cards: 5,
          first_goal_min: 37
        }
      },
      joinedTime: '10 horas',
      txHash: '0x321fed...987cba'
    },
    {
      id: 10,
      username: 'PedroWager',
      avatar: 'P',
      address: '0x9e4c...3a1f',
      bet: {
        amount: 150,
        potential: 450,
        predictions: {
          total_goals: 1,
          corners_total: 7,
          yellow_cards: 2,
          first_goal_min: 89
        }
      },
      joinedTime: '12 horas',
      txHash: '0xa1b2c3...d4e5f6'
    },
    {
      id: 11,
      username: 'IsaBet_Pro',
      avatar: 'I',
      address: '0x8c7a...6d2b',
      bet: {
        amount: 150,
        potential: 450,
        predictions: {
          total_goals: 6,
          corners_total: 18,
          yellow_cards: 10,
          first_goal_min: 8
        }
      },
      joinedTime: '14 horas',
      txHash: '0xf6e5d4...c3b2a1'
    },
    {
      id: 12,
      username: 'MiguelPunter',
      avatar: 'M',
      address: '0x5a9d...4f8e',
      bet: {
        amount: 150,
        potential: 450,
        predictions: {
          total_goals: 2,
          corners_total: 9,
          yellow_cards: 4,
          first_goal_min: 52
        }
      },
      joinedTime: '16 horas',
      txHash: '0x1a2b3c...4d5e6f'
    },
    {
      id: 13,
      username: 'CarmenGamer',
      avatar: 'C',
      address: '0x3f7b...2e8a',
      bet: {
        amount: 150,
        potential: 450,
        predictions: {
          total_goals: 3,
          corners_total: 12,
          yellow_cards: 7,
          first_goal_min: 29
        }
      },
      joinedTime: '18 horas',
      txHash: '0x6f5e4d...3c2b1a'
    },
    {
      id: 14,
      username: 'JavierSharp',
      avatar: 'J',
      address: '0x1c8e...9a5d',
      bet: {
        amount: 150,
        potential: 450,
        predictions: {
          total_goals: 4,
          corners_total: 11,
          yellow_cards: 6,
          first_goal_min: 45
        }
      },
      joinedTime: '20 horas',
      txHash: '0x9d8c7b...6a5f4e'
    },
    {
      id: 15,
      username: 'VictorBets',
      avatar: 'V',
      address: '0x7e2d...4c9b',
      bet: {
        amount: 150,
        potential: 450,
        predictions: {
          total_goals: 5,
          corners_total: 14,
          yellow_cards: 8,
          first_goal_min: 21
        }
      },
      joinedTime: '22 horas',
      txHash: '0x4e3d2c...1b9a8f'
    }
  ];

  // Crear participación del usuario actual si se unió al reto
  const currentUserParticipation = hasJoined ? {
    id: 0, // ID especial para el usuario actual
    username: 'Tu_Prediccion',
    avatar: '👤',
    address: '0x1234...5678',
    bet: {
      amount: 150,
      potential: 450,
      predictions: {
        // Leer las predicciones desde los parámetros URL
        total_goals: parseInt(searchParams.get('goals') || '3'),
        corners_total: parseInt(searchParams.get('corners') || '11'),
        yellow_cards: parseInt(searchParams.get('cards') || '6'),
        first_goal_min: parseInt(searchParams.get('firstGoal') || '25')
      }
    },
    joinedTime: 'hace unos segundos',
    txHash: '0xnew123...456def',
    isCurrentUser: true // Flag para identificar al usuario actual
  } : null;

  // Combinar participantes poniendo al usuario actual primero
  const participants = currentUserParticipation 
    ? [currentUserParticipation, ...baseParticipants]
    : baseParticipants;

  // Obtener información del modo de resolución
  const resolutionInfo = getResolutionModeInfo(challenge.resolutionMode);
  const resolutionTheme = getResolutionModeTheme(challenge.resolutionMode);

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white p-6">
      <NavigationButtons />
      <div className="max-w-2xl mx-auto">
        {/* Header con botón de regreso */}
        <div className="mb-6">
          
          {/* Mensaje de confirmación si recién se unió */}
          {hasJoined && (
            <div className="mt-4 bg-gradient-to-r from-green-900/20 to-green-800/10 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 text-xl mr-4">
                  ✅
                </div>
                <div>
                  <h3 className="text-green-400 font-semibold">¡Te has unido al reto exitosamente!</h3>
                  <p className="text-gray-300 text-sm">Tu predicción aparece destacada en la lista de participantes</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tarjeta principal del challenge */}
        <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600 mb-6">
          {/* Encabezado del challenge */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white text-xl mr-4">
                🎯
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">{challenge.title}</h1>
                <div className="flex items-center mt-1 gap-2">
                  <span className="bg-blue-600/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                    {challenge.subtitle}
                  </span>
                  <span className={`${resolutionTheme.badge} ${resolutionTheme.text} text-xs px-2 py-1 rounded-full border ${resolutionTheme.border}/30 flex items-center`}>
                    <span className="mr-1">{resolutionInfo.icon}</span>
                    {resolutionInfo.name}
                  </span>
                  <span className="bg-green-600/20 text-green-300 text-xs px-2 py-1 rounded-full border border-green-500/30">
                    ACTIVO
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                Ver Detalles
              </button>
            </div>
          </div>

          {/* Información del partido */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-white font-medium mb-2">{challenge.matchDetails.teams}</h3>
              <div className="text-sm text-gray-400 space-y-1">
                <div className="flex items-center">
                  <span className="text-blue-400 mr-2">📅</span>
                  <span>{challenge.matchDetails.date} {challenge.matchDetails.time}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">⚽</span>
                  <span>{challenge.matchDetails.league} • {challenge.matchDetails.venue}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="bg-[#1a1d29] p-4 rounded-lg border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Pool Total</div>
                <div className="text-2xl font-bold text-green-400">{challenge.betting.totalPool}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {challenge.betting.progress} participantes • {challenge.betting.timeLeft}
                </div>
                <div className="text-xs text-blue-400 mt-1">
                  Ganadores: 95% • Red: 5%
                </div>
              </div>
            </div>
          </div>

          {/* Progreso */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progreso</span>
              <span className="text-white">{progress}/{maxProgress}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress / maxProgress) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Información del creador */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-600">
            <div className="flex items-center">
              <span className="text-purple-400 mr-2">👤</span>
              <span className="text-gray-400">Creado por</span>
              <div className="ml-2">
                <span className="text-white font-medium">{challenge.creator.username}</span>
                <div className="text-xs text-gray-500">{challenge.creator.address}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">
                Cierre: <span className="text-orange-400">{new Date(challenge.deadline).toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: 'short', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</span>
              </div>
            </div>
          </div>

          {/* Botón de unirse */}
          <div className="mt-6">
            {hasJoined ? (
              <div className="w-full bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center">
                <span>✅ Ya participas en este reto</span>
              </div>
            ) : (
              <button 
                onClick={() => router.push(`/challenge/join?id=${challengeId}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center"
              >
                <span>Unirse al Reto</span>
              </button>
            )}
          </div>
        </div>

        {/* Detalles del reto y modo de resolución */}
        <div className="bg-[#2a2d47] rounded-lg p-6 border border-gray-600 mb-6">
          <h3 className="text-white font-medium text-lg mb-4 flex items-center">
            <span className="mr-2">⚙️</span>
            Detalles del Reto
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información de apuestas */}
            <div className="space-y-4">
              <div className="bg-[#1a1d29] rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <span className="mr-2">💰</span>
                  Información de Apuestas
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pregunta:</span>
                    <span className="text-white text-right max-w-[200px]">{challenge.betQuestion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Apuesta requerida:</span>
                    <span className="text-yellow-400 font-medium">{challenge.betting.fixedStake} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Modalidad:</span>
                    <span className="text-blue-400">Monto fijo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Red fee:</span>
                    <span className="text-yellow-400">{challenge.networkFee}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Visibilidad:</span>
                    <span className="text-blue-400">{challenge.isPublic ? 'Público' : 'Privado'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1a1d29] rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <span className="mr-2">📅</span>
                  Fechas Importantes
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Creado:</span>
                    <span className="text-white">{new Date(challenge.createdAt).toLocaleDateString('es-ES', { 
                      day: '2-digit', 
                      month: 'short', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cierre apuestas:</span>
                    <span className="text-orange-400">{new Date(challenge.deadline).toLocaleDateString('es-ES', { 
                      day: '2-digit', 
                      month: 'short', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Inicio del partido:</span>
                    <span className="text-blue-400">{challenge.matchDetails.date}, {challenge.matchDetails.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modo de resolución */}
            <div className="space-y-4">
              <div className="bg-[#1a1d29] rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <span className="mr-2">🤖</span>
                  Modo de Resolución
                </h4>
                <div className="space-y-3">
                  <div className={`${resolutionTheme.bg} border ${resolutionTheme.border}/20 rounded-lg p-3`}>
                    <div className="flex items-center mb-2">
                      <span className="mr-2 text-lg">{resolutionInfo.icon}</span>
                      <span className={`${resolutionTheme.text} font-medium text-sm`}>
                        {resolutionInfo.name.toUpperCase()}
                      </span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${resolutionTheme.badge} border ${resolutionTheme.border}/30`}>
                        {resolutionInfo.difficulty}
                      </span>
                    </div>
                    <p className="text-white text-sm mb-2">{resolutionInfo.description}</p>
                    <div className="text-xs text-gray-400">
                      <strong>Ejemplo:</strong> {resolutionInfo.example}
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="text-gray-400 mb-1">Fuente de datos:</div>
                    <div className="text-blue-400">{challenge.datasource}</div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <div className={`text-${resolutionTheme.color}-400 mb-1`}>
                      Distribución: {resolutionInfo.prizeDistribution}
                    </div>
                    ✓ Resolución automática por contrato inteligente<br/>
                    ✓ Datos verificados por oráculos<br/>
                    ✓ Pagos instantáneos al finalizar
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1a1d29] rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <span className="mr-2">👑</span>
                  Creador del Reto
                </h4>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                    {challenge.creator.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-medium">{challenge.creator.username}</div>
                    <div className="text-gray-400 text-xs">{challenge.creator.address}</div>
                    <div className="text-gray-400 text-xs">Reputación: {challenge.creator.reputation}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reglas del reto */}
        <div className="bg-[#2a2d47] rounded-lg p-6 border border-gray-600 mb-6">
          <h3 className="text-white font-medium text-lg mb-4 flex items-center">
            <span className="mr-2">📋</span>
            Reglas del Reto
          </h3>
          
          <div className="bg-[#1a1d29] rounded-lg p-4 border border-gray-700">
            <ul className="space-y-3">
              {challenge.rules?.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-400 mr-3 mt-1">•</span>
                  <span className="text-gray-300 text-sm leading-relaxed">{rule}</span>
                </li>
              )) || (
                <li className="text-gray-400 text-sm">Cargando reglas...</li>
              )}
            </ul>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center text-xs text-gray-500">
                <span className="mr-2">⚠️</span>
                <span>Al participar en este reto, aceptas automáticamente todas las reglas mencionadas.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 gap-4">
          {/* Participantes y sus apuestas - Sección expandida */}
          <div className="bg-[#2a2d47] rounded-lg p-6 border border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium text-lg">Participantes y Apuestas</h3>
              <span className="bg-blue-600 text-blue-100 text-xs px-3 py-1 rounded-full">
                {participants.length} participantes
              </span>
            </div>
            
            <div className="space-y-4">
              {participants.map((participant) => (
                <div key={participant.id} className={`rounded-lg p-4 border transition-all ${
                  participant.isCurrentUser 
                    ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/20 border-blue-500/50 shadow-lg shadow-blue-500/10' 
                    : 'bg-[#1a1d29] border-gray-700'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium mr-4">
                        {participant.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-medium">{participant.username}</h4>
                          {participant.isCurrentUser && (
                            <span className="bg-blue-500 text-blue-100 text-xs px-2 py-1 rounded-full font-medium">
                              TÚ
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{participant.address}</p>
                        <p className={`text-xs ${participant.isCurrentUser ? 'text-blue-400' : 'text-gray-500'}`}>
                          Unido {participant.joinedTime}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                        <div className="text-green-400 font-medium">{participant.bet.amount} USDC</div>
                        <div className="text-xs text-gray-400">Ganancia: {participant.bet.potential} USDC</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-blue-400 mr-2">🎯</span>
                          <span className="text-white font-medium">Predicciones Múltiples:</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded px-2 py-1">
                            <span className="text-gray-400">Goles:</span>
                            <span className="text-blue-400 font-medium ml-1">{participant.bet.predictions.total_goals}</span>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded px-2 py-1">
                            <span className="text-gray-400">Corners:</span>
                            <span className="text-green-400 font-medium ml-1">{participant.bet.predictions.corners_total}</span>
                          </div>
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded px-2 py-1">
                            <span className="text-gray-400">Tarjetas:</span>
                            <span className="text-yellow-400 font-medium ml-1">{participant.bet.predictions.yellow_cards}</span>
                          </div>
                          <div className="bg-purple-500/10 border border-purple-500/20 rounded px-2 py-1">
                            <span className="text-gray-400">1er Gol:</span>
                            <span className="text-purple-400 font-medium ml-1">{participant.bet.predictions.first_goal_min}&apos;</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-gray-400 text-xs">
                          TX: <span className="text-blue-400 font-mono">{participant.txHash}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Estadísticas de predicciones */}
            <div className="mt-6 pt-4 border-t border-gray-600">
              <h4 className="text-white font-medium mb-3">Análisis de Predicciones</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Goles */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                  <div className="text-blue-400 text-sm font-medium mb-1">Total de Goles</div>
                  <div className="text-white font-bold text-lg">
                    {participants.length > 0 ? (participants.reduce((sum, p) => sum + (p.bet?.predictions?.total_goals || 0), 0) / participants.length).toFixed(1) : '0'} avg
                  </div>
                  <div className="text-gray-400 text-xs">
                    Rango: {participants.length > 0 ? Math.min(...participants.map(p => p.bet?.predictions?.total_goals || 0)) : 0} - {participants.length > 0 ? Math.max(...participants.map(p => p.bet?.predictions?.total_goals || 0)) : 0}
                  </div>
                </div>

                {/* Corners */}
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                  <div className="text-green-400 text-sm font-medium mb-1">Corners</div>
                  <div className="text-white font-bold text-lg">
                    {participants.length > 0 ? (participants.reduce((sum, p) => sum + (p.bet?.predictions?.corners_total || 0), 0) / participants.length).toFixed(1) : '0'} avg
                  </div>
                  <div className="text-gray-400 text-xs">
                    Rango: {participants.length > 0 ? Math.min(...participants.map(p => p.bet?.predictions?.corners_total || 0)) : 0} - {participants.length > 0 ? Math.max(...participants.map(p => p.bet?.predictions?.corners_total || 0)) : 0}
                  </div>
                </div>

                {/* Tarjetas */}
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                  <div className="text-yellow-400 text-sm font-medium mb-1">Tarjetas</div>
                  <div className="text-white font-bold text-lg">
                    {participants.length > 0 ? (participants.reduce((sum, p) => sum + (p.bet?.predictions?.yellow_cards || 0), 0) / participants.length).toFixed(1) : '0'} avg
                  </div>
                  <div className="text-gray-400 text-xs">
                    Rango: {participants.length > 0 ? Math.min(...participants.map(p => p.bet?.predictions?.yellow_cards || 0)) : 0} - {participants.length > 0 ? Math.max(...participants.map(p => p.bet?.predictions?.yellow_cards || 0)) : 0}
                  </div>
                </div>

                {/* Primer Gol */}
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3">
                  <div className="text-purple-400 text-sm font-medium mb-1">Primer Gol</div>
                  <div className="text-white font-bold text-lg">
                    {participants.length > 0 ? (participants.reduce((sum, p) => sum + (p.bet?.predictions?.first_goal_min || 0), 0) / participants.length).toFixed(0) : '0'}&apos;
                  </div>
                  <div className="text-gray-400 text-xs">
                    Rango: {participants.length > 0 ? Math.min(...participants.map(p => p.bet?.predictions?.first_goal_min || 0)) : 0}&apos; - {participants.length > 0 ? Math.max(...participants.map(p => p.bet?.predictions?.first_goal_min || 0)) : 0}&apos;
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600">
            <h3 className="text-white font-medium mb-3">Estadísticas del Reto</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Pool Total</span>
                <span className="text-white font-medium">{challenge.betting.totalPool}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Participantes activos</span>
                <span className="text-blue-400 font-medium">{participants.length}/25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ganancia del ganador</span>
                <span className="text-green-400 font-medium">
                  {(participants.reduce((sum, p) => sum + p.bet.amount, 0) * 0.96).toFixed(0)} USDC
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Monto por apuesta</span>
                <span className="text-purple-400 font-medium">
                  {challenge.betting.fixedStake} USDC (fijo)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tiempo restante</span>
                <span className="text-yellow-400 font-medium">{challenge.betting.timeLeft}</span>
              </div>
            </div>
            
            {/* Información del modo de resolución */}
            <div className="mt-4 pt-3 border-t border-gray-600">
              <div className="text-xs text-gray-400 mb-2">Modo de resolución:</div>
              <div className="text-sm text-white font-medium mb-1">MÁS CERCANO</div>
              <div className="text-xs text-gray-400">
                Gana quien tenga menor diferencia total en las 4 predicciones
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}