'use client'

import { NewsItem } from '@/types'

interface NewsTickerProps {
  news: NewsItem[]
}

export const NewsTicker = ({ news }: NewsTickerProps) => {
  if (!news.length) {
    return (
      <div className="bg-primary text-primary-foreground py-2 px-4 text-sm font-medium">
        Loading market news...
      </div>
    )
  }

  return (
    <div className="bg-primary text-primary-foreground py-2 relative overflow-hidden">
      <div className="flex items-center">
        <div className="bg-primary-foreground bg-opacity-20 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
          Live News
        </div>
        <div className="flex-1 overflow-hidden ml-4">
          <div className="flex items-center space-x-8 animate-scroll">
            {/* Original items */}
            {news.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 min-w-max flex-shrink-0"
              >
                <span className="text-primary-foreground text-opacity-70 text-xs">
                  {new Date(item.publishedAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="text-sm font-medium max-w-xs truncate">
                  {item.title}
                </span>
                <span className="text-primary-foreground text-opacity-70 text-xs">
                  • {item.source}
                </span>
              </div>
            ))}
            {/* Duplicate items for seamless loop */}
            {news.map((item) => (
              <div
                key={`duplicate-${item.id}`}
                className="flex items-center space-x-4 min-w-max flex-shrink-0"
              >
                <span className="text-primary-foreground text-opacity-70 text-xs">
                  {new Date(item.publishedAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="text-sm font-medium max-w-xs truncate">
                  {item.title}
                </span>
                <span className="text-primary-foreground text-opacity-70 text-xs">
                  • {item.source}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
