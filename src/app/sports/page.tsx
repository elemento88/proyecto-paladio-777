'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import DatabaseDiagnostic from '@/components/DatabaseDiagnostic';
import CacheStatus from '@/components/CacheStatus';
import InfiniteScrollLoader from '@/components/InfiniteScrollLoader';
import { useEventsLoader } from '@/hooks/useEventsLoader';
import { LiveScore } from '@/types/sports';
import { getTeamLogo, isImageUrl } from '@/lib/teamLogos';
import ApiStatusIndicator from '@/components/ApiStatusIndicator';
import NavigationButtons from '@/components/NavigationButtons';

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
    logo: '⚽',
    description: 'El deporte más popular del mundo con ligas de élite',
    activeGames: 45,
    upcomingGames: 127,
    totalVolume: '$2.4M',
    popularLeagues: ['Champions League', 'Premier League', 'La Liga', 'Serie A'],
    color: 'text-gray-400',
    bgColor: 'bg-gradient-to-br from-gray-900 to-gray-800 bg-opacity-20'
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
    color: 'text-gray-400',
    bgColor: 'bg-gradient-to-br from-gray-900 to-gray-800 bg-opacity-20'
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
    color: 'text-gray-400',
    bgColor: 'bg-gradient-to-br from-gray-900 to-gray-800 bg-opacity-20'
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
    color: 'text-gray-400',
    bgColor: 'bg-gradient-to-br from-gray-900 to-gray-800 bg-opacity-20'
  },
  {
    id: 'mma',
    name: 'MMA',
    icon: '🥊',
    logo: '🥊',
    description: 'UFC, Bellator y competencias de artes marciales mixtas',
    activeGames: 12,
    upcomingGames: 45,
    totalVolume: '$650K',
    popularLeagues: ['UFC', 'Bellator', 'ONE Championship', 'PFL'],
    color: 'text-gray-400',
    bgColor: 'bg-gradient-to-br from-gray-900 to-gray-800 bg-opacity-20'
  },
];

export default function SportsPage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    filteredEvents,
    loading,
    loadingMore,
    initialLoading,
    hasMore,
    totalEvents,
    currentPage,
    loadMore,
    searchEvents,
    filterEvents,
    refreshEvents,
    cacheStats,
    error
  } = useEventsLoader();

  const sportFilter = searchParams.get('sport');
  const gameCount = searchParams.get('gameCount') ? parseInt(searchParams.get('gameCount')!) : 1;

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    searchEvents(query);
  };

  const handleFilter = () => {
    const filters: any = {};
    if (selectedSport !== 'all') {
      // Convertir ID de deporte a nombre español para el filtro
      const sportData = sportsCategories.find(s => s.id === selectedSport);
      if (sportData) {
        filters.sport = sportData.name;
      }
    }
    if (selectedLeague !== 'all') filters.league = selectedLeague;
    filterEvents(filters);
  };

  useEffect(() => {
    handleFilter();
  }, [selectedSport, selectedLeague]);

  const availableLeagues = useMemo(() => {
    const leagues = new Set<string>();
    filteredEvents?.forEach(event => {
      if (event?.league) {
        leagues.add(event.league);
      }
    });
    return Array.from(leagues).sort();
  }, [filteredEvents]);

  // Mapear ligas por deporte para el panel lateral - Ligas más populares
  const leaguesBySport = useMemo(() => {
    return {
      'futbol': {
        name: 'Fútbol',
        icon: '⚽',
        color: 'text-gray-400',
        leagues: ['La Liga', 'Premier League', 'Serie A', 'Bundesliga', 'Champions League', 'Ligue 1', 'Copa Libertadores', 'Liga MX', 'MLS']
      },
      'baloncesto': {
        name: 'Baloncesto',
        icon: '🏀',
        color: 'text-gray-400',
        leagues: ['NBA', 'Euroliga', 'NCAA March Madness', 'FIBA World Cup', 'ACB Liga Endesa', 'CBA China', 'NBL Australia', 'G League']
      },
      'futbol-americano': {
        name: 'Fútbol Americano',
        icon: '🏈',
        color: 'text-gray-400',
        leagues: ['NFL', 'NCAA Football', 'CFL Canadian', 'XFL', 'USFL', 'NFL Playoffs', 'Super Bowl', 'College Football Playoff']
      },
      'beisbol': {
        name: 'Béisbol',
        icon: '⚾',
        color: 'text-gray-400',
        leagues: ['MLB', 'World Series', 'NPB Japan', 'KBO Korea', 'Caribbean Series', 'LMB Mexico', 'Winter Leagues', 'World Baseball Classic']
      },
      'mma': {
        name: 'MMA',
        icon: '🥊',
        color: 'text-gray-400',
        leagues: ['UFC', 'Bellator MMA', 'ONE Championship', 'PFL', 'Rizin FF', 'KSW', 'Cage Warriors', 'LFA']
      }
    };
  }, []);

  const getSportData = (sportFromApi: string) => {
    const sportMappings: { [key: string]: string } = {
      'football': 'futbol',
      'basketball': 'baloncesto',
      'american football': 'futbol-americano',
      'baseball': 'beisbol',
      'mma': 'mma'
    }

    const mappedId = sportMappings[sportFromApi.toLowerCase()] || sportFromApi.toLowerCase()
    return sportsCategories.find(s => s.id === mappedId) || {
      id: sportFromApi,
      name: sportFromApi.charAt(0).toUpperCase() + sportFromApi.slice(1),
      icon: '⚽',
      color: 'text-blue-400',
      bgColor: 'bg-gradient-to-br from-blue-900 to-blue-800 bg-opacity-20'
    }
  };

  const convertToUpcomingGame = (liveScore: LiveScore): UpcomingGame => {
    const sportIcons: Record<string, string> = {
      'Fútbol': '⚽', 'Football': '⚽', 'Soccer': '⚽',
      'Baloncesto': '🏀', 'Basketball': '🏀',
      'Fútbol Americano': '🏈', 'American Football': '🏈',
      'Béisbol': '⚾', 'Baseball': '⚾',
      'MMA': '🥊', 'Hockey': '🏒', 'Tenis': '🎾',
    };

    const sportColors: Record<string, { color: string; bgColor: string }> = {
      'Fútbol': { color: 'text-gray-400', bgColor: 'bg-gradient-to-br from-gray-900 to-gray-800 bg-opacity-20' },
      'Baloncesto': { color: 'text-gray-400', bgColor: 'bg-gradient-to-br from-gray-900 to-gray-800 bg-opacity-20' },
      'Fútbol Americano': { color: 'text-gray-400', bgColor: 'bg-gradient-to-br from-gray-900 to-gray-800 bg-opacity-20' },
      'Béisbol': { color: 'text-gray-400', bgColor: 'bg-gradient-to-br from-gray-900 to-gray-800 bg-opacity-20' },
      'MMA': { color: 'text-gray-400', bgColor: 'bg-gradient-to-br from-gray-900 to-gray-800 bg-opacity-20' },
    };

    const sportData = getSportData(liveScore.sport || 'football');
    const sport = sportData.name;
    const colors = sportColors[sport] || { color: sportData.color, bgColor: sportData.bgColor };

    return {
      id: liveScore.id.toString(),
      sport: sport,
      sportIcon: sportIcons[sport] || '🏆',
      league: liveScore.league || 'Liga',
      homeTeam: liveScore.homeTeam || 'Equipo Local',
      awayTeam: liveScore.awayTeam || 'Equipo Visitante',
      homeTeamLogo: getTeamLogo(liveScore.homeTeam || 'Equipo Local'),
      awayTeamLogo: getTeamLogo(liveScore.awayTeam || 'Equipo Visitante'),
      date: liveScore.date ? new Date(liveScore.date).toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) : new Date().toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      time: liveScore.time || 'TBD',
      venue: 'Stadium',
      status: (() => {
        if (liveScore.status?.includes('Live')) return 'live';
        if (liveScore.status?.includes('Finished')) return 'upcoming';

        // Calcular si el evento es muy pronto (menos de 24 horas)
        const eventDate = new Date(liveScore.date || new Date());
        const now = new Date();
        const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        return hoursUntilEvent < 24 ? 'soon' : 'upcoming';
      })(),
      minutesToStart: (() => {
        const eventDate = new Date(liveScore.date || new Date());
        const now = new Date();
        const minutesUntilEvent = Math.max(0, Math.floor((eventDate.getTime() - now.getTime()) / (1000 * 60)));
        return minutesUntilEvent;
      })(),
      odds: {
        home: '2.10',
        draw: sport === 'Fútbol' ? '3.20' : undefined,
        away: '1.85'
      },
      totalBets: Math.floor(Math.random() * 500) + 100,
      volume: `$${(Math.random() * 100 + 20).toFixed(1)}K`,
      ...colors
    };
  };

  const displayedGames = filteredEvents.map(convertToUpcomingGame);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavigationButtons showHome={true} showBack={false} />

      {/* Espacio para el header fijo - SIN línea negra */}
      <div className="h-16 bg-transparent"></div>

      <div className="flex relative">
        <div className="flex-1 relative z-20">
          <div className="max-w-full mx-auto px-4 py-6">

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-4 mb-2">
                    <h1 className="text-4xl font-bold text-white">Deportes</h1>
                    {gameCount > 1 && (
                      <span className="bg-green-600 bg-opacity-20 text-green-400 px-3 py-1 rounded-lg text-sm">
                        Añadiendo Partido {gameCount} de 15
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400">
                    ✨ {mounted ? totalEvents.toLocaleString() : '0'} eventos deportivos disponibles • {mounted ? filteredEvents.length.toLocaleString() : '0'} filtrados • Mostrando {mounted ? displayedGames.length.toLocaleString() : '0'}
                  </p>
                  {mounted && hasMore && (
                    <p className="text-sm text-blue-400 mt-1">
                      📄 Página {currentPage + 1} • Scroll para cargar más eventos automáticamente
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Eventos Totales</div>
                  <div className="text-2xl font-bold text-white">{mounted ? totalEvents.toLocaleString() : '0'}</div>
                  {mounted && (
                    <div className="text-xs text-gray-500 mt-1">Cache: {cacheStats.cacheSize}</div>
                  )}
                </div>
              </div>

              {/* Barra horizontal de deportes */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 overflow-x-auto py-4 px-2">
                  <button
                    onClick={() => setSelectedSport('all')}
                    className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 border-2 ${
                      selectedSport === 'all'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/30 transform scale-105 border-purple-400 ring-2 ring-purple-300/50'
                        : 'bg-gray-800/50 text-gray-300 border-gray-700/50 hover:bg-gray-700/70 hover:text-white hover:scale-105 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-lg">🏆</span>
                    <span className="font-medium whitespace-nowrap">Todos</span>
                  </button>

                  {mounted && sportsCategories.map((sportData) => (
                    <button
                      key={sportData.id}
                      onClick={() => setSelectedSport(sportData.id)}
                      className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 border-2 ${
                        selectedSport === sportData.id
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-500/30 transform scale-105 border-blue-400 ring-2 ring-blue-300/50'
                          : 'bg-gray-800/50 text-gray-300 border-gray-700/50 hover:bg-gray-700/70 hover:text-white hover:scale-105 hover:border-gray-600'
                      }`}
                    >
                      <span className="text-lg">{sportData.icon}</span>
                      <span className="font-medium whitespace-nowrap">{sportData.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {initialLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-500 border-opacity-30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <div className="text-xl font-semibold text-white mb-2">Cargando eventos deportivos...</div>
                  <div className="text-gray-400">
                    Preparando {mounted && cacheStats.totalEvents > 0 ? cacheStats.totalEvents.toLocaleString() : '2,000'} eventos para ti
                  </div>
                </div>
              </div>
            )}

            {/* Grid de juegos */}
            {!initialLoading && (
              <div className="mb-8">
                <div className="flex gap-6">
                  {/* Panel de Ligas por Deporte - Lado Izquierdo */}
                  <div className="w-72 bg-gray-900 bg-opacity-50 backdrop-blur rounded-xl p-4 sticky top-20 h-[calc(100vh-6rem)] relative overflow-hidden">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      🏆 Ligas por Deporte
                    </h3>

                    <div className="space-y-1">
                      {/* Mostrar ligas del deporte seleccionado en la barra horizontal */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                          {selectedSport === 'all' ? (
                            <>
                              <span className="text-base">🏆</span>
                              Todas las Ligas Deportivas
                            </>
                          ) : (
                            <>
                              <span className="text-base">{leaguesBySport[selectedSport as keyof typeof leaguesBySport]?.icon}</span>
                              Ligas de {leaguesBySport[selectedSport as keyof typeof leaguesBySport]?.name}
                            </>
                          )}
                        </h4>

                        {/* Ligas del deporte seleccionado */}
                        {selectedSport !== 'all' && (
                          <div className="relative">
                            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-black scrollbar-thumb-black scrollbar-thumb-opacity-70 hover:scrollbar-thumb-opacity-90">
                              {leaguesBySport[selectedSport as keyof typeof leaguesBySport]?.leagues.map(league => (
                                <button
                                  key={league}
                                  onClick={() => setSelectedLeague(league)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                    selectedLeague === league
                                      ? 'bg-blue-600 bg-opacity-30 text-blue-300 border border-blue-500 border-opacity-50'
                                      : 'bg-gray-800 bg-opacity-40 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-gray-600'
                                  }`}
                                >
                                  <span className="block truncate">{league}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Cuando está en "all", mostrar un resumen de ligas por deporte */}
                        {selectedSport === 'all' && (
                          <div className="relative">
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-black scrollbar-thumb-black scrollbar-thumb-opacity-70 hover:scrollbar-thumb-opacity-90">
                              {Object.entries(leaguesBySport).map(([sportId, sportInfo]) => (
                                <div key={sportId} className="border-l-2 border-gray-700 pl-3">
                                  <div className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                    <span className="text-lg">{sportInfo.icon}</span>
                                    <span>{sportInfo.name}</span>
                                  </div>

                                  {/* Grid de ligas en filas */}
                                  <div className="grid grid-cols-1 gap-2">
                                    {sportInfo.leagues.map(league => (
                                      <button
                                        key={league}
                                        onClick={() => setSelectedLeague(league)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                          selectedLeague === league
                                            ? 'bg-blue-600 bg-opacity-30 text-blue-300 border border-blue-500 border-opacity-50'
                                            : 'bg-gray-800 bg-opacity-40 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-gray-600'
                                        }`}
                                      >
                                        <span className="block truncate">{league}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Todas las Ligas */}
                      <div className="pt-2 border-t border-gray-700">
                        <button
                          onClick={() => setSelectedLeague('all')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            selectedLeague === 'all'
                              ? 'bg-green-600 bg-opacity-20 text-green-300 border border-green-500 border-opacity-30'
                              : 'text-gray-300 hover:bg-gray-800 hover:bg-opacity-50 hover:text-white'
                          }`}
                        >
                          🌐 Ligas
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Contenido Principal */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-semibold text-white">🔥 Eventos Deportivos</h2>
                      </div>
                      <div className="flex items-center space-x-3">
                        {mounted && cacheStats.totalEvents > 0 && (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-400">Cache activo ({cacheStats.totalEvents.toLocaleString()})</span>
                          </div>
                        )}
                        {(loading || loadingMore) && (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs text-blue-400">{loadingMore ? 'Cargando más...' : 'Procesando...'}</span>
                          </div>
                        )}
                        {error && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-red-400">⚠️ {error}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {displayedGames.length === 0 ? (
                      <div className="bg-gray-800 border border-gray-600 rounded-xl p-8 text-center">
                        <div className="text-4xl mb-4">🏟️</div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {loading ? 'Cargando eventos...' : 'No hay eventos disponibles'}
                        </h3>
                        <p className="text-gray-400 mb-4">
                          {loading
                            ? 'Obteniendo eventos deportivos de todas las fuentes...'
                            : 'No encontramos eventos que coincidan con tus filtros actuales.'
                          }
                        </p>
                        {!loading && (
                          <button
                            onClick={() => {
                              setSelectedSport('all');
                              setSelectedLeague('all');
                              setSearchTerm('');
                              handleSearch('');
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            🔄 Mostrar Todos
                          </button>
                        )}
                      </div>
                    ) : (
                      <InfiniteScrollLoader
                        hasMore={hasMore}
                        loading={loadingMore}
                        onLoadMore={loadMore}
                        threshold={300}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {displayedGames.map((game, index) => (
                            <div key={`${game.id}-${index}`} className={`${game.bgColor} border border-gray-600 rounded-xl p-6 hover:border-gray-500 transition-all group hover:scale-105 relative overflow-hidden h-full flex flex-col min-h-80`}>
                              <div className="absolute top-2 right-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  game.status === 'live' ? 'bg-red-500 animate-pulse' :
                                  game.status === 'soon' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'
                                }`}></div>
                              </div>

                              <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-base ${game.color}`}>
                                      {game.sportIcon}
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-400">{game.sport}</div>
                                      <div className="text-sm font-medium text-white">{game.league}</div>
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-3 flex-1">
                                  <div className="text-center">
                                    <div className="text-lg font-semibold text-white mb-2">
                                      {game.homeTeam} vs {game.awayTeam}
                                    </div>
                                    <div className="text-sm text-gray-300 mb-2">{game.date}</div>
                                    <div className="text-base text-gray-200 mb-2 font-medium">{game.time}</div>
                                    <div className={`text-sm px-2 py-1 rounded inline-block ${
                                      game.status === 'live' ? 'text-red-400 bg-red-900 bg-opacity-20 font-bold' : 'text-blue-400 bg-blue-900 bg-opacity-20'
                                    }`}>
                                      {game.status === 'live' ? '🔴 EN VIVO' : 'Programado'}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-gray-600 mt-auto">
                                <div className="space-y-3">
                                  <Link
                                    href={`/sports/challenges/${game.id}?match=${encodeURIComponent(game.homeTeam + ' vs ' + game.awayTeam)}&league=${encodeURIComponent(game.league)}&sport=${encodeURIComponent(game.sport)}`}
                                    className="block w-full py-2 px-3 rounded-lg transition-all font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white text-center group-hover:shadow-lg hover:scale-105 no-underline"
                                  >
                                    🎯 Ver Retos ({Math.floor(Math.random() * 50) + 5})
                                  </Link>
                                  <Link
                                    href={`/sports/create?matchId=${game.id}&matchTitle=${encodeURIComponent(game.homeTeam + ' vs ' + game.awayTeam)}&teams=${encodeURIComponent(game.homeTeam + ' vs ' + game.awayTeam)}&date=${encodeURIComponent(game.date)}&time=${encodeURIComponent(game.time)}&league=${encodeURIComponent(game.league)}&sport=${encodeURIComponent(game.sport)}${gameCount > 1 ? `&gameCount=${gameCount}` : ''}`}
                                    className="block w-full py-2 px-3 rounded-lg transition-all font-medium text-sm bg-green-600 hover:bg-green-700 text-white text-center group-hover:shadow-lg hover:scale-105 no-underline"
                                  >
                                    ➕ Crear Reto
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </InfiniteScrollLoader>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <ApiStatusIndicator />
    </div>
  );
}