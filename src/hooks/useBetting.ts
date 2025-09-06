import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { BetType, ResolutionMode, BetStatus } from '@/types/betting'

interface BettingChallenge {
  id: string
  title: string
  description?: string
  bet_type: BetType
  resolution_mode: ResolutionMode
  creator_id: string
  sport_id: string
  league_id: string
  stake_amount: number
  min_participants: number
  max_participants: number
  current_participants: number
  end_date: string
  lock_date?: string
  outcome_value?: number
  status: BetStatus
  is_public: boolean
  icon: string
  icon_bg: string
  total_pool: number
  created_at: string
  updated_at: string
  // Joined data
  sport?: { name: string; slug: string; icon: string }
  league?: { name: string; slug: string; icon: string; country: string }
  creator?: { username?: string; wallet_address?: string }
}

interface UserBet {
  id: string
  challenge_id: string
  user_id: string
  prediction_value?: number
  stake_amount: number
  potential_winnings?: number
  actual_winnings: number
  position?: number
  is_winner: boolean
  placed_at: string
  resolved_at?: string
  // Joined data
  challenge?: BettingChallenge
}

export function useBetting() {
  const { user, profile } = useAuth()
  const [challenges, setChallenges] = useState<BettingChallenge[]>([])
  const [userBets, setUserBets] = useState<UserBet[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch active challenges
  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('betting_challenges')
        .select(`
          *,
          sport:sports_categories(name, slug, icon),
          league:leagues(name, slug, icon, country),
          creator:user_profiles(username, wallet_address)
        `)
        .eq('status', 'ACTIVE')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setChallenges(data || [])
    } catch (error) {
      console.error('Error fetching challenges:', error)
    }
  }

  // Fetch user's bets
  const fetchUserBets = async () => {
    if (!user) return

    try {
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
        .order('placed_at', { ascending: false })

      if (error) throw error
      setUserBets(data || [])
    } catch (error) {
      console.error('Error fetching user bets:', error)
    }
  }

  // Create new betting challenge
  const createChallenge = async (challengeData: {
    title: string
    description?: string
    bet_type: BetType
    resolution_mode: ResolutionMode
    sport_id: string
    league_id: string
    stake_amount: number
    max_participants: number
    end_date: string
    is_public?: boolean
  }) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { data, error } = await supabase
        .from('betting_challenges')
        .insert({
          ...challengeData,
          creator_id: user.id,
          is_public: challengeData.is_public ?? true
        })
        .select()
        .single()

      if (error) throw error
      
      // Refresh challenges
      await fetchChallenges()
      
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  // Place a bet on a challenge
  const placeBet = async (challengeId: string, predictionValue?: number, stakeAmount?: number) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      // Get challenge details
      const { data: challenge, error: challengeError } = await supabase
        .from('betting_challenges')
        .select('*')
        .eq('id', challengeId)
        .single()

      if (challengeError) throw challengeError

      const finalStakeAmount = stakeAmount || challenge.stake_amount

      // Check if user has enough balance
      if (profile && profile.balance_usdc < finalStakeAmount) {
        return { error: 'Insufficient balance' }
      }

      // Place the bet
      const { data, error } = await supabase
        .from('user_bets')
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
          prediction_value: predictionValue,
          stake_amount: finalStakeAmount
        })
        .select()
        .single()

      if (error) throw error

      // Update user balance and challenge participants
      await Promise.all([
        supabase
          .from('user_profiles')
          .update({ 
            balance_usdc: (profile?.balance_usdc || 0) - finalStakeAmount,
            balance_locked: (profile?.balance_locked || 0) + finalStakeAmount
          })
          .eq('id', user.id),
        
        supabase
          .from('betting_challenges')
          .update({ 
            current_participants: challenge.current_participants + 1,
            total_pool: challenge.total_pool + finalStakeAmount
          })
          .eq('id', challengeId)
      ])

      // Create transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          bet_id: data.id,
          challenge_id: challengeId,
          type: 'BET_PLACED',
          amount: -finalStakeAmount,
          balance_before: profile?.balance_usdc || 0,
          balance_after: (profile?.balance_usdc || 0) - finalStakeAmount
        })

      // Refresh data
      await Promise.all([fetchChallenges(), fetchUserBets()])

      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  // Get sports categories
  const fetchSportsCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('sports_categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  // Get leagues by sport
  const fetchLeagues = async (sportId?: string) => {
    try {
      let query = supabase
        .from('leagues')
        .select('*, sport:sports_categories(name, slug, icon)')
        .eq('is_active', true)
        .order('name')

      if (sportId && sportId !== 'todos') {
        query = query.eq('sport_id', sportId)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  // Subscribe to real-time updates
  const subscribeToUpdates = () => {
    const challengesSubscription = supabase
      .channel('betting_challenges_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'betting_challenges' },
        (payload) => {
          console.log('Challenge updated:', payload)
          fetchChallenges()
        }
      )
      .subscribe()

    const betsSubscription = user ? supabase
      .channel('user_bets_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_bets',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('User bet updated:', payload)
          fetchUserBets()
        }
      )
      .subscribe() : null

    return () => {
      challengesSubscription.unsubscribe()
      if (betsSubscription) betsSubscription.unsubscribe()
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchChallenges()
      if (user) {
        await fetchUserBets()
      }
      setLoading(false)
    }

    loadData()
  }, [user])

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToUpdates()
    return unsubscribe
  }, [user])

  return {
    challenges,
    userBets,
    loading,
    createChallenge,
    placeBet,
    fetchSportsCategories,
    fetchLeagues,
    refetchChallenges: fetchChallenges,
    refetchUserBets: fetchUserBets
  }
}