-- PART 4: Additional Tables
CREATE TABLE user_bets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  challenge_id UUID REFERENCES betting_challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  prediction_value DECIMAL(18,6),
  stake_amount DECIMAL(18,6) NOT NULL,
  potential_winnings DECIMAL(18,6),
  actual_winnings DECIMAL(18,6) DEFAULT 0,
  position INTEGER,
  is_winner BOOLEAN DEFAULT false,
  placed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(challenge_id, user_id)
);

CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  bet_id UUID REFERENCES user_bets(id),
  challenge_id UUID REFERENCES betting_challenges(id),
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(18,6) NOT NULL,
  balance_before DECIMAL(18,6),
  balance_after DECIMAL(18,6),
  status VARCHAR(20) DEFAULT 'COMPLETED',
  tx_hash VARCHAR(66),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_statistics (
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE PRIMARY KEY,
  total_bets INTEGER DEFAULT 0,
  active_bets INTEGER DEFAULT 0,
  won_bets INTEGER DEFAULT 0,
  lost_bets INTEGER DEFAULT 0,
  pending_bets INTEGER DEFAULT 0,
  total_staked DECIMAL(18,6) DEFAULT 0,
  total_winnings DECIMAL(18,6) DEFAULT 0,
  profit_loss DECIMAL(18,6) DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);