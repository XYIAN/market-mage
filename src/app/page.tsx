'use client'

import { Card } from 'primereact/card'
import { NewsTicker } from '@/components/news-ticker'
import { HeroSection } from '@/components/hero-section'
import { FeatureCards } from '@/components/feature-cards'
import { useNewsTicker } from '@/hooks/useNewsTicker'
import { useStockData } from '@/hooks/useStockData'
import { useAIInsight } from '@/hooks/useAIInsight'

export default function HomePage() {
  const { news } = useNewsTicker()
  const { stocks } = useStockData()
  const { insight } = useAIInsight()

  return (
    <div className="min-h-screen">
      {/* Sticky News Ticker */}
      <div className="sticky top-0 z-50">
        <NewsTicker news={news} />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-6">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Grid */}
        <FeatureCards />

        {/* Quick Stats */}
        {stocks.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 justify-items-center">
            <Card className="w-full max-w-xs text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {stocks.length}
              </div>
              <div className="text-sm">Stocks Tracked</div>
            </Card>
            <Card className="w-full max-w-xs text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">
                {stocks.filter((s) => s.change >= 0).length}
              </div>
              <div className="text-sm">Gaining</div>
            </Card>
            <Card className="w-full max-w-xs text-center">
              <div className="text-2xl font-bold text-red-500 mb-1">
                {stocks.filter((s) => s.change < 0).length}
              </div>
              <div className="text-sm">Declining</div>
            </Card>
            <Card className="w-full max-w-xs text-center">
              <div
                className={`text-2xl font-bold mb-1 ${
                  stocks.reduce((sum, s) => sum + s.changePercent, 0) /
                    stocks.length >=
                  0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {stocks.reduce((sum, s) => sum + s.changePercent, 0) /
                  stocks.length >=
                0
                  ? '+'
                  : ''}
                {(
                  stocks.reduce((sum, s) => sum + s.changePercent, 0) /
                  stocks.length
                ).toFixed(2)}
                %
              </div>
              <div className="text-sm">Avg Change</div>
            </Card>
          </div>
        )}

        {/* Latest AI Insight Preview */}
        {insight && (
          <div className="flex justify-center mb-8">
            <Card className="w-full max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <i className="pi pi-lightbulb text-primary text-xl"></i>
                <h3 className="text-xl font-semibold">
                  Today&apos;s AI Insight
                </h3>
              </div>
              <p className="mb-4 line-clamp-3">
                {insight.content.substring(0, 200)}...
              </p>
            </Card>
          </div>
        )}

        {/* Call to Action */}
        <Card className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Start Trading Smarter?
          </h2>
          <p className="mb-6">
            Join thousands of traders who are already using AI-powered insights
            to make better investment decisions.
          </p>
        </Card>
      </div>
    </div>
  )
}
