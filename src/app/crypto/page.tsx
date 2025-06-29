'use client'

import { Card } from 'primereact/card'
import {
  TopCryptocurrencies,
  CryptoNewsCarousel,
  MarketOverview,
  TradingInsights,
} from '@/components'
import { DashboardTitle } from '@/components/layout/DashboardTitle'

// Separate wrapper components for each section
const TopCryptocurrenciesSection = () => (
  <Card className="space-card w-full max-w-4xl">
    <TopCryptocurrencies />
  </Card>
)

const MarketOverviewSection = () => (
  <Card className="space-card w-full max-w-4xl">
    <MarketOverview />
  </Card>
)

const TradingInsightsSection = () => (
  <Card className="space-card w-full max-w-4xl">
    <TradingInsights />
  </Card>
)

const CryptoNewsSection = () => (
  <Card className="space-card w-full max-w-6xl">
    <CryptoNewsCarousel />
  </Card>
)

export default function CryptoDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-8">
      {/* Dashboard Title */}
      <DashboardTitle
        title="Crypto Dashboard"
        subtitle="Track cryptocurrencies and get market insights"
        showRefreshButton={false}
      />

      {/* Top Cryptocurrencies Section */}
      <TopCryptocurrenciesSection />

      {/* Market Overview Section */}
      <MarketOverviewSection />

      {/* Trading Insights Section */}
      <TradingInsightsSection />

      {/* Crypto News Section */}
      <CryptoNewsSection />
    </div>
  )
}
