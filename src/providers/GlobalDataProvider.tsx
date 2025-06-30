'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { useWizardToast } from '@/components/layout/WizardToastProvider'
import { createClient } from '@/lib/supabase/client'
import { NewsItem } from '@/types'

interface GlobalDataContextType {
  // News data
  globalNews: NewsItem[]
  cryptoNews: NewsItem[]
  stockNews: NewsItem[]
  newsLoading: boolean

  // Market data
  globalCryptoData: any[]
  globalStockData: any[]
  marketLoading: boolean

  // Cache status
  lastNewsUpdate: Date | null
  lastMarketUpdate: Date | null

  // Refresh functions
  refreshNews: () => Promise<void>
  refreshMarketData: () => Promise<void>
  loadMarketData: () => Promise<void>
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(
  undefined
)

export const useGlobalData = () => {
  const context = useContext(GlobalDataContext)
  if (!context) {
    throw new Error('useGlobalData must be used within a GlobalDataProvider')
  }
  return context
}

interface GlobalDataProviderProps {
  children: React.ReactNode
}

export const GlobalDataProvider: React.FC<GlobalDataProviderProps> = ({
  children,
}) => {
  const [globalNews, setGlobalNews] = useState<NewsItem[]>([])
  const [cryptoNews, setCryptoNews] = useState<NewsItem[]>([])
  const [stockNews, setStockNews] = useState<NewsItem[]>([])
  const [globalCryptoData, setGlobalCryptoData] = useState<any[]>([])
  const [globalStockData, setGlobalStockData] = useState<any[]>([])

  const [newsLoading, setNewsLoading] = useState(false)
  const [marketLoading, setMarketLoading] = useState(false)

  const [lastNewsUpdate, setLastNewsUpdate] = useState<Date | null>(null)
  const [lastMarketUpdate, setLastMarketUpdate] = useState<Date | null>(null)

  const [marketDataLoaded, setMarketDataLoaded] = useState(false)

  const supabase = createClient()
  const { show } = useWizardToast()

  // Enhanced console logging
  const logWithTimestamp = useCallback((message: string, data?: any) => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [GlobalDataProvider] ${message}`, data || '')
  }, [])

  // Check if cache is valid (2 hours for news, 5 minutes for market data)
  const isCacheValid = useCallback(
    (lastUpdate: Date | null, cacheDuration: number): boolean => {
      if (!lastUpdate) return false
      const now = new Date()
      const timeDiff = now.getTime() - lastUpdate.getTime()
      return timeDiff < cacheDuration
    },
    []
  )

  // Fetch news data with caching
  const fetchNewsData = useCallback(
    async (forceRefresh = false) => {
      const NEWS_CACHE_DURATION = 2 * 60 * 60 * 1000 // 2 hours

      if (!forceRefresh && isCacheValid(lastNewsUpdate, NEWS_CACHE_DURATION)) {
        logWithTimestamp('Using cached news data', {
          lastUpdate: lastNewsUpdate,
        })
        return
      }

      setNewsLoading(true)
      logWithTimestamp('Fetching fresh news data...')

      try {
        // Check Supabase cache first
        const { data: cachedNews, error: cacheError } = await supabase
          .from('api_cache')
          .select('data, expires_at')
          .eq('cache_key', 'global_news')
          .single()

        if (cachedNews && new Date(cachedNews.expires_at) > new Date()) {
          logWithTimestamp('Using Supabase cached news data')
          const newsData = cachedNews.data
          setGlobalNews(newsData.all || [])
          setCryptoNews(newsData.crypto || [])
          setStockNews(newsData.stocks || [])
          setLastNewsUpdate(new Date())
          show({
            severity: 'info',
            summary: 'News Updated',
            detail: `Loaded ${
              newsData.all?.length || 0
            } news articles from cache`,
            life: 3000,
            closable: true,
          })
          return
        }

        // Fetch fresh news data
        logWithTimestamp('Fetching fresh news from APIs...')

        // Fetch from multiple sources
        const [yahooResponse, cryptoResponse] = await Promise.allSettled([
          fetch('/api/news?type=stocks'),
          fetch('/api/crypto/news'),
        ])

        const allNews: NewsItem[] = []
        const cryptoNewsData: NewsItem[] = []
        const stockNewsData: NewsItem[] = []

        // Process Yahoo Finance news
        if (yahooResponse.status === 'fulfilled' && yahooResponse.value.ok) {
          const yahooData = await yahooResponse.value.json()
          stockNewsData.push(...(yahooData.articles || []))
          allNews.push(...(yahooData.articles || []))
          logWithTimestamp('Yahoo Finance news fetched', {
            count: yahooData.articles?.length,
          })
        }

        // Process crypto news
        if (cryptoResponse.status === 'fulfilled' && cryptoResponse.value.ok) {
          const cryptoData = await cryptoResponse.value.json()
          cryptoNewsData.push(...(cryptoData.articles || []))
          allNews.push(...(cryptoData.articles || []))
          logWithTimestamp('Crypto news fetched', {
            count: cryptoData.articles?.length,
          })
        }

        // Sort by date and limit to prevent overwhelming
        const sortedNews = allNews
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          )
          .slice(0, 50)

        const sortedCryptoNews = cryptoNewsData
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          )
          .slice(0, 20)

        const sortedStockNews = stockNewsData
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          )
          .slice(0, 20)

        // Update state
        setGlobalNews(sortedNews)
        setCryptoNews(sortedCryptoNews)
        setStockNews(sortedStockNews)
        setLastNewsUpdate(new Date())

        // Cache in Supabase
        const cacheData = {
          all: sortedNews,
          crypto: sortedCryptoNews,
          stocks: sortedStockNews,
        }

        const expiresAt = new Date(Date.now() + NEWS_CACHE_DURATION)

        await supabase.from('api_cache').upsert({
          cache_key: 'global_news',
          data: cacheData,
          expires_at: expiresAt.toISOString(),
        })

        logWithTimestamp('News data cached successfully', {
          total: sortedNews.length,
          crypto: sortedCryptoNews.length,
          stocks: sortedStockNews.length,
        })

        show({
          severity: 'success',
          summary: 'News Updated',
          detail: `Fetched ${sortedNews.length} fresh news articles`,
          life: 3000,
          closable: true,
        })
      } catch (error) {
        logWithTimestamp('Error fetching news data', error)
        show({
          severity: 'error',
          summary: 'News Error',
          detail: 'Failed to fetch news data. Using cached data if available.',
          life: 5000,
          closable: true,
        })
      } finally {
        setNewsLoading(false)
      }
    },
    [lastNewsUpdate, isCacheValid, supabase, show, logWithTimestamp]
  )

  // Fetch market data with caching (only when requested)
  const fetchMarketData = useCallback(
    async (forceRefresh = false) => {
      const MARKET_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

      if (
        !forceRefresh &&
        isCacheValid(lastMarketUpdate, MARKET_CACHE_DURATION)
      ) {
        logWithTimestamp('Using cached market data', {
          lastUpdate: lastMarketUpdate,
        })
        return
      }

      setMarketLoading(true)
      logWithTimestamp('Fetching fresh market data...')

      try {
        // Check Supabase cache first
        const { data: cachedMarket, error: cacheError } = await supabase
          .from('api_cache')
          .select('data, expires_at')
          .eq('cache_key', 'global_market_data')
          .single()

        if (cachedMarket && new Date(cachedMarket.expires_at) > new Date()) {
          logWithTimestamp('Using Supabase cached market data')
          const marketData = cachedMarket.data
          setGlobalCryptoData(marketData.crypto || [])
          setGlobalStockData(marketData.stocks || [])
          setLastMarketUpdate(new Date())
          show({
            severity: 'info',
            summary: 'Market Data Updated',
            detail: 'Loaded market data from cache',
            life: 2000,
            closable: true,
          })
          return
        }

        // Fetch fresh market data
        logWithTimestamp('Fetching fresh market data from APIs...')

        const [cryptoResponse, stockResponse] = await Promise.allSettled([
          fetch('/api/crypto/coingecko'),
          fetch('/api/market/stocks'),
        ])

        let cryptoData: any[] = []
        let stockData: any[] = []

        // Process crypto data
        if (cryptoResponse.status === 'fulfilled' && cryptoResponse.value.ok) {
          const response = await cryptoResponse.value.json()
          cryptoData = response.data || []
          logWithTimestamp('Crypto data fetched', { count: cryptoData.length })
        }

        // Process stock data
        if (stockResponse.status === 'fulfilled' && stockResponse.value.ok) {
          const response = await stockResponse.value.json()
          stockData = response.data || []
          logWithTimestamp('Stock data fetched', { count: stockData.length })
        }

        // Update state
        setGlobalCryptoData(cryptoData)
        setGlobalStockData(stockData)
        setLastMarketUpdate(new Date())

        // Cache in Supabase
        const cacheData = {
          crypto: cryptoData,
          stocks: stockData,
        }

        const expiresAt = new Date(Date.now() + MARKET_CACHE_DURATION)

        await supabase.from('api_cache').upsert({
          cache_key: 'global_market_data',
          data: cacheData,
          expires_at: expiresAt.toISOString(),
        })

        logWithTimestamp('Market data cached successfully', {
          crypto: cryptoData.length,
          stocks: stockData.length,
        })

        show({
          severity: 'success',
          summary: 'Market Data Updated',
          detail: `Fetched fresh market data for ${
            cryptoData.length + stockData.length
          } assets`,
          life: 3000,
          closable: true,
        })
      } catch (error) {
        logWithTimestamp('Error fetching market data', error)
        show({
          severity: 'error',
          summary: 'Market Data Error',
          detail:
            'Failed to fetch market data. Using cached data if available.',
          life: 5000,
          closable: true,
        })
      } finally {
        setMarketLoading(false)
      }
    },
    [lastMarketUpdate, isCacheValid, supabase, show, logWithTimestamp]
  )

  // Load market data on demand (lazy loading)
  const loadMarketData = useCallback(async () => {
    if (!marketDataLoaded) {
      logWithTimestamp('Loading market data on demand')
      setMarketDataLoaded(true)
      await fetchMarketData()
    }
  }, [marketDataLoaded, fetchMarketData, logWithTimestamp])

  // Refresh functions
  const refreshNews = useCallback(async () => {
    logWithTimestamp('Manual news refresh requested')
    await fetchNewsData(true)
  }, [fetchNewsData, logWithTimestamp])

  const refreshMarketData = useCallback(async () => {
    logWithTimestamp('Manual market data refresh requested')
    await fetchMarketData(true)
  }, [fetchMarketData, logWithTimestamp])

  // Initialize only news data on mount (lazy loading)
  useEffect(() => {
    logWithTimestamp('GlobalDataProvider initialized - loading news only')

    // Load only news data initially
    fetchNewsData()

    // Set up periodic news refresh only
    const newsInterval = setInterval(() => {
      logWithTimestamp('Periodic news refresh triggered')
      fetchNewsData()
    }, 2 * 60 * 60 * 1000) // 2 hours

    return () => {
      clearInterval(newsInterval)
      logWithTimestamp('GlobalDataProvider cleanup')
    }
  }, [fetchNewsData, logWithTimestamp])

  const value: GlobalDataContextType = {
    globalNews,
    cryptoNews,
    stockNews,
    newsLoading,
    globalCryptoData,
    globalStockData,
    marketLoading,
    lastNewsUpdate,
    lastMarketUpdate,
    refreshNews,
    refreshMarketData,
    loadMarketData,
  }

  return (
    <GlobalDataContext.Provider value={value}>
      {children}
    </GlobalDataContext.Provider>
  )
}
