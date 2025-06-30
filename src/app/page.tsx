import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Market-Mage | AI-Powered Stock & Crypto Dashboard',
  description:
    'Advanced AI-powered trading dashboard with real-time stock and cryptocurrency data, market insights, and intelligent trading suggestions. Track your portfolio, get AI oracle insights, and stay ahead of the markets.',
  keywords:
    'stock dashboard, crypto dashboard, AI trading, market analysis, portfolio tracker, trading insights, real-time data, cryptocurrency, stocks, investment tools',
  openGraph: {
    title: 'Market-Mage | AI-Powered Stock & Crypto Dashboard',
    description:
      'Advanced AI-powered trading dashboard with real-time stock and cryptocurrency data, market insights, and intelligent trading suggestions.',
    type: 'website',
    url: 'https://market-mage.netlify.app',
    siteName: 'Market-Mage',
    images: [
      {
        url: '/icon-mm-1.png',
        width: 1200,
        height: 630,
        alt: 'Market-Mage Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Market-Mage | AI-Powered Stock & Crypto Dashboard',
    description:
      'Advanced AI-powered trading dashboard with real-time stock and cryptocurrency data, market insights, and intelligent trading suggestions.',
    images: ['/icon-mm-1.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://market-mage.netlify.app',
  },
}

;('use client')

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
