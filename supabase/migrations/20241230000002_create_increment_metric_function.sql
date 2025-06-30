-- Create function to increment metric values
CREATE OR REPLACE FUNCTION increment_metric(metric_key TEXT)
RETURNS void AS $$
BEGIN
    UPDATE user_metrics 
    SET metric_value = metric_value + 1,
        updated_at = NOW()
    WHERE metric_key = increment_metric.metric_key;
    
    -- If the metric doesn't exist, create it
    IF NOT FOUND THEN
        INSERT INTO user_metrics (metric_key, metric_value)
        VALUES (increment_metric.metric_key, 1);
    END IF;
END;
$$ LANGUAGE plpgsql; 