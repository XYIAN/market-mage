'use client'

import { Card } from 'primereact/card'

export const InsightSkeleton = () => {
  return (
    <Card
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
      <div className="h-4 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-700 rounded mb-2"></div>
      <div className="h-8 bg-gray-700 rounded"></div>
    </Card>
  )
}
