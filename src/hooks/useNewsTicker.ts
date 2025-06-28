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
		
		try {
			const newsData = await apiUtils.fetchNews()
			setNews(newsData)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch news')
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
		refresh: fetchNews
	}
} 