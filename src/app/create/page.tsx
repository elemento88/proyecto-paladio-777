'use client'

import Link from 'next/link';

interface MarketType {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  backgroundColor: string;
  difficulty: string;
  estimatedTime: string;
  features: string[];
}

const marketTypes: MarketType[] = [
  {
    id: '1',
    title: 'Battle Royal',
    description: 'Todos contra todos - el ganador se lleva todo el pozo',
    icon: '⚔️',
    iconColor: 'text-red-400',
    backgroundColor: 'from-red-900/20 to-red-800/10',
    difficulty: 'Básico',
    estimatedTime: '5 min',
    features: ['Múltiples participantes', 'Ganador único', 'Pozo completo']
  },
  {
    id: '2',
    title: 'Pool Grupal',
    description: 'Fondos compartidos con distribución proporcional de premios',
    icon: '👥',
    iconColor: 'text-green-400',
    backgroundColor: 'from-green-900/20 to-green-800/10',
    difficulty: 'Intermedio',
    estimatedTime: '8 min',
    features: ['Liquidez compartida', 'Reparto de ganancias', 'Menor riesgo']
  },
  {
    id: '3',
    title: 'Predicción Simple',
    description: 'Apuesta directa sobre el resultado de un evento específico',
    icon: '🎯',
    iconColor: 'text-blue-400',
    backgroundColor: 'from-blue-900/20 to-blue-800/10',
    difficulty: 'Básico',
    estimatedTime: '3 min',
    features: ['Sí/No simple', 'Resolución rápida', 'Para principiantes']
  },
  {
    id: '4',
    title: 'Mercado Over/Under',
    description: 'Apuesta sobre si un valor será mayor o menor a un número',
    icon: '📊',
    iconColor: 'text-yellow-400',
    backgroundColor: 'from-yellow-900/20 to-yellow-800/10',
    difficulty: 'Intermedio',
    estimatedTime: '6 min',
    features: ['Rango numérico', 'Análisis estadístico', 'Datos deportivos']
  },
  {
    id: '5',
    title: 'Desafío 1v1',
    description: 'Duelo directo entre dos participantes con apuesta igualada',
    icon: '🥊',
    iconColor: 'text-purple-400',
    backgroundColor: 'from-purple-900/20 to-purple-800/10',
    difficulty: 'Avanzado',
    estimatedTime: '10 min',
    features: ['Duelo directo', 'Apuestas igualadas', 'Negociación privada']
  },
  {
    id: '6',
    title: 'Liga por Puntos',
    description: 'Sistema de puntuación acumulativa a través de múltiples eventos',
    icon: '🏆',
    iconColor: 'text-orange-400',
    backgroundColor: 'from-orange-900/20 to-orange-800/10',
    difficulty: 'Avanzado',
    estimatedTime: '15 min',
    features: ['Múltiples eventos', 'Puntuación acumulada', 'Temporada completa']
  }
];

export default function CreateChallengeePage() {
  return (
    <div className="min-h-screen bg-[#1a1d29] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-gray-400 hover:text-white flex items-center mb-4">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Crear Nuevo Reto</h1>
          <p className="text-gray-400">Selecciona el tipo de mercado para tu reto deportivo</p>
        </div>

        {/* Grid de tipos de mercado */}
        <div className="grid grid-cols-3 gap-6">
          {marketTypes.map((market) => (
            <div 
              key={market.id} 
              className={`bg-gradient-to-br ${market.backgroundColor} border border-gray-600 rounded-xl p-6 hover:border-gray-500 transition-all cursor-pointer group hover:scale-105 flex flex-col h-full min-h-[320px]`}
            >
              {/* Header con icono y dificultad */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 bg-[#2a2d47] rounded-xl flex items-center justify-center text-2xl ${market.iconColor} group-hover:scale-110 transition-transform`}>
                  {market.icon}
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">Dificultad</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    market.difficulty === 'Básico' ? 'bg-green-600/20 text-green-400' :
                    market.difficulty === 'Intermedio' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-red-600/20 text-red-400'
                  }`}>
                    {market.difficulty}
                  </span>
                </div>
              </div>

              {/* Contenido principal */}
              <div className="flex-1 flex flex-col">
                {/* Título y descripción */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2">{market.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{market.description}</p>
                </div>

                {/* Layout horizontal para características y tiempo */}
                <div className="flex justify-between items-start mb-4 flex-1">
                  {/* Características */}
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 mb-2">Características:</div>
                    <div className="space-y-1">
                      {market.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-xs">
                          <div className={`w-1.5 h-1.5 rounded-full ${market.iconColor.replace('text-', 'bg-')} mr-2`}></div>
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tiempo estimado */}
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-1">⏱️ Tiempo</div>
                    <span className={`font-semibold ${market.iconColor}`}>{market.estimatedTime}</span>
                  </div>
                </div>
              </div>

              {/* Botón de acción - siempre al final */}
              <div className="mt-auto pt-4 border-t border-gray-600">
                <button className={`w-full py-3 px-4 rounded-lg transition-all font-medium text-sm
                  ${market.difficulty === 'Básico' ? 'bg-green-600 hover:bg-green-700' :
                    market.difficulty === 'Intermedio' ? 'bg-yellow-600 hover:bg-yellow-700' :
                    'bg-red-600 hover:bg-red-700'
                  } text-white group-hover:shadow-lg`}
                >
                  Crear {market.title}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
            <h3 className="text-xl font-semibold text-white mb-4">💡 Consejos para Crear Retos</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-white font-medium">Elige el deporte correcto</h4>
                  <p className="text-gray-400 text-sm">Selecciona eventos con datos confiables y calendarios definidos</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-white font-medium">Define reglas claras</h4>
                  <p className="text-gray-400 text-sm">Especifica condiciones de victoria y criterios de resolución</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white text-sm mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-white font-medium">Apuesta responsable</h4>
                  <p className="text-gray-400 text-sm">Establece montos apropiados y tiempos de resolución realistas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
            <h3 className="text-xl font-semibold text-white mb-4">📊 Estadísticas de Retos</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Más Popular</span>
                <div className="flex items-center">
                  <span className="text-red-400">⚔️</span>
                  <span className="text-white font-semibold ml-2">Battle Royal</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tasa de Éxito</span>
                <span className="text-green-400 font-semibold">94.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tiempo Promedio</span>
                <span className="text-blue-400 font-semibold">7 minutos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Retos Creados Hoy</span>
                <span className="text-purple-400 font-semibold">127</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-gray-600 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-2">¿Necesitas ayuda?</h3>
            <p className="text-gray-400 mb-4">Consulta nuestra guía completa o únete a la comunidad</p>
            <div className="flex items-center justify-center space-x-4">
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">
                📚 Ver Guía
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                💬 Discord
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}