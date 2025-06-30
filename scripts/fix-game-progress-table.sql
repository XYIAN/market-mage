-- Fix user_game_progress table structure
-- This script fixes the unique constraint issue that's causing the 409 errors

-- First, let's check if the table exists and drop it if it has the wrong structure
DROP TABLE IF EXISTS user_game_progress CASCADE;

-- Recreate the table with the correct structure
CREATE TABLE user_game_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1,
    points INTEGER DEFAULT 0,
    title TEXT DEFAULT 'Apprentice',
    current_avatar TEXT DEFAULT 'wizard-male',
    unlocked_avatars TEXT[] DEFAULT ARRAY['wizard-male', 'enchantress-female'],
    achievements JSONB DEFAULT '[]',
    completed_quests TEXT[] DEFAULT '{}',
    current_quest TEXT,
    login_streak INTEGER DEFAULT 0,
    last_login_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_logins INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id (but NOT unique)
CREATE INDEX idx_user_game_progress_user_id ON user_game_progress(user_id);

-- Enable RLS
ALTER TABLE user_game_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own game progress" ON user_game_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own game progress" ON user_game_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game progress" ON user_game_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_game_progress_updated_at 
    BEFORE UPDATE ON user_game_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO user_game_progress (user_id, level, points, title, current_avatar, unlocked_avatars, achievements, completed_quests, login_streak, last_login_date, total_logins) VALUES
('00000000-0000-0000-0000-000000000000', 1, 0, 'Apprentice', 'wizard-male', ARRAY['wizard-male', 'enchantress-female'], '[]', '{}', 0, NOW(), 1)
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'user_game_progress table fixed successfully!' as status; 