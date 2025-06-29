'use client'

import { NewsTicker } from '@/components/news-ticker'
import { HeroSection } from '@/components/hero-section'
import { FeatureCards } from '@/components/feature-cards'
import { StatsSection } from '@/components/stats-section'
import { AIInsightPreview } from '@/components/ai-insight-preview'
import { CallToAction } from '@/components/call-to-action'
import { useNewsTicker } from '@/hooks/useNewsTicker'
import { useStockData } from '@/hooks/useStockData'
import { useAIInsight } from '@/hooks/useAIInsight'
import { FEATURE_CARDS } from '@/data/cards'

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
        <FeatureCards cards={FEATURE_CARDS} />

        {/* Quick Stats */}
        <StatsSection stocks={stocks} />

        {/* Latest AI Insight Preview */}
        <AIInsightPreview insight={insight} />

        {/* Call to Action */}
        <CallToAction />
      </div>
    </div>
  )
}
