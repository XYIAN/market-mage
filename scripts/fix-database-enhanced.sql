-- Enhanced Database Fix Script
-- Run this in your Supabase SQL editor to fix all issues and implement the new features

-- 1. Create api_cache table if it doesn't exist
CREATE TABLE IF NOT EXISTS api_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cache_key TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    achievement_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create enhanced news storage table
CREATE TABLE IF NOT EXISTS news_articles (
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

-- 4. Create market data history table
CREATE TABLE IF NOT EXISTS market_data_history (
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

-- 5. Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_api_cache_key ON api_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_api_cache_expires ON api_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at);
CREATE INDEX IF NOT EXISTS idx_news_articles_article_id ON news_articles(article_id);
CREATE INDEX IF NOT EXISTS idx_news_articles_sentiment ON news_articles(sentiment);
CREATE INDEX IF NOT EXISTS idx_market_data_symbol ON market_data_history(symbol);
CREATE INDEX IF NOT EXISTS idx_market_data_asset_type ON market_data_history(asset_type);
CREATE INDEX IF NOT EXISTS idx_market_data_recorded_at ON market_data_history(recorded_at);

-- 6. Enable RLS on all tables
ALTER TABLE api_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data_history ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for api_cache
DROP POLICY IF EXISTS "Allow read access to api_cache" ON api_cache;
CREATE POLICY "Allow read access to api_cache" ON api_cache
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert/update to api_cache" ON api_cache;
CREATE POLICY "Allow insert/update to api_cache" ON api_cache
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- 8. Create RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. Create RLS policies for news_articles
DROP POLICY IF EXISTS "Allow read access to news_articles" ON news_articles;
CREATE POLICY "Allow read access to news_articles" ON news_articles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert/update to news_articles" ON news_articles;
CREATE POLICY "Allow insert/update to news_articles" ON news_articles
    FOR ALL USING (auth.role() = 'service_role');

-- 10. Create RLS policies for market_data_history
DROP POLICY IF EXISTS "Allow read access to market_data_history" ON market_data_history;
CREATE POLICY "Allow read access to market_data_history" ON market_data_history
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert/update to market_data_history" ON market_data_history;
CREATE POLICY "Allow insert/update to market_data_history" ON market_data_history
    FOR ALL USING (auth.role() = 'service_role');

-- 11. Create functions for news management
CREATE OR REPLACE FUNCTION cleanup_old_news_articles()
RETURNS void AS $$
BEGIN
    DELETE FROM news_articles 
    WHERE id NOT IN (
        SELECT id FROM (
            SELECT id,
                   ROW_NUMBER() OVER (PARTITION BY article_id ORDER BY created_at DESC) as rn
            FROM news_articles
        ) ranked
        WHERE rn <= 3
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_news_article(
    p_article_id TEXT,
    p_title TEXT,
    p_description TEXT,
    p_url TEXT,
    p_source TEXT,
    p_sentiment TEXT,
    p_published_at TIMESTAMP WITH TIME ZONE,
    p_category TEXT
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
    v_version INTEGER;
BEGIN
    -- Get the next version number for this article
    SELECT COALESCE(MAX(version), 0) + 1 INTO v_version
    FROM news_articles
    WHERE article_id = p_article_id;
    
    -- Insert the new article
    INSERT INTO news_articles (
        article_id, title, description, url, source, 
        sentiment, published_at, category, version
    ) VALUES (
        p_article_id, p_title, p_description, p_url, p_source,
        p_sentiment, p_published_at, p_category, v_version
    ) RETURNING id INTO v_id;
    
    -- Clean up old versions (keep only 3 most recent)
    PERFORM cleanup_old_news_articles();
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- 12. Create function to get news articles
CREATE OR REPLACE FUNCTION get_news_articles(
    p_category TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    article_id TEXT,
    title TEXT,
    description TEXT,
    url TEXT,
    source TEXT,
    sentiment TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    category TEXT,
    version INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        na.id,
        na.article_id,
        na.title,
        na.description,
        na.url,
        na.source,
        na.sentiment,
        na.published_at,
        na.category,
        na.version,
        na.created_at
    FROM news_articles na
    WHERE (p_category IS NULL OR na.category = p_category)
    ORDER BY na.published_at DESC, na.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- 13. Create function to get market data history
CREATE OR REPLACE FUNCTION get_market_data_history(
    p_symbol TEXT,
    p_asset_type TEXT,
    p_hours INTEGER DEFAULT 24
)
RETURNS TABLE (
    symbol TEXT,
    asset_type TEXT,
    price DECIMAL(20, 8),
    change_percentage DECIMAL(10, 4),
    volume BIGINT,
    market_cap BIGINT,
    recorded_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mdh.symbol,
        mdh.asset_type,
        mdh.price,
        mdh.change_percentage,
        mdh.volume,
        mdh.market_cap,
        mdh.recorded_at
    FROM market_data_history mdh
    WHERE mdh.symbol = p_symbol 
      AND mdh.asset_type = p_asset_type
      AND mdh.recorded_at >= NOW() - INTERVAL '1 hour' * p_hours
    ORDER BY mdh.recorded_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 14. Create function to clean up old market data
CREATE OR REPLACE FUNCTION cleanup_old_market_data()
RETURNS void AS $$
BEGIN
    DELETE FROM market_data_history 
    WHERE recorded_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- 15. Insert sample data for testing
INSERT INTO api_cache (cache_key, data, expires_at) VALUES
('global_news', '{"all": [], "crypto": [], "stocks": []}', NOW() + INTERVAL '2 hours'),
('global_market_data', '{"crypto": [], "stocks": []}', NOW() + INTERVAL '5 minutes')
ON CONFLICT (cache_key) DO NOTHING;

INSERT INTO news_articles (article_id, title, description, url, source, sentiment, published_at, category) VALUES
('sample-1', 'Tech Stocks Rally on Strong Earnings', 'Major technology companies report better-than-expected quarterly results.', 'https://example.com/1', 'Yahoo Finance', 'positive', NOW() - INTERVAL '1 hour', 'stocks'),
('sample-2', 'Bitcoin Surges Past $45,000', 'Bitcoin reaches new yearly highs as institutional adoption grows.', 'https://example.com/2', 'CoinTelegraph', 'positive', NOW() - INTERVAL '2 hours', 'crypto'),
('sample-3', 'Federal Reserve Signals Rate Changes', 'Central bank officials hint at possible adjustments to monetary policy.', 'https://example.com/3', 'Financial Times', 'neutral', NOW() - INTERVAL '3 hours', 'stocks')
ON CONFLICT DO NOTHING;

INSERT INTO market_data_history (symbol, asset_type, price, change_percentage, volume, market_cap) VALUES
('AAPL', 'stock', 185.64, 2.15, 45000000, 2900000000000),
('BTC', 'crypto', 45000.00, 3.25, 25000000000, 850000000000),
('ETH', 'crypto', 3200.00, 1.87, 15000000000, 380000000000)
ON CONFLICT DO NOTHING;

-- 16. Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_api_cache_updated_at BEFORE UPDATE ON api_cache
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 17. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- 18. Create a function to increment user metrics
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
SELECT 'Database setup completed successfully! All tables, indexes, policies, and functions have been created.' as status; 