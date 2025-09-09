-- PART 2: Leagues Table
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

-- Insert leagues
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