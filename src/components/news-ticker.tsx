'use client'

import { NewsItem } from '@/types'
import '@/styles/news/ticker.css'

interface NewsTickerProps {
  news: NewsItem[]
  loading?: boolean
}

export const NewsTicker = ({ news, loading = false }: NewsTickerProps) => {
  if (loading || !news.length) {
    return (
      <div
        style={{ position: 'fixed', top: 0, zIndex: 9999, padding: '8px 16px' }}
      >
        <div className="flex items-center gap-2">
          <i className="pi pi-spin pi-spinner"></i>
          <span>Loading market news...</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', top: 0, zIndex: 9999, padding: '8px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          Live News
        </div>
        <div style={{ flex: 1, overflow: 'hidden', marginLeft: '16px' }}>
          <div
            className="animate-scroll"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {/* Original items */}
            {news.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '32px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: '12px', marginRight: '16px' }}>
                  {new Date(item.publishedAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.title}
                </span>
                <span style={{ fontSize: '12px', marginLeft: '8px' }}>
                  • {item.source}
                </span>
              </div>
            ))}
            {/* Duplicate items for seamless loop */}
            {news.map((item) => (
              <div
                key={`duplicate-${item.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '32px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: '12px', marginRight: '16px' }}>
                  {new Date(item.publishedAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.title}
                </span>
                <span style={{ fontSize: '12px', marginLeft: '8px' }}>
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
