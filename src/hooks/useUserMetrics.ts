import { useState, useEffect } from 'react'
import { apiCacheService, CACHE_DURATIONS } from '@/services/apiCacheService'

interface UserMetrics {
  total_users: number
  active_dashboards: number
  total_api_calls: number
  cached_responses: number
}

export const useUserMetrics = () => {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try to get cached metrics first
        const cacheKey = apiCacheService.generateCacheKey('user_metrics')
        const cachedMetrics = await apiCacheService.getCachedData<UserMetrics>(
          cacheKey
        )

        if (cachedMetrics) {
          setMetrics(cachedMetrics)
          setLoading(false)
          return
        }

        // If no cache, fetch fresh data
        const freshMetrics = await apiCacheService.getUserMetrics()

        if (freshMetrics) {
          // Cache the fresh data
          await apiCacheService.setCachedData(
            cacheKey,
            freshMetrics,
            CACHE_DURATIONS.USER_METRICS
          )

          setMetrics(freshMetrics)
        } else {
          setError('Failed to fetch user metrics')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  return { metrics, loading, error }
}
