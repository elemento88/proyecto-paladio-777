import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useSupabaseFunctions() {
  const { user } = useAuth()

  // Resolve a betting challenge with outcome
  const resolveBettingChallenge = async (challengeId: string, outcomeValue: number) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { data, error } = await supabase.rpc('resolve_betting_challenge', {
        challenge_id_param: challengeId,
        outcome_value_param: outcomeValue,
        resolver_user_id: user.id
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  // Cancel a betting challenge
  const cancelBettingChallenge = async (challengeId: string) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { data, error } = await supabase.rpc('cancel_betting_challenge', {
        challenge_id_param: challengeId,
        canceller_user_id: user.id
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  // Get user statistics
  const getUserStatistics = async (userId?: string) => {
    const targetUserId = userId || user?.id
    if (!targetUserId) return { error: 'No user ID provided' }

    try {
      const { data, error } = await supabase.rpc('get_user_statistics', {
        user_id_param: targetUserId
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  // Add balance to user (for testing/demo)
  const addUserBalance = async (amount: number) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { data, error } = await supabase.rpc('add_user_balance', {
        user_id_param: user.id,
        amount_param: amount
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  // Get user transactions
  const getUserTransactions = async (limit: number = 50) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          bet:user_bets(
            id,
            challenge:betting_challenges(title, sport_id, league_id)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  // Get challenge comments
  const getChallengeComments = async (challengeId: string) => {
    try {
      const { data, error } = await supabase
        .from('challenge_comments')
        .select(`
          *,
          user:user_profiles(username, avatar_url)
        `)
        .eq('challenge_id', challengeId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  // Add comment to challenge
  const addChallengeComment = async (challengeId: string, message: string, parentId?: string) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { data, error } = await supabase
        .from('challenge_comments')
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
          message,
          parent_id: parentId || null
        })
        .select(`
          *,
          user:user_profiles(username, avatar_url)
        `)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  return {
    resolveBettingChallenge,
    cancelBettingChallenge,
    getUserStatistics,
    addUserBalance,
    getUserTransactions,
    getChallengeComments,
    addChallengeComment
  }
}