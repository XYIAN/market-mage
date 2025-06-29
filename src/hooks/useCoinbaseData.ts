import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  cryptoService,
  type CryptoData,
  type MarketStats,
} from '@/services/cryptoService'

interface UseCryptoDataReturn {
  cryptoData: CryptoData[]
  marketStats: MarketStats | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  invalidateCache: () => void
}

export const useCoinbaseData = (): UseCryptoDataReturn => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize market stats calculation
  const marketStats = useMemo(() => {
    return cryptoService.calculateMarketStats(cryptoData)
  }, [cryptoData])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await cryptoService.getCryptoData()
      setCryptoData(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch crypto data'
      setError(errorMessage)
      console.error('Error in useCoinbaseData:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  const invalidateCache = useCallback(() => {
    cryptoService.invalidateCache()
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    cryptoData,
    marketStats,
    loading,
    error,
    refetch,
    invalidateCache,
  }
}
