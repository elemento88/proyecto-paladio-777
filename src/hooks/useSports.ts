import { useState, useEffect, useCallback } from 'react'
import {
  SportData,
  LiveScore,
  Fixture,
  League,
  Team
} from '@/types/sports'
import { UnifiedSportsAPI } from '@/lib/unifiedSportsApi'

interface UseSportsReturn {
  // Data states
  sports: SportData[]
  liveScores: LiveScore[]
  todaysFixtures: LiveScore[]
  leagues: League[]
  fixtures: Fixture[]
  teams: Team[]

  // Loading states
  loading: boolean
  loadingSports: boolean
  loadingLive: boolean
  loadingFixtures: boolean
  loadingLeagues: boolean
  loadingTeams: boolean

  // Utility states
  error: string | null
  lastUpdate: Date | null
  canMakeRequest: boolean
  requestsRemaining: number

  // Actions
  refreshLiveScores: () => Promise<void>
  refreshFixtures: () => Promise<void>
  loadFixtures: (leagueId?: number, date?: string) => Promise<void>
  loadLeagues: (season?: number) => Promise<void>
  loadTeams: (leagueId: number, season?: number) => Promise<void>
  searchTeams: (query: string) => Promise<void>
  searchLeagues: (query: string) => Promise<void>
}

export function useSports(): UseSportsReturn {
  // Estados principales de datos mock
  const [sports] = useState<SportData[]>([
    { id: 1, name: 'Fútbol', code: 'football' },
    { id: 2, name: 'Baloncesto', code: 'basketball' },
    { id: 3, name: 'Fútbol Americano', code: 'american-football' },
    { id: 4, name: 'Béisbol', code: 'baseball' },
    { id: 5, name: 'MMA', code: 'mma' }
  ])

  const [liveScores, setLiveScores] = useState<LiveScore[]>([])
  const [todaysFixtures, setTodaysFixtures] = useState<LiveScore[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [teams, setTeams] = useState<Team[]>([])

  // Estados de carga
  const [loading, setLoading] = useState(false)
  const [loadingSports, setLoadingSports] = useState(false)
  const [loadingLive, setLoadingLive] = useState(false)
  const [loadingFixtures, setLoadingFixtures] = useState(false)
  const [loadingLeagues, setLoadingLeagues] = useState(false)
  const [loadingTeams, setLoadingTeams] = useState(false)

  // Estados de utilidad
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [canMakeRequest] = useState(true) // Siempre true para datos mock
  const [requestsRemaining] = useState(999) // Ilimitado para datos mock

  // Función para cargar eventos en vivo
  const refreshLiveScores = useCallback(async () => {
    setLoadingLive(true)
    setError(null)

    try {
      console.log('🎭 Loading mock live scores...')
      const allEvents = await UnifiedSportsAPI.getAllEvents()

      // Simular algunos eventos como "en vivo"
      const liveEvents = allEvents.slice(0, 8).map(event => ({
        ...event,
        status: 'Live',
        homeScore: Math.floor(Math.random() * 4),
        awayScore: Math.floor(Math.random() * 4)
      }))

      setLiveScores(liveEvents)
      setLastUpdate(new Date())
      console.log(`✅ Loaded ${liveEvents.length} mock live scores`)

    } catch (err) {
      console.error('❌ Error loading live scores:', err)
      setError('Error cargando marcadores en vivo')
    } finally {
      setLoadingLive(false)
    }
  }, [])

  // Función para cargar fixtures de hoy
  const refreshFixtures = useCallback(async () => {
    setLoadingFixtures(true)
    setError(null)

    try {
      console.log('🎭 Loading mock fixtures...')
      const allEvents = await UnifiedSportsAPI.getAllEvents()

      // Tomar eventos para "hoy"
      const todayEvents = allEvents.slice(0, 12)
      setTodaysFixtures(todayEvents)
      setLastUpdate(new Date())
      console.log(`✅ Loaded ${todayEvents.length} mock fixtures`)

    } catch (err) {
      console.error('❌ Error loading fixtures:', err)
      setError('Error cargando partidos de hoy')
    } finally {
      setLoadingFixtures(false)
    }
  }, [])

  // Funciones simplificadas para compatibilidad
  const loadFixtures = useCallback(async (leagueId?: number, date?: string) => {
    await refreshFixtures()
  }, [refreshFixtures])

  const loadLeagues = useCallback(async (season?: number) => {
    setLoadingLeagues(true)
    try {
      // Mock leagues
      const mockLeagues: League[] = [
        { id: 1, name: 'La Liga', country: 'Spain', logo: '', season: 2024 },
        { id: 2, name: 'Premier League', country: 'England', logo: '', season: 2024 },
        { id: 3, name: 'NBA', country: 'USA', logo: '', season: 2024 },
        { id: 4, name: 'NFL', country: 'USA', logo: '', season: 2024 }
      ]
      setLeagues(mockLeagues)
    } finally {
      setLoadingLeagues(false)
    }
  }, [])

  const loadTeams = useCallback(async (leagueId: number, season?: number) => {
    setLoadingTeams(true)
    try {
      // Mock teams
      const mockTeams: Team[] = [
        { id: 1, name: 'Real Madrid', country: 'Spain', logo: '', venue: 'Santiago Bernabéu' },
        { id: 2, name: 'Barcelona', country: 'Spain', logo: '', venue: 'Camp Nou' },
        { id: 3, name: 'Manchester City', country: 'England', logo: '', venue: 'Etihad Stadium' }
      ]
      setTeams(mockTeams)
    } finally {
      setLoadingTeams(false)
    }
  }, [])

  const searchTeams = useCallback(async (query: string) => {
    await loadTeams(1) // Mock search
  }, [loadTeams])

  const searchLeagues = useCallback(async (query: string) => {
    await loadLeagues() // Mock search
  }, [loadLeagues])

  // Cargar datos iniciales
  useEffect(() => {
    refreshLiveScores()
    refreshFixtures()
  }, [refreshLiveScores, refreshFixtures])

  return {
    // Data states
    sports,
    liveScores,
    todaysFixtures,
    leagues,
    fixtures,
    teams,

    // Loading states
    loading,
    loadingSports,
    loadingLive,
    loadingFixtures,
    loadingLeagues,
    loadingTeams,

    // Utility states
    error,
    lastUpdate,
    canMakeRequest,
    requestsRemaining,

    // Actions
    refreshLiveScores,
    refreshFixtures,
    loadFixtures,
    loadLeagues,
    loadTeams,
    searchTeams,
    searchLeagues
  }
}