'use client'

import Link from 'next/link'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { useAIInsight } from '@/hooks/useAIInsight'

export const AIInsightPreview = () => {
  const { insight } = useAIInsight()

  if (!insight) return null

  return (
    <div className="flex justify-center mb-8">
      <Card className="w-full max-w-2xl">
        <div className="p-1rem">
          <div className="flex items-center gap-2 mb-4">
            <i className="pi pi-lightbulb text-primary text-xl"></i>
            <h3 className="text-xl font-semibold">Today&apos;s AI Insight</h3>
          </div>
          <p className="mb-4 line-clamp-3">
            {insight.content.substring(0, 200)}...
          </p>
          <Link href="/dashboard">
            <Button
              label="Read Full Insight"
              icon="pi pi-arrow-right"
              className="p-button-text"
            />
          </Link>
        </div>
      </Card>
    </div>
  )
}
