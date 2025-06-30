-- Database Check and Fix Script
-- Run this in your Supabase SQL editor to ensure all tables exist

-- Check if api_cache table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'api_cache') THEN
        CREATE TABLE api_cache (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            cache_key TEXT UNIQUE NOT NULL,
            data JSONB NOT NULL,
            expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX idx_api_cache_key ON api_cache(cache_key);
        CREATE INDEX idx_api_cache_expires ON api_cache(expires_at);
        
        ALTER TABLE api_cache ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Allow read access to api_cache" ON api_cache
            FOR SELECT USING (true);
            
        CREATE POLICY "Allow insert/update to api_cache" ON api_cache
            FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
            
        RAISE NOTICE 'Created api_cache table';
    ELSE
        RAISE NOTICE 'api_cache table already exists';
    END IF;
END $$;

-- Check if user_profiles table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        CREATE TABLE user_profiles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            username TEXT UNIQUE,
            achievement_points INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
        CREATE INDEX idx_user_profiles_username ON user_profiles(username);
        
        ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view own profile" ON user_profiles
            FOR SELECT USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can update own profile" ON user_profiles
            FOR UPDATE USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can insert own profile" ON user_profiles
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
        RAISE NOTICE 'Created user_profiles table';
    ELSE
        RAISE NOTICE 'user_profiles table already exists';
    END IF;
END $$;

-- Check if news_articles table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'news_articles') THEN
        CREATE TABLE news_articles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            article_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            url TEXT,
            source TEXT NOT NULL,
            sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
            published_at TIMESTAMP WITH TIME ZONE NOT NULL,
            category TEXT NOT NULL,
            version INTEGER DEFAULT 1,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX idx_news_articles_category ON news_articles(category);
        CREATE INDEX idx_news_articles_published_at ON news_articles(published_at);
        CREATE INDEX idx_news_articles_article_id ON news_articles(article_id);
        CREATE INDEX idx_news_articles_sentiment ON news_articles(sentiment);
        
        ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Allow read access to news_articles" ON news_articles
            FOR SELECT USING (true);
            
        CREATE POLICY "Allow insert/update to news_articles" ON news_articles
            FOR ALL USING (auth.role() = 'service_role');
            
        RAISE NOTICE 'Created news_articles table';
    ELSE
        RAISE NOTICE 'news_articles table already exists';
    END IF;
END $$;

-- Check if market_data_history table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'market_data_history') THEN
        CREATE TABLE market_data_history (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            symbol TEXT NOT NULL,
            asset_type TEXT NOT NULL CHECK (asset_type IN ('stock', 'crypto')),
            price DECIMAL(20, 8) NOT NULL,
            change_percentage DECIMAL(10, 4),
            volume BIGINT,
            market_cap BIGINT,
            recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX idx_market_data_symbol ON market_data_history(symbol);
        CREATE INDEX idx_market_data_asset_type ON market_data_history(asset_type);
        CREATE INDEX idx_market_data_recorded_at ON market_data_history(recorded_at);
        
        ALTER TABLE market_data_history ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Allow read access to market_data_history" ON market_data_history
            FOR SELECT USING (true);
            
        CREATE POLICY "Allow insert/update to market_data_history" ON market_data_history
            FOR ALL USING (auth.role() = 'service_role');
            
        RAISE NOTICE 'Created market_data_history table';
    ELSE
        RAISE NOTICE 'market_data_history table already exists';
    END IF;
END $$;

-- Check if user_game_progress table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_game_progress') THEN
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
        
        CREATE INDEX idx_user_game_progress_user_id ON user_game_progress(user_id);
        
        ALTER TABLE user_game_progress ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view own game progress" ON user_game_progress
            FOR SELECT USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can update own game progress" ON user_game_progress
            FOR UPDATE USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can insert own game progress" ON user_game_progress
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
        RAISE NOTICE 'Created user_game_progress table';
    ELSE
        RAISE NOTICE 'user_game_progress table already exists';
    END IF;
END $$;

-- Check if user_metrics table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_metrics') THEN
        CREATE TABLE user_metrics (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            metric_name TEXT NOT NULL,
            count INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, metric_name)
        );
        
        CREATE INDEX idx_user_metrics_user_id ON user_metrics(user_id);
        CREATE INDEX idx_user_metrics_name ON user_metrics(metric_name);
        
        ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view own metrics" ON user_metrics
            FOR SELECT USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can update own metrics" ON user_metrics
            FOR UPDATE USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can insert own metrics" ON user_metrics
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
        RAISE NOTICE 'Created user_metrics table';
    ELSE
        RAISE NOTICE 'user_metrics table already exists';
    END IF;
END $$;

-- Insert sample data for testing
INSERT INTO api_cache (cache_key, data, expires_at) VALUES
('global_news', '{"all": [], "crypto": [], "stocks": []}', NOW() + INTERVAL '2 hours'),
('global_market_data', '{"crypto": [], "stocks": []}', NOW() + INTERVAL '5 minutes')
ON CONFLICT (cache_key) DO NOTHING;

-- Create functions if they don't exist
CREATE OR REPLACE FUNCTION increment_metric(metric_name TEXT)
RETURNS void AS $$
BEGIN
    INSERT INTO user_metrics (user_id, metric_name, count)
    VALUES (auth.uid(), metric_name, 1)
    ON CONFLICT (user_id, metric_name)
    DO UPDATE SET count = user_metrics.count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
SELECT 'Database check completed! All tables and functions are ready.' as status; 