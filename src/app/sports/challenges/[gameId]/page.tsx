'use client'

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';

interface Challenge {
  id: string;
  title: string;
  type: 'Battle Royal' | '1v1 Duel' | 'Group Balanced' | 'Tournament';
  description: string;
  stake: string;
  participants: string;
  maxParticipants: number;
  timeRemaining: string;
  creator: string;
  odds: string;
  status: 'active' | 'full' | 'ended';
  prize: string;
  icon: string;
  iconBg: string;
}

export default function GameChallengesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const gameId = params?.gameId as string;
  const match = searchParams.get('match') || 'Partido Desconocido';
  const league = searchParams.get('league') || 'Liga';
  const sport = searchParams.get('sport') || 'Deporte';

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Battle Royal' | '1v1 Duel' | 'Group Balanced' | 'Tournament'>('all');

  // Generar retos mock para este juego específico
  useEffect(() => {
    const generateChallenges = () => {
      const challengeTypes: Challenge['type'][] = ['Battle Royal', '1v1 Duel', 'Group Balanced', 'Tournament'];
      const challengeTemplates = [
        { title: 'Ganador del Partido', description: 'Predicción del equipo ganador' },
        { title: 'Total de Goles/Puntos', description: 'Predicción del marcador total' },
        { title: 'Primer Gol/Punto', description: 'Quién anotará primero' },
        { title: 'Resultado Exacto', description: 'Marcador exacto del partido' },
        { title: 'Mejor Jugador', description: 'MVP del encuentro' },
        { title: 'Tarjetas/Faltas', description: 'Número de incidencias' },
        { title: 'Tiempo de Primer Gol', description: 'Minuto del primer tanto' },
        { title: 'Corners/Saques', description: 'Estadísticas de juego' }
      ];

      const mockChallenges: Challenge[] = [];
      const numChallenges = Math.floor(Math.random() * 25) + 15; // 15-40 retos

      for (let i = 0; i < numChallenges; i++) {
        const template = challengeTemplates[Math.floor(Math.random() * challengeTemplates.length)];
        const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
        const participants = Math.floor(Math.random() * 15) + 2;
        const maxParticipants = Math.floor(Math.random() * 20) + participants;
        const stake = Math.floor(Math.random() * 200) + 25;

        mockChallenges.push({
          id: `challenge-${gameId}-${i}`,
          title: `${template.title} - ${match}`,
          type,
          description: `${template.description} | ${league} | ${sport}`,
          stake: `$${stake}`,
          participants: `${participants}/${maxParticipants}`,
          maxParticipants,
          timeRemaining: `${Math.floor(Math.random() * 48) + 1}h ${Math.floor(Math.random() * 60)}m`,
          creator: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
          odds: `${(Math.random() * 2 + 1.5).toFixed(2)}x`,
          status: participants >= maxParticipants ? 'full' : 'active',
          prize: `$${Math.floor(stake * (Math.random() * 0.5 + 1.5))}`,
          icon: getIconForSport(sport),
          iconBg: getIconBgForSport(sport)
        });
      }

      return mockChallenges.sort((a, b) => b.maxParticipants - a.maxParticipants);
    };

    setTimeout(() => {
      setChallenges(generateChallenges());
      setLoading(false);
    }, 500);
  }, [gameId, match, league, sport]);

  const getIconForSport = (sport: string): string => {
    const icons: Record<string, string> = {
      'Fútbol': '⚽',
      'Baloncesto': '🏀',
      'Fútbol Americano': '🏈',
      'Béisbol': '⚾',
      'MMA': '🥊',
      'Tenis': '🎾',
      'Hockey': '🏒'
    };
    return icons[sport] || '🏆';
  };

  const getIconBgForSport = (sport: string): string => {
    const backgrounds: Record<string, string> = {
      'Fútbol': 'bg-green-500',
      'Baloncesto': 'bg-orange-500',
      'Fútbol Americano': 'bg-purple-500',
      'Béisbol': 'bg-red-500',
      'MMA': 'bg-yellow-500',
      'Tenis': 'bg-blue-500',
      'Hockey': 'bg-indigo-500'
    };
    return backgrounds[sport] || 'bg-gray-500';
  };

  const filteredChallenges = filter === 'all'
    ? challenges
    : challenges.filter(challenge => challenge.type === filter);

  const getTypeColor = (type: Challenge['type']): string => {
    const colors = {
      'Battle Royal': 'bg-red-600 text-red-200',
      '1v1 Duel': 'bg-blue-600 text-blue-200',
      'Group Balanced': 'bg-green-600 text-green-200',
      'Tournament': 'bg-purple-600 text-purple-200'
    };
    return colors[type];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="h-16 bg-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-opacity-30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-xl font-semibold text-white mb-2">Cargando retos...</div>
              <div className="text-gray-400">Preparando los retos para {match}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Espacio para el header fijo */}
      <div className="h-16 bg-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <BackButton />
          <div className="mt-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-10 h-10 ${getIconBgForSport(sport)} rounded-lg flex items-center justify-center text-xl`}>
                {getIconForSport(sport)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{match}</h1>
                <p className="text-gray-400">{league} • {sport}</p>
              </div>
            </div>
            <p className="text-lg text-gray-300">
              {filteredChallenges.length} retos disponibles para este partido
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 overflow-x-auto py-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-200 border-2 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg border-purple-400'
                  : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Todos ({challenges.length})
            </button>
            {['Battle Royal', '1v1 Duel', 'Group Balanced', 'Tournament'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type as Challenge['type'])}
                className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-200 border-2 ${
                  filter === type
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg border-purple-400'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {type} ({challenges.filter(c => c.type === type).length})
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Retos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredChallenges.map((challenge) => (
            <div key={challenge.id} className="bg-gray-800 border border-gray-600 rounded-xl p-6 hover:border-gray-500 transition-all group hover:scale-105 relative overflow-hidden">
              {/* Status indicator */}
              <div className="absolute top-3 right-3">
                <div className={`w-3 h-3 rounded-full ${
                  challenge.status === 'active' ? 'bg-green-500 animate-pulse' :
                  challenge.status === 'full' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getTypeColor(challenge.type)}`}>
                  {challenge.type}
                </div>
                <div className="text-xs text-gray-400">{challenge.timeRemaining}</div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {challenge.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  {challenge.description}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-xs text-gray-500">Entrada</div>
                    <div className="text-lg font-bold text-green-400">{challenge.stake}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Premio</div>
                    <div className="text-lg font-bold text-yellow-400">{challenge.prize}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-xs text-gray-500">Participantes</div>
                    <div className="text-sm font-medium text-white">{challenge.participants}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Cuotas</div>
                    <div className="text-sm font-bold text-blue-400">{challenge.odds}</div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  Por: {challenge.creator}
                </div>
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                  challenge.status === 'active'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white group-hover:shadow-lg hover:scale-105'
                    : challenge.status === 'full'
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                }`}
                disabled={challenge.status === 'ended'}
              >
                {challenge.status === 'active' ? '🎯 Unirse al Reto' :
                 challenge.status === 'full' ? '👥 Reto Lleno' : '❌ Reto Finalizado'}
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay retos de este tipo
            </h3>
            <p className="text-gray-400 mb-4">
              Intenta con otro filtro o crea un nuevo reto
            </p>
            <Link href={`/sports/create?matchId=${gameId}&matchTitle=${encodeURIComponent(match)}`}>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                ➕ Crear Reto
              </button>
            </Link>
          </div>
        )}

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <Link href={`/sports/create?matchId=${gameId}&matchTitle=${encodeURIComponent(match)}&teams=${encodeURIComponent(match)}&league=${encodeURIComponent(league)}&sport=${encodeURIComponent(sport)}`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110">
              <span className="text-xl">➕</span>
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}