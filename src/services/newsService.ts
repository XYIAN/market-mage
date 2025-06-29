import { cacheManager, CACHE_KEYS, withCache } from '@/utils/cache'
import { NewsItem } from '@/types'

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
            summary:
              'Major financial institutions continue to show interest in cryptocurrency investments, driving Bitcoin to new heights.',
            source: 'CryptoNews',
            publishedAt: '2024-01-15T10:30:00Z',
            url: '#',
            sentiment: 'positive',
            category: 'Bitcoin',
          },
          {
            id: '2',
            title: 'Ethereum 2.0 Update Shows Promising Results',
            summary:
              'The latest Ethereum network upgrade demonstrates improved scalability and reduced energy consumption.',
            source: 'BlockchainDaily',
            publishedAt: '2024-01-15T09:15:00Z',
            url: '#',
            sentiment: 'positive',
            category: 'Ethereum',
          },
          {
            id: '3',
            title: 'Regulatory Changes Impact Crypto Market',
            summary:
              'New regulations in major markets are creating both challenges and opportunities for cryptocurrency adoption.',
            source: 'CryptoInsider',
            publishedAt: '2024-01-15T08:45:00Z',
            url: '#',
            sentiment: 'neutral',
            category: 'Regulation',
          },
          {
            id: '4',
            title: 'DeFi Protocols See Record Trading Volume',
            summary:
              'Decentralized finance platforms are experiencing unprecedented growth in user activity and trading volume.',
            source: 'DeFiNews',
            publishedAt: '2024-01-15T07:30:00Z',
            url: '#',
            sentiment: 'positive',
            category: 'DeFi',
          },
          {
            id: '5',
            title: 'NFT Market Shows Signs of Recovery',
            summary:
              'After a period of decline, the NFT market is showing renewed interest from collectors and investors.',
            source: 'NFTWeekly',
            publishedAt: '2024-01-15T06:20:00Z',
            url: '#',
            sentiment: 'positive',
            category: 'NFT',
          },
          {
            id: '6',
            title: 'Central Bank Digital Currencies Gain Momentum',
            summary:
              'More countries are exploring CBDCs as they seek to modernize their financial systems.',
            source: 'FinTechNews',
            publishedAt: '2024-01-15T05:10:00Z',
            url: '#',
            sentiment: 'neutral',
            category: 'CBDC',
          },
        ]
      },
      this.NEWS_CACHE_TTL
    )
  }

  async getStockNews(): Promise<NewsItem[]> {
    return withCache(
      `${CACHE_KEYS.NEWS_DATA}_stock`,
      async () => {
        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return [
          {
            id: '1',
            title: 'Tech Stocks Rally as AI Innovation Drives Market Growth',
            summary:
              'Major technology companies are leading the market rally with breakthrough developments in artificial intelligence.',
            source: 'MarketWatch',
            publishedAt: '2024-01-15T10:30:00Z',
            url: '#',
            sentiment: 'positive',
            category: 'Technology',
          },
          {
            id: '2',
            title: 'Federal Reserve Signals Potential Rate Cuts',
            summary:
              'The Federal Reserve indicates possible interest rate reductions in response to improving economic indicators.',
            source: 'Bloomberg',
            publishedAt: '2024-01-15T09:15:00Z',
            url: '#',
            sentiment: 'positive',
            category: 'Economy',
          },
          {
            id: '3',
            title: 'Earnings Season Kicks Off with Mixed Results',
            summary:
              'Corporate earnings reports show varied performance across different sectors of the economy.',
            source: 'Reuters',
            publishedAt: '2024-01-15T08:45:00Z',
            url: '#',
            sentiment: 'neutral',
            category: 'Earnings',
          },
          {
            id: '4',
            title: 'Green Energy Stocks Surge on Climate Policy',
            summary:
              'Renewable energy companies are experiencing significant growth following new environmental regulations.',
            source: 'CNBC',
            publishedAt: '2024-01-15T07:30:00Z',
            url: '#',
            sentiment: 'positive',
            category: 'Energy',
          },
          {
            id: '5',
            title: 'Healthcare Sector Faces Regulatory Challenges',
            summary:
              'Pharmaceutical companies are navigating new regulatory requirements while maintaining innovation.',
            source: 'Yahoo Finance',
            publishedAt: '2024-01-15T06:20:00Z',
            url: '#',
            sentiment: 'neutral',
            category: 'Healthcare',
          },
          {
            id: '6',
            title: 'Retail Sector Adapts to Changing Consumer Behavior',
            summary:
              'Traditional retailers are embracing digital transformation to meet evolving customer expectations.',
            source: 'Forbes',
            publishedAt: '2024-01-15T05:10:00Z',
            url: '#',
            sentiment: 'positive',
            category: 'Retail',
          },
        ]
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
