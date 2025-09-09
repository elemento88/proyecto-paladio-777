'use client'

import { useState } from 'react';
import { Match } from '@/types/betting';
import BackButton from '@/components/BackButton';

const mockMatches: Match[] = [
  {
    id: '1',
    title: 'Real Madrid vs Barcelona',
    league: 'La Liga',
    date: 'sáb, 23 ago',
    time: '21:00',
    venue: 'Santiago Bernabéu',
    local: { name: 'Real Madrid', odds: 2.1 },
    draw: { odds: 3.2 },
    away: { name: 'Barcelona', odds: 3.5 },
    participants: '45/100 participantes',
    minBet: '$50 apuesta',
    status: 'Próximo'
  },
  {
    id: '2',
    title: 'Manchester City vs Liverpool',
    league: 'Premier League',
    date: 'lun, 25 ago',
    time: '20:45',
    venue: 'Etihad Stadium',
    local: { name: 'Manchester City', odds: 1.85 },
    draw: { odds: 3.4 },
    away: { name: 'Liverpool', odds: 4.2 },
    participants: '78/150 participantes',
    minBet: '$75 apuesta',
    status: 'Próximo'
  },
  {
    id: '3',
    title: 'Bayern Munich vs Borussia Dortmund',
    league: 'Bundesliga',
    date: 'mié, 27 ago',
    time: '19:30',
    venue: 'Allianz Arena',
    local: { name: 'Bayern Munich', odds: 1.65 },
    draw: { odds: 3.8 },
    away: { name: 'Borussia Dortmund', odds: 5.1 },
    participants: '92/120 participantes',
    minBet: '$60 apuesta',
    status: 'Próximo'
  },
  {
    id: '4',
    title: 'Juventus vs Inter Milan',
    league: 'Serie A',
    date: 'vie, 29 ago',
    time: '20:00',
    venue: 'Allianz Stadium',
    local: { name: 'Juventus', odds: 2.3 },
    draw: { odds: 3.1 },
    away: { name: 'Inter Milan', odds: 3.2 },
    participants: '34/80 participantes',
    minBet: '$40 apuesta',
    status: 'Próximo'
  }
];

export default function MatchesPage() {
  const [selectedSport, setSelectedSport] = useState('Todos los deportes');
  const [selectedLeague, setSelectedLeague] = useState('Todas las ligas');

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header con filtros */}
        <div className="mb-8">
          <BackButton />
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Partidos Deportivos</h1>
              <p className="text-gray-400">Encuentra y apuesta en los próximos encuentros</p>
            </div>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Buscar equipos, ligas..."
                className="w-full bg-[#2a2d47] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <select 
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="bg-[#2a2d47] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            >
              <option>Todos los deportes</option>
              <option>Fútbol</option>
              <option>Baloncesto</option>
              <option>Tenis</option>
            </select>
            <select 
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="bg-[#2a2d47] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            >
              <option>Todas las ligas</option>
              <option>La Liga</option>
              <option>Premier League</option>
              <option>Bundesliga</option>
              <option>Serie A</option>
            </select>
          </div>
        </div>

        {/* Grid de partidos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockMatches.map((match) => (
            <div key={match.id} className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-colors">
              {/* Header del partido */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white mr-3">
                    ⚽
                  </div>
                  <div>
                    <span className="bg-green-600 text-green-100 text-xs px-2 py-1 rounded-full">
                      {match.status}
                    </span>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">{match.league}</span>
              </div>

              {/* Información del partido */}
              <div className="mb-4">
                <h3 className="text-white font-semibold text-lg mb-2">{match.title}</h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <div className="flex items-center">
                    <span className="text-blue-400 mr-2">📅</span>
                    <span>{match.date} {match.time}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">📍</span>
                    <span>{match.venue}</span>
                  </div>
                </div>
              </div>

              {/* Cuotas de apuesta */}
              <div className="mb-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#1a1d29] rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">Local</div>
                    <div className="text-lg font-bold text-white">{match.local.odds}</div>
                  </div>
                  {match.draw && (
                    <div className="bg-[#1a1d29] rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">Empate</div>
                      <div className="text-lg font-bold text-white">{match.draw.odds}</div>
                    </div>
                  )}
                  <div className="bg-[#1a1d29] rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">Visitante</div>
                    <div className="text-lg font-bold text-white">{match.away.odds}</div>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center">
                  <span className="text-blue-400 mr-1">👥</span>
                  <span className="text-gray-400">{match.participants}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-1">💰</span>
                  <span className="text-gray-400">{match.minBet}</span>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mb-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.random() * 80 + 20}%` }}
                  ></div>
                </div>
              </div>

              {/* Botón de crear reto */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                Crear Reto
              </button>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-12 bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
          <h3 className="text-xl font-semibold text-white mb-4">Próximos Eventos Destacados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">24</div>
              <div className="text-sm text-gray-400">Partidos hoy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">156</div>
              <div className="text-sm text-gray-400">Esta semana</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">89</div>
              <div className="text-sm text-gray-400">Retos activos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}