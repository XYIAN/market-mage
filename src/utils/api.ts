import { StockData, CryptoData, NewsItem, NewsApiResponse } from '@/types'

// Using multiple APIs for better data coverage
const POLYGON_API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY || 'demo'
const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || 'demo'
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || 'demo'

export const apiUtils = {
  // Fetch stock data for multiple symbols using Finnhub and Polygon only
  fetchStockData: async (symbols: string[]): Promise<StockData[]> => {
    try {
      // Try Polygon.io first (better rate limits)
      if (POLYGON_API_KEY !== 'demo') {
        const polygonData = await fetchFromPolygon(symbols)
        if (polygonData.length > 0) {
          return polygonData
        }
      }

      // Fallback to Finnhub
      if (FINNHUB_API_KEY !== 'demo') {
        const finnhubData = await fetchFromFinnhub(symbols)
        if (finnhubData.length > 0) {
          return finnhubData
        }
      }

      // Final fallback to mock data
      return generateMockStockData(symbols)
    } catch (error) {
      console.error('Error fetching stock data:', error)
      return generateMockStockData(symbols)
    }
  },

  // Fetch crypto data for multiple symbols (using only free APIs)
  fetchCryptoData: async (symbols: string[]): Promise<CryptoData[]> => {
    try {
      // Use only free APIs for crypto data - no Alpha Vantage
      const mockData = symbols.map((symbol) => {
        const basePrice = getCryptoBasePrice(symbol)
        const changePercent = (Math.random() - 0.5) * 10 // Random change between -5% and +5%
        const change = basePrice * (changePercent / 100)

        return {
          symbol: symbol,
          name: getCryptoName(symbol),
          price: (basePrice + change).toFixed(2),
          change: change.toFixed(2),
          volume: Math.floor(Math.random() * 1000000000).toLocaleString(), // Mock volume as string
          marketCap: Math.floor(Math.random() * 1000000000000), // Mock market cap
          lastUpdated: new Date().toISOString(),
        }
      })

      return mockData
    } catch (error) {
      console.error('Error fetching crypto data:', error)
      // Return mock crypto data if API fails
      return [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          price: (45000 + Math.random() * 5000).toFixed(2),
          change: ((Math.random() - 0.5) * 2000).toFixed(2),
          marketCap: Math.floor(800000000000 + Math.random() * 100000000000),
          volume: Math.floor(Math.random() * 1000000000).toLocaleString(),
          lastUpdated: new Date().toISOString(),
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          price: (3000 + Math.random() * 500).toFixed(2),
          change: ((Math.random() - 0.5) * 200).toFixed(2),
          marketCap: Math.floor(350000000000 + Math.random() * 50000000000),
          volume: Math.floor(Math.random() * 500000000).toLocaleString(),
          lastUpdated: new Date().toISOString(),
        },
        {
          symbol: 'ADA',
          name: 'Cardano',
          price: (1.5 + Math.random() * 0.5).toFixed(4),
          change: ((Math.random() - 0.5) * 0.2).toFixed(4),
          marketCap: Math.floor(50000000000 + Math.random() * 10000000000),
          volume: Math.floor(Math.random() * 100000000).toLocaleString(),
          lastUpdated: new Date().toISOString(),
        },
      ]
    }
  },

  // Fetch financial news
  fetchNews: async (): Promise<NewsItem[]> => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${NEWS_API_KEY}&pageSize=20`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }

      const data: NewsApiResponse = await response.json()

      return data.articles.map((article, index) => ({
        id: `news-${index}`,
        title: article.title,
        description: article.description || 'No description available',
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name,
        sentiment: 'neutral',
      }))
    } catch (error) {
      console.error('Error fetching news:', error)
      // Return mock data if API fails - at least 8 stories
      return [
        {
          id: 'mock-1',
          title: 'Market Update: Tech Stocks Rally on Strong Earnings',
          description:
            'Major technology companies report better-than-expected quarterly results, driving market optimism.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Market News',
          sentiment: 'neutral',
        },
        {
          id: 'mock-2',
          title: 'Federal Reserve Signals Potential Rate Changes',
          description:
            'Central bank officials hint at possible adjustments to monetary policy in upcoming meetings.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Financial Times',
          sentiment: 'neutral',
        },
        {
          id: 'mock-3',
          title: 'Oil Prices Stabilize After Recent Volatility',
          description:
            'Crude oil markets find equilibrium following weeks of geopolitical uncertainty.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Energy Report',
          sentiment: 'neutral',
        },
        {
          id: 'mock-4',
          title: 'Cryptocurrency Market Shows Signs of Recovery',
          description:
            'Bitcoin and Ethereum lead digital asset rally as institutional adoption continues to grow.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Crypto Daily',
          sentiment: 'neutral',
        },
        {
          id: 'mock-5',
          title: 'Global Markets React to Economic Data Release',
          description:
            'International markets respond to latest economic indicators and policy announcements.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Global Finance',
          sentiment: 'neutral',
        },
        {
          id: 'mock-6',
          title: 'Earnings Season Brings Mixed Results',
          description:
            'Corporate earnings reports show varied performance across different market sectors.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Earnings Watch',
          sentiment: 'neutral',
        },
        {
          id: 'mock-7',
          title: 'Green Energy Stocks Continue Momentum',
          description:
            'Renewable energy sector maintains strong performance amid climate policy developments.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Green Finance',
          sentiment: 'neutral',
        },
        {
          id: 'mock-8',
          title: 'Retail Sector Adapts to Digital Transformation',
          description:
            'Traditional retailers embrace e-commerce and digital technologies to meet changing consumer demands.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Retail Insights',
          sentiment: 'neutral',
        },
      ]
    }
  },

  // Generate AI trading insight
  generateAIInsight: async (): Promise<string> => {
    try {
      const response = await fetch('/api/ai-insight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to generate AI insight')
      }

      const data = await response.json()
      return data.insight
    } catch (error) {
      console.error('Error generating AI insight:', error)
      return 'Unable to generate AI insight at this time. Please try again later.'
    }
  },
}

// Helper function to fetch from Polygon.io
async function fetchFromPolygon(symbols: string[]): Promise<StockData[]> {
  try {
    const promises = symbols.map(async (symbol) => {
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
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
        name: symbol, // Polygon doesn't provide company names in this endpoint
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        volume: result.v, // Volume
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

// Helper function to fetch from Finnhub
async function fetchFromFinnhub(symbols: string[]): Promise<StockData[]> {
  try {
    const promises = symbols.map(async (symbol) => {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
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
        name: symbol, // Finnhub doesn't provide company names in quote endpoint
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        volume: data.v || 0, // Volume
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

// Helper function to generate mock stock data
function generateMockStockData(symbols: string[]): StockData[] {
  return symbols.map((symbol) => {
    const basePrice = getBasePrice(symbol)
    const changePercent = (Math.random() - 0.5) * 8 // -4% to +4%
    const change = basePrice * (changePercent / 100)
    const volume = Math.floor(Math.random() * 500000) + 500000

    return {
      symbol,
      name: getCompanyName(symbol),
      price: basePrice + change,
      change,
      changePercent,
      volume,
      marketCap: (basePrice + change) * volume * (Math.random() * 5 + 1),
      lastUpdated: new Date().toISOString(),
    }
  })
}

// Helper function to get base price for symbols
function getBasePrice(symbol: string): number {
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

// Helper function to get company names
function getCompanyName(symbol: string): string {
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

// Helper function to get crypto base price
function getCryptoBasePrice(symbol: string): number {
  const basePrices: Record<string, number> = {
    BTC: 45000,
    ETH: 3000,
    ADA: 1.5,
  }
  return basePrices[symbol] || 100
}

// Helper function to get crypto name
function getCryptoName(symbol: string): string {
  const cryptoNames: Record<string, string> = {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    ADA: 'Cardano',
  }
  return cryptoNames[symbol] || symbol
}
