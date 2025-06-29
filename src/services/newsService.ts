import { cacheManager, CACHE_KEYS, withCache } from '@/utils/cache'
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
    return withCache(
      `${CACHE_KEYS.NEWS_DATA}_crypto`,
      async () => {
        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return [
          {
            id: '1',
            title:
              'Bitcoin Surges Past $45,000 as Institutional Adoption Grows',
            description:
              'Major financial institutions continue to show interest in cryptocurrency investments, driving Bitcoin to new heights.',
            source: 'CryptoNews',
            publishedAt: '2024-01-15T10:30:00Z',
            url: '#',
            sentiment: 'positive',
          },
          {
            id: '2',
            title: 'Ethereum 2.0 Update Shows Promising Results',
            description:
              'The latest Ethereum network upgrade demonstrates improved scalability and reduced energy consumption.',
            source: 'BlockchainDaily',
            publishedAt: '2024-01-15T09:15:00Z',
            url: '#',
            sentiment: 'positive',
          },
          {
            id: '3',
            title: 'Regulatory Changes Impact Crypto Market',
            description:
              'New regulations in major markets are creating both challenges and opportunities for cryptocurrency adoption.',
            source: 'CryptoInsider',
            publishedAt: '2024-01-15T08:45:00Z',
            url: '#',
            sentiment: 'neutral',
          },
          {
            id: '4',
            title: 'DeFi Protocols See Record Trading Volume',
            description:
              'Decentralized finance platforms are experiencing unprecedented growth in user activity and trading volume.',
            source: 'DeFiNews',
            publishedAt: '2024-01-15T07:30:00Z',
            url: '#',
            sentiment: 'positive',
          },
          {
            id: '5',
            title: 'NFT Market Shows Signs of Recovery',
            description:
              'After a period of decline, the NFT market is showing renewed interest from collectors and investors.',
            source: 'NFTWeekly',
            publishedAt: '2024-01-15T06:20:00Z',
            url: '#',
            sentiment: 'positive',
          },
          {
            id: '6',
            title: 'Central Bank Digital Currencies Gain Momentum',
            description:
              'More countries are exploring CBDCs as they seek to modernize their financial systems.',
            source: 'FinTechNews',
            publishedAt: '2024-01-15T05:10:00Z',
            url: '#',
            sentiment: 'neutral',
          },
        ]
      },
      this.NEWS_CACHE_TTL
    )
  }

  async getStockNews(): Promise<NewsItem[]> {
    return withCache(
      `${CACHE_KEYS.NEWS_DATA}_stock_yahoo`,
      async () => {
        // Yahoo Finance unofficial API (public endpoint)
        try {
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
          const items = (data?.data?.main?.stream || []).map(
            (item: YahooNewsItem, idx: number) => ({
              id: item.id || `yahoo-${idx}`,
              title: item.title,
              description: item.summary || 'No description available',
              source: 'Yahoo Finance',
              publishedAt: item.pubDate
                ? new Date(item.pubDate * 1000).toISOString()
                : new Date().toISOString(),
              url: item.link,
              sentiment: 'neutral',
            })
          )
          return items
        } catch (error) {
          console.error('Error fetching Yahoo Finance news:', error)
          // Fallback to previous mock data
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
          ]
        }
      },
      this.NEWS_CACHE_TTL
    )
  }

  async getPopularInsights(): Promise<PopularInsight[]> {
    return withCache(
      `${CACHE_KEYS.POPULAR_INSIGHTS}`,
      async () => {
        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        return [
          {
            id: '1',
            title: 'AI Sector Momentum Building',
            description:
              'Artificial intelligence companies showing strong technical indicators and institutional buying.',
            category: 'bullish',
            confidence: 85,
            impact: 'high',
            timestamp: new Date().toISOString(),
            tags: ['AI', 'Technology', 'Growth'],
          },
          {
            id: '2',
            title: 'Energy Sector Under Pressure',
            description:
              'Traditional energy stocks facing headwinds from renewable energy adoption and policy changes.',
            category: 'bearish',
            confidence: 72,
            impact: 'medium',
            timestamp: new Date().toISOString(),
            tags: ['Energy', 'Policy', 'Renewables'],
          },
          {
            id: '3',
            title: 'Financial Services Consolidation',
            description:
              'Merger and acquisition activity increasing in the financial services sector.',
            category: 'neutral',
            confidence: 68,
            impact: 'medium',
            timestamp: new Date().toISOString(),
            tags: ['Finance', 'M&A', 'Consolidation'],
          },
          {
            id: '4',
            title: 'Healthcare Innovation Surge',
            description:
              'Biotech and pharmaceutical companies leading innovation in personalized medicine.',
            category: 'bullish',
            confidence: 78,
            impact: 'high',
            timestamp: new Date().toISOString(),
            tags: ['Healthcare', 'Biotech', 'Innovation'],
          },
          {
            id: '5',
            title: 'Consumer Spending Patterns Shift',
            description:
              'E-commerce and digital services continuing to gain market share from traditional retail.',
            category: 'bullish',
            confidence: 81,
            impact: 'medium',
            timestamp: new Date().toISOString(),
            tags: ['Consumer', 'E-commerce', 'Digital'],
          },
          {
            id: '6',
            title: 'Real Estate Market Cooling',
            description:
              'Residential real estate showing signs of stabilization after recent volatility.',
            category: 'neutral',
            confidence: 65,
            impact: 'low',
            timestamp: new Date().toISOString(),
            tags: ['Real Estate', 'Housing', 'Stabilization'],
          },
        ]
      },
      this.NEWS_CACHE_TTL
    )
  }

  async getMarketSentiment(): Promise<MarketSentiment> {
    return withCache(
      `${CACHE_KEYS.MARKET_SENTIMENT}`,
      async () => {
        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 600))

        return {
          overall: 'bullish',
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
      },
      this.NEWS_CACHE_TTL
    )
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

  invalidateNewsCache(category?: 'crypto' | 'stock'): void {
    if (category) {
      cacheManager.invalidate(`${CACHE_KEYS.NEWS_DATA}_${category}`)
    } else {
      cacheManager.invalidate(`${CACHE_KEYS.NEWS_DATA}_crypto`)
      cacheManager.invalidate(`${CACHE_KEYS.NEWS_DATA}_stock`)
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
