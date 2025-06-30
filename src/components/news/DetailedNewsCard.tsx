'use client'

import { useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Chip } from 'primereact/chip'
import { NewsItem } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface DetailedNewsCardProps {
  news: NewsItem
  className?: string
}

export const DetailedNewsCard = ({
  news,
  className = '',
}: DetailedNewsCardProps) => {
  const [showDetails, setShowDetails] = useState(false)

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500'
      case 'negative':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'pi pi-arrow-up'
      case 'negative':
        return 'pi pi-arrow-down'
      default:
        return 'pi pi-minus'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Unknown time'
    }
  }

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-400">{news.source}</span>
        <div
          className={`w-2 h-2 rounded-full ${getSentimentColor(
            news.sentiment
          )}`}
        ></div>
      </div>
      <span className="text-xs text-gray-500">
        {formatDate(news.publishedAt)}
      </span>
    </div>
  )

  const footer = (
    <div className="flex justify-between items-center">
      <Chip
        label={news.sentiment || 'neutral'}
        icon={getSentimentIcon(news.sentiment)}
        className={`text-xs ${
          news.sentiment === 'positive'
            ? 'bg-green-100 text-green-800'
            : news.sentiment === 'negative'
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      />
      <Button
        label="Read More"
        icon="pi pi-external-link"
        size="small"
        onClick={() => setShowDetails(true)}
        className="p-button-text"
      />
    </div>
  )

  return (
    <>
      <Card
        header={header}
        footer={footer}
        className={`cursor-pointer hover:shadow-lg transition-shadow ${className}`}
        onClick={() => setShowDetails(true)}
      >
        <div className="space-y-3">
          <h3 className="text-lg font-semibold line-clamp-2 hover:text-blue-600 transition-colors">
            {news.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {news.description}
          </p>
        </div>
      </Card>

      <Dialog
        visible={showDetails}
        onHide={() => setShowDetails(false)}
        header={
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${getSentimentColor(
                news.sentiment
              )}`}
            ></div>
            <span className="font-semibold">News Details</span>
          </div>
        }
        style={{ width: '90vw', maxWidth: '800px' }}
        className="dark"
      >
        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <span className="font-medium">{news.source}</span>
              <span>{formatDate(news.publishedAt)}</span>
            </div>
            <Chip
              label={news.sentiment || 'neutral'}
              icon={getSentimentIcon(news.sentiment)}
              className={`${
                news.sentiment === 'positive'
                  ? 'bg-green-100 text-green-800'
                  : news.sentiment === 'negative'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {news.title}
          </h2>

          {/* Description */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {news.description}
            </p>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Market Impact
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {news.sentiment === 'positive'
                  ? 'This news may have a positive impact on market sentiment and could lead to increased investor confidence.'
                  : news.sentiment === 'negative'
                  ? 'This news may create market uncertainty and could lead to increased volatility in affected sectors.'
                  : 'This news provides neutral information that may not significantly impact market movements.'}
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                Trading Considerations
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Consider monitoring related assets and sectors for potential
                trading opportunities based on this news development.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              label="Close"
              icon="pi pi-times"
              onClick={() => setShowDetails(false)}
              className="p-button-secondary"
            />
            <Button
              label="Read Full Article"
              icon="pi pi-external-link"
              onClick={() => {
                window.open(news.url, '_blank')
                setShowDetails(false)
              }}
              className="p-button-primary"
            />
          </div>
        </div>
      </Dialog>
    </>
  )
}
