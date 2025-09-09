-- PART 3: User and Betting Tables
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  wallet_address VARCHAR(42),
  network VARCHAR(20) DEFAULT 'polygon',
  balance_usdc DECIMAL(18,6) DEFAULT 0,
  balance_locked DECIMAL(18,6) DEFAULT 0,
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE betting_challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  bet_type INTEGER NOT NULL,
  resolution_mode INTEGER NOT NULL,
  one_vs_one_mode INTEGER,
  creator_id UUID REFERENCES user_profiles(id),
  sport_id UUID REFERENCES sports_categories(id),
  league_id UUID REFERENCES leagues(id),
  stake_amount DECIMAL(18,6) NOT NULL,
  min_participants INTEGER DEFAULT 2,
  max_participants INTEGER NOT NULL,
  current_participants INTEGER DEFAULT 0,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  lock_date TIMESTAMP WITH TIME ZONE,
  outcome_value DECIMAL(18,6),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  is_public BOOLEAN DEFAULT true,
  icon VARCHAR(10) DEFAULT '🏆',
  icon_bg VARCHAR(7) DEFAULT '#3B82F6',
  total_pool DECIMAL(18,6) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);