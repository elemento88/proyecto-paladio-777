import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

interface BotAccount {
  id: string
  username: string
  bot_type: 'aggressive' | 'conservative' | 'random' | 'smart'
  balance_usdc: number
  balance_locked: number
  avatar_url: string
  wallet_address: string
  created_at: string
  stats: {
    total_bets: number
    won_bets: number
    lost_bets: number
    win_rate: number
    profit_loss: number
  }
}

interface CreateBotParams {
  username?: string
  botType?: 'aggressive' | 'conservative' | 'random' | 'smart'
  initialBalance?: number
}

interface CreateMultipleBotsParams {
  count: number
  botType?: 'aggressive' | 'conservative' | 'random' | 'smart'
  initialBalance?: number
}

export function useBots() {
  const { user } = useAuth()
  const [bots, setBots] = useState<BotAccount[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch bot accounts
  const fetchBots = async () => {
    if (!user) return { error: 'User not authenticated' }

    try {
      setLoading(true)
      const { data, error } = await supabase.rpc('get_bot_accounts', {
        creator_user_id: user.id,
        limit_param: 100
      })

      if (error) throw error
      
      if (data.success) {
        setBots(data.bots || [])
        return { data: data.bots, error: null }
      } else {
        return { data: null, error: 'Failed to fetch bots' }
      }
    } catch (error: any) {
      console.error('Error fetching bots:', error)
      return { data: null, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Create a single bot account
  const createBot = async ({ 
    username, 
    botType = 'random', 
    initialBalance = 100 
  }: CreateBotParams = {}) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      setLoading(true)
      
      // Generate username if not provided
      const botUsername = username || `Bot_${Date.now()}_${Math.floor(Math.random() * 1000)}`

      const { data, error } = await supabase.rpc('create_bot_account', {
        bot_username: botUsername,
        bot_type_param: botType,
        initial_balance: initialBalance,
        creator_user_id: user.id
      })

      if (error) throw error

      if (data.success) {
        // Refresh bots list
        await fetchBots()
        return { data: data, error: null }
      } else {
        return { data: null, error: data.error || 'Failed to create bot' }
      }
    } catch (error: any) {
      console.error('Error creating bot:', error)
      return { data: null, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Create multiple bot accounts
  const createMultipleBots = async ({ 
    count, 
    botType = 'random', 
    initialBalance = 100 
  }: CreateMultipleBotsParams) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      setLoading(true)
      
      const { data, error } = await supabase.rpc('create_multiple_bots', {
        count_param: count,
        bot_type_param: botType,
        initial_balance: initialBalance,
        creator_user_id: user.id
      })

      if (error) throw error

      if (data.success) {
        // Refresh bots list
        await fetchBots()
        return { 
          data: {
            created_count: data.created_count,
            requested_count: data.requested_count,
            bots: data.bots
          }, 
          error: null 
        }
      } else {
        return { data: null, error: 'Failed to create bots' }
      }
    } catch (error: any) {
      console.error('Error creating multiple bots:', error)
      return { data: null, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Delete a bot account
  const deleteBot = async (botId: string) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      setLoading(true)
      
      const { data, error } = await supabase.rpc('delete_bot_account', {
        bot_id_param: botId,
        deleter_user_id: user.id
      })

      if (error) throw error

      if (data.success) {
        // Refresh bots list
        await fetchBots()
        return { data: data, error: null }
      } else {
        return { data: null, error: data.error || 'Failed to delete bot' }
      }
    } catch (error: any) {
      console.error('Error deleting bot:', error)
      return { data: null, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Simulate bot betting on a challenge
  const simulateBotBetting = async (botId: string, challengeId: string) => {
    try {
      const { data, error } = await supabase.rpc('simulate_bot_betting', {
        bot_id_param: botId,
        challenge_id_param: challengeId
      })

      if (error) throw error

      if (data.success) {
        // Refresh bots list to update balances
        await fetchBots()
        return { data: data, error: null }
      } else {
        return { data: null, error: data.error || 'Failed to simulate bot betting' }
      }
    } catch (error: any) {
      console.error('Error simulating bot betting:', error)
      return { data: null, error: error.message }
    }
  }

  // Make all bots bet on a specific challenge
  const makeAllBotsBet = async (challengeId: string) => {
    const results = []
    
    for (const bot of bots) {
      if (bot.balance_usdc > 10) { // Only if bot has enough balance
        const result = await simulateBotBetting(bot.id, challengeId)
        results.push({
          botId: bot.id,
          botUsername: bot.username,
          result
        })
      }
    }

    return results
  }

  // Add balance to a bot (for testing)
  const addBotBalance = async (botId: string, amount: number) => {
    try {
      const { data, error } = await supabase.rpc('add_user_balance', {
        user_id_param: botId,
        amount_param: amount
      })

      if (error) throw error

      if (data.success) {
        // Refresh bots list
        await fetchBots()
        return { data: data, error: null }
      } else {
        return { data: null, error: 'Failed to add balance' }
      }
    } catch (error: any) {
      console.error('Error adding bot balance:', error)
      return { data: null, error: error.message }
    }
  }

  // Auto-load bots when user changes
  useEffect(() => {
    if (user) {
      fetchBots()
    } else {
      setBots([])
    }
  }, [user])

  return {
    bots,
    loading,
    createBot,
    createMultipleBots,
    deleteBot,
    simulateBotBetting,
    makeAllBotsBet,
    addBotBalance,
    fetchBots,
    // Helper functions
    getBotsByType: (type: string) => bots.filter(bot => bot.bot_type === type),
    getTotalBots: () => bots.length,
    getTotalBotBalance: () => bots.reduce((sum, bot) => sum + bot.balance_usdc, 0),
    getActiveBots: () => bots.filter(bot => bot.balance_usdc > 10)
  }
}