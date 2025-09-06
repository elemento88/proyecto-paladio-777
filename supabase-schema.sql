-- Supabase Database Schema for Betting Protocol Application
-- Run this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Sports and categories
CREATE TABLE sports_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  icon VARCHAR(10) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leagues
CREATE TABLE leagues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  icon VARCHAR(10) NOT NULL,
  sport_id UUID REFERENCES sports_categories(id),
  country VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles (extends Supabase auth.users)
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

-- Betting challenges/matches
CREATE TABLE betting_challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  bet_type INTEGER NOT NULL, -- BetType enum
  resolution_mode INTEGER NOT NULL, -- ResolutionMode enum
  one_vs_one_mode INTEGER, -- OneVsOneMode enum (nullable)
  creator_id UUID REFERENCES user_profiles(id),
  sport_id UUID REFERENCES sports_categories(id),
  league_id UUID REFERENCES leagues(id),
  stake_amount DECIMAL(18,6) NOT NULL,
  min_participants INTEGER DEFAULT 2,
  max_participants INTEGER NOT NULL,
  current_participants INTEGER DEFAULT 0,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  lock_date TIMESTAMP WITH TIME ZONE, -- When betting locks
  outcome_value DECIMAL(18,6), -- Actual outcome for resolution
  status VARCHAR(20) DEFAULT 'ACTIVE', -- BetStatus enum
  is_public BOOLEAN DEFAULT true,
  icon VARCHAR(10) DEFAULT '🏆',
  icon_bg VARCHAR(7) DEFAULT '#3B82F6',
  total_pool DECIMAL(18,6) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User bets/predictions
CREATE TABLE user_bets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  challenge_id UUID REFERENCES betting_challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  prediction_value DECIMAL(18,6), -- User's prediction
  stake_amount DECIMAL(18,6) NOT NULL,
  potential_winnings DECIMAL(18,6),
  actual_winnings DECIMAL(18,6) DEFAULT 0,
  position INTEGER, -- Final ranking/position
  is_winner BOOLEAN DEFAULT false,
  placed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(challenge_id, user_id) -- One bet per user per challenge
);

-- Transactions history
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  bet_id UUID REFERENCES user_bets(id),
  challenge_id UUID REFERENCES betting_challenges(id),
  type VARCHAR(20) NOT NULL, -- BET_PLACED, BET_WON, etc.
  amount DECIMAL(18,6) NOT NULL,
  balance_before DECIMAL(18,6),
  balance_after DECIMAL(18,6),
  status VARCHAR(20) DEFAULT 'COMPLETED',
  tx_hash VARCHAR(66), -- Blockchain transaction hash
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market offers (for market-based betting)
CREATE TABLE market_offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  challenge_id UUID REFERENCES betting_challenges(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES user_profiles(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  min_bet DECIMAL(18,6) NOT NULL,
  max_bet DECIMAL(18,6),
  odds DECIMAL(8,4) NOT NULL,
  volume DECIMAL(18,6) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time chat/comments for challenges
CREATE TABLE challenge_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  challenge_id UUID REFERENCES betting_challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  parent_id UUID REFERENCES challenge_comments(id), -- For replies
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User statistics (computed/cached)
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

-- Insert default sports categories
INSERT INTO sports_categories (name, slug, icon) VALUES
  ('Todos', 'todos', '🏆'),
  ('Fútbol', 'futbol', '⚽'),
  ('Baloncesto', 'baloncesto', '🏀'),
  ('Tenis', 'tenis', '🎾'),
  ('Béisbol', 'beisbol', '⚾'),
  ('Fútbol Americano', 'futbol-americano', '🏈'),
  ('Golf', 'golf', '⛳'),
  ('Hockey', 'hockey', '🏒'),
  ('Rugby', 'rugby', '🏉'),
  ('Voleibol', 'voleibol', '🏐');

-- Insert default leagues
INSERT INTO leagues (name, slug, icon, sport_id, country) 
SELECT 
  league_name, 
  league_slug, 
  league_icon, 
  sc.id, 
  league_country
FROM (
  VALUES 
    ('Premier League', 'premier-league', '⚽', 'futbol', 'Inglaterra'),
    ('La Liga', 'la-liga', '⚽', 'futbol', 'España'),
    ('Serie A', 'serie-a', '⚽', 'futbol', 'Italia'),
    ('Bundesliga', 'bundesliga', '⚽', 'futbol', 'Alemania'),
    ('Champions League', 'champions-league', '🏆', 'futbol', 'Europa'),
    ('NBA', 'nba', '🏀', 'baloncesto', 'USA'),
    ('EuroLeague', 'euroleague', '🏀', 'baloncesto', 'Europa'),
    ('ATP Tour', 'atp-tour', '🎾', 'tenis', 'Mundial'),
    ('WTA Tour', 'wta-tour', '🎾', 'tenis', 'Mundial')
) AS leagues_data(league_name, league_slug, league_icon, sport_slug, league_country)
JOIN sports_categories sc ON sc.slug = leagues_data.sport_slug;

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE betting_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for betting_challenges
CREATE POLICY "Everyone can view active challenges" ON betting_challenges FOR SELECT USING (is_public = true OR creator_id = auth.uid());
CREATE POLICY "Authenticated users can create challenges" ON betting_challenges FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Creators can update their challenges" ON betting_challenges FOR UPDATE USING (creator_id = auth.uid());

-- Policies for user_bets
CREATE POLICY "Users can view their own bets" ON user_bets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can place bets" ON user_bets FOR INSERT WITH CHECK (user_id = auth.uid());

-- Policies for transactions
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can insert transactions" ON transactions FOR INSERT WITH CHECK (true);

-- Functions for updating statistics
CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user statistics when a bet is resolved
  IF TG_OP = 'UPDATE' AND OLD.resolved_at IS NULL AND NEW.resolved_at IS NOT NULL THEN
    UPDATE user_statistics 
    SET 
      total_bets = total_bets + 1,
      won_bets = CASE WHEN NEW.is_winner THEN won_bets + 1 ELSE won_bets END,
      lost_bets = CASE WHEN NOT NEW.is_winner THEN lost_bets + 1 ELSE lost_bets END,
      total_winnings = total_winnings + NEW.actual_winnings,
      profit_loss = profit_loss + (NEW.actual_winnings - NEW.stake_amount),
      last_updated = NOW()
    WHERE user_id = NEW.user_id;
    
    -- Update win rate
    UPDATE user_statistics 
    SET win_rate = CASE WHEN total_bets > 0 THEN (won_bets::DECIMAL / total_bets::DECIMAL) * 100 ELSE 0 END
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user statistics
CREATE TRIGGER trigger_update_user_stats
  AFTER UPDATE ON user_bets
  FOR EACH ROW
  EXECUTE FUNCTION update_user_statistics();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
  
  INSERT INTO public.user_statistics (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();