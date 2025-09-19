'use client'

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NavigationButtons from '@/components/NavigationButtons';
import Footer from '@/components/Footer';
import { publishedChallenges } from '@/lib/publishedChallenges';
import { userParticipations } from '@/lib/userParticipations';

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
  const [joiningChallenge, setJoiningChallenge] = useState<string | null>(null);

  // Cargar retos reales para este juego específico
  useEffect(() => {
    const loadChallenges = () => {
      try {
        // Obtener retos publicados para este partido
        const publishedMatchChallenges = publishedChallenges.getChallengesByMatch(gameId);

        // Convertir a formato Challenge para mantener compatibilidad
        const convertedChallenges: Challenge[] = publishedMatchChallenges.map(challenge => ({
          id: challenge.id,
          title: challenge.title,
          type: challenge.type === 'battle-royal' ? 'Battle Royal' :
                challenge.type === 'group-balanced' ? 'Group Balanced' :
                challenge.type === 'prediction' ? '1v1 Duel' : 'Tournament',
          description: challenge.description,
          stake: `$${challenge.entryAmount}`,
          participants: `${challenge.participants}/${challenge.maxParticipants}`,
          maxParticipants: challenge.maxParticipants,
          timeRemaining: calculateTimeRemaining(challenge.matchData.date, challenge.matchData.time),
          creator: challenge.createdBy,
          odds: calculateOdds(challenge.participants, challenge.maxParticipants),
          status: challenge.status as Challenge['status'],
          prize: `$${challenge.prize}`,
          icon: getIconForSport(sport),
          iconBg: getIconBgForSport(sport)
        }));

        // Si no hay retos reales, generar algunos mock
        if (convertedChallenges.length === 0) {
          const mockChallenges = generateMockChallenges();
          setChallenges(mockChallenges);
        } else {
          setChallenges(convertedChallenges);
        }

        console.log(`📊 Loaded ${convertedChallenges.length} published challenges for match ${gameId}`);
      } catch (error) {
        console.error('Error loading challenges:', error);
        // Fallback a mock challenges en caso de error
        setChallenges(generateMockChallenges());
      }

      setLoading(false);
    };

    // Función auxiliar para calcular tiempo restante
    const calculateTimeRemaining = (date: string, time: string): string => {
      try {
        const matchDateTime = new Date(`${date} ${time}`);
        const now = new Date();
        const diff = matchDateTime.getTime() - now.getTime();

        if (diff <= 0) return 'En curso';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
      } catch {
        return '24h 0m';
      }
    };

    // Función auxiliar para calcular odds
    const calculateOdds = (participants: number, maxParticipants: number): string => {
      const ratio = participants / maxParticipants;
      const odds = 1.5 + (1 - ratio) * 2;
      return `${odds.toFixed(2)}x`;
    };

    // Función para generar mock challenges si no hay reales
    const generateMockChallenges = (): Challenge[] => {
      const challengeTypes: Challenge['type'][] = ['Battle Royal', '1v1 Duel', 'Group Balanced', 'Tournament'];
      const challengeTemplates = [
        { title: 'Ganador del Partido', description: 'Predicción del equipo ganador' },
        { title: 'Total de Goles/Puntos', description: 'Predicción del marcador total' },
        { title: 'Primer Gol/Punto', description: 'Quién anotará primero' },
        { title: 'Resultado Exacto', description: 'Marcador exacto del partido' }
      ];

      return challengeTemplates.map((template, i) => {
        const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
        const participants = Math.floor(Math.random() * 8) + 2;
        const maxParticipants = Math.floor(Math.random() * 10) + participants;
        const stake = Math.floor(Math.random() * 100) + 25;

        return {
          id: `mock-challenge-${gameId}-${i}`,
          title: `${template.title} - ${match}`,
          type,
          description: `${template.description} | ${league} | ${sport}`,
          stake: `$${stake}`,
          participants: `${participants}/${maxParticipants}`,
          maxParticipants,
          timeRemaining: `${Math.floor(Math.random() * 24) + 1}h ${Math.floor(Math.random() * 60)}m`,
          creator: `demo_user_${i}`,
          odds: `${(Math.random() * 1.5 + 1.5).toFixed(2)}x`,
          status: participants >= maxParticipants ? 'full' : 'active',
          prize: `$${Math.floor(stake * (Math.random() * 0.5 + 1.5))}`,
          icon: getIconForSport(sport),
          iconBg: getIconBgForSport(sport)
        };
      });
    };

    setTimeout(loadChallenges, 500);
  }, [gameId, match, league, sport]);

  // Función para unirse a un reto
  const handleJoinChallenge = async (challenge: Challenge) => {
    const userId = 'user_demo'; // Se reemplazará con el ID del usuario real

    try {
      setJoiningChallenge(challenge.id);

      // Verificar si el usuario ya está en este reto
      const isAlreadyJoined = userParticipations.isUserInChallenge(userId, challenge.id);

      if (isAlreadyJoined) {
        alert('Ya estás participando en este reto');
        return;
      }

      // Verificar si el reto está disponible
      if (challenge.status !== 'active') {
        alert('Este reto ya no está disponible');
        return;
      }

      // Crear participación del usuario
      const participation = userParticipations.joinChallenge(
        userId,
        challenge.id,
        challenge.stake.replace('$', ''), // Remover el símbolo $
        [] // Predicciones se pueden agregar después
      );

      // Actualizar el reto en publishedChallenges (incrementar participantes)
      const joined = publishedChallenges.joinChallenge(challenge.id, userId);

      if (joined) {
        // Recargar retos para reflejar el cambio
        const updatedChallenges = challenges.map(c => {
          if (c.id === challenge.id) {
            const parts = c.participants.split('/');
            const currentParticipants = parseInt(parts[0]) + 1;
            const maxParticipants = parseInt(parts[1]);

            return {
              ...c,
              participants: `${currentParticipants}/${maxParticipants}`,
              status: currentParticipants >= maxParticipants ? 'full' as Challenge['status'] : c.status
            };
          }
          return c;
        });

        setChallenges(updatedChallenges);

        alert(`¡Te has unido exitosamente al reto "${challenge.title}"!`);
        console.log('✅ User joined challenge:', participation);
      } else {
        alert('Error al unirse al reto. Inténtalo de nuevo.');
      }

    } catch (error) {
      console.error('Error joining challenge:', error);
      alert('Error al unirse al reto. Inténtalo de nuevo.');
    } finally {
      setJoiningChallenge(null);
    }
  };

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
        <NavigationButtons />
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
      <NavigationButtons />
      {/* Espacio para el header fijo */}
      <div className="h-16 bg-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
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
                onClick={() => handleJoinChallenge(challenge)}
                disabled={challenge.status === 'ended' || challenge.status === 'full' || joiningChallenge === challenge.id}
                className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                  challenge.status === 'active' && joiningChallenge !== challenge.id
                    ? 'bg-purple-600 hover:bg-purple-700 text-white group-hover:shadow-lg hover:scale-105'
                    : challenge.status === 'full'
                    ? 'bg-yellow-600 text-white cursor-not-allowed'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                }`}
              >
                {joiningChallenge === challenge.id ? '⏳ Uniéndose...' :
                 challenge.status === 'active' ? '🎯 Unirse al Reto' :
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