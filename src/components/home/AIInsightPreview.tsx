'use client'

import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { useRouter } from 'next/navigation'

interface AIInsight {
  title: string
  content: string
  timestamp: string
}

interface AIInsightPreviewProps {
  insight?: AIInsight
}

export const AIInsightPreview = ({ insight }: AIInsightPreviewProps) => {
  const router = useRouter()

  if (!insight) return null

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-8">Latest AI Insight</h2>
      <Card className="max-w-4xl mx-auto">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <i className="pi pi-magic text-2xl text-primary mr-3"></i>
            <h3 className="text-xl font-semibold">{insight.title}</h3>
          </div>
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {insight.content}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {new Date(insight.timestamp).toLocaleDateString()}
            </span>
            <Button
              label="View Full Insight"
              icon="pi pi-arrow-right"
              size="small"
              onClick={() => router.push('/dashboard')}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
