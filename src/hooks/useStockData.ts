'use client'

import { useState, useEffect, useCallback } from 'react'
import { StockData } from '@/types'
import { apiUtils } from '@/utils/api'
import { useWizardToast } from '@/components/layout/WizardToastProvider'
import { createWizardToast } from '@/utils/toast'

export const useStockData = (symbols: string[]) => {
  const [stockData, setStockData] = useState<StockData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { show } = useWizardToast()

  const fetchStockData = useCallback(async () => {
    if (!symbols.length) return

    setLoading(true)
    setError(null)

    try {
      const data = await apiUtils.fetchStockData(symbols)
      setStockData(data)
      show(
        createWizardToast({
          action: 'stock',
          success: true,
          customMessage: `📈 Stock prophecy revealed! ${symbols.length} symbols updated.`,
        })
      )
    } catch (err) {
      console.error(`Error fetching stock data for ${symbols.join(', ')}:`, err)
      setError(
        err instanceof Error ? err.message : 'Failed to fetch stock data'
      )
      show(
        createWizardToast({
          action: 'stock',
          success: false,
          customMessage: `📉 The market oracle is silent. Stock data unavailable.`,
        })
      )
    } finally {
      setLoading(false)
    }
  }, [symbols, show])

  useEffect(() => {
    fetchStockData()
  }, [fetchStockData])

  return {
    stockData,
    loading,
    error,
    refresh: fetchStockData,
  }
}
