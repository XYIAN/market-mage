'use client'

import { useEffect, useRef } from 'react'
import { NewsItem } from '@/types'

interface NewsTickerProps {
  news: NewsItem[]
}

export const NewsTicker = ({ news }: NewsTickerProps) => {
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ticker = tickerRef.current
    if (!ticker) return

    const scrollTicker = () => {
      if (ticker.scrollLeft >= ticker.scrollWidth - ticker.clientWidth) {
        ticker.scrollLeft = 0
      } else {
        ticker.scrollLeft += 1
      }
    }

    const interval = setInterval(scrollTicker, 30) // Faster scrolling
    return () => clearInterval(interval)
  }, [])

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
        <div
          ref={tickerRef}
          className="flex-1 overflow-hidden whitespace-nowrap ml-4"
        >
          <div className="inline-flex items-center space-x-8 animate-marquee">
            {news.map((item) => (
              <div
                key={item.id}
                className="inline-flex items-center space-x-4 min-w-max"
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
                className="inline-flex items-center space-x-4 min-w-max"
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
