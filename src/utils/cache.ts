interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class CacheManager {
  private memoryCache = new Map<string, CacheItem<unknown>>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    }

    // Set in memory cache
    this.memoryCache.set(key, item)

    // Set in localStorage
    try {
      localStorage.setItem(key, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  get<T>(key: string): T | null {
    // Try memory cache first
    const memoryItem = this.memoryCache.get(key)
    if (memoryItem && !this.isExpired(memoryItem)) {
      return memoryItem.data as T
    }

    // Try localStorage
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const item: CacheItem<T> = JSON.parse(stored)
        if (!this.isExpired(item)) {
          // Update memory cache
          this.memoryCache.set(key, item)
          return item.data
        } else {
          // Remove expired item
          localStorage.removeItem(key)
          this.memoryCache.delete(key)
        }
      }
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
    }

    return null
  }

  private isExpired(item: CacheItem<unknown>): boolean {
    return Date.now() - item.timestamp > item.ttl
  }

  invalidate(key: string): void {
    this.memoryCache.delete(key)
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
    }
  }

  clear(): void {
    this.memoryCache.clear()
    try {
      localStorage.clear()
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }
  }

  // Get cache stats for debugging
  getStats() {
    return {
      memorySize: this.memoryCache.size,
      localStorageSize: this.getLocalStorageSize(),
    }
  }

  private getLocalStorageSize(): number {
    try {
      return Object.keys(localStorage).length
    } catch {
      return 0
    }
  }
}

export const cacheManager = new CacheManager()

// Cache keys
export const CACHE_KEYS = {
  COINBASE_PRODUCTS: 'coinbase_products',
  COINBASE_TICKERS: 'coinbase_tickers',
  CRYPTO_DATA: 'crypto_data',
  NEWS_DATA: 'news_data',
  STOCK_DATA: 'stock_data',
  AI_INSIGHTS: 'ai_insights',
  HISTORICAL_DATA: 'historical_data',
} as const

// Utility functions
export const createCacheKey = (
  baseKey: string,
  params?: Record<string, unknown>
): string => {
  if (!params) return baseKey
  const queryString = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return `${baseKey}?${queryString}`
}

export const withCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> => {
  // Check cache first
  const cached = cacheManager.get<T>(key)
  if (cached) {
    return cached
  }

  // Fetch fresh data
  const data = await fetcher()
  cacheManager.set(key, data, ttl)
  return data
}
