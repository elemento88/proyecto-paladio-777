'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import HomeButton from '@/components/HomeButton';
import Footer from '@/components/Footer';
import DatabaseDiagnostic from '@/components/DatabaseDiagnostic';
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
  }
];

// Ya no necesitamos deportes adicionales, solo los 7 deportes permitidos

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

// Función para obtener iconos de ligas
function getLeagueIcon(league: string): string {
  const leagueIcons: { [key: string]: string } = {
    'Premier League': '⚽',
    'La Liga': '🇪🇸',
    'Serie A': '🇮🇹',
    'Bundesliga': '🇩🇪',
    'Ligue 1': '🇫🇷',
    'Champions League': '🏆',
    'Europa League': '🥉',
    'Liga de Naciones UEFA': '🇪🇺',
    'NBA': '🏀',
    'EuroLeague': '🏀',
    'NCAA': '🎓',
    'ATP Tour': '🎾',
    'WTA Tour': '🎾',
    'Grand Slam': '🏆',
    'MLB': '⚾',
    'NHL': '🏒',
    'FIVB': '🏐',
    'World Cup': '🏆',
    'Six Nations': '🏉',
    'UFC': '🥋',
    'PGA Tour': '⛳',
    'Masters': '🏆',
    'F1': '🏎️',
    'MotoGP': '🏍️'
  };
  
  // Buscar coincidencia exacta o parcial
  const exactMatch = leagueIcons[league];
  if (exactMatch) return exactMatch;
  
  // Buscar coincidencia parcial
  for (const [key, icon] of Object.entries(leagueIcons)) {
    if (league.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(league.toLowerCase())) {
      return icon;
    }
  }
  
  // Iconos por defecto según tipo de deporte detectado
  if (league.toLowerCase().includes('football') || league.toLowerCase().includes('soccer') || league.toLowerCase().includes('liga')) {
    return '⚽';
  } else if (league.toLowerCase().includes('basketball') || league.toLowerCase().includes('nba')) {
    return '🏀';
  } else if (league.toLowerCase().includes('tennis')) {
    return '🎾';
  } else if (league.toLowerCase().includes('baseball')) {
    return '⚾';
  } else if (league.toLowerCase().includes('hockey')) {
    return '🏒';
  } else if (league.toLowerCase().includes('volley')) {
    return '🏐';
  } else if (league.toLowerCase().includes('rugby')) {
    return '🏉';
  }
  
  return '🏆'; // Icono por defecto
}

export default function SportsPage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Estados para scroll infinito
  const [displayedCount, setDisplayedCount] = useState(60);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 20;
  
  
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

  // Combinar eventos reales de API con todos los datos mock
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
    
  // Combinar TODOS los eventos: reales + mock para máxima abundancia
  const allGames = [...realGames, ...upcomingGames];
  
  // Log para debugging
  React.useEffect(() => {
    console.log(`🎯 TOTAL DE EVENTOS DISPONIBLES: ${allGames.length}`);
    console.log(`📊 Eventos reales de API: ${realGames.length}`);
    console.log(`🎭 Eventos mock/sintéticos: ${upcomingGames.length}`);
  }, [allGames.length, realGames.length]);


  // Filtrar deportes basado en búsqueda
  const filteredSports = sportsCategories.filter(sport =>
    sport.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener todas las ligas únicas de los juegos
  const availableLeagues = useMemo(() => {
    const leagues = new Set<string>();
    allGames?.forEach(game => {
      if (game?.league) {
        leagues.add(game.league);
      }
    });
    return Array.from(leagues).sort();
  }, [allGames]);

  // Filtrar juegos basado en búsqueda, deporte y liga seleccionada
  const filteredGames = useMemo(() => {
    let games = allGames || [];
    
    // Filtrar por deporte seleccionado desde URL si existe
    if (sportFilter) {
      games = games.filter(game => game?.sport?.toLowerCase() === sportFilter.toLowerCase());
    }
    
    // Filtrar por deporte seleccionado desde botones si existe
    if (selectedSport && selectedSport !== 'all') {
      games = games.filter(game => game?.sport?.toLowerCase() === selectedSport.toLowerCase());
    }
    
    // Filtrar por liga seleccionada si existe
    if (selectedLeague && selectedLeague !== 'all') {
      games = games.filter(game => game?.league === selectedLeague);
    }
    
    // Filtrar por término de búsqueda si existe
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      games = games.filter(game => {
        if (!game) return false;
        
        // Buscar en nombres de equipos
        const homeTeamMatch = game.homeTeam?.toLowerCase().includes(searchLower);
        const awayTeamMatch = game.awayTeam?.toLowerCase().includes(searchLower);
        
        // Buscar en liga
        const leagueMatch = game.league?.toLowerCase().includes(searchLower);
        
        // Buscar en deporte
        const sportMatch = game.sport?.toLowerCase().includes(searchLower);
        
        // Buscar en venue
        const venueMatch = game.venue?.toLowerCase().includes(searchLower);
        
        return homeTeamMatch || awayTeamMatch || leagueMatch || sportMatch || venueMatch;
      });
    }
    
    return games;
  }, [allGames, sportFilter, selectedSport, selectedLeague, searchTerm]);

  // Eventos para mostrar (paginados)
  const displayedGames = filteredGames.slice(0, displayedCount);

  // Función para cargar más eventos
  const loadMoreGames = () => {
    if (isLoadingMore || displayedCount >= filteredGames.length) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredGames.length));
      setIsLoadingMore(false);
    }, 300);
  };

  // Scroll infinito: detectar cuando llegue al final
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight) {
        if (!isLoadingMore && displayedCount < filteredGames.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredGames.length));
            setIsLoadingMore(false);
          }, 300);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, displayedCount, filteredGames.length]);

  // Reset cuando cambian filtros
  React.useEffect(() => {
    setDisplayedCount(60);
  }, [searchTerm, selectedLeague, selectedSport, sportFilter]);

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white">
      <div className="flex relative">
        {/* Sidebar izquierda - Ligas */}
        <div className={`w-64 bg-[#1a1d29] border-r border-gray-600 min-h-screen p-4 absolute left-0 top-0 overflow-y-auto z-40 transition-transform duration-300 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`} style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4b5563 transparent'
        }}>
          <div className="mb-6">
            <HomeButton />
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">🏆 Ligas</h2>
            
            {/* Botón para mostrar todas las ligas */}
            <button
              onClick={() => setSelectedLeague('all')}
              className={`w-full text-left p-2 mb-1 transition-all hover:bg-gray-700 ${
                selectedLeague === 'all' 
                  ? 'text-blue-400 bg-blue-600/10' 
                  : 'text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm">🌍</span>
                <div className="text-sm font-medium">Todas las Ligas</div>
                <div className="text-xs text-gray-500 ml-auto">
                  {allGames?.length || 0}
                </div>
              </div>
            </button>
            
            {/* Lista de ligas */}
            <div className="space-y-0 overflow-visible">
              {availableLeagues.map(league => {
                const leagueGames = allGames?.filter(game => game?.league === league) || [];
                const leagueIcon = getLeagueIcon(league);
                
                return (
                  <button
                    key={league}
                    onClick={() => setSelectedLeague(league)}
                    className={`w-full text-left p-2 transition-all hover:bg-gray-700 ${
                      selectedLeague === league 
                        ? 'text-blue-400 bg-blue-600/10' 
                        : 'text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{leagueIcon}</span>
                      <div className="text-sm font-medium truncate flex-1">{league}</div>
                      <div className="text-xs text-gray-500">
                        {leagueGames.length}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Retos de Usuarios */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-3">🎯 Retos Activos</h3>
            <div className="space-y-3">
              {/* Reto 1 */}
              <div className="bg-[#2a2d47]/50 border border-gray-600 rounded-lg p-3 hover:bg-gray-700/30 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      M
                    </div>
                    <span className="text-sm text-white font-medium">Mario_77</span>
                  </div>
                  <span className="text-xs text-green-400 font-bold">$250</span>
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  Real Madrid vs Barcelona
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-400">Champions League</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">⏱️ 2h 15m</span>
                  </div>
                </div>
              </div>

              {/* Reto 2 */}
              <div className="bg-[#2a2d47]/50 border border-gray-600 rounded-lg p-3 hover:bg-gray-700/30 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      A
                    </div>
                    <span className="text-sm text-white font-medium">Ana_Bet</span>
                  </div>
                  <span className="text-xs text-green-400 font-bold">$150</span>
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  Lakers vs Warriors
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-orange-400">NBA</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">⏱️ 45m</span>
                  </div>
                </div>
              </div>

              {/* Reto 3 */}
              <div className="bg-[#2a2d47]/50 border border-gray-600 rounded-lg p-3 hover:bg-gray-700/30 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      J
                    </div>
                    <span className="text-sm text-white font-medium">Jose_King</span>
                  </div>
                  <span className="text-xs text-green-400 font-bold">$500</span>
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  Chiefs vs Ravens
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-400">NFL</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">⏱️ 1h 30m</span>
                  </div>
                </div>
              </div>

              {/* Reto 4 */}
              <div className="bg-[#2a2d47]/50 border border-gray-600 rounded-lg p-3 hover:bg-gray-700/30 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      L
                    </div>
                    <span className="text-sm text-white font-medium">Luis_Pro</span>
                  </div>
                  <span className="text-xs text-green-400 font-bold">$300</span>
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  Djokovic vs Nadal
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-yellow-400">Australian Open</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">⏱️ 12h 0m</span>
                  </div>
                </div>
              </div>

              {/* Reto 5 */}
              <div className="bg-[#2a2d47]/50 border border-gray-600 rounded-lg p-3 hover:bg-gray-700/30 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      C
                    </div>
                    <span className="text-sm text-white font-medium">Carlos_Win</span>
                  </div>
                  <span className="text-xs text-green-400 font-bold">$180</span>
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  Yankees vs Red Sox
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-red-400">MLB</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">⏱️ 16h 5m</span>
                  </div>
                </div>
              </div>

              {/* Botón ver más */}
              <button className="w-full py-2 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 text-sm font-medium transition-all">
                🔍 Ver todos los retos
              </button>
            </div>
          </div>
        </div>

        {/* Overlay para móvil */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Contenido principal */}
        <div className="flex-1 lg:ml-64 p-6">
          {/* Botón de menú móvil */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="bg-[#2a2d47] border border-gray-600 rounded-lg p-3 flex items-center space-x-2 hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl">☰</span>
              <span className="font-medium">Ligas</span>
            </button>
          </div>
          
          <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
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
                {selectedLeague && selectedLeague !== 'all' && (
                  <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-lg text-sm">
                    Liga: {selectedLeague}
                  </span>
                )}
                {selectedSport && selectedSport !== 'all' && (
                  <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-sm">
                    Deporte: {selectedSport}
                  </span>
                )}
              </div>
              <p className="text-gray-400">
                {selectedLeague === 'all' 
                  ? `✨ ${allGames.length} eventos deportivos disponibles • Selecciona una liga para filtrar`
                  : `Eventos de ${selectedLeague} • ${filteredGames.length} encontrados • Mostrando ${displayedCount}`
                }
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Eventos Totales</div>
              <div className="text-2xl font-bold text-white">{allGames?.length || 0}</div>
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
              {/* Botón "Todos los deportes" */}
              <div className="flex-shrink-0 group cursor-pointer" onClick={() => setSelectedSport('all')}>
                <div className={`w-16 h-16 bg-gradient-to-br ${selectedSport === 'all' ? 'from-blue-600/30 to-blue-500/20 border-blue-500' : 'from-gray-900/20 to-gray-800/10 border-gray-600'} border rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-200 group-hover:border-gray-400`}>
                  🏆
                </div>
                <div className={`text-xs text-center mt-2 transition-colors w-16 truncate ${selectedSport === 'all' ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`}>
                  Todos
                </div>
              </div>
              
              {filteredSports.map((sport) => (
                <div key={sport.id} className="flex-shrink-0 group cursor-pointer" onClick={() => setSelectedSport(sport.name)}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${selectedSport === sport.name ? `${sport.bgColor} border-blue-500` : `${sport.bgColor} border-gray-600`} border rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-200 group-hover:border-gray-400`}>
                    {sport.logo}
                  </div>
                  <div className={`text-xs text-center mt-2 transition-colors w-16 truncate ${selectedSport === sport.name ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`}>
                    {sport.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de juegos próximos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-white">🔥 Próximos Eventos</h2>
              {searchTerm.trim() && (
                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-sm">
                  Buscando: "{searchTerm.trim()}"
                </span>
              )}
              {filteredGames.length > 0 && searchTerm.trim() && (
                <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-sm">
                  {filteredGames.length} resultado{filteredGames.length !== 1 ? 's' : ''} • {displayedCount} mostrados
                </span>
              )}
            </div>
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
              <div className="text-4xl mb-4">
                {searchTerm.trim() ? '🔍' : '🏟️'}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm.trim() ? 'No se encontraron resultados' : 'No hay eventos disponibles'}
              </h3>
              <p className="text-gray-400 mb-4">
                {searchTerm.trim() 
                  ? `No encontramos eventos que coincidan con "${searchTerm}". Prueba con otros términos como nombres de equipos, ligas o deportes.`
                  : sportFilter 
                    ? `No encontramos eventos para ${sportFilter} en este momento.` 
                    : "No hay eventos programados en este momento."
                }
              </p>
              {searchTerm.trim() ? (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors mr-2"
                >
                  ✕ Limpiar búsqueda
                </button>
              ) : null}
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
            {displayedGames.map((game, index) => (
                <div key={`${game.id}-${index}`} className={`bg-gradient-to-br ${game.bgColor} border border-gray-600 rounded-xl p-4 hover:border-gray-500 transition-all group hover:scale-105 relative overflow-hidden h-full flex flex-col`}>
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
                      <button 
                        className="w-full py-2 px-3 rounded-lg transition-all font-medium text-xs bg-blue-600 hover:bg-blue-700 text-white group-hover:shadow-lg"
                        onClick={(e) => {
                          console.log('🎯 Crear Reto clicked for:', game.homeTeam, 'vs', game.awayTeam);
                          console.log('🔗 Navigating to:', `/sports/create?matchId=${game.id}&matchTitle=${encodeURIComponent(game.homeTeam + ' vs ' + game.awayTeam)}`);
                        }}
                      >
                        ➕ Crear Reto
                      </button>
                    </Link>
                  </div>
                </div>
            ))}
            </div>
          )}
        </div>

        {/* Diagnóstico de base de datos */}
        <div className="mt-8 mb-8">
          <DatabaseDiagnostic />
        </div>

        {/* Test de navegación */}
        <div className="mt-4 mb-8">
          <div className="bg-[#2a2d47] border border-gray-600 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-3">🧪 Test de Navegación</h3>
            <div className="flex space-x-4">
              <Link href="/sports/create?test=true">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                  ✅ Test Directo → /sports/create
                </button>
              </Link>
              <Link href="/create">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                  🔧 Alternativo → /create
                </button>
              </Link>
            </div>
          </div>
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
                <div key={`upcoming-${game?.id || index}-${index}`} className="text-sm">
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
        </div>
      </div>
      
      {/* Footer de borde a borde */}
      <Footer />
    </div>
  );
}