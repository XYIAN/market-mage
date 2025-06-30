'use client'

import { useState, useEffect, useCallback } from 'react'
import { NewsCarousel, PopularInsights, MarketSentiment } from '@/components'
import { NewsItem } from '@/types'
import { newsService } from '@/services/newsService'
import { useGlobalData } from '@/providers/GlobalDataProvider'

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
  const { stockNews, newsLoading, refreshNews } = useGlobalData()
  const [insights, setInsights] = useState<PopularInsight[]>([])
  const [sentiment, setSentiment] = useState<MarketSentiment | null>(null)
  const [insightsLoading, setInsightsLoading] = useState(true)
  const [sentimentLoading, setSentimentLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    fetchInsights()
    fetchSentiment()
  }, [fetchInsights, fetchSentiment])

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center mb-4 p-8">
          <h2 className="text-xl font-semibold text-blue-200">Market News</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">Error loading news: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Market News & Insights
          </h1>
          <p className="text-gray-300 text-lg">
            Stay updated with the latest stock market news, trends, and insights
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Live Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">AI Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Market Sentiment</span>
            </div>
          </div>
        </div>

        <div className="w-full backdrop-blur-sm bg-black/20 rounded-xl border border-blue-500/20 p-6">
          <NewsCarousel
            news={stockNews}
            loading={newsLoading}
            title="Latest Market News"
          />
        </div>

        <div className="w-full backdrop-blur-sm bg-black/20 rounded-xl border border-purple-500/20 p-6">
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

        <div className="w-full backdrop-blur-sm bg-black/20 rounded-xl border border-cyan-500/20 p-6">
          <PopularInsights insights={insights} loading={insightsLoading} />
        </div>
      </div>
    </div>
  )
}
