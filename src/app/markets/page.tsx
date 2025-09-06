'use client'

import { MarketType } from '@/types/betting';

const marketTypes: MarketType[] = [
  {
    id: '1',
    title: 'Mercado Simple',
    description: 'Posiciones individuales con resolución basada en oráculos',
    icon: '🎯',
    iconColor: 'text-blue-400',
    backgroundColor: 'from-blue-900/20 to-blue-800/10',
    marketsCount: 12,
    totalVolume: '$45,230'
  },
  {
    id: '2',
    title: 'Group Balanced',
    description: 'Grupos equilibrados automáticamente con dinámicas de liquidez grupal',
    icon: '⚖️',
    iconColor: 'text-blue-400',
    backgroundColor: 'from-blue-900/20 to-blue-800/10',
    marketsCount: 8,
    totalVolume: '$22,890'
  },
  {
    id: '3',
    title: 'Trading Directo',
    description: 'Contratos bilaterales con ejecución automática',
    icon: '⚡',
    iconColor: 'text-yellow-400',
    backgroundColor: 'from-yellow-900/20 to-yellow-800/10',
    marketsCount: 15,
    totalVolume: '$1,250'
  },
  {
    id: '4',
    title: 'Liga Competitiva',
    description: 'Torneos estructurados con progresión de brackets',
    icon: '👑',
    iconColor: 'text-purple-400',
    backgroundColor: 'from-purple-900/20 to-purple-800/10',
    marketsCount: 5,
    totalVolume: '$120,000'
  }
];

export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-[#1a1d29] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button className="text-gray-400 hover:text-white flex items-center mb-4">
            ← Volver
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Tipos de Mercado</h1>
          <p className="text-gray-400">Explora diferentes modalidades de retos disponibles</p>
        </div>

        {/* Grid de tipos de mercado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketTypes.map((market) => (
            <div 
              key={market.id} 
              className={`bg-gradient-to-br ${market.backgroundColor} border border-gray-600 rounded-xl p-6 hover:border-gray-500 transition-all cursor-pointer group`}
            >
              {/* Icono y título */}
              <div className="mb-4">
                <div className={`w-16 h-16 bg-[#2a2d47] rounded-xl flex items-center justify-center text-3xl ${market.iconColor} mb-4 group-hover:scale-110 transition-transform`}>
                  {market.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{market.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{market.description}</p>
              </div>

              {/* Estadísticas */}
              <div className="mt-6 pt-4 border-t border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">📈 Mercados</span>
                  <span className={`font-semibold ${market.iconColor}`}>{market.marketsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">💰 Volumen Total</span>
                  <span className="text-white font-semibold">{market.totalVolume}</span>
                </div>
              </div>

              {/* Indicador de actividad */}
              <div className="mt-4">
                <div className="flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full ${market.iconColor.replace('text-', 'bg-')} mr-2`}></div>
                  <span className="text-xs text-gray-500">Activo</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
            <h3 className="text-xl font-semibold text-white mb-4">¿Cómo Funcionan?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-white font-medium">Mercado Simple</h4>
                  <p className="text-gray-400 text-sm">Retos individuales con resolución automática mediante oráculos externos</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-white font-medium">Group Balanced</h4>
                  <p className="text-gray-400 text-sm">Grupos equilibrados donde los participantes compiten con oportunidades balanceadas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
            <h3 className="text-xl font-semibold text-white mb-4">Estadísticas Globales</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Mercados Activos</span>
                <span className="text-white font-semibold">40</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Volumen Total 24h</span>
                <span className="text-green-400 font-semibold">$189,370</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Participantes Únicos</span>
                <span className="text-blue-400 font-semibold">1,247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tasa de Resolución</span>
                <span className="text-purple-400 font-semibold">99.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}