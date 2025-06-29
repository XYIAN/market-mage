'use client'

import { useState, useEffect, useCallback } from 'react'
import { CryptoData, MarketStats } from '@/types'
import { cryptoService } from '@/services/cryptoService'
import { useWizardToast } from '@/components/layout/WizardToastProvider'
import { createWizardToast } from '@/utils/toast'

export const useCoinbaseData = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { show } = useWizardToast()

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await cryptoService.getCryptoData()
      setCryptoData(data)

      // Calculate market stats
      if (data.length > 0) {
        const totalMarketCap = data.reduce(
          (sum, crypto) => sum + crypto.marketCap,
          0
        )
        const totalVolume = data.reduce(
          (sum, crypto) => sum + parseFloat(crypto.volume.replace(/,/g, '')),
          0
        )
        const averagePrice =
          data.reduce((sum, crypto) => sum + parseFloat(crypto.price), 0) /
          data.length

        // Find top and worst performers
        const sortedByChange = [...data].sort((a, b) => {
          const changeA = parseFloat(a.change.replace(/[+%]/g, ''))
          const changeB = parseFloat(b.change.replace(/[+%]/g, ''))
          return changeB - changeA
        })

        const topPerformer = sortedByChange[0]
        const worstPerformer = sortedByChange[sortedByChange.length - 1]

        setMarketStats({
          totalMarketCap,
          totalVolume,
          averagePrice,
          topPerformer: {
            symbol: topPerformer.symbol,
            name: topPerformer.name,
            price: topPerformer.price,
            change: topPerformer.change,
          },
          worstPerformer: {
            symbol: worstPerformer.symbol,
            name: worstPerformer.name,
            price: worstPerformer.price,
            change: worstPerformer.change,
          },
        })
      }

      show(createWizardToast({ action: 'crypto', success: true }))
    } catch (err) {
      console.error('Error fetching crypto data:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to fetch crypto data'
      )
      show(createWizardToast({ action: 'crypto', success: false }))
    } finally {
      setLoading(false)
    }
  }, [show])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Refresh data every 10 minutes (matches crypto service cache)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData()
    }, 10 * 60 * 1000) // 10 minutes

    return () => clearInterval(interval)
  }, [fetchData])

  return {
    cryptoData,
    marketStats,
    loading,
    error,
    refresh: fetchData,
  }
}
