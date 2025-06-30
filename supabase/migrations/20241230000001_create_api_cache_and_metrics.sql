-- Create API cache table for storing external API responses
CREATE TABLE api_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cache_key TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user metrics table for tracking app statistics
CREATE TABLE user_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_key TEXT UNIQUE NOT NULL,
    metric_value INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster cache lookups
CREATE INDEX idx_api_cache_key ON api_cache(cache_key);
CREATE INDEX idx_api_cache_expires ON api_cache(expires_at);

-- Insert initial metrics
INSERT INTO user_metrics (metric_key, metric_value) VALUES 
    ('total_users', 0),
    ('active_dashboards', 0),
    ('total_api_calls', 0),
    ('cached_responses', 0);

-- Create function to update metrics
CREATE OR REPLACE FUNCTION update_user_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total users count
    UPDATE user_metrics 
    SET metric_value = (SELECT COUNT(*) FROM auth.users),
        updated_at = NOW()
    WHERE metric_key = 'total_users';
    
    -- Update active dashboards count
    UPDATE user_metrics 
    SET metric_value = (SELECT COUNT(*) FROM watchlists),
        updated_at = NOW()
    WHERE metric_key = 'active_dashboards';
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update metrics
CREATE TRIGGER update_metrics_on_user_change
    AFTER INSERT OR DELETE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION update_user_metrics();

CREATE TRIGGER update_metrics_on_watchlist_change
    AFTER INSERT OR DELETE ON watchlists
    FOR EACH ROW
    EXECUTE FUNCTION update_user_metrics();

-- Enable RLS
ALTER TABLE api_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;

-- RLS policies for api_cache (read-only for all authenticated users)
CREATE POLICY "Allow read access to api_cache" ON api_cache
    FOR SELECT USING (true);

CREATE POLICY "Allow insert/update to api_cache" ON api_cache
    FOR ALL USING (auth.role() = 'service_role');

-- RLS policies for user_metrics (read-only for all users)
CREATE POLICY "Allow read access to user_metrics" ON user_metrics
    FOR SELECT USING (true);

CREATE POLICY "Allow update to user_metrics" ON user_metrics
    FOR UPDATE USING (auth.role() = 'service_role'); 