'use client'

import { useState } from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import { BettingChallenge, Transaction, UserStats } from '@/types/betting';

// Mock data para el dashboard administrativo
const mockAdminStats = {
  totalBets: 1247,
  activeBets: 89,
  totalUsers: 342,
  totalVolume: '45,678.90',
  protocolFees: '1,142.25',
  platformRevenue: '912.30',
  averageBetSize: '125.40',
  dailyActiveUsers: 87,
  monthlyGrowth: '+23.5%',
  conversionRate: '12.8%'
};

const mockRecentBets: BettingChallenge[] = [
  {
    id: '1',
    title: 'Champions League Final',
    type: 'Tournament',
    description: 'UEFA Champions League - Predicción del ganador',
    stake: '$250',
    participants: '18/20',
    timeRemaining: '2h 30m',
    creator: '0x1234...5678',
    odds: '2.45x',
    category: 'UEFA',
    sport: 'Fútbol',
    endDate: '28/1, 21:00',
    icon: '🏆',
    iconBg: 'bg-yellow-500'
  },
  {
    id: '2',
    title: 'NBA Finals MVP',
    type: 'Battle Royal',
    description: 'NBA Finals - Most Valuable Player prediction',
    stake: '$100',
    participants: '45/50',
    timeRemaining: '5 días',
    creator: '0x8765...4321',
    odds: '3.20x',
    category: 'NBA',
    sport: 'Baloncesto',
    endDate: '2/2, 15:00',
    icon: '🏀',
    iconBg: 'bg-orange-500'
  }
];

const mockRecentTransactions: Transaction[] = [
  {
    id: '1',
    type: 'BET_PLACED',
    betId: '123',
    betTitle: 'Super Bowl LVIII',
    amount: '-500.00',
    date: '2024-01-28',
    status: 'COMPLETED'
  },
  {
    id: '2',
    type: 'BET_WON',
    betId: '124',
    betTitle: 'Tennis Masters Final',
    amount: '+1250.75',
    date: '2024-01-28',
    status: 'COMPLETED'
  },
  {
    id: '3',
    type: 'REWARD_CLAIMED',
    betId: '125',
    betTitle: 'Champions League',
    amount: '+325.50',
    date: '2024-01-27',
    status: 'PENDING'
  }
];

const mockTopUsers = [
  { username: '0x1234...abcd', totalBets: 89, volume: '$12,450', winRate: '78.5%', rank: 1 },
  { username: '0x5678...efgh', totalBets: 76, volume: '$9,875', winRate: '71.2%', rank: 2 },
  { username: '0x9abc...1234', totalBets: 65, volume: '$8,320', winRate: '69.8%', rank: 3 },
  { username: '0xdef0...5678', totalBets: 58, volume: '$7,650', winRate: '67.1%', rank: 4 },
  { username: '0x2468...9abc', totalBets: 52, volume: '$6,890', winRate: '64.7%', rank: 5 }
];

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'bets' | 'users' | 'transactions'>('overview');
  const [timeRange, setTimeRange] = useState('24h');

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'BET_PLACED': return '📤';
      case 'BET_WON': return '🏆';
      case 'BET_LOST': return '❌';
      case 'REWARD_CLAIMED': return '💰';
      default: return '📊';
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'BET_WON':
      case 'REWARD_CLAIMED': return 'text-green-400';
      case 'BET_LOST': return 'text-red-400';
      case 'BET_PLACED': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white">
      {/* Header */}
      <div className="bg-[#1a1d29] border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold">A</span>
            </div>
            <div>
              <h1 className="font-semibold text-xl">Dashboard Administrativo</h1>
              <p className="text-sm text-gray-400">Panel de control del protocolo</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="24h">Últimas 24h</option>
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
            </select>
            <BackButton 
              fallbackUrl="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ← Volver al App
            </BackButton>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Navegación de tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            {[
              { key: 'overview', label: '📊 General', desc: 'Estadísticas generales' },
              { key: 'bets', label: '🎯 Apuestas', desc: 'Gestión de apuestas' },
              { key: 'users', label: '👥 Usuarios', desc: 'Gestión de usuarios' },
              { key: 'transactions', label: '💳 Transacciones', desc: 'Historial de transacciones' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de Overview */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <span className="text-green-400 text-sm font-medium">+12%</span>
                </div>
                <h3 className="text-2xl font-bold text-white">{mockAdminStats.totalBets}</h3>
                <p className="text-gray-400 text-sm">Total Apuestas</p>
              </div>

              <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">👥</span>
                  </div>
                  <span className="text-green-400 text-sm font-medium">+8%</span>
                </div>
                <h3 className="text-2xl font-bold text-white">{mockAdminStats.totalUsers}</h3>
                <p className="text-gray-400 text-sm">Usuarios Totales</p>
              </div>

              <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">💰</span>
                  </div>
                  <span className="text-green-400 text-sm font-medium">+15%</span>
                </div>
                <h3 className="text-2xl font-bold text-white">${mockAdminStats.totalVolume}</h3>
                <p className="text-gray-400 text-sm">Volumen Total</p>
              </div>

              <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📈</span>
                  </div>
                  <span className="text-green-400 text-sm font-medium">+5%</span>
                </div>
                <h3 className="text-2xl font-bold text-white">${mockAdminStats.protocolFees}</h3>
                <p className="text-gray-400 text-sm">Fees del Protocolo</p>
              </div>
            </div>

            {/* Métricas secundarias */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">📊 Estadísticas de Rendimiento</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Usuarios Activos Diarios</span>
                    <span className="text-white font-medium">{mockAdminStats.dailyActiveUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Apuesta Promedio</span>
                    <span className="text-white font-medium">${mockAdminStats.averageBetSize}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Crecimiento Mensual</span>
                    <span className="text-green-400 font-medium">{mockAdminStats.monthlyGrowth}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tasa de Conversión</span>
                    <span className="text-blue-400 font-medium">{mockAdminStats.conversionRate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">🏆 Top 5 Usuarios</h3>
                <div className="space-y-3">
                  {mockTopUsers.map((user) => (
                    <div key={user.username} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">{user.rank}</span>
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">{user.username}</div>
                          <div className="text-gray-400 text-xs">{user.totalBets} apuestas</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-medium">{user.volume}</div>
                        <div className="text-gray-400 text-xs">{user.winRate} win rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenido de Bets */}
        {selectedTab === 'bets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Gestión de Apuestas</h2>
              <div className="flex space-x-2">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                  ✅ Resolver Apuestas
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                  ❌ Cancelar Apuestas
                </button>
              </div>
            </div>

            <div className="bg-[#2a2d47] rounded-xl border border-gray-600">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Apuestas Recientes</h3>
                <div className="space-y-4">
                  {mockRecentBets.map((bet) => (
                    <div key={bet.id} className="p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 ${bet.iconBg} rounded-lg flex items-center justify-center mr-3`}>
                            {bet.icon}
                          </div>
                          <div>
                            <div className="text-white font-medium">{bet.title}</div>
                            <div className="text-gray-400 text-sm">{bet.category} • {bet.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-white font-medium">{bet.stake}</div>
                            <div className="text-gray-400 text-sm">{bet.participants}</div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                              Ver
                            </button>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                              Resolver
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenido de Users */}
        {selectedTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Gestión de Usuarios</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Buscar usuario..."
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  🔍 Buscar
                </button>
              </div>
            </div>

            <div className="bg-[#2a2d47] rounded-xl border border-gray-600">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Usuarios por Volumen</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-2 text-gray-400">Ranking</th>
                        <th className="text-left py-2 text-gray-400">Usuario</th>
                        <th className="text-left py-2 text-gray-400">Apuestas</th>
                        <th className="text-left py-2 text-gray-400">Volumen</th>
                        <th className="text-left py-2 text-gray-400">Win Rate</th>
                        <th className="text-left py-2 text-gray-400">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTopUsers.map((user) => (
                        <tr key={user.username} className="border-b border-gray-700">
                          <td className="py-3 text-white">#{user.rank}</td>
                          <td className="py-3 text-white font-medium">{user.username}</td>
                          <td className="py-3 text-gray-300">{user.totalBets}</td>
                          <td className="py-3 text-green-400 font-medium">{user.volume}</td>
                          <td className="py-3 text-blue-400">{user.winRate}</td>
                          <td className="py-3">
                            <div className="flex space-x-2">
                              <button className="text-blue-400 hover:underline text-sm">Ver</button>
                              <button className="text-yellow-400 hover:underline text-sm">Editar</button>
                              <button className="text-red-400 hover:underline text-sm">Suspender</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenido de Transactions */}
        {selectedTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Historial de Transacciones</h2>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                📊 Exportar CSV
              </button>
            </div>

            <div className="bg-[#2a2d47] rounded-xl border border-gray-600">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Transacciones Recientes</h3>
                <div className="space-y-3">
                  {mockRecentTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getTransactionIcon(transaction.type)}</span>
                          <div>
                            <div className="text-white font-medium">{transaction.betTitle}</div>
                            <div className="text-gray-400 text-sm capitalize">
                              {transaction.type.replace('_', ' ').toLowerCase()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                            {transaction.amount}
                          </div>
                          <div className="text-gray-400 text-sm">{transaction.date}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}