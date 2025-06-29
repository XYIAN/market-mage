'use client'

import { useMemo } from 'react'
import { Carousel, CarouselResponsiveOption } from 'primereact/carousel'
import { useCoinbaseData } from '@/hooks/useCoinbaseData'
import { InsightCard, InsightSkeleton } from './trading-insights'

interface TradingInsight {
  id: string
  symbol: string
  recommendation: 'buy' | 'sell' | 'hold'
  confidence: number
  reasoning: string
  priceTarget: string
  timeframe: string
  riskLevel: 'low' | 'medium' | 'high'
  timestamp: string
}

const getRecommendation = (
  change: number
): TradingInsight['recommendation'] => {
  if (change > 2) return 'buy'
  if (change < -2) return 'sell'
  return 'hold'
}

const getConfidence = (change: number): number => {
  if (Math.abs(change) > 5) return 90
  if (Math.abs(change) > 2) return 75
  return 60
}

const getRiskLevel = (change: number): TradingInsight['riskLevel'] => {
  if (Math.abs(change) > 5) return 'high'
  if (Math.abs(change) > 2) return 'medium'
  return 'low'
}

const getReasoning = (
  rec: TradingInsight['recommendation'],
  symbol: string
): string => {
  switch (rec) {
    case 'buy':
      return `Momentum and volume suggest a buying opportunity for ${symbol}.`
    case 'sell':
      return `Recent decline and volatility suggest caution for ${symbol}.`
    default:
      return `Market is stable for ${symbol}, holding is recommended.`
  }
}

export const TradingInsights = () => {
  const { cryptoData, loading } = useCoinbaseData()

  // Generate insights based on real data
  const insights: TradingInsight[] = useMemo(() => {
    return cryptoData.slice(0, 8).map((crypto) => {
      // Parse the change percentage from the formatted string (e.g., "+2.50%" -> 2.50)
      const change = parseFloat(crypto.change.replace(/[+%]/g, ''))
      const recommendation = getRecommendation(change)
      const confidence = getConfidence(change)
      const riskLevel = getRiskLevel(change)
      const reasoning = getReasoning(recommendation, crypto.symbol)
      const priceTarget = (
        parseFloat(crypto.price) *
        (1 +
          (recommendation === 'buy'
            ? 0.1
            : recommendation === 'sell'
            ? -0.1
            : 0.02))
      ).toFixed(2)
      return {
        id: `insight-${crypto.symbol}`,
        symbol: crypto.symbol,
        recommendation,
        confidence,
        reasoning,
        priceTarget,
        timeframe: '7 days',
        riskLevel,
        timestamp: new Date().toISOString(),
      }
    })
  }, [cryptoData])

  const responsiveOptions: CarouselResponsiveOption[] = [
    { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
    { breakpoint: '1199px', numVisible: 2, numScroll: 1 },
    { breakpoint: '767px', numVisible: 1, numScroll: 1 },
    { breakpoint: '575px', numVisible: 1, numScroll: 1 },
  ]

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">AI Trading Insights</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: 3 }).map((_, idx) => (
            <InsightSkeleton key={idx} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">AI Trading Insights</h2>
        <p className="text-gray-400 text-sm">
          AI-powered trading recommendations based on market analysis
        </p>
      </div>
      <Carousel
        value={insights}
        numVisible={3}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        itemTemplate={(insight) => <InsightCard insight={insight} />}
        className="custom-carousel"
      />
    </div>
  )
}
