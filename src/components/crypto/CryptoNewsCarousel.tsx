'use client'

import { useState, useEffect, useCallback } from 'react'
import { NewsCarousel } from '@/components'
import { NewsItem } from '@/types'
import { newsService } from '@/services/newsService'

export const CryptoNewsCarousel = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await newsService.getCryptoNews()
      setNews(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch crypto news'
      setError(errorMessage)
      console.error('Error fetching crypto news:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  if (error) {
    return (
      <div className="w-full">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Latest Crypto News</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">Error loading news: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <NewsCarousel news={news} loading={loading} title="Latest Crypto News" />
  )
}
