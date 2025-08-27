'use client'

import { useState } from 'react';

interface ChallengeDetailProps {
  id?: string;
}

export default function ChallengePage({ id }: ChallengeDetailProps) {
  const [progress] = useState(7);
  const [maxProgress] = useState(10);
  
  const challenge = {
    title: 'Clásico Madrid vs Barcelona',
    subtitle: 'Battle Royal',
    status: 'activo',
    matchDetails: {
      teams: 'Real Madrid vs Barcelona',
      date: 'vie, 19 ene',
      time: '21:00',
      league: 'La Liga',
      venue: 'Fútbol'
    },
    betting: {
      prize: '$500',
      progress: '7/10',
      timeLeft: '2 días'
    },
    creator: 'Carlos_Deportes'
  };

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header con botón de regreso */}
        <div className="mb-6">
          <button className="text-gray-400 hover:text-white flex items-center mb-4">
            ← Volver
          </button>
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
                <div className="flex items-center mt-1">
                  <span className="bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded-full mr-3">
                    {challenge.subtitle}
                  </span>
                  <span className="bg-green-600 text-green-100 text-xs px-2 py-1 rounded-full">
                    {challenge.status}
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
              <div className="bg-[#1a1d29] p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Premio</div>
                <div className="text-2xl font-bold text-green-400">{challenge.betting.prize}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {challenge.betting.progress} • {challenge.betting.timeLeft}
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
              <span className="text-white font-medium ml-2">{challenge.creator}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">
                Finaliza <span className="text-white">20/1, 20:00</span>
              </div>
            </div>
          </div>

          {/* Botón de unirse */}
          <div className="mt-6">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center">
              <span>Unirse al Reto</span>
              <span className="ml-2">→</span>
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600">
            <h3 className="text-white font-medium mb-3">Participantes Actuales</h3>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm mr-3">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-white">Participante {i + 1}</span>
                  </div>
                  <span className="text-gray-400 text-sm">Unido hace {i + 1}h</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600">
            <h3 className="text-white font-medium mb-3">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total apostado</span>
                <span className="text-white font-medium">$350</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cuotas actuales</span>
                <span className="text-green-400 font-medium">1.85x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tiempo restante</span>
                <span className="text-yellow-400 font-medium">2 días 5h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}