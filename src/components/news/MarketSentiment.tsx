import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { Tag } from 'primereact/tag'
import { Skeleton } from 'primereact/skeleton'
import type { ChartData, ChartOptions } from 'chart.js'

interface MarketSentiment {
  overall: 'bullish' | 'bearish' | 'neutral'
  score: number
  volume: number
  volatility: number
  sectors: {
    technology: number
    healthcare: number
    finance: number
    energy: number
    consumer: number
  }
}

interface MarketSentimentProps {
  sentiment: MarketSentiment
  loading: boolean
}

export function MarketSentiment({ sentiment, loading }: MarketSentimentProps) {
  const getOverallSeverity = (overall: string) => {
    switch (overall) {
      case 'bullish':
        return 'success'
      case 'bearish':
        return 'danger'
      default:
        return 'info'
    }
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(1)}B`
    }
    if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`
    }
    return volume.toLocaleString()
  }

  const sectorChartData: ChartData<'doughnut'> = {
    labels: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer'],
    datasets: [
      {
        data: [
          sentiment.sectors.technology,
          sentiment.sectors.healthcare,
          sentiment.sectors.finance,
          sentiment.sectors.energy,
          sentiment.sectors.consumer,
        ],
        backgroundColor: [
          '#3B82F6', // Blue
          '#10B981', // Green
          '#F59E0B', // Yellow
          '#EF4444', // Red
          '#8B5CF6', // Purple
        ],
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    ],
  }

  const sectorChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    },
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Market Sentiment</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex flex-column">
              <Skeleton width="100px" height="24px" className="mb-3" />
              <Skeleton width="100%" height="20px" className="mb-2" />
              <Skeleton width="100%" height="20px" className="mb-2" />
              <Skeleton width="100%" height="20px" className="mb-2" />
              <Skeleton width="100%" height="20px" className="mb-2" />
            </div>
          </Card>
          <Card>
            <Skeleton width="100%" height="300px" />
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">Market Sentiment</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="flex flex-column">
            <div className="flex justify-content-between align-items-center mb-4">
              <h3 className="text-lg font-semibold">Overall Sentiment</h3>
              <Tag
                value={sentiment.overall}
                severity={getOverallSeverity(sentiment.overall)}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-content-between align-items-center">
                <span className="text-sm text-blue-200">Sentiment Score</span>
                <span className="text-lg font-semibold">
                  {sentiment.score}/100
                </span>
              </div>
              <div className="flex justify-content-between align-items-center">
                <span className="text-sm text-blue-200">Trading Volume</span>
                <span className="text-lg font-semibold">
                  ${formatVolume(sentiment.volume)}
                </span>
              </div>
              <div className="flex justify-content-between align-items-center">
                <span className="text-sm text-blue-200">Volatility Index</span>
                <span className="text-lg font-semibold">
                  {sentiment.volatility}%
                </span>
              </div>
            </div>
          </div>
        </Card>
        <Card
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="flex flex-column">
            <h3 className="text-lg font-semibold mb-4">Sector Sentiment</h3>
            <div className="h-64">
              <Chart
                type="doughnut"
                data={sectorChartData}
                options={sectorChartOptions}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
