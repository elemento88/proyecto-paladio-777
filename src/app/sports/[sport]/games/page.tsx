'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import { useParams } from 'next/navigation';

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  league: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'live' | 'finished';
  odds: {
    home: string;
    draw?: string;
    away: string;
  };
  totalBets: number;
  volume: string;
}

interface SportInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const sportsInfo: { [key: string]: SportInfo } = {
  'futbol': { id: 'futbol', name: 'Fútbol', icon: '⚽', color: 'text-green-400' },
  'baloncesto': { id: 'baloncesto', name: 'Baloncesto', icon: '🏀', color: 'text-orange-400' },
  'tenis': { id: 'tenis', name: 'Tenis', icon: '🎾', color: 'text-yellow-400' },
  'futbol-americano': { id: 'futbol-americano', name: 'Fútbol Americano', icon: '🏈', color: 'text-purple-400' },
  'beisbol': { id: 'beisbol', name: 'Béisbol', icon: '⚾', color: 'text-red-400' },
  'hockey': { id: 'hockey', name: 'Hockey', icon: '🏒', color: 'text-blue-400' }
};

const mockGames: { [key: string]: Game[] } = {
  'futbol': [
    {
      id: '1',
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      homeTeamLogo: '👑',
      awayTeamLogo: '🔵',
      league: 'La Liga',
      date: '2024-01-28',
      time: '20:00',
      venue: 'Santiago Bernabéu',
      status: 'upcoming',
      odds: { home: '2.10', draw: '3.40', away: '3.20' },
      totalBets: 1247,
      volume: '$89,400'
    },
    {
      id: '2',
      homeTeam: 'Manchester City',
      awayTeam: 'Liverpool',
      homeTeamLogo: '💙',
      awayTeamLogo: '❤️',
      league: 'Premier League',
      date: '2024-01-29',
      time: '17:30',
      venue: 'Etihad Stadium',
      status: 'upcoming',
      odds: { home: '1.85', draw: '3.60', away: '4.20' },
      totalBets: 892,
      volume: '$67,200'
    },
    {
      id: '3',
      homeTeam: 'PSG',
      awayTeam: 'Bayern Munich',
      homeTeamLogo: '🔴',
      awayTeamLogo: '🔴',
      league: 'Champions League',
      date: '2024-01-30',
      time: '21:00',
      venue: 'Parc des Princes',
      status: 'live',
      odds: { home: '2.90', draw: '3.10', away: '2.40' },
      totalBets: 2156,
      volume: '$124,800'
    }
  ],
  'baloncesto': [
    {
      id: '4',
      homeTeam: 'Los Angeles Lakers',
      awayTeam: 'Golden State Warriors',
      homeTeamLogo: '💜',
      awayTeamLogo: '💛',
      league: 'NBA',
      date: '2024-01-28',
      time: '22:30',
      venue: 'Crypto.com Arena',
      status: 'upcoming',
      odds: { home: '1.95', away: '1.85' },
      totalBets: 756,
      volume: '$45,600'
    },
    {
      id: '5',
      homeTeam: 'Boston Celtics',
      awayTeam: 'Miami Heat',
      homeTeamLogo: '☘️',
      awayTeamLogo: '🔥',
      league: 'NBA',
      date: '2024-01-29',
      time: '19:00',
      venue: 'TD Garden',
      status: 'upcoming',
      odds: { home: '1.70', away: '2.10' },
      totalBets: 634,
      volume: '$38,900'
    }
  ],
  'tenis': [
    {
      id: '6',
      homeTeam: 'Novak Djokovic',
      awayTeam: 'Rafael Nadal',
      homeTeamLogo: '🎾',
      awayTeamLogo: '🎾',
      league: 'Australian Open',
      date: '2024-01-30',
      time: '14:00',
      venue: 'Rod Laver Arena',
      status: 'upcoming',
      odds: { home: '1.60', away: '2.40' },
      totalBets: 1890,
      volume: '$156,700'
    }
  ]
};

const sportCategories = [
  { id: 'futbol', name: 'Fútbol', icon: '⚽' },
  { id: 'baloncesto', name: 'Baloncesto', icon: '🏀' },
  { id: 'tenis', name: 'Tenis', icon: '🎾' },
  { id: 'futbol-americano', name: 'Fútbol Americano', icon: '🏈' },
  { id: 'beisbol', name: 'Béisbol', icon: '⚾' },
  { id: 'hockey', name: 'Hockey', icon: '🏒' }
];

export default function SportGamesPage() {
  const params = useParams();
  const sportId = params.sport as string;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'live' | 'finished'>('upcoming');
  
  const currentSport = sportsInfo[sportId];
  const games = mockGames[sportId] || [];
  
  const filteredGames = games.filter(game => {
    const matchesSearch = searchTerm === '' || 
      game.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.league.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || game.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (!currentSport) {
    return <div className="min-h-screen bg-[#1a1d29] text-white p-6">Deporte no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <BackButton fallbackUrl="/sports">
            ← Volver a Deportes
          </BackButton>
          <div className="flex items-center mb-4">
            <div className={`w-12 h-12 bg-[#2a2d47] rounded-xl flex items-center justify-center text-2xl ${currentSport.color} mr-4`}>
              {currentSport.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{currentSport.name}</h1>
              <p className="text-gray-400">Próximos juegos y eventos en vivo</p>
            </div>
          </div>
        </div>

        {/* Barra horizontal de deportes */}
        <div className="mb-8">
          <div className="flex space-x-3 overflow-x-auto pb-4">
            {sportCategories.map((sport) => (
              <Link key={sport.id} href={`/sports/${sport.id}/games`}>
                <div className={`flex-shrink-0 px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                  sportId === sport.id 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-[#2a2d47] border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{sport.icon}</span>
                    <span className="font-medium text-sm">{sport.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Buscador y filtros */}
        <div className="mb-8 bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Buscador */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar equipos, jugadores o ligas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>
            
            {/* Filtros de estado */}
            <div className="flex space-x-2">
              {[
                { key: 'upcoming', label: '⏰ Próximos' },
                { key: 'live', label: '🔴 En Vivo' },
                { key: 'finished', label: '✅ Finalizados' },
                { key: 'all', label: '📊 Todos' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedStatus(filter.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedStatus === filter.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Estadísticas rápidas */}
          <div className="mt-4 pt-4 border-t border-gray-600 flex items-center justify-between text-sm">
            <div className="flex space-x-6">
              <div>
                <span className="text-gray-400">Total encontrados: </span>
                <span className="text-white font-medium">{filteredGames.length}</span>
              </div>
              <div>
                <span className="text-gray-400">En vivo: </span>
                <span className="text-red-400 font-medium">{games.filter(g => g.status === 'live').length}</span>
              </div>
              <div>
                <span className="text-gray-400">Próximos: </span>
                <span className="text-blue-400 font-medium">{games.filter(g => g.status === 'upcoming').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de juegos */}
        <div className="space-y-4">
          {filteredGames.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <div className="text-xl text-gray-400 mb-2">No se encontraron juegos</div>
              <div className="text-gray-500">Intenta con otros términos de búsqueda o filtros</div>
            </div>
          ) : (
            filteredGames.map((game) => (
              <div key={game.id} className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all">
                <div className="flex items-center justify-between">
                  {/* Información del partido */}
                  <div className="flex items-center space-x-6">
                    {/* Estado */}
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        game.status === 'live' ? 'bg-red-500 animate-pulse' :
                        game.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}></div>
                      <div className="text-xs text-gray-400 mt-1 capitalize">{game.status}</div>
                    </div>

                    {/* Equipos */}
                    <div className="flex items-center space-x-4">
                      {/* Equipo local */}
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-[#1a1d29] rounded-lg flex items-center justify-center text-lg">
                          {game.homeTeamLogo}
                        </div>
                        <div>
                          <div className="text-white font-medium">{game.homeTeam}</div>
                          {game.odds.home && (
                            <div className="text-xs text-gray-400">Cuota: {game.odds.home}</div>
                          )}
                        </div>
                      </div>

                      {/* VS */}
                      <div className="text-gray-500 font-bold text-sm">VS</div>

                      {/* Equipo visitante */}
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-[#1a1d29] rounded-lg flex items-center justify-center text-lg">
                          {game.awayTeamLogo}
                        </div>
                        <div>
                          <div className="text-white font-medium">{game.awayTeam}</div>
                          {game.odds.away && (
                            <div className="text-xs text-gray-400">Cuota: {game.odds.away}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detalles del partido */}
                  <div className="flex items-center space-x-8">
                    {/* Información del evento */}
                    <div className="text-right">
                      <div className="text-white font-medium">{game.league}</div>
                      <div className="text-gray-400 text-sm">{game.date} • {game.time}</div>
                      <div className="text-gray-500 text-xs">{game.venue}</div>
                    </div>

                    {/* Estadísticas */}
                    <div className="text-right">
                      <div className="text-green-400 font-medium">{game.volume}</div>
                      <div className="text-gray-400 text-sm">{game.totalBets} apuestas</div>
                      {game.odds.draw && (
                        <div className="text-xs text-gray-400">Empate: {game.odds.draw}</div>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex space-x-2">
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">
                        Ver Detalles
                      </button>
                      <Link href="/create">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                          Apostar
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Información adicional */}
        {filteredGames.length > 0 && (
          <div className="mt-12 bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
            <h3 className="text-xl font-semibold text-white mb-4">💡 Consejos para apostar en {currentSport.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="text-white font-medium mb-2">🔍 Análisis</h4>
                <p className="text-gray-400">Revisa estadísticas recientes, historial de enfrentamientos y condiciones del partido</p>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">💰 Gestión</h4>
                <p className="text-gray-400">Nunca apuestes más de lo que puedes permitirte perder y diversifica tus riesgos</p>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">⏰ Timing</h4>
                <p className="text-gray-400">Las cuotas cambian constantemente, encuentra el momento óptimo para apostar</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}