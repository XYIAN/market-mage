'use client'

import {
  HeroSection,
  FeatureCards,
  StatsSection,
  AIInsightPreview,
  CallToAction,
  UserMetrics,
} from '@/components'
import { useStockData } from '@/hooks/useStockData'
import { useAIInsight } from '@/hooks/useAIInsight'

export default function HomePage() {
  const { stockData } = useStockData([])
  const { insight } = useAIInsight()

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-6">
        {/* Hero Section */}
        <HeroSection />

        {/* User Metrics */}
        <UserMetrics />

        {/* Features Grid */}
        <FeatureCards />

        {/* Quick Stats */}
        {stockData.length > 0 && <StatsSection />}

        {/* Latest AI Insight Preview */}
        {insight && <AIInsightPreview />}

        {/* Call to Action */}
        <CallToAction />
      </div>
    </div>
  )
}
