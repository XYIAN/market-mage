'use client'

import { useState, useEffect, useCallback } from 'react'
import { StockData } from '@/types'
import { apiUtils } from '@/utils/api'
import { storageUtils } from '@/utils/storage'

export const useStockData = () => {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStocks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const watchlist = storageUtils.getWatchlist()
      const symbols = watchlist.map((item) => item.symbol)

      if (symbols.length === 0) {
        setStocks([])
        return
      }

      const stockData = await apiUtils.fetchStockData(symbols)

      // Merge with watchlist data to get company names
      const enrichedData = stockData.map((stock) => {
        const watchlistItem = watchlist.find((w) => w.symbol === stock.symbol)
        return {
          ...stock,
          name: watchlistItem?.name || stock.symbol,
        }
      })

      setStocks(enrichedData)
      setLastUpdated(new Date())
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch stock data'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchStocks()
  }, [fetchStocks])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStocks()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [fetchStocks])

  // Refresh when user becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && lastUpdated) {
        const timeSinceUpdate = Date.now() - lastUpdated.getTime()
        const fiveMinutes = 5 * 60 * 1000

        if (timeSinceUpdate > fiveMinutes) {
          fetchStocks()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [fetchStocks, lastUpdated])

  return {
    stocks,
    loading,
    error,
    lastUpdated,
    refresh: fetchStocks,
  }
}
