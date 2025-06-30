-- Fix Game Progress Database Constraints
-- Run this script in your Supabase SQL editor to fix the constraint issues

-- Remove the problematic unique constraint if it exists
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

-- Clean up any duplicate entries (keep the most recent one)
DELETE FROM user_game_progress 
WHERE id NOT IN (
    SELECT DISTINCT ON (user_id) id 
    FROM user_game_progress 
    ORDER BY user_id, updated_at DESC
);

-- Add a proper unique constraint on user_id
ALTER TABLE user_game_progress ADD CONSTRAINT user_game_progress_user_id_unique UNIQUE (user_id);

-- Ensure we have the correct index
DROP INDEX IF EXISTS idx_user_game_progress_user_id;
CREATE INDEX idx_user_game_progress_user_id ON user_game_progress(user_id);

-- Success message
SELECT 'Game progress constraints fixed successfully!' as status; 