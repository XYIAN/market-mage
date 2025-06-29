'use client'

import { useState, useEffect, useCallback } from 'react'
import { NewsCarousel, PopularInsights, MarketSentiment } from '@/components'
import { NewsItem } from '@/types'
import { newsService } from '@/services/newsService'

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

export default function MarketNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [insights, setInsights] = useState<PopularInsight[]>([])
  const [sentiment, setSentiment] = useState<MarketSentiment | null>(null)
  const [loading, setLoading] = useState(true)
  const [insightsLoading, setInsightsLoading] = useState(true)
  const [sentimentLoading, setSentimentLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await newsService.getStockNews()
      setNews(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch market news'
      setError(errorMessage)
      console.error('Error fetching market news:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchInsights = useCallback(async () => {
    setInsightsLoading(true)
    try {
      const data = await newsService.getPopularInsights()
      setInsights(data)
    } catch (err) {
      console.error('Error fetching insights:', err)
    } finally {
      setInsightsLoading(false)
    }
  }, [])

  const fetchSentiment = useCallback(async () => {
    setSentimentLoading(true)
    try {
      const data = await newsService.getMarketSentiment()
      setSentiment(data)
    } catch (err) {
      console.error('Error fetching sentiment:', err)
    } finally {
      setSentimentLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNews()
    fetchInsights()
    fetchSentiment()
  }, [fetchNews, fetchInsights, fetchSentiment])

  if (error) {
    return (
      <div className="w-full">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Market News</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">Error loading news: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Market News & Insights</h1>
          <p className="text-gray-400">
            Stay updated with the latest stock market news, trends, and insights
          </p>
        </div>

        <div className="w-full">
          <NewsCarousel
            news={news}
            loading={loading}
            title="Latest Market News"
          />
        </div>

        <div className="w-full">
          <MarketSentiment
            sentiment={
              sentiment || {
                overall: 'neutral',
                score: 0,
                volume: 0,
                volatility: 0,
                sectors: {
                  technology: 0,
                  healthcare: 0,
                  finance: 0,
                  energy: 0,
                  consumer: 0,
                },
              }
            }
            loading={sentimentLoading}
          />
        </div>

        <div className="w-full">
          <PopularInsights insights={insights} loading={insightsLoading} />
        </div>
      </div>
    </div>
  )
}
