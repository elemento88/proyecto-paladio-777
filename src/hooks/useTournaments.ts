import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { BetType, ResolutionMode } from '@/types/betting'

export interface TournamentType {
  LEAGUE: 'LEAGUE'
  KNOCKOUT: 'KNOCKOUT'
  HYBRID: 'HYBRID'
}

export interface TournamentDuration {
  FAST: 'FAST'    // 3-7 days
  MEDIUM: 'MEDIUM' // 1-2 weeks
  LONG: 'LONG'     // 3-4 weeks
  SEASON: 'SEASON' // 1-3 months
}

export interface TournamentPrizeDistribution {
  WINNER_TAKES_ALL: 'WINNER_TAKES_ALL'
  TOP3: 'TOP3'
  TOP5: 'TOP5'
  TOP10_PERCENT: 'TOP10_PERCENT'
}

export interface CreateTournamentData {
  title: string
  description?: string
  sport_id: string
  league_id: string
  stake_amount: number
  max_participants: number
  end_date: string
  tournament_type: 'LEAGUE' | 'KNOCKOUT' | 'HYBRID'
  tournament_duration: 'FAST' | 'MEDIUM' | 'LONG' | 'SEASON'
  tournament_prize_distribution: 'WINNER_TAKES_ALL' | 'TOP3' | 'TOP5' | 'TOP10_PERCENT'
  allow_spectators?: boolean
  enable_chat?: boolean
  tournament_config?: any
}

export interface Tournament {
  id: string
  title: string
  description?: string
  tournament_type: string
  tournament_duration: string
  tournament_prize_distribution: string
  current_participants: number
  max_participants: number
  total_pool: number
  tournament_phase: string
  tournament_start_date: string
  end_date: string
  status: string
  sport?: { name: string; icon: string }
  league?: { name: string; icon: string }
}

export interface TournamentStanding {
  position: number
  user: {
    id: string
    username: string
    avatar_url?: string
  }
  points: number
  wins: number
  losses: number
  draws: number
  accuracy_percentage: number
  qualification_status: string
}

export interface TournamentPrize {
  position: number
  prize_amount: number
  prize_percentage: number
  winner?: {
    id: string
    username: string
    avatar_url?: string
  }
}

export interface TournamentDetails {
  tournament: Tournament
  standings: TournamentStanding[]
  prizes: TournamentPrize[]
}

export function useTournaments() {
  const { user } = useAuth()
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [userTournaments, setUserTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch active tournaments
  const fetchTournaments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('betting_challenges')
        .select(`
          *,
          sport:sports_categories(name, slug, icon),
          league:leagues(name, slug, icon, country)
        `)
        .eq('bet_type', 1) // TOURNAMENT type
        .eq('status', 'ACTIVE')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTournaments(data || [])
      return { data, error: null }
    } catch (error: any) {
      console.error('Error fetching tournaments:', error)
      return { data: null, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Fetch user's tournaments
  const fetchUserTournaments = async () => {
    if (!user) return { error: 'User not authenticated' }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_bets')
        .select(`
          *,
          challenge:betting_challenges(
            *,
            sport:sports_categories(name, slug, icon),
            league:leagues(name, slug, icon, country)
          )
        `)
        .eq('user_id', user.id)
        .not('challenge.bet_type', 'is', null)
        .eq('challenge.bet_type', 1) // TOURNAMENT type
        .order('placed_at', { ascending: false })

      if (error) throw error
      
      const tournamentData = data?.map(bet => bet.challenge).filter(Boolean) || []
      setUserTournaments(tournamentData)
      return { data: tournamentData, error: null }
    } catch (error: any) {
      console.error('Error fetching user tournaments:', error)
      return { data: null, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Create a tournament
  const createTournament = async (tournamentData: CreateTournamentData) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      setLoading(true)
      
      const { data, error } = await supabase.rpc('create_tournament', {
        tournament_data: {
          ...tournamentData,
          bet_type: 1, // TOURNAMENT
          resolution_mode: 2, // MULTI_WINNER for tournaments
          creator_id: user.id
        }
      })

      if (error) throw error

      if (data.success) {
        // Refresh tournaments
        await fetchTournaments()
        return { data: data, error: null }
      } else {
        return { data: null, error: data.error || 'Failed to create tournament' }
      }
    } catch (error: any) {
      console.error('Error creating tournament:', error)
      return { data: null, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Join a tournament
  const joinTournament = async (tournamentId: string) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      setLoading(true)
      
      const { data, error } = await supabase.rpc('join_tournament', {
        tournament_id_param: tournamentId,
        user_id_param: user.id
      })

      if (error) throw error

      if (data.success) {
        // Refresh tournaments and user tournaments
        await Promise.all([fetchTournaments(), fetchUserTournaments()])
        return { data: data, error: null }
      } else {
        return { data: null, error: data.error || 'Failed to join tournament' }
      }
    } catch (error: any) {
      console.error('Error joining tournament:', error)
      return { data: null, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Get tournament details with standings and prizes
  const getTournamentDetails = async (tournamentId: string): Promise<{ data: TournamentDetails | null; error: string | null }> => {
    try {
      const { data, error } = await supabase.rpc('get_tournament_details', {
        tournament_id_param: tournamentId
      })

      if (error) throw error

      if (data.error) {
        return { data: null, error: data.error }
      }

      return { data: data as TournamentDetails, error: null }
    } catch (error: any) {
      console.error('Error getting tournament details:', error)
      return { data: null, error: error.message }
    }
  }

  // Get tournaments by type
  const getTournamentsByType = (type: string) => {
    return tournaments.filter(t => t.tournament_type === type)
  }

  // Get tournaments by phase
  const getTournamentsByPhase = (phase: string) => {
    return tournaments.filter(t => t.tournament_phase === phase)
  }

  // Check if user is in tournament
  const isUserInTournament = (tournamentId: string) => {
    return userTournaments.some(t => t.id === tournamentId)
  }

  // Get tournament type info
  const getTournamentTypeInfo = (type: string) => {
    const typeInfo = {
      LEAGUE: {
        name: 'Liga',
        icon: '🏁',
        description: 'Todos compiten entre sí en múltiples rondas',
        mechanics: 'Sistema de ranking por puntos acumulados'
      },
      KNOCKOUT: {
        name: 'Eliminación',
        icon: '⚔️',
        description: 'Brackets de eliminación directa',
        mechanics: 'Perdedores quedan eliminados del torneo'
      },
      HYBRID: {
        name: 'Híbrido',
        icon: '🔄',
        description: 'Fase de liga + playoffs de eliminación',
        mechanics: 'Clasificatoria seguida de eliminación directa'
      }
    }
    return typeInfo[type as keyof typeof typeInfo]
  }

  // Get tournament duration info
  const getTournamentDurationInfo = (duration: string) => {
    const durationInfo = {
      FAST: { name: 'Rápido', days: '3-7 días', icon: '⚡' },
      MEDIUM: { name: 'Medio', days: '1-2 semanas', icon: '🕐' },
      LONG: { name: 'Largo', days: '3-4 semanas', icon: '📅' },
      SEASON: { name: 'Temporada', days: '1-3 meses', icon: '🏆' }
    }
    return durationInfo[duration as keyof typeof durationInfo]
  }

  // Auto-load tournaments
  useEffect(() => {
    fetchTournaments()
  }, [])

  // Auto-load user tournaments when user changes
  useEffect(() => {
    if (user) {
      fetchUserTournaments()
    } else {
      setUserTournaments([])
    }
  }, [user])

  return {
    tournaments,
    userTournaments,
    loading,
    createTournament,
    joinTournament,
    getTournamentDetails,
    fetchTournaments,
    fetchUserTournaments,
    getTournamentsByType,
    getTournamentsByPhase,
    isUserInTournament,
    getTournamentTypeInfo,
    getTournamentDurationInfo,
    // Helper getters
    activeTournaments: getTournamentsByPhase('REGISTRATION'),
    runningTournaments: getTournamentsByPhase('ACTIVE'),
    finishedTournaments: getTournamentsByPhase('FINISHED'),
    leagueTournaments: getTournamentsByType('LEAGUE'),
    knockoutTournaments: getTournamentsByType('KNOCKOUT'),
    hybridTournaments: getTournamentsByType('HYBRID')
  }
}