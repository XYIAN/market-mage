'use client'

import { useState, useEffect, useCallback } from 'react'
import { NewsItem } from '@/types'
import { apiUtils } from '@/utils/api'

export const useNewsTicker = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = useCallback(async () => {
    setLoading(true)
    setError(null)
    console.log('Fetching news data...')

    try {
      const newsData = await apiUtils.fetchNews()
      console.log('News data received:', newsData)
      setNews(newsData)
    } catch (err) {
      console.error('Error fetching news:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch news')

      // Set mock news data if API fails
      const mockNews: NewsItem[] = [
        {
          id: 'mock-1',
          title: 'Market Update: Tech Stocks Rally on Strong Earnings',
          summary:
            'Major technology companies report better-than-expected quarterly results.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Market News',
          sentiment: 'positive',
          category: 'Technology',
          image: undefined,
        },
        {
          id: 'mock-2',
          title: 'Federal Reserve Signals Potential Rate Changes',
          summary:
            'Central bank officials hint at possible adjustments to monetary policy.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Financial Times',
          sentiment: 'neutral',
          category: 'Economy',
          image: undefined,
        },
        {
          id: 'mock-3',
          title: 'Cryptocurrency Market Shows Signs of Recovery',
          summary:
            'Bitcoin and Ethereum lead digital asset rally as institutional adoption grows.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Crypto Daily',
          sentiment: 'positive',
          category: 'Cryptocurrency',
          image: undefined,
        },
        {
          id: 'mock-4',
          title: 'Oil Prices Stabilize After Recent Volatility',
          summary:
            'Crude oil markets find equilibrium following weeks of uncertainty.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Energy Report',
          sentiment: 'neutral',
          category: 'Energy',
          image: undefined,
        },
        {
          id: 'mock-5',
          title: 'AI-Powered Trading Platforms Gain Traction',
          summary:
            'Financial institutions increasingly adopt machine learning algorithms.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Tech Finance',
          sentiment: 'positive',
          category: 'Technology',
          image: undefined,
        },
      ]
      setNews(mockNews)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  // Refresh news every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNews()
    }, 30 * 60 * 1000) // 30 minutes

    return () => clearInterval(interval)
  }, [fetchNews])

  return {
    news,
    loading,
    error,
    refresh: fetchNews,
  }
}
