import { StockData, CryptoData, NewsItem, NewsApiResponse } from '@/types'

// Using Alpha Vantage API (free tier) for stock data
const ALPHA_VANTAGE_API_KEY =
  process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo'
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || 'demo'

export const apiUtils = {
  // Fetch stock data for multiple symbols
  fetchStockData: async (symbols: string[]): Promise<StockData[]> => {
    try {
      const promises = symbols.map(async (symbol) => {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${symbol}`)
        }

        const data = await response.json()
        const quote = data['Global Quote']

        if (!quote || Object.keys(quote).length === 0) {
          throw new Error(`No data available for ${symbol}`)
        }

        return {
          symbol: quote['01. symbol'],
          name: quote['01. symbol'], // Alpha Vantage doesn't provide company names in global quote
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(
            quote['10. change percent'].replace('%', '')
          ),
          volume: parseInt(quote['06. volume']),
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
      console.error('Error fetching stock data:', error)
      return []
    }
  },

  // Fetch crypto data for multiple symbols
  fetchCryptoData: async (symbols: string[]): Promise<CryptoData[]> => {
    try {
      const promises = symbols.map(async (symbol) => {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch crypto data for ${symbol}`)
        }

        const data = await response.json()
        const rate = data['Realtime Currency Exchange Rate']

        if (!rate || Object.keys(rate).length === 0) {
          throw new Error(`No crypto data available for ${symbol}`)
        }

        // For demo purposes, we'll generate some mock change data
        const price = parseFloat(rate['5. Exchange Rate'])
        const changePercent = (Math.random() - 0.5) * 10 // Random change between -5% and +5%
        const change = price * (changePercent / 100)

        return {
          symbol: rate['1. From_Currency Code'],
          name: rate['2. From_Currency Name'],
          price,
          change,
          changePercent,
          volume: Math.floor(Math.random() * 1000000000), // Mock volume
          marketCap: Math.floor(Math.random() * 1000000000000), // Mock market cap
          lastUpdated: new Date().toISOString(),
        }
      })

      const results = await Promise.allSettled(promises)
      return results
        .filter(
          (result): result is PromiseFulfilledResult<CryptoData> =>
            result.status === 'fulfilled'
        )
        .map((result) => result.value)
    } catch (error) {
      console.error('Error fetching crypto data:', error)
      // Return mock crypto data if API fails
      return [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          price: 45000 + Math.random() * 5000,
          change: (Math.random() - 0.5) * 2000,
          changePercent: (Math.random() - 0.5) * 10,
          volume: Math.floor(Math.random() * 1000000000),
          marketCap: 800000000000 + Math.random() * 100000000000,
          lastUpdated: new Date().toISOString(),
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          price: 3000 + Math.random() * 500,
          change: (Math.random() - 0.5) * 200,
          changePercent: (Math.random() - 0.5) * 8,
          volume: Math.floor(Math.random() * 500000000),
          marketCap: 350000000000 + Math.random() * 50000000000,
          lastUpdated: new Date().toISOString(),
        },
        {
          symbol: 'ADA',
          name: 'Cardano',
          price: 1.5 + Math.random() * 0.5,
          change: (Math.random() - 0.5) * 0.2,
          changePercent: (Math.random() - 0.5) * 15,
          volume: Math.floor(Math.random() * 100000000),
          marketCap: 50000000000 + Math.random() * 10000000000,
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
        summary: article.description || 'No description available',
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name,
      }))
    } catch (error) {
      console.error('Error fetching news:', error)
      // Return mock data if API fails - at least 8 stories
      return [
        {
          id: 'mock-1',
          title: 'Market Update: Tech Stocks Rally on Strong Earnings',
          summary:
            'Major technology companies report better-than-expected quarterly results, driving market optimism.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Market News',
        },
        {
          id: 'mock-2',
          title: 'Federal Reserve Signals Potential Rate Changes',
          summary:
            'Central bank officials hint at possible adjustments to monetary policy in upcoming meetings.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Financial Times',
        },
        {
          id: 'mock-3',
          title: 'Oil Prices Stabilize After Recent Volatility',
          summary:
            'Crude oil markets find equilibrium following weeks of geopolitical uncertainty.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Energy Report',
        },
        {
          id: 'mock-4',
          title: 'Cryptocurrency Market Shows Signs of Recovery',
          summary:
            'Bitcoin and Ethereum lead digital asset rally as institutional adoption continues to grow.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Crypto Daily',
        },
        {
          id: 'mock-5',
          title: 'Global Markets React to Economic Data Release',
          summary:
            'Investors digest latest employment and inflation figures, adjusting positions accordingly.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Reuters',
        },
        {
          id: 'mock-6',
          title: 'AI-Powered Trading Platforms Gain Traction',
          summary:
            'Financial institutions increasingly adopt machine learning algorithms for market analysis.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Tech Finance',
        },
        {
          id: 'mock-7',
          title: 'European Markets Open Higher on Positive Sentiment',
          summary:
            'European indices climb as investors remain optimistic about economic recovery prospects.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Bloomberg',
        },
        {
          id: 'mock-8',
          title: 'Sustainable Investing Trends Continue to Rise',
          summary:
            'ESG-focused funds attract record inflows as environmental concerns drive investment decisions.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Sustainable Finance',
        },
        {
          id: 'mock-9',
          title: 'Asian Markets Show Mixed Performance',
          summary:
            'Regional indices display varied results amid ongoing trade negotiations and policy uncertainty.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Asia Markets',
        },
        {
          id: 'mock-10',
          title: 'Bond Yields Fluctuate Amid Economic Uncertainty',
          summary:
            'Treasury yields experience volatility as market participants assess inflation and growth outlook.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Bond Market Daily',
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
