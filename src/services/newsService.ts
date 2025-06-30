import { apiCacheService, CACHE_DURATIONS } from './apiCacheService'
import { NewsItem } from '@/types'

interface PopularInsight {
  id: string
  title: string
  description: string
  category: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  impact: 'high' | 'medium' | 'low'
  timestamp: string
  tags: string[]
}

interface MarketSentiment {
  overall: 'bullish' | 'bearish' | 'neutral'
  score: number
  volume: number
  volatility: number
  sectors: {
    technology: number
    healthcare: number
    finance: number
    energy: number
    consumer: number
  }
}

class NewsService {
  private readonly NEWS_CACHE_TTL = 10 * 60 * 1000 // 10 minutes

  async getCryptoNews(): Promise<NewsItem[]> {
    try {
      // Try to get cached data first
      const cacheKey = apiCacheService.generateCacheKey('crypto_news')
      const cachedData = await apiCacheService.getCachedData<NewsItem[]>(
        cacheKey
      )

      if (cachedData) {
        return cachedData
      }

      // If no cache, fetch fresh data
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const freshData: NewsItem[] = [
        {
          id: '1',
          title: 'Bitcoin Surges Past $45,000 as Institutional Adoption Grows',
          description:
            'Major financial institutions continue to show interest in cryptocurrency investments, driving Bitcoin to new heights.',
          source: 'CryptoNews',
          publishedAt: '2024-01-15T10:30:00Z',
          url: '#',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          title: 'Ethereum 2.0 Update Shows Promising Results',
          description:
            'The latest Ethereum network upgrade demonstrates improved scalability and reduced energy consumption.',
          source: 'BlockchainDaily',
          publishedAt: '2024-01-15T09:15:00Z',
          url: '#',
          sentiment: 'positive' as const,
        },
        {
          id: '3',
          title: 'Regulatory Changes Impact Crypto Market',
          description:
            'New regulations in major markets are creating both challenges and opportunities for cryptocurrency adoption.',
          source: 'CryptoInsider',
          publishedAt: '2024-01-15T08:45:00Z',
          url: '#',
          sentiment: 'neutral' as const,
        },
        {
          id: '4',
          title: 'DeFi Protocols See Record Trading Volume',
          description:
            'Decentralized finance platforms are experiencing unprecedented growth in user activity and trading volume.',
          source: 'DeFiNews',
          publishedAt: '2024-01-15T07:30:00Z',
          url: '#',
          sentiment: 'positive' as const,
        },
        {
          id: '5',
          title: 'NFT Market Shows Signs of Recovery',
          description:
            'After a period of decline, the NFT market is showing renewed interest from collectors and investors.',
          source: 'NFTWeekly',
          publishedAt: '2024-01-15T06:20:00Z',
          url: '#',
          sentiment: 'positive' as const,
        },
        {
          id: '6',
          title: 'Central Bank Digital Currencies Gain Momentum',
          description:
            'More countries are exploring CBDCs as they seek to modernize their financial systems.',
          source: 'FinTechNews',
          publishedAt: '2024-01-15T05:10:00Z',
          url: '#',
          sentiment: 'neutral' as const,
        },
      ]

      // Cache the fresh data
      await apiCacheService.setCachedData(
        cacheKey,
        freshData,
        CACHE_DURATIONS.NEWS
      )

      // Increment API calls metric
      await apiCacheService.incrementMetric('total_api_calls')

      return freshData
    } catch (error) {
      console.error('Error fetching crypto news:', error)
      return []
    }
  }

  async getStockNews(): Promise<NewsItem[]> {
    try {
      // Try to get cached data first
      const cacheKey = apiCacheService.generateCacheKey('stock_news')
      const cachedData = await apiCacheService.getCachedData<NewsItem[]>(
        cacheKey
      )

      if (cachedData) {
        return cachedData
      }

      // If no cache, fetch fresh data
      let freshData: NewsItem[]
      try {
        // Yahoo Finance unofficial API (public endpoint)
        type YahooNewsItem = {
          id: string
          title: string
          summary?: string
          pubDate?: number
          link: string
        }
        const response = await fetch(
          'https://query1.finance.yahoo.com/v2/finance/news?category=general&region=US&lang=en-US'
        )
        if (!response.ok) {
          throw new Error('Failed to fetch Yahoo Finance news')
        }
        const data = await response.json()
        // Yahoo's news format is a bit nested
        const items: NewsItem[] = (data?.data?.main?.stream || []).map(
          (item: YahooNewsItem, idx: number) => ({
            id: item.id || `yahoo-${idx}`,
            title: item.title,
            description: item.summary || 'No description available',
            source: 'Yahoo Finance',
            publishedAt: item.pubDate
              ? new Date(item.pubDate * 1000).toISOString()
              : new Date().toISOString(),
            url: item.link,
            sentiment: 'neutral' as 'positive' | 'negative' | 'neutral',
          })
        )
        freshData = items
      } catch (error) {
        console.error('Error fetching Yahoo Finance news:', error)
        // Fallback to mock data
        freshData = [
          {
            id: 'mock-1',
            title: 'Market Update: Tech Stocks Rally on Strong Earnings',
            description:
              'Major technology companies report better-than-expected quarterly results, driving market optimism.',
            url: '#',
            publishedAt: new Date().toISOString(),
            source: 'Market News',
            sentiment: 'neutral' as const,
          },
          {
            id: 'mock-2',
            title: 'Federal Reserve Signals Potential Rate Changes',
            description:
              'Central bank officials hint at possible adjustments to monetary policy in upcoming meetings.',
            url: '#',
            publishedAt: new Date().toISOString(),
            source: 'Financial Times',
            sentiment: 'neutral' as const,
          },
        ]
      }

      // Cache the fresh data
      await apiCacheService.setCachedData(
        cacheKey,
        freshData,
        CACHE_DURATIONS.NEWS
      )

      // Increment API calls metric
      await apiCacheService.incrementMetric('total_api_calls')

      return freshData
    } catch (error) {
      console.error('Error fetching stock news:', error)
      return []
    }
  }

  async getPopularInsights(): Promise<PopularInsight[]> {
    try {
      // Try to get cached data first
      const cacheKey = apiCacheService.generateCacheKey('popular_insights')
      const cachedData = await apiCacheService.getCachedData<PopularInsight[]>(
        cacheKey
      )

      if (cachedData) {
        return cachedData
      }

      // If no cache, fetch fresh data
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const freshData = [
        {
          id: '1',
          title: 'AI Sector Momentum Building',
          description:
            'Artificial intelligence companies showing strong technical indicators and institutional buying.',
          category: 'bullish' as const,
          confidence: 85,
          impact: 'high' as const,
          timestamp: new Date().toISOString(),
          tags: ['AI', 'Technology', 'Growth'],
        },
        {
          id: '2',
          title: 'Energy Sector Under Pressure',
          description:
            'Traditional energy stocks facing headwinds from renewable energy adoption and policy changes.',
          category: 'bearish' as const,
          confidence: 72,
          impact: 'medium' as const,
          timestamp: new Date().toISOString(),
          tags: ['Energy', 'Policy', 'Renewables'],
        },
        {
          id: '3',
          title: 'Financial Services Consolidation',
          description:
            'Merger and acquisition activity increasing in the financial services sector.',
          category: 'neutral' as const,
          confidence: 68,
          impact: 'medium' as const,
          timestamp: new Date().toISOString(),
          tags: ['Finance', 'M&A', 'Consolidation'],
        },
        {
          id: '4',
          title: 'Healthcare Innovation Surge',
          description:
            'Biotech and pharmaceutical companies leading innovation in personalized medicine.',
          category: 'bullish' as const,
          confidence: 78,
          impact: 'high' as const,
          timestamp: new Date().toISOString(),
          tags: ['Healthcare', 'Biotech', 'Innovation'],
        },
        {
          id: '5',
          title: 'Consumer Spending Patterns Shift',
          description:
            'E-commerce and digital services continuing to gain market share from traditional retail.',
          category: 'bullish' as const,
          confidence: 81,
          impact: 'medium' as const,
          timestamp: new Date().toISOString(),
          tags: ['Consumer', 'E-commerce', 'Digital'],
        },
        {
          id: '6',
          title: 'Real Estate Market Cooling',
          description:
            'Residential real estate showing signs of stabilization after recent volatility.',
          category: 'neutral' as const,
          confidence: 65,
          impact: 'low' as const,
          timestamp: new Date().toISOString(),
          tags: ['Real Estate', 'Housing', 'Stabilization'],
        },
      ]

      // Cache the fresh data
      await apiCacheService.setCachedData(
        cacheKey,
        freshData,
        CACHE_DURATIONS.NEWS
      )

      // Increment API calls metric
      await apiCacheService.incrementMetric('total_api_calls')

      return freshData
    } catch (error) {
      console.error('Error fetching popular insights:', error)
      return []
    }
  }

  async getMarketSentiment(): Promise<MarketSentiment> {
    try {
      // Try to get cached data first
      const cacheKey = apiCacheService.generateCacheKey('market_sentiment')
      const cachedData = await apiCacheService.getCachedData<MarketSentiment>(
        cacheKey
      )

      if (cachedData) {
        return cachedData
      }

      // If no cache, fetch fresh data
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 600))

      const freshData = {
        overall: 'bullish' as const,
        score: 72,
        volume: 1250000000,
        volatility: 18.5,
        sectors: {
          technology: 78,
          healthcare: 65,
          finance: 58,
          energy: 42,
          consumer: 71,
        },
      }

      // Cache the fresh data
      await apiCacheService.setCachedData(
        cacheKey,
        freshData,
        CACHE_DURATIONS.MARKET_DATA
      )

      // Increment API calls metric
      await apiCacheService.incrementMetric('total_api_calls')

      return freshData
    } catch (error) {
      console.error('Error fetching market sentiment:', error)
      return {
        overall: 'neutral',
        score: 50,
        volume: 0,
        volatility: 0,
        sectors: {
          technology: 50,
          healthcare: 50,
          finance: 50,
          energy: 50,
          consumer: 50,
        },
      }
    }
  }

  async getNewsByCategory(category: 'crypto' | 'stock'): Promise<NewsItem[]> {
    switch (category) {
      case 'crypto':
        return this.getCryptoNews()
      case 'stock':
        return this.getStockNews()
      default:
        throw new Error(`Unknown news category: ${category}`)
    }
  }

  async clearCache(): Promise<void> {
    try {
      // Clear expired cache entries
      await apiCacheService.clearExpiredCache()
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }

  // Utility function to format news data
  formatNewsData(news: NewsItem[]): NewsItem[] {
    return news.map((item) => ({
      ...item,
      publishedAt: new Date(item.publishedAt).toISOString(),
    }))
  }
}

export const newsService = new NewsService()
