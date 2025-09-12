'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserBet, UserStats, Transaction, UserBalance, BetType, BetStatus, ResolutionMode } from '@/types/betting';
import { useBalance } from '@/hooks/useBalance';
import DepositModal from './DepositModal';

// Datos mock para desarrollo
const mockUserBalance: UserBalance = {
  usdc: '1,250.00',
  locked: '350.00',
  available: '900.00',
  pendingRewards: '125.50'
};

const mockUserStats: UserStats = {
  totalBets: 47,
  activeBets: 5,
  wonBets: 28,
  lostBets: 14,
  pendingBets: 5,
  totalStaked: '2,450.00',
  totalWinnings: '3,120.75',
  winRate: 66.7,
  profitLoss: '+670.75',
  bestStreak: 8,
  currentStreak: 3
};

// Lista vacía inicialmente - se llenará cuando el usuario se una o cree retos
const mockUserBets: UserBet[] = [];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'BET_WON',
    betId: '3',
    betTitle: 'Champions League Final',
    amount: '+125.75',
    date: '2024-01-27',
    status: 'COMPLETED'
  },
  {
    id: '2',
    type: 'BET_PLACED',
    betId: '1',
    betTitle: 'Real Madrid vs Barcelona',
    amount: '-100.00',
    date: '2024-01-28',
    status: 'COMPLETED'
  },
  {
    id: '3',
    type: 'BET_PLACED',
    betId: '2',
    betTitle: 'Lakers vs Warriors',
    amount: '-200.00',
    date: '2024-01-27',
    status: 'COMPLETED'
  },
  {
    id: '4',
    type: 'REWARD_CLAIMED',
    betId: '3',
    betTitle: 'Champions League Final',
    amount: '+125.75',
    date: '2024-01-27',
    status: 'PENDING'
  }
];

interface UserPanelProps {
  username: string;
}

export default function UserPanel({ username }: UserPanelProps) {
  const [selectedTab, setSelectedTab] = useState<'posiciones' | 'historial' | 'analytics'>('posiciones');
  const { balance, transactions, isLoading, addTransaction, updateBalance } = useBalance();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [userBets, setUserBets] = useState<UserBet[]>(mockUserBets);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [expandedStats, setExpandedStats] = useState(false);
  const [notifications, setNotifications] = useState<{id: string, type: 'success' | 'info' | 'warning', message: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Función para agregar un nuevo reto a la lista de posiciones
  const addUserBet = (bet: UserBet) => {
    setUserBets(prev => [bet, ...prev]);
  };

  // Función para refrescar datos
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    addNotification('success', '✅ Datos actualizados exitosamente');
  };

  // Función para agregar notificaciones
  const addNotification = (type: 'success' | 'info' | 'warning', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    // Auto-remove después de 3 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        addNotification('info', '📊 Datos actualizados automáticamente');
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isRefreshing]);

  // Función para buscar retos por evento/partido
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    // Simular búsqueda de retos
    const mockResults = [
      {
        id: '1',
        title: 'Real Madrid vs Barcelona',
        league: 'La Liga',
        betAmount: '$100',
        participants: 15,
        timeLeft: '2h 30m',
        sport: 'Fútbol',
        status: 'active'
      },
      {
        id: '2', 
        title: 'Lakers vs Warriors',
        league: 'NBA',
        betAmount: '$75',
        participants: 8,
        timeLeft: '1h 45m',
        sport: 'Baloncesto',
        status: 'active'
      },
      {
        id: '3',
        title: 'Chiefs vs Ravens',
        league: 'NFL',
        betAmount: '$200',
        participants: 22,
        timeLeft: '4h 15m',
        sport: 'Fútbol Americano',
        status: 'active'
      }
    ];

    // Filtrar resultados por el query
    const filtered = mockResults.filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.league.toLowerCase().includes(query.toLowerCase()) ||
      result.sport.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filtered);
    addNotification('info', `🔍 ${filtered.length} retos encontrados`);
  };

  // Simular agregar el reto de desafío múltiple si el usuario se unió
  useEffect(() => {
    // Solo ejecutar en el cliente para evitar hydration issues
    if (typeof window === 'undefined') return;
    
    // Verificar si el usuario se unió al reto de challenge desde URL params
    const urlParams = new URLSearchParams(window.location.search);
    const joined = urlParams.get('joined');
    const challengeId = urlParams.get('id');
    
    if (joined === 'true' && challengeId === 'challenge_001') {
      const newBet: UserBet = {
        id: challengeId,
        title: 'Real Madrid vs Barcelona - Multi-Apuesta',
        betType: BetType.MULTI,
        resolutionMode: ResolutionMode.CLOSEST,
        status: BetStatus.ACTIVE,
        stake: '150.00',
        userPrediction: 'Múltiple',
        participants: 16,
        maxParticipants: 25,
        dateCreated: new Date().toLocaleDateString('es-ES'),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
        sport: 'Fútbol',
        league: 'La Liga',
        icon: '⚽',
        iconBg: 'bg-green-500'
      };
      
      // Usar setUserBets con función para evitar duplicados
      setUserBets(prev => {
        const existingBet = prev.find(bet => bet.id === challengeId);
        if (!existingBet) {
          return [newBet, ...prev];
        }
        return prev;
      });
    }
  }, []);

  const handleDeposit = (amount: number) => {
    // Agregar transacción de depósito
    addTransaction({
      type: 'REWARD_CLAIMED',
      betId: 'deposit',
      betTitle: 'Depósito USDC',
      amount: `+${amount.toFixed(2)}`,
      status: 'COMPLETED'
    });

    // Actualizar balance
    updateBalance(amount, 'deposit');
  };

  const getBetStatusColor = (status: BetStatus) => {
    switch (status) {
      case BetStatus.ACTIVE:
        return 'bg-green-600 text-green-100';
      case BetStatus.PENDING:
        return 'bg-yellow-600 text-yellow-100';
      case BetStatus.RESOLVED:
        return 'bg-blue-600 text-blue-100';
      case BetStatus.LOCKED:
        return 'bg-gray-600 text-gray-100';
      case BetStatus.CANCELLED:
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  const getBetTypeLabel = (type: BetType) => {
    switch (type) {
      case BetType.SIMPLE:
        return 'Simple';
      case BetType.TOURNAMENT:
        return 'Torneo';
      case BetType.GROUP_BALANCED:
        return 'Grupo';
      case BetType.ONE_VS_ONE:
        return '1v1';
      default:
        return type;
    }
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'BET_PLACED':
        return '📤';
      case 'BET_WON':
        return '🏆';
      case 'BET_LOST':
        return '❌';
      case 'BET_REFUNDED':
        return '🔄';
      case 'REWARD_CLAIMED':
        return '💰';
      default:
        return '📊';
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'BET_WON':
      case 'REWARD_CLAIMED':
        return 'text-green-400';
      case 'BET_LOST':
        return 'text-red-400';
      case 'BET_PLACED':
        return 'text-blue-400';
      case 'BET_REFUNDED':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="w-80 bg-[#1a1d29] border-l border-gray-700 p-4 flex flex-col">
      {/* Imagen m12 */}
      <div className="mb-4 flex justify-center">
        <img 
          src="/m12.png" 
          alt="M12 Logo" 
          width={150} 
          height={75} 
          className="drop-shadow-lg"
          style={{
            objectFit: 'contain',
            background: 'transparent'
          }}
        />
      </div>

      {/* Header del usuario con balance */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-white">Mis Posiciones</h2>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-1 rounded-full transition-all hover:bg-gray-700 ${
                isRefreshing ? 'animate-spin' : 'hover:scale-110'
              }`}
            >
              <span className="text-sm">🔄</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="p-1 rounded-full hover:bg-gray-700 transition-all hover:scale-110"
            >
              <span className="text-sm">⚡</span>
            </button>
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-3">Gestiona tus retos activos</p>
        
        {/* Balance resumen */}
        <div className="bg-[#2a2d47] rounded-lg p-3 mb-4 border border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-xs font-medium">Mi Balance</span>
            <button
              onClick={() => setShowDepositModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded transition-colors"
            >
              + Depositar
            </button>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">Balance Disponible</span>
            <span className="text-green-400 font-bold">${mockUserBalance.available} USDC</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">Apostado</span>
            <span className="text-yellow-400 font-medium">${mockUserBalance.locked}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">Pendiente</span>
            <span className="text-blue-400 font-medium">${mockUserBalance.pendingRewards}</span>
          </div>
        </div>

        {/* Panel de acciones rápidas */}
        {showQuickActions && (
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-3 mb-4 border border-blue-600/30 animate-fadeIn">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
              <span className="mr-2">⚡</span>
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => addNotification('info', '🎯 Creando reto rápido...')}
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 px-3 rounded transition-all hover:scale-105"
              >
                🎯 Reto Rápido
              </button>
              <button 
                onClick={() => addNotification('info', '💰 Abriendo depósito...')}
                className="bg-green-600/20 hover:bg-green-600/30 text-green-400 py-2 px-3 rounded transition-all hover:scale-105"
              >
                💰 Depositar
              </button>
              <button 
                onClick={() => addNotification('info', '📊 Generando reporte...')}
                className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 py-2 px-3 rounded transition-all hover:scale-105"
              >
                📊 Reporte
              </button>
              <button 
                onClick={() => addNotification('warning', '⚙️ Configuraciones proximamente...')}
                className="bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 py-2 px-3 rounded transition-all hover:scale-105"
              >
                ⚙️ Config
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notificaciones */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg shadow-lg border animate-slideIn ${
                notification.type === 'success' ? 'bg-green-900/90 border-green-600 text-green-200' :
                notification.type === 'warning' ? 'bg-yellow-900/90 border-yellow-600 text-yellow-200' :
                'bg-blue-900/90 border-blue-600 text-blue-200'
              }`}
            >
              <div className="text-sm font-medium">{notification.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs de navegación */}
      <div className="flex justify-start mb-6 bg-gray-700 rounded-lg p-1">
        {[
          { key: 'posiciones', label: '📈', name: 'Posiciones' },
          { key: 'historial', label: '🕐', name: 'Historial' },
          { key: 'analytics', label: '📊', name: 'Analytics' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setSelectedTab(tab.key as any);
              addNotification('info', `📊 Cambiando a ${tab.name}`);
            }}
            className={`py-2 px-3 rounded-md text-xs font-medium capitalize transition-all hover:scale-105 ${
              selectedTab === tab.key
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
            }`}
          >
            {tab.label} {tab.name}
          </button>
        ))}
      </div>

      {/* Contenido de los tabs */}
      <div className="flex-1 overflow-y-auto">
        {selectedTab === 'posiciones' && (
          <div className="space-y-3">
            {userBets.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-white font-medium mb-2">No hay posiciones activas</h3>
                <p className="text-gray-400 text-sm">
                  Únete a retos para ver tus posiciones aquí
                </p>
              </div>
            ) : (
              // Lista de posiciones cuando hay retos
              userBets.map((bet) => (
                <div key={bet.id} className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 ${bet.iconBg} rounded-lg flex items-center justify-center text-white mr-3 text-sm`}>
                        {bet.icon}
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{bet.title}</div>
                        <div className="text-gray-400 text-xs">{bet.league} • {getBetTypeLabel(bet.betType)}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getBetStatusColor(bet.status)}`}>
                      {bet.status === BetStatus.ACTIVE ? '🟢 Activo' :
                       bet.status === BetStatus.PENDING ? '🟡 Pendiente' :
                       bet.status === BetStatus.RESOLVED ? '✅ Ganado' :
                       bet.status === BetStatus.LOCKED ? '🔒 Bloqueado' : '❌ Cancelado'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Apuesta</span>
                      <span className="text-white font-medium">${bet.stake}</span>
                    </div>
                    {bet.userPrediction && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mi predicción</span>
                        <span className="text-blue-400 font-medium">{bet.userPrediction}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Participantes</span>
                      <span className="text-white">{bet.participants}/{bet.maxParticipants}</span>
                    </div>
                    {bet.winnings && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ganancia</span>
                        <span className="text-green-400 font-bold">+${bet.winnings}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-600 flex justify-between items-center text-xs">
                    <span className="text-gray-500">📅 {bet.dateCreated}</span>
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:underline">Ver detalles</button>
                      {username === '77paladio' && (
                        <Link href="/admin">
                          <button className="text-red-400 hover:underline text-xs">Admin</button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {selectedTab === 'historial' && (
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              transactions.map((transaction) => (
              <div key={transaction.id} className="bg-[#2a2d47] rounded-lg p-3 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getTransactionIcon(transaction.type)}</span>
                    <div>
                      <div className="text-white text-sm font-medium">{transaction.betTitle}</div>
                      <div className="text-gray-400 text-xs capitalize">{transaction.type.replace('_', ' ').toLowerCase()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${getTransactionColor(transaction.type)}`}>
                      {transaction.amount}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'COMPLETED' ? 'bg-green-600/20 text-green-400' :
                      transaction.status === 'PENDING' ? 'bg-yellow-600/20 text-yellow-400' :
                      'bg-red-600/20 text-red-400'
                    }`}>
                      {transaction.status === 'COMPLETED' ? '✅' :
                       transaction.status === 'PENDING' ? '⏳' : '❌'}
                    </div>
                  </div>
                </div>
                <div className="text-gray-500 text-xs">📅 {transaction.date}</div>
              </div>
              ))
            )}
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div className="space-y-4">
            <div className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600 hover:border-blue-600/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold flex items-center">
                  <span className="mr-2">📊</span>
                  Estadísticas
                </h3>
                <button
                  onClick={() => setExpandedStats(!expandedStats)}
                  className="text-blue-400 hover:text-blue-300 transition-all hover:scale-110"
                >
                  {expandedStats ? '🔼' : '🔽'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center p-3 bg-gray-800/50 rounded hover:bg-gray-700/50 transition-all cursor-pointer">
                  <div className="text-white text-lg font-bold">{mockUserStats.totalBets}</div>
                  <div className="text-gray-400">Total</div>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded hover:bg-gray-700/50 transition-all cursor-pointer">
                  <div className="text-green-400 text-lg font-bold">{mockUserStats.winRate}%</div>
                  <div className="text-gray-400">Win Rate</div>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded hover:bg-gray-700/50 transition-all cursor-pointer">
                  <div className="text-blue-400 text-lg font-bold">{mockUserStats.activeBets}</div>
                  <div className="text-gray-400">Activas</div>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded hover:bg-gray-700/50 transition-all cursor-pointer">
                  <div className="text-purple-400 text-lg font-bold">{mockUserStats.currentStreak}</div>
                  <div className="text-gray-400">Racha</div>
                </div>
              </div>

              {expandedStats && (
                <div className="mt-4 pt-4 border-t border-gray-600 animate-fadeIn">
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex justify-between p-2 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded">
                      <span className="text-gray-400">Apuestas Ganadas</span>
                      <span className="text-green-400 font-bold">{mockUserStats.wonBets}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gradient-to-r from-red-900/20 to-pink-900/20 rounded">
                      <span className="text-gray-400">Apuestas Perdidas</span>
                      <span className="text-red-400 font-bold">{mockUserStats.lostBets}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded">
                      <span className="text-gray-400">Mejor Racha</span>
                      <span className="text-yellow-400 font-bold">{mockUserStats.bestStreak}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600">
              <h3 className="text-white font-semibold mb-3">💰 Balance</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total apostado</span>
                  <span className="text-white font-medium">${mockUserStats.totalStaked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total ganado</span>
                  <span className="text-green-400 font-medium">${mockUserStats.totalWinnings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Profit/Loss</span>
                  <span className={`font-bold ${mockUserStats.profitLoss.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    ${mockUserStats.profitLoss}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600">
              <h3 className="text-white font-semibold mb-3">🎯 Rendimiento</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Mejor racha</span>
                  <span className="text-yellow-400 font-medium">{mockUserStats.bestStreak} victorias</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Apuestas ganadas</span>
                  <span className="text-green-400 font-medium">{mockUserStats.wonBets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Apuestas perdidas</span>
                  <span className="text-red-400 font-medium">{mockUserStats.lostBets}</span>
                </div>
              </div>
            </div>

            {/* Botón de acción para generar reporte */}
            <button
              onClick={() => addNotification('success', '📄 Reporte completo generado exitosamente')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all hover:scale-105 hover:shadow-lg interactive-hover"
            >
              📄 Generar Reporte Completo
            </button>
          </div>
        )}
      </div>
      
      {/* Modal de depósito */}
      <DepositModal 
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDeposit={handleDeposit}
      />
    </div>
  );
}