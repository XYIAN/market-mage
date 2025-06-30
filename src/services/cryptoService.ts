import { apiCacheService, CACHE_DURATIONS } from './apiCacheService'
import { CryptoData } from '@/types'

interface TickerData {
  price: string
  change: string
  volume: string
  marketCap: string
}

class CryptoService {
  constructor() {
    // Auto-refresh data every 30 seconds (only in browser)
    if (typeof window !== 'undefined') {
      setInterval(() => {
        console.log('Auto-refreshing crypto data...')
        this.invalidateCache('crypto_data')
        this.invalidateCache('coinbase_products')
        this.invalidateCache('coinbase_tickers')
      }, 30000)
    }
  }

  /**
   * Format currency values
   */
  formatCurrency(value: number): string {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`
    }
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`
    }
    if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`
    }
    if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`
    }
    return `$${value.toFixed(2)}`
  }

  /**
   * Fetch crypto data from Coinbase API with caching
   */
  async getCryptoData(): Promise<CryptoData[]> {
    try {
      // Try to get cached data first
      const cacheKey = apiCacheService.generateCacheKey('coinbase_products')
      const cachedData = await apiCacheService.getCachedData<CryptoData[]>(
        cacheKey
      )

      if (cachedData) {
        return cachedData
      }

      // If no cache, fetch fresh data
      const response = await fetch('/api/crypto/coinbase/products')
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data')
      }

      const data = await response.json()

      // Cache the fresh data
      await apiCacheService.setCachedData(
        cacheKey,
        data,
        CACHE_DURATIONS.CRYPTO_PRICES
      )

      // Increment API calls metric
      await apiCacheService.incrementMetric('total_api_calls')

      return data
    } catch (error) {
      console.error('Error fetching crypto data:', error)
      throw error
    }
  }

  /**
   * Fetch specific crypto ticker data with caching
   */
  async getCryptoTicker(productId: string): Promise<TickerData> {
    try {
      // Try to get cached data first
      const cacheKey = apiCacheService.generateCacheKey('coinbase_ticker', {
        productId,
      })
      const cachedData = await apiCacheService.getCachedData<TickerData>(
        cacheKey
      )

      if (cachedData) {
        return cachedData
      }

      // If no cache, fetch fresh data
      const response = await fetch(`/api/crypto/coinbase/ticker/${productId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch ticker data')
      }

      const data = await response.json()

      // Cache the fresh data
      await apiCacheService.setCachedData(
        cacheKey,
        data,
        CACHE_DURATIONS.CRYPTO_PRICES
      )

      // Increment API calls metric
      await apiCacheService.incrementMetric('total_api_calls')

      return data
    } catch (error) {
      console.error('Error fetching ticker data:', error)
      throw error
    }
  }

  /**
   * Fetch Binance data with caching
   */
  async getBinanceData(): Promise<CryptoData[]> {
    try {
      // Try to get cached data first
      const cacheKey = apiCacheService.generateCacheKey('binance_data')
      const cachedData = await apiCacheService.getCachedData<CryptoData[]>(
        cacheKey
      )

      if (cachedData) {
        return cachedData
      }

      // If no cache, fetch fresh data
      const response = await fetch('/api/crypto/binance')
      if (!response.ok) {
        throw new Error('Failed to fetch Binance data')
      }

      const data = await response.json()

      // Cache the fresh data
      await apiCacheService.setCachedData(
        cacheKey,
        data,
        CACHE_DURATIONS.CRYPTO_PRICES
      )

      // Increment API calls metric
      await apiCacheService.incrementMetric('total_api_calls')

      return data
    } catch (error) {
      console.error('Error fetching Binance data:', error)
      throw error
    }
  }

  /**
   * Fetch CoinGecko data with caching
   */
  async getCoinGeckoData(): Promise<CryptoData[]> {
    try {
      // Try to get cached data first
      const cacheKey = apiCacheService.generateCacheKey('coingecko_data')
      const cachedData = await apiCacheService.getCachedData<CryptoData[]>(
        cacheKey
      )

      if (cachedData) {
        return cachedData
      }

      // If no cache, fetch fresh data
      const response = await fetch('/api/crypto/coingecko')
      if (!response.ok) {
        throw new Error('Failed to fetch CoinGecko data')
      }

      const data = await response.json()

      // Cache the fresh data
      await apiCacheService.setCachedData(
        cacheKey,
        data,
        CACHE_DURATIONS.CRYPTO_PRICES
      )

      // Increment API calls metric
      await apiCacheService.incrementMetric('total_api_calls')

      return data
    } catch (error) {
      console.error('Error fetching CoinGecko data:', error)
      throw error
    }
  }

  /**
   * Invalidate cache for a specific key
   */
  async invalidateCache(key: string): Promise<void> {
    if (typeof window !== 'undefined') {
      await apiCacheService.invalidateCache(key)
    }
  }
}

export const cryptoService = new CryptoService()
