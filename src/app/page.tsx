'use client'

import { NewsTicker } from '@/components/news-ticker'
import { useNewsTicker } from '@/hooks/useNewsTicker'
import { useStockData } from '@/hooks/useStockData'
import { useAIInsight } from '@/hooks/useAIInsight'
import { HeroSection } from '@/components/home/HeroSection'
import { FeatureCards } from '@/components/home/FeatureCards'
import { StatsSection } from '@/components/home/StatsSection'
import { AIInsightPreview } from '@/components/home/AIInsightPreview'
import { CallToAction } from '@/components/home/CallToAction'

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
        {stocks.length > 0 && <StatsSection />}

        {/* Latest AI Insight Preview */}
        {insight && <AIInsightPreview />}

        {/* Call to Action */}
        <CallToAction />
      </div>
    </div>
  )
}
