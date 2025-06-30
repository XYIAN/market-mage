-- Migration script for Market-Mage game system (FIXED)
-- Run this in your Supabase SQL Editor

-- Create user_game_progress table
CREATE TABLE IF NOT EXISTS user_game_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1 NOT NULL,
  points INTEGER DEFAULT 0 NOT NULL,
  title VARCHAR(50) DEFAULT 'Apprentice' NOT NULL,
  current_avatar VARCHAR(50) DEFAULT 'wizard-male' NOT NULL,
  unlocked_avatars TEXT[] DEFAULT ARRAY['wizard-male', 'enchantress-female'],
  achievements JSONB DEFAULT '[]'::jsonb,
  completed_quests TEXT[] DEFAULT ARRAY[]::TEXT[],
  current_quest VARCHAR(100),
  login_streak INTEGER DEFAULT 0 NOT NULL,
  last_login_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_logins INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create game_achievements table for tracking achievement unlocks
CREATE TABLE IF NOT EXISTS game_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(100) NOT NULL,
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0,
  max_progress INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create game_quests table for tracking quest progress
CREATE TABLE IF NOT EXISTS game_quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id VARCHAR(100) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  current_step INTEGER DEFAULT 0,
  step_progress JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

-- Create game_sessions table for tracking game play sessions
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id VARCHAR(100),
  session_data JSONB DEFAULT '{}'::jsonb,
  score INTEGER DEFAULT 0,
  time_elapsed INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_game_progress_user_id ON user_game_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_game_achievements_user_id ON game_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_game_achievements_achievement_id ON game_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_game_quests_user_id ON game_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_game_quests_quest_id ON game_quests(quest_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);

-- Enable Row Level Security
ALTER TABLE user_game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own game progress" ON user_game_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own game progress" ON user_game_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game progress" ON user_game_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements" ON game_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements" ON game_achievements
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON game_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own quests" ON game_quests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own quests" ON game_quests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quests" ON game_quests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own game sessions" ON game_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own game sessions" ON game_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game sessions" ON game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_game_progress_updated_at
  BEFORE UPDATE ON user_game_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_achievements_updated_at
  BEFORE UPDATE ON game_achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_quests_updated_at
  BEFORE UPDATE ON game_quests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle user registration and initialize game progress
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_game_progress (
    user_id,
    level,
    points,
    title,
    current_avatar,
    unlocked_avatars,
    achievements,
    completed_quests,
    login_streak,
    last_login_date,
    total_logins
  ) VALUES (
    NEW.id,
    1,
    0,
    'Apprentice',
    'wizard-male',
    ARRAY['wizard-male', 'enchantress-female'],
    '[]'::jsonb,
    ARRAY[]::TEXT[],
    0,
    NOW(),
    1
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create function to increment login streak
CREATE OR REPLACE FUNCTION increment_login_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update streak if last_login_date is changing
  IF NEW.last_login_date IS DISTINCT FROM OLD.last_login_date THEN
    -- Check if this is a consecutive day login
    IF NEW.last_login_date::date = (OLD.last_login_date::date + INTERVAL '1 day') THEN
      NEW.login_streak = OLD.login_streak + 1;
    ELSE
      NEW.login_streak = 1;
    END IF;
    NEW.total_logins = OLD.total_logins + 1;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for login streak tracking
CREATE TRIGGER update_login_streak
  BEFORE UPDATE ON user_game_progress
  FOR EACH ROW
  EXECUTE FUNCTION increment_login_streak(); 