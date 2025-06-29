'use client'

import { useMemo } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { Carousel, CarouselResponsiveOption } from 'primereact/carousel'
import { useCoinbaseData } from '@/hooks/useCoinbaseData'

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

  const getRecommendationSeverity = (recommendation: string) => {
    switch (recommendation) {
      case 'buy':
        return 'success'
      case 'sell':
        return 'danger'
      default:
        return 'warning'
    }
  }

  const getRiskSeverity = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'success'
      case 'medium':
        return 'warning'
      default:
        return 'danger'
    }
  }

  const insightTemplate = (insight: TradingInsight) => (
    <Card
      key={insight.id}
      style={{
        background: 'rgba(30, 41, 59, 0.85)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        minHeight: 220,
        maxWidth: 340,
        margin: '0 auto',
        boxShadow: '0 4px 24px 0 rgba(59,130,246,0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      className="m-2"
    >
      <div className="flex flex-col gap-2 h-full">
        <div className="flex justify-between items-center mb-1">
          <span className="text-blue-200 font-bold text-lg">
            {insight.symbol}
          </span>
          <Tag
            value={insight.recommendation.toUpperCase()}
            severity={getRecommendationSeverity(insight.recommendation)}
            className="text-xs"
          />
        </div>
        <div className="flex gap-2 mb-1">
          <Tag
            value={`${insight.confidence}%`}
            severity="info"
            className="text-xs"
          />
          <Tag
            value={insight.riskLevel.toUpperCase()}
            severity={getRiskSeverity(insight.riskLevel)}
            className="text-xs"
          />
        </div>
        <div className="text-blue-100 text-sm mb-2">{insight.reasoning}</div>
        <div className="flex justify-between items-center mt-auto">
          <div>
            <div className="text-xs text-blue-300">Target</div>
            <div className="text-blue-400 font-bold text-base">
              ${insight.priceTarget}
            </div>
          </div>
          <div className="text-xs text-blue-300 text-right">
            {insight.timeframe}
          </div>
        </div>
        <Button
          label="Details"
          icon="pi pi-chart-line"
          className="p-button-sm p-button-text mt-2"
        />
      </div>
    </Card>
  )

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">AI Trading Insights</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card
              key={idx}
              style={{
                minHeight: 220,
                maxWidth: 340,
                margin: '0 auto',
                background: 'rgba(30,41,59,0.85)',
              }}
              className="m-2 animate-pulse"
            >
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-6 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">AI Trading Insights</h2>
      </div>
      <Carousel
        value={insights}
        numScroll={1}
        numVisible={3}
        responsiveOptions={responsiveOptions}
        itemTemplate={insightTemplate}
        className="w-full"
        circular
        autoplayInterval={7000}
      />
    </div>
  )
}
