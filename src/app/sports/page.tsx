'use client'

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import HomeButton from '@/components/HomeButton';
import Footer from '@/components/Footer';
import { useSports } from '@/hooks/useSports';
import { LiveScore } from '@/types/sports';

interface SportCategory {
  id: string;
  name: string;
  icon: string;
  logo: string;
  description: string;
  activeGames: number;
  upcomingGames: number;
  totalVolume: string;
  popularLeagues: string[];
  color: string;
  bgColor: string;
}

interface UpcomingGame {
  id: string;
  sport: string;
  sportIcon: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'live' | 'soon';
  minutesToStart: number;
  odds: {
    home: string;
    draw?: string;
    away: string;
  };
  totalBets: number;
  volume: string;
  color: string;
  bgColor: string;
}

const sportsCategories: SportCategory[] = [
  {
    id: 'futbol',
    name: 'Fútbol',
    icon: '⚽',
    logo: '🏆',
    description: 'El deporte más popular del mundo con ligas de élite',
    activeGames: 45,
    upcomingGames: 127,
    totalVolume: '$2.4M',
    popularLeagues: ['Champions League', 'Premier League', 'La Liga', 'Serie A'],
    color: 'text-green-400',
    bgColor: 'from-green-900/20 to-green-800/10'
  },
  {
    id: 'baloncesto',
    name: 'Baloncesto',
    icon: '🏀',
    logo: '🏀',
    description: 'NBA, Euroliga y competencias internacionales',
    activeGames: 32,
    upcomingGames: 89,
    totalVolume: '$1.8M',
    popularLeagues: ['NBA', 'Euroliga', 'NCAA', 'FIBA'],
    color: 'text-orange-400',
    bgColor: 'from-orange-900/20 to-orange-800/10'
  },
  {
    id: 'tenis',
    name: 'Tenis',
    icon: '🎾',
    logo: '🎾',
    description: 'Grand Slams y torneos ATP/WTA',
    activeGames: 28,
    upcomingGames: 156,
    totalVolume: '$920K',
    popularLeagues: ['Wimbledon', 'Roland Garros', 'US Open', 'Australian Open'],
    color: 'text-yellow-400',
    bgColor: 'from-yellow-900/20 to-yellow-800/10'
  },
  {
    id: 'futbol-americano',
    name: 'Fútbol Americano',
    icon: '🏈',
    logo: '🏈',
    description: 'NFL, College Football y competencias profesionales',
    activeGames: 22,
    upcomingGames: 64,
    totalVolume: '$1.2M',
    popularLeagues: ['NFL', 'NCAA', 'CFL', 'XFL'],
    color: 'text-purple-400',
    bgColor: 'from-purple-900/20 to-purple-800/10'
  },
  {
    id: 'beisbol',
    name: 'Béisbol',
    icon: '⚾',
    logo: '⚾',
    description: 'MLB, Ligas Menores y competencias internacionales',
    activeGames: 18,
    upcomingGames: 203,
    totalVolume: '$750K',
    popularLeagues: ['MLB', 'NPB', 'KBO', 'Caribbean Series'],
    color: 'text-red-400',
    bgColor: 'from-red-900/20 to-red-800/10'
  },
  {
    id: 'hockey',
    name: 'Hockey',
    icon: '🏒',
    logo: '🏒',
    description: 'NHL, Ligas Europeas y competencias mundiales',
    activeGames: 12,
    upcomingGames: 45,
    totalVolume: '$380K',
    popularLeagues: ['NHL', 'KHL', 'SHL', 'Champions League'],
    color: 'text-blue-400',
    bgColor: 'from-blue-900/20 to-blue-800/10'
  }
];

const additionalSports: SportCategory[] = [
  {
    id: 'golf',
    name: 'Golf',
    icon: '⛳',
    logo: '⛳',
    description: 'Torneos PGA, Masters y competencias internacionales',
    activeGames: 8,
    upcomingGames: 24,
    totalVolume: '$180K',
    popularLeagues: ['PGA Tour', 'Masters', 'The Open', 'Ryder Cup'],
    color: 'text-emerald-400',
    bgColor: 'from-emerald-900/20 to-emerald-800/10'
  },
  {
    id: 'voleibol',
    name: 'Voleibol',
    icon: '🏐',
    logo: '🏐',
    description: 'Ligas nacionales y competencias olímpicas',
    activeGames: 6,
    upcomingGames: 18,
    totalVolume: '$85K',
    popularLeagues: ['FIVB', 'CEV', 'Liga Nacional', 'Olympics'],
    color: 'text-pink-400',
    bgColor: 'from-pink-900/20 to-pink-800/10'
  },
  {
    id: 'rugby',
    name: 'Rugby',
    icon: '🏉',
    logo: '🏉',
    description: 'Six Nations, World Cup y ligas profesionales',
    activeGames: 4,
    upcomingGames: 12,
    totalVolume: '$120K',
    popularLeagues: ['Six Nations', 'World Cup', 'Premiership', 'Super Rugby'],
    color: 'text-indigo-400',
    bgColor: 'from-indigo-900/20 to-indigo-800/10'
  },
  {
    id: 'boxeo',
    name: 'Boxeo',
    icon: '🥊',
    logo: '🥊',
    description: 'Peleas profesionales y campeonatos mundiales',
    activeGames: 15,
    upcomingGames: 32,
    totalVolume: '$450K',
    popularLeagues: ['WBC', 'WBA', 'IBF', 'WBO'],
    color: 'text-red-500',
    bgColor: 'from-red-900/20 to-red-800/10'
  },
  {
    id: 'ciclismo',
    name: 'Ciclismo',
    icon: '🚴',
    logo: '🚴',
    description: 'Tour de France, Giro d\'Italia y competencias UCI',
    activeGames: 3,
    upcomingGames: 9,
    totalVolume: '$95K',
    popularLeagues: ['Tour de France', 'Giro d\'Italia', 'Vuelta', 'UCI'],
    color: 'text-cyan-400',
    bgColor: 'from-cyan-900/20 to-cyan-800/10'
  },
  {
    id: 'mma',
    name: 'MMA',
    icon: '🥋',
    logo: '🥋',
    description: 'UFC, Bellator y competencias de artes marciales mixtas',
    activeGames: 8,
    upcomingGames: 19,
    totalVolume: '$340K',
    popularLeagues: ['UFC', 'Bellator', 'ONE Championship', 'PFL'],
    color: 'text-orange-500',
    bgColor: 'from-orange-900/20 to-orange-800/10'
  },
  {
    id: 'natacion',
    name: 'Natación',
    icon: '🏊',
    logo: '🏊',
    description: 'Competencias olímpicas y mundiales de natación',
    activeGames: 2,
    upcomingGames: 7,
    totalVolume: '$45K',
    popularLeagues: ['Olympics', 'World Championships', 'FINA', 'NCAA'],
    color: 'text-teal-400',
    bgColor: 'from-teal-900/20 to-teal-800/10'
  },
  {
    id: 'atletismo',
    name: 'Atletismo',
    icon: '🏃',
    logo: '🏃',
    description: 'Atletismo olímpico, Diamond League y maratones',
    activeGames: 5,
    upcomingGames: 14,
    totalVolume: '$125K',
    popularLeagues: ['Olympics', 'Diamond League', 'World Championships', 'Boston Marathon'],
    color: 'text-amber-400',
    bgColor: 'from-amber-900/20 to-amber-800/10'
  }
];

// Datos mock de juegos próximos basados en eventos reales
const upcomingGames: UpcomingGame[] = [
  {
    id: '1',
    sport: 'Fútbol',
    sportIcon: '⚽',
    league: 'Premier League',
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    homeTeamLogo: '💙',
    awayTeamLogo: '❤️',
    date: '2024-01-28',
    time: '17:30',
    venue: 'Etihad Stadium',
    status: 'soon',
    minutesToStart: 45,
    odds: { home: '2.10', draw: '3.40', away: '3.20' },
    totalBets: 1247,
    volume: '$89.4K',
    color: 'text-green-400',
    bgColor: 'from-green-900/20 to-green-800/10'
  },
  {
    id: '2',
    sport: 'Baloncesto',
    sportIcon: '🏀',
    league: 'NBA',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    homeTeamLogo: '💜',
    awayTeamLogo: '💛',
    date: '2024-01-28',
    time: '22:30',
    venue: 'Crypto.com Arena',
    status: 'upcoming',
    minutesToStart: 180,
    odds: { home: '1.95', away: '1.85' },
    totalBets: 892,
    volume: '$67.2K',
    color: 'text-orange-400',
    bgColor: 'from-orange-900/20 to-orange-800/10'
  },
  {
    id: '3',
    sport: 'Fútbol',
    sportIcon: '⚽',
    league: 'La Liga',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    homeTeamLogo: '👑',
    awayTeamLogo: '🔵',
    date: '2024-01-28',
    time: '20:00',
    venue: 'Santiago Bernabéu',
    status: 'live',
    minutesToStart: 0,
    odds: { home: '2.30', draw: '3.10', away: '2.90' },
    totalBets: 2156,
    volume: '$124.8K',
    color: 'text-green-400',
    bgColor: 'from-green-900/20 to-green-800/10'
  },
  {
    id: '4',
    sport: 'Tenis',
    sportIcon: '🎾',
    league: 'Australian Open',
    homeTeam: 'Djokovic',
    awayTeam: 'Nadal',
    homeTeamLogo: '🎾',
    awayTeamLogo: '🎾',
    date: '2024-01-29',
    time: '14:00',
    venue: 'Rod Laver Arena',
    status: 'upcoming',
    minutesToStart: 720,
    odds: { home: '1.60', away: '2.40' },
    totalBets: 1456,
    volume: '$98.7K',
    color: 'text-yellow-400',
    bgColor: 'from-yellow-900/20 to-yellow-800/10'
  },
  {
    id: '5',
    sport: 'Fútbol Americano',
    sportIcon: '🏈',
    league: 'NFL',
    homeTeam: 'Chiefs',
    awayTeam: 'Ravens',
    homeTeamLogo: '🔴',
    awayTeamLogo: '💜',
    date: '2024-01-28',
    time: '21:00',
    venue: 'Arrowhead Stadium',
    status: 'soon',
    minutesToStart: 90,
    odds: { home: '1.75', away: '2.05' },
    totalBets: 1687,
    volume: '$156.3K',
    color: 'text-purple-400',
    bgColor: 'from-purple-900/20 to-purple-800/10'
  },
  {
    id: '6',
    sport: 'Baloncesto',
    sportIcon: '🏀',
    league: 'NBA',
    homeTeam: 'Celtics',
    awayTeam: 'Heat',
    homeTeamLogo: '☘️',
    awayTeamLogo: '🔥',
    date: '2024-01-29',
    time: '19:00',
    venue: 'TD Garden',
    status: 'upcoming',
    minutesToStart: 1200,
    odds: { home: '1.70', away: '2.10' },
    totalBets: 634,
    volume: '$38.9K',
    color: 'text-orange-400',
    bgColor: 'from-orange-900/20 to-orange-800/10'
  },
  {
    id: '7',
    sport: 'Hockey',
    sportIcon: '🏒',
    league: 'NHL',
    homeTeam: 'Rangers',
    awayTeam: 'Bruins',
    homeTeamLogo: '🔵',
    awayTeamLogo: '🟡',
    date: '2024-01-28',
    time: '19:30',
    venue: 'Madison Square Garden',
    status: 'upcoming',
    minutesToStart: 150,
    odds: { home: '2.20', away: '1.65' },
    totalBets: 478,
    volume: '$29.5K',
    color: 'text-blue-400',
    bgColor: 'from-blue-900/20 to-blue-800/10'
  },
  {
    id: '8',
    sport: 'Béisbol',
    sportIcon: '⚾',
    league: 'MLB Spring',
    homeTeam: 'Yankees',
    awayTeam: 'Red Sox',
    homeTeamLogo: '⚪',
    awayTeamLogo: '🔴',
    date: '2024-01-29',
    time: '13:05',
    venue: 'Yankee Stadium',
    status: 'upcoming',
    minutesToStart: 960,
    odds: { home: '1.85', away: '1.95' },
    totalBets: 567,
    volume: '$34.2K',
    color: 'text-red-400',
    bgColor: 'from-red-900/20 to-red-800/10'
  },
  {
    id: '9',
    sport: 'Fútbol',
    sportIcon: '⚽',
    league: 'Champions League',
    homeTeam: 'PSG',
    awayTeam: 'Bayern',
    homeTeamLogo: '🔴',
    awayTeamLogo: '🔴',
    date: '2024-01-30',
    time: '21:00',
    venue: 'Parc des Princes',
    status: 'upcoming',
    minutesToStart: 1680,
    odds: { home: '2.90', draw: '3.20', away: '2.30' },
    totalBets: 1934,
    volume: '$187.6K',
    color: 'text-green-400',
    bgColor: 'from-green-900/20 to-green-800/10'
  },
  {
    id: '10',
    sport: 'Tenis',
    sportIcon: '🎾',
    league: 'Australian Open',
    homeTeam: 'Alcaraz',
    awayTeam: 'Medvedev',
    homeTeamLogo: '🎾',
    awayTeamLogo: '🎾',
    date: '2024-01-29',
    time: '09:00',
    venue: 'Melbourne Park',
    status: 'upcoming',
    minutesToStart: 540,
    odds: { home: '1.90', away: '1.90' },
    totalBets: 1123,
    volume: '$76.8K',
    color: 'text-yellow-400',
    bgColor: 'from-yellow-900/20 to-yellow-800/10'
  }
];

export default function SportsPage() {
  const searchParams = useSearchParams();
  const [showMoreSports, setShowMoreSports] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Hook para obtener datos deportivos reales de TheSportsDB
  const { 
    sports: availableSports,
    todaysFixtures, 
    loading, 
    error,
    fetchTodaysFixtures 
  } = useSports();
  
  // Obtener parámetros de URL para filtrado por deporte
  const sportFilter = searchParams.get('sport');
  const gameCount = searchParams.get('gameCount') ? parseInt(searchParams.get('gameCount')!) : 1;

  // Cargar eventos al montar el componente
  useEffect(() => {
    fetchTodaysFixtures();
  }, [fetchTodaysFixtures]);

  // Convertir datos de API a formato de juego para mostrar con manejo de errores
  const convertApiDataToGame = (liveScore: LiveScore): UpcomingGame => {
    // Validaciones de seguridad
    if (!liveScore || !liveScore.homeTeam || !liveScore.awayTeam) {
      throw new Error('Datos de evento incompletos');
    }

    const sportColors = {
      'soccer': { color: 'text-green-400', bgColor: 'from-green-900/20 to-green-800/10' },
      'basketball': { color: 'text-orange-400', bgColor: 'from-orange-900/20 to-orange-800/10' },
      'american football': { color: 'text-purple-400', bgColor: 'from-purple-900/20 to-purple-800/10' },
      'ice hockey': { color: 'text-blue-400', bgColor: 'from-blue-900/20 to-blue-800/10' },
      'baseball': { color: 'text-red-400', bgColor: 'from-red-900/20 to-red-800/10' },
      'tennis': { color: 'text-yellow-400', bgColor: 'from-yellow-900/20 to-yellow-800/10' },
    } as const;

    const sport = (liveScore.sport || 'soccer').toLowerCase();
    const sportInfo = sportColors[sport as keyof typeof sportColors] || 
                     { color: 'text-gray-400', bgColor: 'from-gray-900/20 to-gray-800/10' };

    const sportIcons = {
      'soccer': '⚽',
      'basketball': '🏀', 
      'american football': '🏈',
      'ice hockey': '🏒',
      'baseball': '⚾',
      'tennis': '🎾',
    } as const;

    let eventDate: Date;
    let minutesToStart = 0;
    
    try {
      eventDate = new Date(liveScore.date || new Date());
      const now = new Date();
      minutesToStart = Math.max(0, Math.floor((eventDate.getTime() - now.getTime()) / (1000 * 60)));
    } catch (error) {
      eventDate = new Date();
      console.warn('Error parsing date:', error);
    }
    
    const sportName = sport === 'soccer' ? 'Fútbol' : 
                     sport === 'basketball' ? 'Baloncesto' :
                     sport === 'american football' ? 'Fútbol Americano' :
                     sport === 'ice hockey' ? 'Hockey' :
                     sport === 'baseball' ? 'Béisbol' :
                     sport === 'tennis' ? 'Tenis' : 
                     sport.charAt(0).toUpperCase() + sport.slice(1);
    
    return {
      id: (liveScore.id || Math.random()).toString(),
      sport: sportName,
      sportIcon: sportIcons[sport as keyof typeof sportIcons] || '🏆',
      league: liveScore.league || 'Liga',
      homeTeam: liveScore.homeTeam || 'Equipo Local',
      awayTeam: liveScore.awayTeam || 'Equipo Visitante',
      homeTeamLogo: '🏠',
      awayTeamLogo: '🚗',
      date: eventDate.toISOString().split('T')[0],
      time: liveScore.time || 'TBD',
      venue: 'Stadium',
      status: (liveScore.status === 'Match Finished' || liveScore.status?.includes('Finished')) ? 'upcoming' : 
              (liveScore.status?.includes('Half') || liveScore.status?.includes('Live')) ? 'live' :
              minutesToStart < 120 ? 'soon' : 'upcoming',
      minutesToStart,
      odds: {
        home: '2.10',
        draw: sport === 'soccer' ? '3.20' : undefined,
        away: '1.85'
      },
      totalBets: Math.floor(Math.random() * 500) + 100,
      volume: `$${(Math.random() * 100 + 20).toFixed(1)}K`,
      ...sportInfo
    };
  };

  // Combinar eventos reales de API con algunos datos mock con manejo de errores
  const realGames = todaysFixtures
    ?.filter(fixture => fixture && fixture.homeTeam && fixture.awayTeam)
    ?.map(fixture => {
      try {
        return convertApiDataToGame(fixture);
      } catch (error) {
        console.warn('Error converting API data:', error);
        return null;
      }
    })
    ?.filter(Boolean) || [];
    
  const allGames = realGames.length > 0 ? realGames : upcomingGames;

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMoreSports(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filtrar deportes basado en búsqueda
  const filteredSports = sportsCategories.filter(sport =>
    sport.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar juegos basado en deporte seleccionado
  const filteredGames = sportFilter && allGames ? 
    allGames.filter(game => game?.sport?.toLowerCase() === sportFilter.toLowerCase()) : 
    allGames || [];

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <HomeButton />
            <Link href="/" className="text-gray-400 hover:text-white flex items-center">
              ← Volver al inicio
            </Link>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-4xl font-bold text-white">Deportes</h1>
                {gameCount > 1 && (
                  <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-sm">
                    Añadiendo Partido {gameCount} de 15
                  </span>
                )}
                {sportFilter && (
                  <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-sm">
                    Filtrado: {sportFilter}
                  </span>
                )}
              </div>
              <p className="text-gray-400">Selecciona una categoría deportiva para ver próximos juegos y crear retos</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Deportes Disponibles</div>
              <div className="text-2xl font-bold text-white">{sportsCategories.length + additionalSports.length}</div>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y deportes */}
        <div className="mb-8 relative">
          <h2 className="text-xl font-semibold text-white mb-4">Deportes Populares</h2>
          
          <div className="flex items-center justify-between gap-8">
            {/* Barra de búsqueda - Izquierda */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar deportes, ligas o equipos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#2a2d47] border border-gray-600 rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  🔍
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Botones de deportes - Derecha */}
            <div className="flex space-x-3 overflow-x-visible pb-4 min-w-fit">
              {filteredSports.map((sport) => (
                <Link key={sport.id} href={`/sports/${sport.id}/games${gameCount > 1 ? `?gameCount=${gameCount}` : ''}`}>
                  <div className="flex-shrink-0 group cursor-pointer">
                    <div className={`w-16 h-16 bg-gradient-to-br ${sport.bgColor} border border-gray-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-200 group-hover:border-gray-400`}>
                      {sport.logo}
                    </div>
                    <div className="text-xs text-center text-gray-400 mt-2 group-hover:text-white transition-colors w-16 truncate">
                      {sport.name}
                    </div>
                  </div>
                </Link>
              ))}
              
              {/* Botón Más */}
              <div className="relative flex-shrink-0" ref={dropdownRef}>
                <div className="group cursor-pointer" onClick={() => setShowMoreSports(!showMoreSports)}>
                  <div className={`w-16 h-16 bg-gradient-to-br from-gray-900/20 to-gray-800/10 border border-gray-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-200 group-hover:border-gray-400 ${showMoreSports ? 'border-blue-500 bg-blue-600/20' : ''}`}>
                    <span className={`transition-transform duration-200 ${showMoreSports ? 'rotate-90' : ''} text-gray-400`}>⋯</span>
                  </div>
                  <div className="text-xs text-center text-gray-400 mt-2 group-hover:text-white transition-colors w-16">
                    Más
                  </div>
                </div>

                {/* Lista desplegable */}
                {showMoreSports && (
                  <div className="absolute top-20 right-0 w-96 bg-[#2a2d47] border border-gray-600 rounded-xl shadow-2xl z-50 p-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Más Deportes</h3>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMoreSports(false);
                        }}
                        className="text-gray-400 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded hover:bg-gray-600 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                      {additionalSports.map((sport) => (
                        <Link key={sport.id} href={`/sports/${sport.id}/games${gameCount > 1 ? `?gameCount=${gameCount}` : ''}`} onClick={() => setShowMoreSports(false)}>
                          <div className={`bg-gradient-to-br ${sport.bgColor} border border-gray-600 rounded-lg p-3 hover:border-gray-500 transition-all cursor-pointer group hover:scale-105`}>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className={`w-8 h-8 bg-[#1a1d29] rounded-lg flex items-center justify-center text-sm ${sport.color}`}>
                                {sport.icon}
                              </div>
                              <div>
                                <div className="text-white font-medium text-sm">{sport.name}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-center">
                                <div className={`font-bold ${sport.color}`}>{sport.activeGames}</div>
                                <div className="text-gray-400">Activos</div>
                              </div>
                              <div className="text-center">
                                <div className={`font-bold ${sport.color}`}>{sport.upcomingGames}</div>
                                <div className="text-gray-400">Próximos</div>
                              </div>
                            </div>
                            
                            <div className="mt-2 text-center">
                              <div className="text-xs text-gray-400">Volumen</div>
                              <div className="text-xs text-white font-medium">{sport.totalVolume}</div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-600 text-center">
                      <div className="text-xs text-gray-400">
                        {additionalSports.length} deportes adicionales disponibles
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grid de juegos próximos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">🔥 Próximos Eventos</h2>
            <div className="flex items-center space-x-3">
              {realGames.length > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Datos en tiempo real - TheSportsDB</span>
                </div>
              )}
              {loading && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-blue-400">Cargando eventos...</span>
                </div>
              )}
              {error && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-red-400">⚠️ {error}</span>
                </div>
              )}
            </div>
          </div>

          {filteredGames.length === 0 ? (
            <div className="bg-[#2a2d47] border border-gray-600 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">🏟️</div>
              <h3 className="text-xl font-semibold text-white mb-2">No hay eventos disponibles</h3>
              <p className="text-gray-400 mb-4">
                {sportFilter 
                  ? `No encontramos eventos para ${sportFilter} en este momento.` 
                  : "No hay eventos programados en este momento."}
              </p>
              <button 
                onClick={fetchTodaysFixtures}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {loading ? 'Cargando...' : '🔄 Actualizar'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredGames.map((game) => (
                <div key={game.id} className={`bg-gradient-to-br ${game.bgColor} border border-gray-600 rounded-xl p-4 hover:border-gray-500 transition-all group hover:scale-105 relative overflow-hidden h-full flex flex-col`}>
                  {/* Status indicator */}
                  <div className="absolute top-2 right-2">
                    <div className={`w-2 h-2 rounded-full ${
                      game.status === 'live' ? 'bg-red-500 animate-pulse' :
                      game.status === 'soon' ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500'
                    }`}></div>
                  </div>

                  {/* Contenido principal - flex-1 para expandir */}
                  <div className="flex-1 flex flex-col">
                    {/* Header del evento */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 bg-[#2a2d47] rounded-lg flex items-center justify-center text-sm ${game.color}`}>
                          {game.sportIcon}
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">{game.sport}</div>
                          <div className="text-xs font-medium text-white">{game.league}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-bold ${game.color}`}>{game.volume}</div>
                        <div className="text-xs text-gray-400">{game.totalBets} retos</div>
                      </div>
                    </div>

                    {/* Equipos */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 flex-1">
                          <span className="text-sm">{game.homeTeamLogo}</span>
                          <span className="text-xs text-white font-medium truncate">{game.homeTeam}</span>
                        </div>
                        <span className="text-xs text-gray-500 mx-2">vs</span>
                        <div className="flex items-center space-x-2 flex-1 justify-end">
                          <span className="text-xs text-white font-medium truncate">{game.awayTeam}</span>
                          <span className="text-sm">{game.awayTeamLogo}</span>
                        </div>
                      </div>
                    </div>

                    {/* Información del partido */}
                    <div className="mb-3">
                      <div className="text-center">
                        <div className="text-xs text-gray-400 mb-1">{game.venue}</div>
                        <div className="text-xs font-medium text-white">{game.date} • {game.time}</div>
                        <div className={`text-xs mt-1 ${
                          game.status === 'live' ? 'text-red-400 font-bold' :
                          game.status === 'soon' ? 'text-yellow-400 font-bold' : 'text-blue-400'
                        }`}>
                          {game.status === 'live' ? '🔴 EN VIVO' :
                           game.status === 'soon' ? `⏰ En ${game.minutesToStart}min` :
                           `⏳ En ${Math.floor(game.minutesToStart / 60)}h ${game.minutesToStart % 60}min`}
                        </div>
                      </div>
                    </div>

                    {/* Cuotas - flex-1 para empujar el botón hacia abajo */}
                    <div className="flex-1 mb-3">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-center bg-gray-800/50 rounded px-2 py-1">
                          <div className="text-xs text-gray-400">Local</div>
                          <div className={`text-xs font-bold ${game.color}`}>{game.odds.home}</div>
                        </div>
                        <div className="text-center bg-gray-800/50 rounded px-2 py-1">
                          <div className="text-xs text-gray-400">Visit.</div>
                          <div className={`text-xs font-bold ${game.color}`}>{game.odds.away}</div>
                        </div>
                      </div>
                      {game.odds.draw && (
                        <div className="text-center bg-gray-800/50 rounded px-2 py-1 mt-1">
                          <div className="text-xs text-gray-400">Empate</div>
                          <div className={`text-xs font-bold ${game.color}`}>{game.odds.draw}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botón de acción - siempre en la parte inferior */}
                  <div className="pt-3 border-t border-gray-600 mt-auto">
                    <Link href={`/sports/create?matchId=${game.id}&matchTitle=${encodeURIComponent(game.homeTeam + ' vs ' + game.awayTeam)}&teams=${encodeURIComponent(game.homeTeam + ' vs ' + game.awayTeam)}&date=${encodeURIComponent(game.date)}&time=${encodeURIComponent(game.time)}&league=${encodeURIComponent(game.league)}&sport=${encodeURIComponent(game.sport)}${gameCount > 1 ? `&gameCount=${gameCount}` : ''}`}>
                      <button className="w-full py-2 px-3 rounded-lg transition-all font-medium text-xs bg-blue-600 hover:bg-blue-700 text-white group-hover:shadow-lg">
                        ➕ Crear Reto
                      </button>
                    </Link>
                  </div>
                </div>
            ))}
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
            <h3 className="text-xl font-semibold text-white mb-4">🔥 Deportes Trending</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg mr-2">⚽</span>
                  <span className="text-white">Fútbol</span>
                </div>
                <span className="text-green-400 text-sm">+24%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg mr-2">🏀</span>
                  <span className="text-white">Baloncesto</span>
                </div>
                <span className="text-green-400 text-sm">+18%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg mr-2">🎾</span>
                  <span className="text-white">Tenis</span>
                </div>
                <span className="text-green-400 text-sm">+12%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
            <h3 className="text-xl font-semibold text-white mb-4">📊 Estadísticas en Tiempo Real</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Eventos Disponibles</span>
                <span className="text-white font-semibold">{allGames?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Deportes Activos</span>
                <span className="text-blue-400 font-semibold">{availableSports?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Eventos en Vivo</span>
                <span className="text-green-400 font-semibold">
                  {allGames?.filter(game => game?.status === 'live')?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Estado API</span>
                <span className={`font-semibold ${error ? 'text-red-400' : 'text-green-400'}`}>
                  {error ? 'Error' : loading ? 'Cargando...' : 'Conectado'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
            <h3 className="text-xl font-semibold text-white mb-4">🎯 Próximos Eventos</h3>
            <div className="space-y-3">
              {allGames && allGames.length > 0 ? allGames.slice(0, 4).map((game, index) => (
                <div key={game?.id || index} className="text-sm">
                  <div className="text-white font-medium">
                    {game?.homeTeam || 'TBD'} vs {game?.awayTeam || 'TBD'}
                  </div>
                  <div className="text-gray-400">
                    {game?.date || 'TBD'} {game?.time || ''} - {game?.league || 'Liga'}
                  </div>
                  {game?.status === 'live' && (
                    <div className="text-red-400 text-xs font-bold">🔴 EN VIVO</div>
                  )}
                </div>
              )) : (
                <div className="text-sm text-gray-400 text-center py-4">
                  No hay eventos próximos disponibles
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-600/10 to-green-600/10 border border-gray-600 rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-white mb-2">¿No encuentras tu deporte favorito?</h3>
            <p className="text-gray-400 mb-6">Sugiérenos nuevos deportes y ligas para incluir en la plataforma</p>
            <div className="flex items-center justify-center space-x-4">
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">
                📝 Sugerir Deporte
              </button>
              <Link href="/create">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                  ➕ Crear Reto Personalizado
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}