import { cacheManager, CACHE_KEYS, withCache } from '@/utils/cache'

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  lastUpdated: string
}

class StockService {
  private readonly STOCK_CACHE_TTL = 2 * 60 * 1000 // 2 minutes
  private readonly FINNHUB_API_KEY =
    process.env.NEXT_PUBLIC_FINNHUB_API_KEY || 'demo'
  private readonly POLYGON_API_KEY =
    process.env.NEXT_PUBLIC_POLYGON_API_KEY || 'demo'

  async getStockData(symbols: string[]): Promise<StockData[]> {
    return withCache(
      `${CACHE_KEYS.STOCK_DATA}_${symbols.join(',')}`,
      async () => {
        try {
          // Try Finnhub and Polygon.io in parallel
          const [finnhubData, polygonData] = await Promise.all([
            this.fetchFromFinnhub(symbols),
            this.fetchFromPolygon(symbols),
          ])
          // Combine and deduplicate
          const allData: StockData[] = [...finnhubData, ...polygonData]
          const uniqueData = this.removeDuplicates(allData)
          return uniqueData
        } catch (error) {
          console.error('Error fetching stock data:', error)
          return this.getMockStockData(symbols)
        }
      },
      this.STOCK_CACHE_TTL
    )
  }

  private async fetchFromFinnhub(symbols: string[]): Promise<StockData[]> {
    try {
      if (this.FINNHUB_API_KEY === 'demo') {
        return []
      }

      const promises = symbols.map(async (symbol) => {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.FINNHUB_API_KEY}`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch Finnhub data for ${symbol}`)
        }

        const data = await response.json()

        if (!data || data.error) {
          throw new Error(`No Finnhub data available for ${symbol}`)
        }

        const currentPrice = data.c // Current price
        const previousPrice = data.pc // Previous close price
        const change = currentPrice - previousPrice
        const changePercent = (change / previousPrice) * 100

        return {
          symbol: symbol,
          name: this.getCompanyName(symbol),
          price: currentPrice,
          change: change,
          changePercent: changePercent,
          volume: data.v || 0, // Volume
          marketCap: currentPrice * (data.v || 0),
          lastUpdated: new Date().toISOString(),
        }
      })

      const results = await Promise.allSettled(promises)
      return results
        .filter(
          (result): result is PromiseFulfilledResult<StockData> =>
            result.status === 'fulfilled'
        )
        .map((result) => result.value)
    } catch (error) {
      console.error('Error fetching from Finnhub:', error)
      return []
    }
  }

  private async fetchFromPolygon(symbols: string[]): Promise<StockData[]> {
    try {
      if (this.POLYGON_API_KEY === 'demo') {
        return []
      }

      const promises = symbols.map(async (symbol) => {
        const response = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${this.POLYGON_API_KEY}`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch Polygon data for ${symbol}`)
        }

        const data = await response.json()

        if (!data.results || data.results.length === 0) {
          throw new Error(`No Polygon data available for ${symbol}`)
        }

        const result = data.results[0]
        const currentPrice = result.c // Close price
        const previousPrice = result.o // Open price
        const change = currentPrice - previousPrice
        const changePercent = (change / previousPrice) * 100

        return {
          symbol: symbol,
          name: this.getCompanyName(symbol),
          price: currentPrice,
          change: change,
          changePercent: changePercent,
          volume: result.v, // Volume
          marketCap: currentPrice * result.v,
          lastUpdated: new Date().toISOString(),
        }
      })

      const results = await Promise.allSettled(promises)
      return results
        .filter(
          (result): result is PromiseFulfilledResult<StockData> =>
            result.status === 'fulfilled'
        )
        .map((result) => result.value)
    } catch (error) {
      console.error('Error fetching from Polygon:', error)
      return []
    }
  }

  private removeDuplicates(data: StockData[]): StockData[] {
    const seen = new Set<string>()
    return data.filter((item) => {
      const key = item.symbol.toLowerCase()
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  private getMockStockData(symbols: string[]): StockData[] {
    return symbols.map((symbol) => {
      const basePrice = this.getBasePrice(symbol)
      const changePercent = (Math.random() - 0.5) * 8 // -4% to +4%
      const change = basePrice * (changePercent / 100)
      const volume = Math.floor(Math.random() * 5000000) + 500000
      const marketCap = basePrice * volume * (Math.random() * 5 + 1)

      return {
        symbol,
        name: this.getCompanyName(symbol),
        price: basePrice + change,
        change,
        changePercent,
        volume,
        marketCap,
        lastUpdated: new Date().toISOString(),
      }
    })
  }

  private getBasePrice(symbol: string): number {
    const basePrices: Record<string, number> = {
      AAPL: 150,
      GOOGL: 2800,
      MSFT: 300,
      AMZN: 3300,
      TSLA: 800,
      META: 300,
      NVDA: 500,
      NFLX: 500,
      AMD: 100,
      INTC: 50,
      CRM: 200,
      ORCL: 80,
      IBM: 140,
      CSCO: 50,
      ADBE: 400,
      PYPL: 200,
      NKE: 150,
      DIS: 180,
      WMT: 140,
      JPM: 150,
    }
    return basePrices[symbol] || 100
  }

  private getCompanyName(symbol: string): string {
    const companyNames: Record<string, string> = {
      AAPL: 'Apple Inc.',
      GOOGL: 'Alphabet Inc.',
      MSFT: 'Microsoft Corporation',
      AMZN: 'Amazon.com Inc.',
      TSLA: 'Tesla Inc.',
      META: 'Meta Platforms Inc.',
      NVDA: 'NVIDIA Corporation',
      NFLX: 'Netflix Inc.',
      AMD: 'Advanced Micro Devices',
      INTC: 'Intel Corporation',
      CRM: 'Salesforce Inc.',
      ORCL: 'Oracle Corporation',
      IBM: 'International Business Machines',
      CSCO: 'Cisco Systems Inc.',
      ADBE: 'Adobe Inc.',
      PYPL: 'PayPal Holdings Inc.',
      NKE: 'Nike Inc.',
      DIS: 'The Walt Disney Company',
      WMT: 'Walmart Inc.',
      JPM: 'JPMorgan Chase & Co.',
    }
    return companyNames[symbol] || symbol
  }

  async searchStocks(query: string): Promise<StockData[]> {
    // This would typically call a search API
    // For now, we'll filter from a predefined list
    const allSymbols = [
      'AAPL',
      'GOOGL',
      'MSFT',
      'AMZN',
      'TSLA',
      'META',
      'NVDA',
      'NFLX',
      'AMD',
      'INTC',
      'CRM',
      'ORCL',
      'IBM',
      'CSCO',
      'ADBE',
      'PYPL',
      'NKE',
      'DIS',
      'WMT',
      'JPM',
    ]

    const filteredSymbols = allSymbols.filter(
      (symbol) =>
        symbol.toLowerCase().includes(query.toLowerCase()) ||
        this.getCompanyName(symbol).toLowerCase().includes(query.toLowerCase())
    )

    return this.getStockData(filteredSymbols.slice(0, 10))
  }

  invalidateCache(): void {
    cacheManager.invalidate(CACHE_KEYS.STOCK_DATA)
  }
}

export const stockService = new StockService()
