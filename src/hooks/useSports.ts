import { useState, useEffect, useCallback } from 'react'
import { 
  SportData, 
  LiveScore, 
  Fixture, 
  League, 
  Team 
} from '@/types/sports'
import { 
  SportsAPI, 
  FootballAPI, 
  RateLimiter,
  AVAILABLE_SPORTS 
} from '@/lib/sportsApi'
import { 
  FreeSportsAPI,
  TheSportsDbAPI 
} from '@/lib/theSportsDbApi'

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
  loadingLive: boolean
  loadingFixtures: boolean
  loadingLeagues: boolean
  loadingTeams: boolean
  
  // Error states
  error: string | null
  
  // Actions
  fetchLiveScores: () => Promise<void>
  fetchTodaysFixtures: () => Promise<void>
  fetchLeagues: (season?: number) => Promise<void>
  fetchFixtures: (leagueId?: number, date?: string) => Promise<void>
  fetchTeams: (leagueId: number, season?: number) => Promise<void>
  refreshData: () => Promise<void>
  // Nuevas funciones de búsqueda con TheSportsDB (gratuitas)
  searchTeams: (query: string) => Promise<void>
  searchLeagues: (query: string) => Promise<void>
  
  // Utility
  remainingRequests: number
  canMakeRequest: boolean
}

export function useSports(): UseSportsReturn {
  // Data states - Ahora usa TheSportsDB que es completamente gratuito
  const [sports, setSports] = useState<SportData[]>(FreeSportsAPI.getAvailableSports())
  const [liveScores, setLiveScores] = useState<LiveScore[]>([])
  const [todaysFixtures, setTodaysFixtures] = useState<LiveScore[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  
  // Loading states
  const [loading, setLoading] = useState(false)
  const [loadingLive, setLoadingLive] = useState(false)
  const [loadingFixtures, setLoadingFixtures] = useState(false)
  const [loadingLeagues, setLoadingLeagues] = useState(false)
  const [loadingTeams, setLoadingTeams] = useState(false)
  
  // Error state
  const [error, setError] = useState<string | null>(null)
  
  // Rate limiting
  const [remainingRequests, setRemainingRequests] = useState(100)
  const [canMakeRequest, setCanMakeRequest] = useState(true)

  // Update rate limiting info
  const updateRateLimit = useCallback(() => {
    const remaining = RateLimiter.getRemainingRequests()
    const canRequest = RateLimiter.canMakeRequest()
    setRemainingRequests(remaining)
    setCanMakeRequest(canRequest)
  }, [])

  // Fetch live scores - Usa TheSportsDB (gratuito) con fallback a API anterior
  const fetchLiveScores = useCallback(async () => {
    try {
      setLoadingLive(true)
      setError(null)
      
      // Intenta primero con TheSportsDB (gratuito)
      let scores = await FreeSportsAPI.getLiveScores()
      
      // Si no hay datos, intenta con la API anterior (solo si hay requests disponibles)
      if (scores.length === 0 && RateLimiter.canMakeRequest()) {
        console.info('No data from TheSportsDB, trying fallback API...')
        scores = await SportsAPI.getLiveScores()
        updateRateLimit()
      }
      
      setLiveScores(scores)
    } catch (err) {
      setError('Failed to fetch live scores')
      console.error('Error fetching live scores:', err)
    } finally {
      setLoadingLive(false)
    }
  }, [updateRateLimit])

  // Fetch today's fixtures - Usa TheSportsDB (gratuito) con fallback a API anterior
  const fetchTodaysFixtures = useCallback(async () => {
    try {
      setLoadingFixtures(true)
      setError(null)
      
      // Intenta primero con TheSportsDB (gratuito)
      let fixtures = await FreeSportsAPI.getTodaysFixtures()
      
      // Si no hay datos, intenta con la API anterior (solo si hay requests disponibles)
      if (fixtures.length === 0 && RateLimiter.canMakeRequest()) {
        console.info('No data from TheSportsDB, trying fallback API...')
        fixtures = await SportsAPI.getTodaysFixtures()
        updateRateLimit()
      }
      
      setTodaysFixtures(fixtures)
    } catch (err) {
      setError('Failed to fetch today\'s fixtures')
      console.error('Error fetching today\'s fixtures:', err)
    } finally {
      setLoadingFixtures(false)
    }
  }, [updateRateLimit])

  // Fetch leagues
  const fetchLeagues = useCallback(async (season: number = new Date().getFullYear()) => {
    if (!RateLimiter.canMakeRequest()) {
      setError('Rate limit reached. Please wait before making more requests.')
      return
    }

    try {
      setLoadingLeagues(true)
      setError(null)
      const leaguesData = await FootballAPI.getLeagues(season)
      setLeagues(leaguesData)
      updateRateLimit()
    } catch (err) {
      setError('Failed to fetch leagues')
      console.error('Error fetching leagues:', err)
    } finally {
      setLoadingLeagues(false)
    }
  }, [updateRateLimit])

  // Fetch fixtures
  const fetchFixtures = useCallback(async (leagueId?: number, date?: string) => {
    if (!RateLimiter.canMakeRequest()) {
      setError('Rate limit reached. Please wait before making more requests.')
      return
    }

    try {
      setLoadingFixtures(true)
      setError(null)
      
      let fixturesData: Fixture[] = []
      
      if (leagueId) {
        fixturesData = await FootballAPI.getFixturesByLeague(leagueId)
      } else if (date) {
        fixturesData = await FootballAPI.getFixturesByDate(date)
      } else {
        // Get today's fixtures by default
        const today = new Date().toISOString().split('T')[0]
        fixturesData = await FootballAPI.getFixturesByDate(today)
      }
      
      setFixtures(fixturesData)
      updateRateLimit()
    } catch (err) {
      setError('Failed to fetch fixtures')
      console.error('Error fetching fixtures:', err)
    } finally {
      setLoadingFixtures(false)
    }
  }, [updateRateLimit])

  // Fetch teams
  const fetchTeams = useCallback(async (leagueId: number, season: number = new Date().getFullYear()) => {
    if (!RateLimiter.canMakeRequest()) {
      setError('Rate limit reached. Please wait before making more requests.')
      return
    }

    try {
      setLoadingTeams(true)
      setError(null)
      const teamsData = await FootballAPI.getTeams(leagueId, season)
      setTeams(teamsData)
      updateRateLimit()
    } catch (err) {
      setError('Failed to fetch teams')
      console.error('Error fetching teams:', err)
    } finally {
      setLoadingTeams(false)
    }
  }, [updateRateLimit])

  // Refresh all data
  const refreshData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      await Promise.allSettled([
        fetchLiveScores(),
        fetchTodaysFixtures()
      ])
    } catch (err) {
      setError('Failed to refresh data')
      console.error('Error refreshing data:', err)
    } finally {
      setLoading(false)
    }
  }, [fetchLiveScores, fetchTodaysFixtures])

  // Nuevas funciones de búsqueda usando TheSportsDB (completamente gratuitas)
  const searchTeams = useCallback(async (query: string) => {
    try {
      setLoadingTeams(true)
      setError(null)
      const teamsData = await FreeSportsAPI.searchTeams(query)
      setTeams(teamsData)
    } catch (err) {
      setError('Failed to search teams')
      console.error('Error searching teams:', err)
    } finally {
      setLoadingTeams(false)
    }
  }, [])

  const searchLeagues = useCallback(async (query: string) => {
    try {
      setLoadingLeagues(true)
      setError(null)
      const leaguesData = await FreeSportsAPI.searchLeagues(query)
      setLeagues(leaguesData)
    } catch (err) {
      setError('Failed to search leagues')
      console.error('Error searching leagues:', err)
    } finally {
      setLoadingLeagues(false)
    }
  }, [])

  // Auto-fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      try {
        // Load today's fixtures on mount
        await fetchTodaysFixtures()
      } catch (err) {
        console.error('Error loading initial data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [fetchTodaysFixtures])

  // Auto-refresh live scores every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (liveScores.length > 0 && RateLimiter.canMakeRequest()) {
        fetchLiveScores()
      }
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [liveScores.length, fetchLiveScores])

  // Update rate limiting info periodically
  useEffect(() => {
    updateRateLimit()
    const interval = setInterval(updateRateLimit, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [updateRateLimit])

  return {
    // Data
    sports,
    liveScores,
    todaysFixtures,
    leagues,
    fixtures,
    teams,
    
    // Loading states
    loading,
    loadingLive,
    loadingFixtures,
    loadingLeagues,
    loadingTeams,
    
    // Error
    error,
    
    // Actions
    fetchLiveScores,
    fetchTodaysFixtures,
    fetchLeagues,
    fetchFixtures,
    fetchTeams,
    refreshData,
    // Nuevas funciones de búsqueda (gratuitas)
    searchTeams,
    searchLeagues,
    
    // Utility
    remainingRequests,
    canMakeRequest
  }
}