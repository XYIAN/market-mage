'use client'

import { useState, useEffect, useCallback } from 'react'
import { NewsItem } from '@/types'
import { apiUtils } from '@/utils/api'
import { useWizardToast } from '@/components/layout/AppContent'
import { createWizardToast } from '@/utils/toast'

export const useNewsTicker = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { show } = useWizardToast()

  const fetchNews = useCallback(async () => {
    setLoading(true)
    setError(null)
    console.log('Fetching news data...')

    try {
      const newsData = await apiUtils.fetchNews()
      console.log('News data received:', newsData)
      setNews(newsData)
      show(createWizardToast({ action: 'news', success: true }))
    } catch (err) {
      console.error('Error fetching news:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch news')
      show(createWizardToast({ action: 'news', success: false }))

      // Set mock news data if API fails
      const mockNews: NewsItem[] = [
        {
          id: 'mock-1',
          title: 'Market Update: Tech Stocks Rally on Strong Earnings',
          description:
            'Major technology companies report better-than-expected quarterly results.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Market News',
          sentiment: 'positive',
        },
        {
          id: 'mock-2',
          title: 'Federal Reserve Signals Potential Rate Changes',
          description:
            'Central bank officials hint at possible adjustments to monetary policy.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Financial Times',
          sentiment: 'neutral',
        },
        {
          id: 'mock-3',
          title: 'Cryptocurrency Market Shows Signs of Recovery',
          description:
            'Bitcoin and Ethereum lead digital asset rally as institutional adoption grows.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Crypto Daily',
          sentiment: 'positive',
        },
        {
          id: 'mock-4',
          title: 'Oil Prices Stabilize After Recent Volatility',
          description:
            'Crude oil markets find equilibrium following weeks of uncertainty.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Energy Report',
          sentiment: 'neutral',
        },
        {
          id: 'mock-5',
          title: 'AI-Powered Trading Platforms Gain Traction',
          description:
            'Financial institutions increasingly adopt machine learning algorithms.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Tech Finance',
          sentiment: 'positive',
        },
      ]
      setNews(mockNews)
    } finally {
      setLoading(false)
    }
  }, [show])

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
