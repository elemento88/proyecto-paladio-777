-- Supabase Edge Functions SQL
-- These are database functions that run server-side

-- Function to resolve betting challenges
CREATE OR REPLACE FUNCTION resolve_betting_challenge(
  challenge_id_param UUID,
  outcome_value_param DECIMAL(18,6),
  resolver_user_id UUID
)
RETURNS JSON AS $$
DECLARE
  challenge_record RECORD;
  bet_record RECORD;
  total_prize_pool DECIMAL(18,6);
  winners_count INTEGER := 0;
  prize_per_winner DECIMAL(18,6);
  result JSON;
BEGIN
  -- Get challenge details
  SELECT * INTO challenge_record 
  FROM betting_challenges 
  WHERE id = challenge_id_param AND status = 'ACTIVE';
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Challenge not found or not active');
  END IF;

  -- Update challenge with outcome
  UPDATE betting_challenges 
  SET 
    outcome_value = outcome_value_param,
    status = 'RESOLVED',
    updated_at = NOW()
  WHERE id = challenge_id_param;

  -- Calculate winners based on resolution mode
  IF challenge_record.resolution_mode = 0 THEN -- EXACT mode
    -- Find exact matches
    UPDATE user_bets 
    SET 
      is_winner = (prediction_value = outcome_value_param),
      resolved_at = NOW()
    WHERE challenge_id = challenge_id_param;
    
  ELSIF challenge_record.resolution_mode = 1 THEN -- CLOSEST mode
    -- Find closest predictions
    WITH closest_predictions AS (
      SELECT 
        id,
        user_id,
        ABS(prediction_value - outcome_value_param) as distance
      FROM user_bets 
      WHERE challenge_id = challenge_id_param
      ORDER BY distance ASC
      LIMIT 1
    )
    UPDATE user_bets 
    SET 
      is_winner = (id IN (SELECT id FROM closest_predictions)),
      resolved_at = NOW()
    WHERE challenge_id = challenge_id_param;
    
  ELSIF challenge_record.resolution_mode = 2 THEN -- MULTI_WINNER mode
    -- Top 3 closest predictions win
    WITH closest_predictions AS (
      SELECT 
        id,
        user_id,
        ABS(prediction_value - outcome_value_param) as distance,
        ROW_NUMBER() OVER (ORDER BY ABS(prediction_value - outcome_value_param) ASC) as rank
      FROM user_bets 
      WHERE challenge_id = challenge_id_param
    )
    UPDATE user_bets 
    SET 
      is_winner = (id IN (SELECT id FROM closest_predictions WHERE rank <= 3)),
      position = (SELECT rank FROM closest_predictions WHERE closest_predictions.id = user_bets.id),
      resolved_at = NOW()
    WHERE challenge_id = challenge_id_param;
  END IF;

  -- Count winners and calculate prize distribution
  SELECT COUNT(*), SUM(stake_amount) 
  INTO winners_count, total_prize_pool
  FROM user_bets 
  WHERE challenge_id = challenge_id_param;

  -- Distribute prizes
  IF winners_count > 0 THEN
    prize_per_winner := total_prize_pool / winners_count;
    
    -- Update winner winnings
    UPDATE user_bets 
    SET actual_winnings = CASE 
      WHEN is_winner THEN prize_per_winner
      ELSE 0 
    END
    WHERE challenge_id = challenge_id_param;

    -- Update user balances for winners
    FOR bet_record IN 
      SELECT * FROM user_bets 
      WHERE challenge_id = challenge_id_param AND is_winner = true
    LOOP
      -- Add winnings to balance and remove from locked
      UPDATE user_profiles 
      SET 
        balance_usdc = balance_usdc + bet_record.actual_winnings,
        balance_locked = balance_locked - bet_record.stake_amount
      WHERE id = bet_record.user_id;

      -- Create winning transaction
      INSERT INTO transactions (
        user_id, bet_id, challenge_id, type, amount, 
        balance_before, balance_after, status
      ) 
      SELECT 
        bet_record.user_id,
        bet_record.id,
        challenge_id_param,
        'BET_WON',
        bet_record.actual_winnings,
        up.balance_usdc - bet_record.actual_winnings,
        up.balance_usdc,
        'COMPLETED'
      FROM user_profiles up 
      WHERE up.id = bet_record.user_id;
    END LOOP;

    -- Update user balances for losers (unlock their stake)
    FOR bet_record IN 
      SELECT * FROM user_bets 
      WHERE challenge_id = challenge_id_param AND is_winner = false
    LOOP
      -- Remove from locked balance (they lose their stake)
      UPDATE user_profiles 
      SET balance_locked = balance_locked - bet_record.stake_amount
      WHERE id = bet_record.user_id;

      -- Create losing transaction
      INSERT INTO transactions (
        user_id, bet_id, challenge_id, type, amount, 
        balance_before, balance_after, status
      ) 
      SELECT 
        bet_record.user_id,
        bet_record.id,
        challenge_id_param,
        'BET_LOST',
        -bet_record.stake_amount,
        up.balance_usdc,
        up.balance_usdc,
        'COMPLETED'
      FROM user_profiles up 
      WHERE up.id = bet_record.user_id;
    END LOOP;
  END IF;

  RETURN json_build_object(
    'success', true,
    'challenge_id', challenge_id_param,
    'outcome_value', outcome_value_param,
    'winners_count', winners_count,
    'prize_per_winner', prize_per_winner,
    'total_pool', total_prize_pool
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cancel a betting challenge
CREATE OR REPLACE FUNCTION cancel_betting_challenge(
  challenge_id_param UUID,
  canceller_user_id UUID
)
RETURNS JSON AS $$
DECLARE
  challenge_record RECORD;
  bet_record RECORD;
BEGIN
  -- Get challenge details
  SELECT * INTO challenge_record 
  FROM betting_challenges 
  WHERE id = challenge_id_param;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Challenge not found');
  END IF;

  -- Check if user is creator or admin
  IF challenge_record.creator_id != canceller_user_id THEN
    RETURN json_build_object('error', 'Only challenge creator can cancel');
  END IF;

  -- Check if challenge can be cancelled
  IF challenge_record.status != 'ACTIVE' THEN
    RETURN json_build_object('error', 'Challenge cannot be cancelled');
  END IF;

  -- Update challenge status
  UPDATE betting_challenges 
  SET 
    status = 'CANCELLED',
    updated_at = NOW()
  WHERE id = challenge_id_param;

  -- Refund all participants
  FOR bet_record IN 
    SELECT * FROM user_bets 
    WHERE challenge_id = challenge_id_param
  LOOP
    -- Return locked balance to available balance
    UPDATE user_profiles 
    SET 
      balance_usdc = balance_usdc + bet_record.stake_amount,
      balance_locked = balance_locked - bet_record.stake_amount
    WHERE id = bet_record.user_id;

    -- Create refund transaction
    INSERT INTO transactions (
      user_id, bet_id, challenge_id, type, amount, 
      balance_before, balance_after, status
    ) 
    SELECT 
      bet_record.user_id,
      bet_record.id,
      challenge_id_param,
      'BET_REFUNDED',
      bet_record.stake_amount,
      up.balance_usdc - bet_record.stake_amount,
      up.balance_usdc,
      'COMPLETED'
    FROM user_profiles up 
    WHERE up.id = bet_record.user_id;
  END LOOP;

  RETURN json_build_object(
    'success', true,
    'challenge_id', challenge_id_param,
    'refunded_participants', (
      SELECT COUNT(*) FROM user_bets WHERE challenge_id = challenge_id_param
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics(user_id_param UUID)
RETURNS JSON AS $$
DECLARE
  stats RECORD;
  transactions_summary RECORD;
BEGIN
  -- Get basic betting stats
  SELECT 
    COUNT(*) as total_bets,
    COUNT(*) FILTER (WHERE resolved_at IS NULL) as active_bets,
    COUNT(*) FILTER (WHERE is_winner = true) as won_bets,
    COUNT(*) FILTER (WHERE is_winner = false AND resolved_at IS NOT NULL) as lost_bets,
    COUNT(*) FILTER (WHERE resolved_at IS NULL) as pending_bets,
    SUM(stake_amount) as total_staked,
    SUM(actual_winnings) as total_winnings,
    SUM(actual_winnings - stake_amount) as profit_loss
  INTO stats
  FROM user_bets 
  WHERE user_id = user_id_param;

  -- Calculate win rate
  DECLARE
    win_rate DECIMAL(5,2) := 0;
  BEGIN
    IF stats.total_bets > 0 THEN
      win_rate := (stats.won_bets::DECIMAL / stats.total_bets::DECIMAL) * 100;
    END IF;
  END;

  -- Update cached statistics
  INSERT INTO user_statistics (
    user_id, total_bets, active_bets, won_bets, lost_bets, pending_bets,
    total_staked, total_winnings, profit_loss, win_rate, last_updated
  ) VALUES (
    user_id_param, stats.total_bets, stats.active_bets, stats.won_bets, 
    stats.lost_bets, stats.pending_bets, stats.total_staked, 
    stats.total_winnings, stats.profit_loss, win_rate, NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_bets = EXCLUDED.total_bets,
    active_bets = EXCLUDED.active_bets,
    won_bets = EXCLUDED.won_bets,
    lost_bets = EXCLUDED.lost_bets,
    pending_bets = EXCLUDED.pending_bets,
    total_staked = EXCLUDED.total_staked,
    total_winnings = EXCLUDED.total_winnings,
    profit_loss = EXCLUDED.profit_loss,
    win_rate = EXCLUDED.win_rate,
    last_updated = NOW();

  RETURN json_build_object(
    'total_bets', stats.total_bets,
    'active_bets', stats.active_bets,
    'won_bets', stats.won_bets,
    'lost_bets', stats.lost_bets,
    'pending_bets', stats.pending_bets,
    'total_staked', stats.total_staked,
    'total_winnings', stats.total_winnings,
    'profit_loss', stats.profit_loss,
    'win_rate', win_rate
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add user balance (for testing/demo purposes)
CREATE OR REPLACE FUNCTION add_user_balance(
  user_id_param UUID,
  amount_param DECIMAL(18,6)
)
RETURNS JSON AS $$
BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = user_id_param) THEN
    RETURN json_build_object('error', 'User not found');
  END IF;

  -- Add balance
  UPDATE user_profiles 
  SET 
    balance_usdc = balance_usdc + amount_param,
    updated_at = NOW()
  WHERE id = user_id_param;

  -- Create transaction record
  INSERT INTO transactions (
    user_id, type, amount, balance_after, status
  ) 
  SELECT 
    user_id_param,
    'BALANCE_ADDED',
    amount_param,
    balance_usdc,
    'COMPLETED'
  FROM user_profiles 
  WHERE id = user_id_param;

  RETURN json_build_object(
    'success', true,
    'user_id', user_id_param,
    'amount_added', amount_param,
    'new_balance', (SELECT balance_usdc FROM user_profiles WHERE id = user_id_param)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC functions accessible from client
-- These can be called using supabase.rpc('function_name', { params })

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION resolve_betting_challenge TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_betting_challenge TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION add_user_balance TO authenticated;