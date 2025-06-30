-- Fix Database Constraints Script
-- This script removes problematic unique constraints and fixes the database structure

-- Remove unique constraint from user_game_progress if it exists
DO $$
BEGIN
    -- Check if the unique constraint exists and drop it
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_game_progress_user_id_key'
    ) THEN
        ALTER TABLE user_game_progress DROP CONSTRAINT user_game_progress_user_id_key;
        RAISE NOTICE 'Removed unique constraint from user_game_progress.user_id';
    ELSE
        RAISE NOTICE 'No unique constraint found on user_game_progress.user_id';
    END IF;
END $$;

-- Ensure we have a regular index (not unique) on user_id
DROP INDEX IF EXISTS idx_user_game_progress_user_id;
CREATE INDEX idx_user_game_progress_user_id ON user_game_progress(user_id);

-- Clean up any duplicate entries (keep the most recent one)
DELETE FROM user_game_progress 
WHERE id NOT IN (
    SELECT DISTINCT ON (user_id) id 
    FROM user_game_progress 
    ORDER BY user_id, updated_at DESC
);

-- Add a unique constraint on user_id to prevent future duplicates
ALTER TABLE user_game_progress ADD CONSTRAINT user_game_progress_user_id_unique UNIQUE (user_id);

-- Update the RLS policies to ensure they work correctly
DROP POLICY IF EXISTS "Users can view own game progress" ON user_game_progress;
DROP POLICY IF EXISTS "Users can update own game progress" ON user_game_progress;
DROP POLICY IF EXISTS "Users can insert own game progress" ON user_game_progress;

CREATE POLICY "Users can view own game progress" ON user_game_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own game progress" ON user_game_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game progress" ON user_game_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Success message
SELECT 'Database constraints fixed successfully!' as status; 