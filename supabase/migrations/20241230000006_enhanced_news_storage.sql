-- Enhanced News Storage System
-- This implements a system to store news articles with historical data
-- and automatic cleanup to keep only the 3 most recent versions

-- Create enhanced news storage table
CREATE TABLE IF NOT EXISTS news_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id TEXT NOT NULL, -- External article ID
    title TEXT NOT NULL,
    description TEXT,
    url TEXT,
    source TEXT NOT NULL,
    sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    category TEXT NOT NULL, -- 'stocks', 'crypto', 'general'
    version INTEGER DEFAULT 1, -- Track different versions of the same article
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at);
CREATE INDEX IF NOT EXISTS idx_news_articles_article_id ON news_articles(article_id);
CREATE INDEX IF NOT EXISTS idx_news_articles_sentiment ON news_articles(sentiment);

-- Create market data storage table for historical tracking
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

-- Create indexes for market data
CREATE INDEX IF NOT EXISTS idx_market_data_symbol ON market_data_history(symbol);
CREATE INDEX IF NOT EXISTS idx_market_data_asset_type ON market_data_history(asset_type);
CREATE INDEX IF NOT EXISTS idx_market_data_recorded_at ON market_data_history(recorded_at);

-- Enable RLS
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for news_articles (read-only for all authenticated users)
CREATE POLICY "Allow read access to news_articles" ON news_articles
    FOR SELECT USING (true);

CREATE POLICY "Allow insert/update to news_articles" ON news_articles
    FOR ALL USING (auth.role() = 'service_role');

-- RLS policies for market_data_history (read-only for all authenticated users)
CREATE POLICY "Allow read access to market_data_history" ON market_data_history
    FOR SELECT USING (true);

CREATE POLICY "Allow insert/update to market_data_history" ON market_data_history
    FOR ALL USING (auth.role() = 'service_role');

-- Function to clean up old news articles (keep only 3 most recent versions per article)
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

-- Function to insert news article with automatic cleanup
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

-- Function to get news articles with pagination
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

-- Function to get market data history for a symbol
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

-- Create a scheduled job to clean up old market data (keep last 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_market_data()
RETURNS void AS $$
BEGIN
    DELETE FROM market_data_history 
    WHERE recorded_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Insert some sample data for testing
INSERT INTO news_articles (article_id, title, description, url, source, sentiment, published_at, category) VALUES
('sample-1', 'Tech Stocks Rally on Strong Earnings', 'Major technology companies report better-than-expected quarterly results.', 'https://example.com/1', 'Yahoo Finance', 'positive', NOW() - INTERVAL '1 hour', 'stocks'),
('sample-2', 'Bitcoin Surges Past $45,000', 'Bitcoin reaches new yearly highs as institutional adoption grows.', 'https://example.com/2', 'CoinTelegraph', 'positive', NOW() - INTERVAL '2 hours', 'crypto'),
('sample-3', 'Federal Reserve Signals Rate Changes', 'Central bank officials hint at possible adjustments to monetary policy.', 'https://example.com/3', 'Financial Times', 'neutral', NOW() - INTERVAL '3 hours', 'stocks');

-- Insert sample market data
INSERT INTO market_data_history (symbol, asset_type, price, change_percentage, volume, market_cap) VALUES
('AAPL', 'stock', 185.64, 2.15, 45000000, 2900000000000),
('BTC', 'crypto', 45000.00, 3.25, 25000000000, 850000000000),
('ETH', 'crypto', 3200.00, 1.87, 15000000000, 380000000000); 