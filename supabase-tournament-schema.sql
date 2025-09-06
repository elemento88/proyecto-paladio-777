-- Tournament Extension for Supabase
-- Add tournament functionality to existing betting system

-- Add tournament fields to betting_challenges table
ALTER TABLE betting_challenges ADD COLUMN IF NOT EXISTS tournament_type VARCHAR(20); -- 'LEAGUE', 'KNOCKOUT', 'HYBRID'
ALTER TABLE betting_challenges ADD COLUMN IF NOT EXISTS tournament_duration VARCHAR(20); -- 'FAST', 'MEDIUM', 'LONG', 'SEASON'
ALTER TABLE betting_challenges ADD COLUMN IF NOT EXISTS tournament_prize_distribution VARCHAR(20); -- 'WINNER_TAKES_ALL', 'TOP3', 'TOP5', 'TOP10_PERCENT'
ALTER TABLE betting_challenges ADD COLUMN IF NOT EXISTS allow_tournament_spectators BOOLEAN DEFAULT false;
ALTER TABLE betting_challenges ADD COLUMN IF NOT EXISTS enable_tournament_chat BOOLEAN DEFAULT false;
ALTER TABLE betting_challenges ADD COLUMN IF NOT EXISTS tournament_start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE betting_challenges ADD COLUMN IF NOT EXISTS tournament_phase VARCHAR(20) DEFAULT 'REGISTRATION'; -- 'REGISTRATION', 'ACTIVE', 'PLAYOFFS', 'FINISHED'
ALTER TABLE betting_challenges ADD COLUMN IF NOT EXISTS tournament_config JSONB; -- Configuration specific to tournament type

-- Create tournament matches table (for knockout/hybrid tournaments)
CREATE TABLE IF NOT EXISTS tournament_matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES betting_challenges(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL, -- 1 = first round, 2 = semifinals, etc.
  match_number INTEGER NOT NULL, -- Position within the round
  participant1_id UUID REFERENCES user_profiles(id),
  participant2_id UUID REFERENCES user_profiles(id),
  winner_id UUID REFERENCES user_profiles(id),
  participant1_score DECIMAL(18,6),
  participant2_score DECIMAL(18,6),
  match_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'ACTIVE', 'FINISHED'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tournament standings table (for league tournaments)
CREATE TABLE IF NOT EXISTS tournament_standings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES betting_challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  total_predictions INTEGER DEFAULT 0,
  accuracy_percentage DECIMAL(5,2) DEFAULT 0,
  current_position INTEGER,
  previous_position INTEGER,
  prize_won DECIMAL(18,6) DEFAULT 0,
  is_eliminated BOOLEAN DEFAULT false,
  qualification_status VARCHAR(20) DEFAULT 'ACTIVE', -- 'ACTIVE', 'QUALIFIED', 'ELIMINATED'
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(tournament_id, user_id)
);

-- Create tournament rounds table (for league/hybrid tournaments)
CREATE TABLE IF NOT EXISTS tournament_rounds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES betting_challenges(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  round_name VARCHAR(100), -- 'Week 1', 'Semifinals', 'Finals', etc.
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'ACTIVE', 'FINISHED'
  round_config JSONB, -- Round-specific configuration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(tournament_id, round_number)
);

-- Create tournament predictions table (separate from user_bets for tournament-specific logic)
CREATE TABLE IF NOT EXISTS tournament_predictions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES betting_challenges(id) ON DELETE CASCADE,
  round_id UUID REFERENCES tournament_rounds(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  prediction_value DECIMAL(18,6) NOT NULL,
  actual_outcome DECIMAL(18,6),
  points_earned INTEGER DEFAULT 0,
  accuracy_points DECIMAL(8,4) DEFAULT 0, -- Calculated based on how close the prediction was
  bonus_points INTEGER DEFAULT 0, -- Extra points for perfect predictions, early submissions, etc.
  prediction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_resolved BOOLEAN DEFAULT false,
  
  UNIQUE(tournament_id, round_id, user_id)
);

-- Create tournament prizes table
CREATE TABLE IF NOT EXISTS tournament_prizes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES betting_challenges(id) ON DELETE CASCADE,
  position INTEGER NOT NULL, -- 1st place, 2nd place, etc.
  prize_amount DECIMAL(18,6) NOT NULL,
  prize_percentage DECIMAL(5,2) NOT NULL, -- What percentage of total pool
  winner_id UUID REFERENCES user_profiles(id), -- NULL until tournament is finished
  is_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(tournament_id, position)
);

-- Function to create a tournament
CREATE OR REPLACE FUNCTION create_tournament(
  tournament_data JSONB
)
RETURNS JSON AS $$
DECLARE
  tournament_id UUID;
  tournament_record RECORD;
  prize_config JSONB;
  total_pool DECIMAL(18,6);
  i INTEGER;
  round_config JSONB;
BEGIN
  -- Extract tournament data
  SELECT 
    (tournament_data->>'title')::VARCHAR(200) as title,
    (tournament_data->>'description')::TEXT as description,
    (tournament_data->>'bet_type')::INTEGER as bet_type,
    (tournament_data->>'resolution_mode')::INTEGER as resolution_mode,
    (tournament_data->>'creator_id')::UUID as creator_id,
    (tournament_data->>'sport_id')::UUID as sport_id,
    (tournament_data->>'league_id')::UUID as league_id,
    (tournament_data->>'stake_amount')::DECIMAL(18,6) as stake_amount,
    (tournament_data->>'max_participants')::INTEGER as max_participants,
    (tournament_data->>'end_date')::TIMESTAMP WITH TIME ZONE as end_date,
    (tournament_data->>'tournament_type')::VARCHAR(20) as tournament_type,
    (tournament_data->>'tournament_duration')::VARCHAR(20) as tournament_duration,
    (tournament_data->>'tournament_prize_distribution')::VARCHAR(20) as tournament_prize_distribution,
    (tournament_data->>'allow_spectators')::BOOLEAN as allow_spectators,
    (tournament_data->>'enable_chat')::BOOLEAN as enable_chat,
    (tournament_data->>'tournament_config')::JSONB as tournament_config
  INTO tournament_record;

  -- Calculate tournament start date based on duration
  DECLARE
    start_date TIMESTAMP WITH TIME ZONE;
  BEGIN
    start_date := CASE tournament_record.tournament_duration
      WHEN 'FAST' THEN NOW() + INTERVAL '1 day'
      WHEN 'MEDIUM' THEN NOW() + INTERVAL '3 days'
      WHEN 'LONG' THEN NOW() + INTERVAL '7 days'
      ELSE NOW() + INTERVAL '14 days'
    END;
  END;

  -- Create the tournament challenge
  INSERT INTO betting_challenges (
    title, description, bet_type, resolution_mode, creator_id,
    sport_id, league_id, stake_amount, max_participants, end_date,
    tournament_type, tournament_duration, tournament_prize_distribution,
    allow_tournament_spectators, enable_tournament_chat,
    tournament_start_date, tournament_config, is_public
  ) VALUES (
    tournament_record.title, tournament_record.description, tournament_record.bet_type,
    tournament_record.resolution_mode, tournament_record.creator_id,
    tournament_record.sport_id, tournament_record.league_id, tournament_record.stake_amount,
    tournament_record.max_participants, tournament_record.end_date,
    tournament_record.tournament_type, tournament_record.tournament_duration,
    tournament_record.tournament_prize_distribution, tournament_record.allow_spectators,
    tournament_record.enable_chat, start_date, tournament_record.tournament_config, true
  ) RETURNING id INTO tournament_id;

  -- Calculate total prize pool
  total_pool := tournament_record.stake_amount * tournament_record.max_participants;

  -- Create prize structure based on distribution type
  CASE tournament_record.tournament_prize_distribution
    WHEN 'WINNER_TAKES_ALL' THEN
      INSERT INTO tournament_prizes (tournament_id, position, prize_amount, prize_percentage)
      VALUES (tournament_id, 1, total_pool * 0.95, 95.0); -- 5% platform fee

    WHEN 'TOP3' THEN
      INSERT INTO tournament_prizes (tournament_id, position, prize_amount, prize_percentage)
      VALUES 
        (tournament_id, 1, total_pool * 0.60, 60.0), -- 1st: 60%
        (tournament_id, 2, total_pool * 0.25, 25.0), -- 2nd: 25%
        (tournament_id, 3, total_pool * 0.10, 10.0); -- 3rd: 10%

    WHEN 'TOP5' THEN
      INSERT INTO tournament_prizes (tournament_id, position, prize_amount, prize_percentage)
      VALUES 
        (tournament_id, 1, total_pool * 0.40, 40.0), -- 1st: 40%
        (tournament_id, 2, total_pool * 0.25, 25.0), -- 2nd: 25%
        (tournament_id, 3, total_pool * 0.15, 15.0), -- 3rd: 15%
        (tournament_id, 4, total_pool * 0.10, 10.0), -- 4th: 10%
        (tournament_id, 5, total_pool * 0.05, 5.0);  -- 5th: 5%

    WHEN 'TOP10_PERCENT' THEN
      DECLARE
        top_winners INTEGER := GREATEST(1, CEIL(tournament_record.max_participants * 0.1));
        prize_per_winner DECIMAL(18,6) := (total_pool * 0.95) / top_winners;
      BEGIN
        FOR i IN 1..top_winners LOOP
          INSERT INTO tournament_prizes (tournament_id, position, prize_amount, prize_percentage)
          VALUES (tournament_id, i, prize_per_winner, (100.0 * 0.95) / top_winners);
        END LOOP;
      END;
  END CASE;

  -- Create rounds based on tournament type
  IF tournament_record.tournament_type IN ('LEAGUE', 'HYBRID') THEN
    DECLARE
      total_rounds INTEGER := CASE tournament_record.tournament_duration
        WHEN 'FAST' THEN 3
        WHEN 'MEDIUM' THEN 5
        WHEN 'LONG' THEN 8
        ELSE 12
      END;
    BEGIN
      FOR i IN 1..total_rounds LOOP
        INSERT INTO tournament_rounds (tournament_id, round_number, round_name, start_date, end_date)
        VALUES (
          tournament_id, 
          i, 
          'Round ' || i,
          start_date + (i - 1) * INTERVAL '7 days',
          start_date + i * INTERVAL '7 days' - INTERVAL '1 hour'
        );
      END LOOP;
    END;
  END IF;

  RETURN json_build_object(
    'success', true,
    'tournament_id', tournament_id,
    'tournament_type', tournament_record.tournament_type,
    'prize_pool', total_pool,
    'start_date', start_date,
    'max_participants', tournament_record.max_participants
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('error', 'Failed to create tournament: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to join a tournament
CREATE OR REPLACE FUNCTION join_tournament(
  tournament_id_param UUID,
  user_id_param UUID
)
RETURNS JSON AS $$
DECLARE
  tournament_record RECORD;
  user_record RECORD;
BEGIN
  -- Get tournament details
  SELECT * INTO tournament_record 
  FROM betting_challenges 
  WHERE id = tournament_id_param 
    AND bet_type = 1 -- TOURNAMENT type
    AND status = 'ACTIVE'
    AND tournament_phase = 'REGISTRATION';
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Tournament not found or not accepting registrations');
  END IF;

  -- Check if tournament is full
  IF tournament_record.current_participants >= tournament_record.max_participants THEN
    RETURN json_build_object('error', 'Tournament is full');
  END IF;

  -- Check if user already joined
  IF EXISTS (SELECT 1 FROM user_bets WHERE challenge_id = tournament_id_param AND user_id = user_id_param) THEN
    RETURN json_build_object('error', 'User already joined this tournament');
  END IF;

  -- Get user details and check balance
  SELECT * INTO user_record FROM user_profiles WHERE id = user_id_param;
  
  IF user_record.balance_usdc < tournament_record.stake_amount THEN
    RETURN json_build_object('error', 'Insufficient balance');
  END IF;

  -- Join tournament (create bet entry)
  INSERT INTO user_bets (
    challenge_id, user_id, stake_amount, placed_at
  ) VALUES (
    tournament_id_param, user_id_param, tournament_record.stake_amount, NOW()
  );

  -- Create tournament standing entry
  INSERT INTO tournament_standings (
    tournament_id, user_id, current_position, previous_position
  ) VALUES (
    tournament_id_param, user_id_param, 
    tournament_record.current_participants + 1,
    tournament_record.current_participants + 1
  );

  -- Update user balance and tournament participants
  UPDATE user_profiles 
  SET 
    balance_usdc = balance_usdc - tournament_record.stake_amount,
    balance_locked = balance_locked + tournament_record.stake_amount,
    updated_at = NOW()
  WHERE id = user_id_param;

  UPDATE betting_challenges 
  SET 
    current_participants = current_participants + 1,
    total_pool = total_pool + tournament_record.stake_amount,
    updated_at = NOW()
  WHERE id = tournament_id_param;

  -- Create transaction record
  INSERT INTO transactions (
    user_id, challenge_id, type, amount, 
    balance_before, balance_after, status
  ) VALUES (
    user_id_param, tournament_id_param, 'TOURNAMENT_ENTRY',
    -tournament_record.stake_amount,
    user_record.balance_usdc,
    user_record.balance_usdc - tournament_record.stake_amount,
    'COMPLETED'
  );

  RETURN json_build_object(
    'success', true,
    'tournament_id', tournament_id_param,
    'user_id', user_id_param,
    'entry_fee', tournament_record.stake_amount,
    'position', tournament_record.current_participants + 1
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('error', 'Failed to join tournament: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get tournament details with standings
CREATE OR REPLACE FUNCTION get_tournament_details(tournament_id_param UUID)
RETURNS JSON AS $$
DECLARE
  tournament_info JSON;
  standings_info JSON;
  matches_info JSON;
  prizes_info JSON;
BEGIN
  -- Get tournament basic info
  SELECT json_build_object(
    'id', id,
    'title', title,
    'description', description,
    'tournament_type', tournament_type,
    'tournament_duration', tournament_duration,
    'tournament_prize_distribution', tournament_prize_distribution,
    'current_participants', current_participants,
    'max_participants', max_participants,
    'total_pool', total_pool,
    'tournament_phase', tournament_phase,
    'tournament_start_date', tournament_start_date,
    'end_date', end_date,
    'status', status,
    'sport', (SELECT json_build_object('name', name, 'icon', icon) FROM sports_categories WHERE id = sport_id),
    'league', (SELECT json_build_object('name', name, 'icon', icon) FROM leagues WHERE id = league_id)
  ) INTO tournament_info
  FROM betting_challenges 
  WHERE id = tournament_id_param;

  -- Get current standings
  SELECT json_agg(
    json_build_object(
      'position', current_position,
      'user', json_build_object(
        'id', up.id,
        'username', up.username,
        'avatar_url', up.avatar_url
      ),
      'points', points,
      'wins', wins,
      'losses', losses,
      'draws', draws,
      'accuracy_percentage', accuracy_percentage,
      'qualification_status', qualification_status
    ) ORDER BY current_position
  ) INTO standings_info
  FROM tournament_standings ts
  JOIN user_profiles up ON ts.user_id = up.id
  WHERE ts.tournament_id = tournament_id_param;

  -- Get tournament prizes
  SELECT json_agg(
    json_build_object(
      'position', position,
      'prize_amount', prize_amount,
      'prize_percentage', prize_percentage,
      'winner', CASE 
        WHEN winner_id IS NOT NULL THEN json_build_object(
          'id', up.id,
          'username', up.username,
          'avatar_url', up.avatar_url
        )
        ELSE NULL
      END
    ) ORDER BY position
  ) INTO prizes_info
  FROM tournament_prizes tp
  LEFT JOIN user_profiles up ON tp.winner_id = up.id
  WHERE tp.tournament_id = tournament_id_param;

  RETURN json_build_object(
    'tournament', tournament_info,
    'standings', COALESCE(standings_info, '[]'::json),
    'prizes', COALESCE(prizes_info, '[]'::json)
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('error', 'Failed to get tournament details: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION create_tournament TO authenticated;
GRANT EXECUTE ON FUNCTION join_tournament TO authenticated;
GRANT EXECUTE ON FUNCTION get_tournament_details TO authenticated;