'use client'

import { CryptoNewsCarousel, MarketOverview } from '@/components'
import { useGlobalData } from '@/providers/GlobalDataProvider'

export default function CryptoNewsPage() {
  const { cryptoNews, newsLoading } = useGlobalData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-yellow-500 to-red-400 bg-clip-text text-transparent">
            Crypto News & Market Analysis
          </h1>
          <p className="text-gray-300 text-lg">
            Stay updated with the latest cryptocurrency news, market trends, and
            insights
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Crypto Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Market Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">DeFi Insights</span>
            </div>
          </div>
        </div>

        {/* Market Overview */}
        <div className="w-full backdrop-blur-sm bg-black/20 rounded-xl border border-orange-500/20 p-6">
          <MarketOverview />
        </div>

        {/* News Carousel - Full Width */}
        <div className="w-full backdrop-blur-sm bg-black/20 rounded-xl border border-yellow-500/20 p-6">
          <CryptoNewsCarousel />
        </div>
      </div>
    </div>
  )
}
