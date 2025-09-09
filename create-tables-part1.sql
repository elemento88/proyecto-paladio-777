-- PART 1: Extensions and Sports Categories
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Sports categories table
CREATE TABLE sports_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  icon VARCHAR(10) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sports categories
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