import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'
import { ProgressBar } from 'primereact/progressbar'
import { Skeleton } from 'primereact/skeleton'

interface PopularInsight {
  id: string
  title: string
  description: string
  category: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  impact: 'high' | 'medium' | 'low'
  timestamp: string
  tags: string[]
}

interface PopularInsightsProps {
  insights: PopularInsight[]
  loading: boolean
}

export function PopularInsights({ insights, loading }: PopularInsightsProps) {
  const getCategorySeverity = (category: string) => {
    switch (category) {
      case 'bullish':
        return 'success'
      case 'bearish':
        return 'danger'
      default:
        return 'info'
    }
  }

  const getImpactSeverity = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'danger'
      case 'medium':
        return 'warning'
      default:
        return 'info'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Popular Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-64">
              <div className="flex flex-column h-full">
                <Skeleton width="60px" height="24px" className="mb-3" />
                <Skeleton width="100%" height="20px" className="mb-2" />
                <Skeleton width="90%" height="16px" className="mb-2" />
                <Skeleton width="100%" height="16px" className="mb-2" />
                <Skeleton width="80%" height="16px" className="mb-4" />
                <div className="flex-grow-1">
                  <Skeleton width="100%" height="16px" className="mb-2" />
                  <Skeleton width="100%" height="16px" className="mb-2" />
                </div>
                <Skeleton width="100%" height="20px" className="mb-2" />
                <Skeleton width="60px" height="16px" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">Popular Insights</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <Card
            key={insight.id}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              height: '280px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="flex flex-column h-full">
              <div className="flex justify-content-between align-items-start mb-3">
                <Tag
                  value={insight.category}
                  severity={getCategorySeverity(insight.category)}
                  className="text-xs"
                />
                <Tag
                  value={insight.impact}
                  severity={getImpactSeverity(insight.impact)}
                  className="text-xs"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 line-height-1-4">
                {insight.title}
              </h3>
              <p className="text-sm text-blue-200 mb-3 flex-grow-1 line-height-1-6">
                {insight.description}
              </p>
              <div className="mt-auto">
                <div className="mb-2">
                  <div className="flex justify-content-between align-items-center mb-1">
                    <span className="text-xs text-blue-200">Confidence</span>
                    <span className="text-xs text-blue-200">
                      {insight.confidence}%
                    </span>
                  </div>
                  <ProgressBar
                    value={insight.confidence}
                    className="h-2"
                    showValue={false}
                  />
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {insight.tags.slice(0, 3).map((tag, index) => (
                    <Tag
                      key={index}
                      value={tag}
                      severity="info"
                      className="text-xs"
                    />
                  ))}
                </div>
                <span className="text-xs text-blue-200">
                  {formatTimestamp(insight.timestamp)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
