'use client'

import { CryptoNewsCarousel, MarketOverview } from '@/components'

export default function CryptoNewsPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Crypto News & Market Analysis
          </h1>
          <p className="text-gray-400">
            Stay updated with the latest cryptocurrency news, market trends, and
            insights
          </p>
        </div>

        {/* Market Overview */}
        <MarketOverview />

        {/* News Carousel - Full Width */}
        <div className="w-full">
          <CryptoNewsCarousel />
        </div>
      </div>
    </div>
  )
}
