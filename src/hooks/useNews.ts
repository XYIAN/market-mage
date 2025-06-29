import { useState, useEffect } from 'react'
import { NewsItem } from '@/types'
import { apiUtils } from '@/utils/api'

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    apiUtils
      .fetchNews()
      .then((data) => {
        if (mounted) {
          setNews(data)
          setError(null)
        }
      })
      .catch(() => {
        if (mounted) setError('Failed to load news')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return { news, loading, error }
}
