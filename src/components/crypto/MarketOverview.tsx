'use client'

import { useMemo } from 'react'
import { useCoinbaseData } from '@/hooks/useCoinbaseData'
import { MarketStats, MarketDistribution } from './market-overview'

export const MarketOverview = () => {
  const { cryptoData, marketStats, loading, error } = useCoinbaseData()

  // Memoize market distribution calculations
  const marketDistribution = useMemo(() => {
    if (!marketStats || !cryptoData.length) return []

    return cryptoData.slice(0, 5).map((crypto) => {
      const percentage = (crypto.marketCap / marketStats.totalMarketCap) * 100
      return {
        symbol: crypto.symbol,
        percentage,
        value: `${percentage.toFixed(1)}%`,
      }
    })
  }, [cryptoData, marketStats])

  if (loading) {
    return (
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold dark-blue-glow">
          Market Overview
        </h2>
      </div>
    )
  }

  if (error || !marketStats) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2 dark-blue-glow">
          Market Overview
        </h2>
        <p className="text-gray-400">{error || 'Unable to load market data'}</p>
      </div>
    )
  }

  return (
    <div className="market-distribution-section p-4 rounded-lg">
      <div className="flex flex-col items-center justify-center text-center mb-4 space-y-1">
        <h2 className="text-2xl font-bold tracking-wide dark-blue-glow">
          Market Overview
        </h2>
        <p className="text-gray-300 text-sm max-w-xl mx-auto">
          Live snapshot of the crypto market powered by Coinbase. See top
          performers, market cap, and distribution.{' '}
          <span className="text-blue-400">Updated in real time.</span>
        </p>
      </div>

      <MarketStats
        marketStats={marketStats}
        cryptoDataLength={cryptoData.length}
      />

      <MarketDistribution marketDistribution={marketDistribution} />
    </div>
  )
}
