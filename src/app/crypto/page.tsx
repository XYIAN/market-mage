'use client'

import {
  TopCryptocurrencies,
  CryptoNewsCarousel,
  MarketOverview,
  TradingInsights,
} from '@/components'
import {
  DashboardLayout,
  DashboardSection,
} from '@/components/dashboard/DashboardLayout'

export default function CryptoDashboard() {
  return (
    <DashboardLayout
      title="Crypto Dashboard"
      subtitle="Track cryptocurrencies and get market insights"
      showRefreshButton={false}
    >
      {/* Top Cryptocurrencies Section */}
      <DashboardSection>
        <TopCryptocurrencies />
      </DashboardSection>

      {/* Market Overview Section */}
      <DashboardSection>
        <MarketOverview />
      </DashboardSection>

      {/* Trading Insights Section */}
      <DashboardSection>
        <TradingInsights />
      </DashboardSection>

      {/* Crypto News Section */}
      <DashboardSection>
        <CryptoNewsCarousel />
      </DashboardSection>
    </DashboardLayout>
  )
}
