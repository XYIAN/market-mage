'use client'

import { cryptoService } from '@/services/cryptoService'

interface MarketStatsProps {
  marketStats: {
    totalMarketCap: number
    totalVolume: number
    averagePrice: number
    topPerformer: {
      symbol: string
      name: string
      price: string
      change: string
    }
    worstPerformer: {
      symbol: string
      name: string
      price: string
      change: string
    }
  }
  cryptoDataLength: number
}

export const MarketStats = ({
  marketStats,
  cryptoDataLength,
}: MarketStatsProps) => {
  return (
    <>
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
            {cryptoDataLength}
          </div>
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
    </>
  )
}
