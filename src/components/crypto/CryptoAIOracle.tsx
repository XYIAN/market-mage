'use client'

import { useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Chip } from 'primereact/chip'
import { CryptoAsset } from '@/types/crypto'
import { useAIInsight } from '@/hooks/useAIInsight'

interface CryptoAIOracleProps {
  assets: CryptoAsset[]
  refreshCount: number
  onRefreshCountChange: (count: number) => void
  lastRefresh?: Date
}

export function CryptoAIOracle({
  assets,
  refreshCount,
  onRefreshCountChange,
  lastRefresh,
}: CryptoAIOracleProps) {
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { generateInsight } = useAIInsight()

  const maxRefreshes = 5
  const remainingRefreshes = maxRefreshes - refreshCount
  const canRefresh = remainingRefreshes > 0

  const generateCryptoInsights = async () => {
    if (!canRefresh) return

    setLoading(true)
    try {
      // For now, we'll use the existing generateInsight which doesn't take parameters
      // In a real implementation, you'd want to modify the API to accept custom prompts
      await generateInsight()

      // Simulate crypto-specific insights for now
      const cryptoInsights = [
        `Based on current market analysis of ${assets
          .map((a) => a.symbol)
          .join(
            ', '
          )}, consider monitoring support levels and volume patterns for potential entry points.`,
        `Market sentiment analysis suggests ${
          assets.length > 0 ? 'mixed signals' : 'neutral conditions'
        } across your selected cryptocurrencies.`,
        `Technical indicators show ${
          assets.length > 0 ? 'consolidation patterns' : 'no clear trend'
        } in the current timeframe.`,
      ]

      const randomInsight =
        cryptoInsights[Math.floor(Math.random() * cryptoInsights.length)]
      setInsights((prev) => [randomInsight, ...prev.slice(0, 2)]) // Keep latest 3 insights
      onRefreshCountChange(refreshCount + 1)
    } catch (error) {
      console.error('Error generating crypto insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    )

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card title="AI Oracle" className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Crypto Trading Insights</h3>
        <div className="flex items-center space-x-2">
          <Chip
            label={`${remainingRefreshes}/${maxRefreshes} refreshes left`}
            className={
              remainingRefreshes > 2
                ? 'bg-green-100 text-green-800'
                : remainingRefreshes > 0
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }
          />
          <Button
            label="Get Insights"
            icon="pi pi-refresh"
            onClick={generateCryptoInsights}
            disabled={!canRefresh || loading}
            loading={loading}
            className="p-button-sm"
          />
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-8">
          <i className="pi pi-brain text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-500 mb-2">No crypto assets added</p>
          <p className="text-sm text-gray-400">
            Add some cryptocurrencies to get AI-powered insights
          </p>
        </div>
      ) : insights.length === 0 ? (
        <div className="text-center py-8">
          <i className="pi pi-chart-line text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-500 mb-4">No insights generated yet</p>
          <Button
            label="Generate First Insight"
            icon="pi pi-magic"
            onClick={generateCryptoInsights}
            disabled={!canRefresh}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex justify-between items-start mb-2">
                <Chip
                  label={`Insight ${index + 1}`}
                  className="bg-blue-100 text-blue-800"
                />
                {index === 0 && lastRefresh && (
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(lastRefresh)}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      )}

      {lastRefresh && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Last updated: {formatTimeAgo(lastRefresh)}
          </p>
        </div>
      )}
    </Card>
  )
}
