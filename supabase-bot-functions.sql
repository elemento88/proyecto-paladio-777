-- Bot Management Functions for Supabase
-- Functions to create and manage bot accounts

-- First, extend user_profiles table to support bots
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_bot BOOLEAN DEFAULT false;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS bot_type VARCHAR(50); -- 'aggressive', 'conservative', 'random', 'smart'
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id); -- Who created this bot

-- Function to create a single bot account
CREATE OR REPLACE FUNCTION create_bot_account(
  bot_username VARCHAR(50),
  bot_type_param VARCHAR(50) DEFAULT 'random',
  initial_balance DECIMAL(18,6) DEFAULT 100.0,
  creator_user_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  bot_user_id UUID;
  fake_email VARCHAR(255);
  fake_password VARCHAR(255);
  bot_avatars TEXT[] := ARRAY[
    '🤖', '🎯', '🎲', '🎪', '🎭', '🚀', '⚡', '🔥', '💎', '🏆',
    '🎰', '🎮', '🏅', '⭐', '💫', '🌟', '🎊', '🎉', '🏁', '🎳'
  ];
  selected_avatar TEXT;
BEGIN
  -- Generate unique email and password for bot
  fake_email := bot_username || '_bot@paladio77.local';
  fake_password := 'bot_' || bot_username || '_' || extract(epoch from now())::text;
  
  -- Select random avatar
  selected_avatar := bot_avatars[1 + floor(random() * array_length(bot_avatars, 1))::int];

  -- Create auth user (this is a workaround since we can't directly insert into auth.users)
  -- We'll create a profile directly and use a generated UUID
  bot_user_id := uuid_generate_v4();

  -- Insert bot profile directly
  INSERT INTO user_profiles (
    id,
    username,
    wallet_address,
    network,
    balance_usdc,
    balance_locked,
    avatar_url,
    bio,
    is_verified,
    is_bot,
    bot_type,
    created_by,
    created_at,
    updated_at
  ) VALUES (
    bot_user_id,
    bot_username,
    '0x' || encode(gen_random_bytes(20), 'hex'), -- Generate fake wallet address
    'polygon',
    initial_balance,
    0,
    selected_avatar,
    'Bot automático para simulación de apuestas',
    false,
    true,
    bot_type_param,
    creator_user_id,
    NOW(),
    NOW()
  );

  -- Initialize bot statistics
  INSERT INTO user_statistics (
    user_id,
    total_bets,
    active_bets,
    won_bets,
    lost_bets,
    pending_bets,
    total_staked,
    total_winnings,
    profit_loss,
    win_rate,
    best_streak,
    current_streak,
    last_updated
  ) VALUES (
    bot_user_id,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NOW()
  );

  -- Create initial balance transaction
  INSERT INTO transactions (
    user_id,
    type,
    amount,
    balance_before,
    balance_after,
    status,
    created_at
  ) VALUES (
    bot_user_id,
    'INITIAL_BALANCE',
    initial_balance,
    0,
    initial_balance,
    'COMPLETED',
    NOW()
  );

  RETURN json_build_object(
    'success', true,
    'bot_id', bot_user_id,
    'username', bot_username,
    'bot_type', bot_type_param,
    'initial_balance', initial_balance,
    'avatar', selected_avatar,
    'wallet_address', (SELECT wallet_address FROM user_profiles WHERE id = bot_user_id)
  );

EXCEPTION
  WHEN unique_violation THEN
    RETURN json_build_object('error', 'Bot username already exists');
  WHEN OTHERS THEN
    RETURN json_build_object('error', 'Failed to create bot: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create multiple bot accounts
CREATE OR REPLACE FUNCTION create_multiple_bots(
  count_param INTEGER DEFAULT 5,
  bot_type_param VARCHAR(50) DEFAULT 'random',
  initial_balance DECIMAL(18,6) DEFAULT 100.0,
  creator_user_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  bot_names TEXT[] := ARRAY[
    'CryptoTrader', 'BetMaster', 'LuckyBot', 'SmartPlayer', 'RiskTaker',
    'ProfitSeeker', 'DataAnalyst', 'TrendFollower', 'ValueHunter', 'MarketMaker',
    'AlgoTrader', 'QuickPlay', 'SteadyWins', 'BigBettor', 'SafePlayer',
    'HighRoller', 'Conservative', 'Aggressive', 'Balanced', 'Strategic',
    'RandomBot', 'WiseOwl', 'FastFox', 'CleverCat', 'SharpEye',
    'BoldBear', 'SwiftEagle', 'StrongBull', 'QuickRabbit', 'SmartWolf'
  ];
  bot_types TEXT[] := ARRAY['aggressive', 'conservative', 'random', 'smart'];
  created_bots JSON[] := ARRAY[]::JSON[];
  current_bot JSON;
  i INTEGER;
  selected_name TEXT;
  selected_type TEXT;
  attempt INTEGER;
  max_attempts INTEGER := 50;
BEGIN
  -- Create the specified number of bots
  FOR i IN 1..count_param LOOP
    attempt := 0;
    
    -- Try to create a bot with a unique name
    LOOP
      attempt := attempt + 1;
      EXIT WHEN attempt > max_attempts;
      
      -- Select random name and type
      selected_name := bot_names[1 + floor(random() * array_length(bot_names, 1))::int] || 
                      '_' || floor(random() * 9999)::text;
      
      IF bot_type_param = 'random' THEN
        selected_type := bot_types[1 + floor(random() * array_length(bot_types, 1))::int];
      ELSE
        selected_type := bot_type_param;
      END IF;
      
      -- Try to create the bot
      SELECT create_bot_account(
        selected_name,
        selected_type,
        initial_balance + (random() * 50 - 25), -- Add some variation to balance
        creator_user_id
      ) INTO current_bot;
      
      -- If successful, add to array and continue
      IF (current_bot->>'success')::boolean THEN
        created_bots := array_append(created_bots, current_bot);
        EXIT;
      END IF;
    END LOOP;
    
    -- If we couldn't create this bot after max attempts, continue with next
    IF attempt > max_attempts THEN
      created_bots := array_append(created_bots, 
        json_build_object('error', 'Could not create bot after ' || max_attempts || ' attempts')
      );
    END IF;
  END LOOP;

  RETURN json_build_object(
    'success', true,
    'created_count', array_length(created_bots, 1),
    'requested_count', count_param,
    'bots', created_bots
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all bot accounts
CREATE OR REPLACE FUNCTION get_bot_accounts(
  creator_user_id UUID DEFAULT NULL,
  limit_param INTEGER DEFAULT 50
)
RETURNS JSON AS $$
DECLARE
  bots JSON;
BEGIN
  IF creator_user_id IS NOT NULL THEN
    -- Get bots created by specific user
    SELECT json_agg(
      json_build_object(
        'id', id,
        'username', username,
        'bot_type', bot_type,
        'balance_usdc', balance_usdc,
        'balance_locked', balance_locked,
        'avatar_url', avatar_url,
        'wallet_address', wallet_address,
        'created_at', created_at,
        'stats', (
          SELECT json_build_object(
            'total_bets', total_bets,
            'won_bets', won_bets,
            'lost_bets', lost_bets,
            'win_rate', win_rate,
            'profit_loss', profit_loss
          )
          FROM user_statistics 
          WHERE user_id = user_profiles.id
        )
      )
    ) INTO bots
    FROM user_profiles 
    WHERE is_bot = true 
      AND (created_by = creator_user_id OR creator_user_id IS NULL)
    ORDER BY created_at DESC
    LIMIT limit_param;
  ELSE
    -- Get all bots
    SELECT json_agg(
      json_build_object(
        'id', id,
        'username', username,
        'bot_type', bot_type,
        'balance_usdc', balance_usdc,
        'balance_locked', balance_locked,
        'avatar_url', avatar_url,
        'wallet_address', wallet_address,
        'created_at', created_at,
        'stats', (
          SELECT json_build_object(
            'total_bets', total_bets,
            'won_bets', won_bets,
            'lost_bets', lost_bets,
            'win_rate', win_rate,
            'profit_loss', profit_loss
          )
          FROM user_statistics 
          WHERE user_id = user_profiles.id
        )
      )
    ) INTO bots
    FROM user_profiles 
    WHERE is_bot = true
    ORDER BY created_at DESC
    LIMIT limit_param;
  END IF;

  RETURN json_build_object(
    'success', true,
    'bots', COALESCE(bots, '[]'::json)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete a bot account
CREATE OR REPLACE FUNCTION delete_bot_account(
  bot_id_param UUID,
  deleter_user_id UUID
)
RETURNS JSON AS $$
DECLARE
  bot_record RECORD;
BEGIN
  -- Get bot details
  SELECT * INTO bot_record 
  FROM user_profiles 
  WHERE id = bot_id_param AND is_bot = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Bot not found');
  END IF;

  -- Check if user can delete this bot (creator or admin)
  IF bot_record.created_by != deleter_user_id THEN
    RETURN json_build_object('error', 'Only bot creator can delete this bot');
  END IF;

  -- Cancel any active bets by this bot
  UPDATE betting_challenges 
  SET 
    current_participants = current_participants - 1,
    total_pool = total_pool - (
      SELECT COALESCE(SUM(stake_amount), 0) 
      FROM user_bets 
      WHERE challenge_id = betting_challenges.id AND user_id = bot_id_param
    )
  WHERE id IN (
    SELECT DISTINCT challenge_id 
    FROM user_bets 
    WHERE user_id = bot_id_param AND resolved_at IS NULL
  );

  -- Delete bot's transactions, bets, statistics, and profile
  DELETE FROM transactions WHERE user_id = bot_id_param;
  DELETE FROM user_bets WHERE user_id = bot_id_param;
  DELETE FROM user_statistics WHERE user_id = bot_id_param;
  DELETE FROM user_profiles WHERE id = bot_id_param;

  RETURN json_build_object(
    'success', true,
    'deleted_bot_id', bot_id_param,
    'deleted_username', bot_record.username
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to simulate bot betting behavior
CREATE OR REPLACE FUNCTION simulate_bot_betting(
  bot_id_param UUID,
  challenge_id_param UUID
)
RETURNS JSON AS $$
DECLARE
  bot_record RECORD;
  challenge_record RECORD;
  prediction_value DECIMAL(18,6);
  stake_amount DECIMAL(18,6);
  bet_result JSON;
BEGIN
  -- Get bot details
  SELECT * INTO bot_record 
  FROM user_profiles 
  WHERE id = bot_id_param AND is_bot = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Bot not found');
  END IF;

  -- Get challenge details
  SELECT * INTO challenge_record 
  FROM betting_challenges 
  WHERE id = challenge_id_param AND status = 'ACTIVE';
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Challenge not found or not active');
  END IF;

  -- Check if bot already has a bet on this challenge
  IF EXISTS (SELECT 1 FROM user_bets WHERE user_id = bot_id_param AND challenge_id = challenge_id_param) THEN
    RETURN json_build_object('error', 'Bot already has a bet on this challenge');
  END IF;

  -- Generate prediction based on bot type
  CASE bot_record.bot_type
    WHEN 'aggressive' THEN
      -- Aggressive bots make extreme predictions
      prediction_value := (random() * 200 + 1); -- 1-201 range
      stake_amount := GREATEST(challenge_record.stake_amount, bot_record.balance_usdc * 0.1);
    WHEN 'conservative' THEN
      -- Conservative bots make safer predictions
      prediction_value := (random() * 50 + 25); -- 25-75 range  
      stake_amount := challenge_record.stake_amount;
    WHEN 'smart' THEN
      -- Smart bots analyze patterns (simplified)
      prediction_value := (random() * 100 + 1); -- 1-101 range
      stake_amount := LEAST(challenge_record.stake_amount * 1.5, bot_record.balance_usdc * 0.05);
    ELSE -- random
      -- Random bots are unpredictable
      prediction_value := (random() * 100 + 1); -- 1-101 range
      stake_amount := challenge_record.stake_amount * (0.5 + random()); -- 0.5x to 1.5x stake
  END CASE;

  -- Ensure bot has enough balance
  stake_amount := LEAST(stake_amount, bot_record.balance_usdc);
  
  IF stake_amount < challenge_record.stake_amount THEN
    RETURN json_build_object('error', 'Bot has insufficient balance');
  END IF;

  -- Place the bet
  INSERT INTO user_bets (
    challenge_id,
    user_id,
    prediction_value,
    stake_amount,
    placed_at
  ) VALUES (
    challenge_id_param,
    bot_id_param,
    prediction_value,
    stake_amount,
    NOW()
  );

  -- Update bot balance
  UPDATE user_profiles 
  SET 
    balance_usdc = balance_usdc - stake_amount,
    balance_locked = balance_locked + stake_amount,
    updated_at = NOW()
  WHERE id = bot_id_param;

  -- Update challenge
  UPDATE betting_challenges 
  SET 
    current_participants = current_participants + 1,
    total_pool = total_pool + stake_amount,
    updated_at = NOW()
  WHERE id = challenge_id_param;

  -- Create transaction
  INSERT INTO transactions (
    user_id,
    challenge_id,
    type,
    amount,
    balance_before,
    balance_after,
    status,
    created_at
  ) VALUES (
    bot_id_param,
    challenge_id_param,
    'BET_PLACED',
    -stake_amount,
    bot_record.balance_usdc,
    bot_record.balance_usdc - stake_amount,
    'COMPLETED',
    NOW()
  );

  RETURN json_build_object(
    'success', true,
    'bot_id', bot_id_param,
    'challenge_id', challenge_id_param,
    'prediction_value', prediction_value,
    'stake_amount', stake_amount,
    'bot_type', bot_record.bot_type
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to authenticated users
GRANT EXECUTE ON FUNCTION create_bot_account TO authenticated;
GRANT EXECUTE ON FUNCTION create_multiple_bots TO authenticated;
GRANT EXECUTE ON FUNCTION get_bot_accounts TO authenticated;
GRANT EXECUTE ON FUNCTION delete_bot_account TO authenticated;
GRANT EXECUTE ON FUNCTION simulate_bot_betting TO authenticated;