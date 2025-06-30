import { apiCacheService, CACHE_DURATIONS } from './apiCacheService'

interface HistoricalPrice {
  price: number
  timestamp: number
  volume: number
}

interface CryptoHistoricalData {
  [symbol: string]: {
    current: HistoricalPrice
    previous: HistoricalPrice
    change24h: number
    changePercent: number
  }
}

class HistoricalDataService {
  private readonly UPDATE_INTERVAL = 5 * 60 * 1000 // 5 minutes

  async getHistoricalData(): Promise<CryptoHistoricalData> {
    try {
      const cacheKey = apiCacheService.generateCacheKey('historical_data')
      const cachedData =
        await apiCacheService.getCachedData<CryptoHistoricalData>(cacheKey)
      return cachedData || {}
    } catch (error) {
      console.error('Error fetching historical data:', error)
      return {}
    }
  }

  async updateHistoricalData(
    symbol: string,
    currentPrice: number,
    currentVolume: number
  ): Promise<{ change24h: number; changePercent: number }> {
    try {
      const historicalData = await this.getHistoricalData()
      const now = Date.now()

      // Get or create historical record for this symbol
      if (!historicalData[symbol]) {
        historicalData[symbol] = {
          current: {
            price: currentPrice,
            volume: currentVolume,
            timestamp: now,
          },
          previous: {
            price: currentPrice,
            volume: currentVolume,
            timestamp: now,
          },
          change24h: 0,
          changePercent: 0,
        }
      } else {
        const record = historicalData[symbol]

        // Check if we need to update (every 5 minutes)
        if (now - record.current.timestamp > this.UPDATE_INTERVAL) {
          // Move current to previous if it's been more than 24 hours
          if (now - record.current.timestamp > 24 * 60 * 60 * 1000) {
            record.previous = { ...record.current }
          }

          // Update current data
          record.current = {
            price: currentPrice,
            volume: currentVolume,
            timestamp: now,
          }

          // Calculate change
          const priceChange = currentPrice - record.previous.price
          const changePercent =
            record.previous.price > 0
              ? (priceChange / record.previous.price) * 100
              : 0

          record.change24h = priceChange
          record.changePercent = changePercent
        }
      }

      // Save updated data
      const cacheKey = apiCacheService.generateCacheKey('historical_data')
      await apiCacheService.setCachedData(
        cacheKey,
        historicalData,
        CACHE_DURATIONS.MARKET_DATA
      )

      return {
        change24h: historicalData[symbol].change24h,
        changePercent: historicalData[symbol].changePercent,
      }
    } catch (error) {
      console.error('Error updating historical data:', error)
      return { change24h: 0, changePercent: 0 }
    }
  }

  async getChangeData(
    symbol: string
  ): Promise<{ change24h: number; changePercent: number }> {
    try {
      const historicalData = await this.getHistoricalData()
      const record = historicalData[symbol]

      if (!record) {
        return { change24h: 0, changePercent: 0 }
      }

      return {
        change24h: record.change24h,
        changePercent: record.changePercent,
      }
    } catch (error) {
      console.error('Error getting change data:', error)
      return { change24h: 0, changePercent: 0 }
    }
  }

  formatChangeDisplay(changePercent: number): string {
    const sign = changePercent >= 0 ? '+' : ''
    return `${sign}${changePercent.toFixed(2)}%`
  }

  // Generate mock historical data for initial setup
  async generateMockHistoricalData(symbols: string[]): Promise<void> {
    try {
      const historicalData: CryptoHistoricalData = {}
      const now = Date.now()
      const oneDayAgo = now - 24 * 60 * 60 * 1000

      symbols.forEach((symbol) => {
        const basePrice = Math.random() * 1000 + 10 // Random price between 10-1010
        const changePercent = (Math.random() - 0.5) * 20 // Random change between -10% and +10%
        const currentPrice = basePrice * (1 + changePercent / 100)

        historicalData[symbol] = {
          current: {
            price: currentPrice,
            volume: Math.random() * 1000000 + 100000,
            timestamp: now,
          },
          previous: {
            price: basePrice,
            volume: Math.random() * 1000000 + 100000,
            timestamp: oneDayAgo,
          },
          change24h: currentPrice - basePrice,
          changePercent: changePercent,
        }
      })

      const cacheKey = apiCacheService.generateCacheKey('historical_data')
      await apiCacheService.setCachedData(
        cacheKey,
        historicalData,
        CACHE_DURATIONS.MARKET_DATA
      )
    } catch (error) {
      console.error('Error generating mock historical data:', error)
    }
  }

  async clearHistoricalData(): Promise<void> {
    try {
      await apiCacheService.clearExpiredCache()
    } catch (error) {
      console.error('Error clearing historical data:', error)
    }
  }
}

export const historicalDataService = new HistoricalDataService()
