'use client'

import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'

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

interface InsightCardProps {
  insight: TradingInsight
}

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

export const InsightCard = ({ insight }: InsightCardProps) => {
  return (
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
}
