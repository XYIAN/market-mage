'use client'

import { useMemo } from 'react'
import { useCoinbaseData } from '@/hooks/useCoinbaseData'
import { MarketDistributionBar } from './MarketDistributionBar'
import { cryptoService } from '@/services/cryptoService'

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col items-center justify-center p-3 border-round surface-border border-1 bg-black/40 rounded-lg">
          <div className="text-xs text-gray-300 mb-1">Total Market Cap</div>
          <div className="text-xl font-bold text-blue-100">
            {cryptoService.formatCurrency(marketStats.totalMarketCap)}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-3 border-round surface-border border-1 bg-black/40 rounded-lg">
          <div className="text-xs text-gray-300 mb-1">24h Volume</div>
          <div className="text-xl font-bold text-blue-100">
            {cryptoService.formatCurrency(marketStats.totalVolume)}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-3 border-round surface-border border-1 bg-black/40 rounded-lg">
          <div className="text-xs text-gray-300 mb-1">Avg Price</div>
          <div className="text-xl font-bold text-blue-100">
            ${marketStats.averagePrice.toFixed(2)}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-3 border-round surface-border border-1 bg-black/40 rounded-lg">
          <div className="text-xs text-gray-300 mb-1">Active Pairs</div>
          <div className="text-xl font-bold text-blue-100">
            {cryptoData.length}
          </div>
        </div>
      </div>

      <div className="mb-2 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2 text-blue-200 tracking-wide">
          Market Distribution
        </h3>
        <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto">
          {marketDistribution.map((item) => (
            <MarketDistributionBar
              key={item.symbol}
              label={item.symbol}
              percentage={item.percentage}
              value={item.value}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-3 border-round surface-border border-1 bg-black/30 rounded-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2 text-blue-200">
            Top Performer
          </h3>
          <div className="flex align-items-center justify-content-between mb-2 w-full">
            <span className="font-semibold text-blue-100">
              {marketStats.topPerformer.symbol}
            </span>
            <span className="text-green-400 font-bold">
              {marketStats.topPerformer.change}
            </span>
          </div>
          <div className="text-xs text-gray-300 mb-2 w-full text-left">
            {marketStats.topPerformer.name}
          </div>
          <div className="text-lg font-bold text-blue-100 w-full text-left">
            ${marketStats.topPerformer.price}
          </div>
        </div>
        <div className="p-3 border-round surface-border border-1 bg-black/30 rounded-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2 text-blue-200">
            Worst Performer
          </h3>
          <div className="flex align-items-center justify-content-between mb-2 w-full">
            <span className="font-semibold text-blue-100">
              {marketStats.worstPerformer.symbol}
            </span>
            <span className="text-red-400 font-bold">
              {marketStats.worstPerformer.change}
            </span>
          </div>
          <div className="text-xs text-gray-300 mb-2 w-full text-left">
            {marketStats.worstPerformer.name}
          </div>
          <div className="text-lg font-bold text-blue-100 w-full text-left">
            ${marketStats.worstPerformer.price}
          </div>
        </div>
      </div>
    </div>
  )
}
