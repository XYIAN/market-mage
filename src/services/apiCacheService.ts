import { createClient } from '@/lib/supabase/client'

interface UserMetrics {
  total_users: number
  active_dashboards: number
  total_api_calls: number
  cached_responses: number
}

class ApiCacheService {
  private supabase = createClient()

  /**
   * Get cached data if it exists and is not expired
   */
  async getCachedData<T>(cacheKey: string): Promise<T | null> {
    try {
      const { data, error } = await this.supabase
        .from('api_cache')
        .select('*')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (error || !data) {
        return null
      }

      // Update cached responses metric
      await this.incrementMetric('cached_responses')

      return data.data as T
    } catch (error) {
      console.error('Error fetching cached data:', error)
      return null
    }
  }

  /**
   * Store data in cache with expiration
   */
  async setCachedData<T>(
    cacheKey: string,
    data: T,
    expirationMinutes: number = 5
  ): Promise<void> {
    try {
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes)

      // Try upsert with onConflict if supported
      let error = null
      try {
        const result = await this.supabase.from('api_cache').upsert(
          {
            cache_key: cacheKey,
            data: data,
            expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'cache_key' }
        )
        error = result.error
      } catch (e) {
        // Fallback for older clients or if onConflict is not supported
        try {
          // Try update first
          const updateResult = await this.supabase
            .from('api_cache')
            .update({
              data: data,
              expires_at: expiresAt.toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('cache_key', cacheKey)
          if (updateResult.error || updateResult.count === 0) {
            // If update fails, try insert
            const insertResult = await this.supabase.from('api_cache').insert({
              cache_key: cacheKey,
              data: data,
              expires_at: expiresAt.toISOString(),
              updated_at: new Date().toISOString(),
            })
            error = insertResult.error
          }
        } catch (err) {
          error = err
        }
      }
      if (error) {
        console.error('Error setting cached data:', error)
      }
    } catch (error) {
      console.error('Error setting cached data:', error)
    }
  }

  /**
   * Get user metrics
   */
  async getUserMetrics(): Promise<UserMetrics | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_metrics')
        .select('metric_key, metric_value')

      if (error || !data) {
        return null
      }

      const metrics: UserMetrics = {
        total_users: 0,
        active_dashboards: 0,
        total_api_calls: 0,
        cached_responses: 0,
      }

      data.forEach((item) => {
        if (item.metric_key in metrics) {
          metrics[item.metric_key as keyof UserMetrics] = item.metric_value
        }
      })

      return metrics
    } catch (error) {
      console.error('Error fetching user metrics:', error)
      return null
    }
  }

  /**
   * Increment a metric value
   */
  async incrementMetric(metricKey: string): Promise<void> {
    try {
      const { error } = await this.supabase.rpc('increment_metric', {
        metric_key: metricKey,
      })

      if (error) {
        console.error('Error incrementing metric:', error)
      }
    } catch (error) {
      console.error('Error incrementing metric:', error)
    }
  }

  /**
   * Clear expired cache entries
   */
  async clearExpiredCache(): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('api_cache')
        .delete()
        .lt('expires_at', new Date().toISOString())

      if (error) {
        console.error('Error clearing expired cache:', error)
      }
    } catch (error) {
      console.error('Error clearing expired cache:', error)
    }
  }

  /**
   * Generate cache key for different API endpoints
   */
  generateCacheKey(
    endpoint: string,
    params?: Record<string, string | number>
  ): string {
    const baseKey = `api:${endpoint}`
    if (!params) return baseKey

    const paramString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    return `${baseKey}:${paramString}`
  }

  /**
   * Invalidate cache for a specific key
   */
  async invalidateCache(cacheKey: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('api_cache')
        .delete()
        .eq('cache_key', cacheKey)

      if (error) {
        console.error('Error invalidating cache:', error)
      }
    } catch (error) {
      console.error('Error invalidating cache:', error)
    }
  }
}

// Create singleton instance
export const apiCacheService = new ApiCacheService()

// Cache durations for different types of data
export const CACHE_DURATIONS = {
  CRYPTO_PRICES: 1, // 1 minute for crypto prices
  STOCK_PRICES: 1, // 1 minute for stock prices
  NEWS: 5, // 5 minutes for news
  MARKET_DATA: 2, // 2 minutes for market data
  USER_METRICS: 10, // 10 minutes for user metrics
} as const
