'use client'

import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { NewsTicker } from '@/components/news-ticker'
import { useNewsTicker } from '@/hooks/useNewsTicker'
import { useStockData } from '@/hooks/useStockData'
import { useAIInsight } from '@/hooks/useAIInsight'
import { FEATURE_CARDS } from '@/data/cards'

export default function HomePage() {
  const { news } = useNewsTicker()
  const { stocks } = useStockData()
  const { insight } = useAIInsight()

  return (
    <div className="min-h-screen">
      {/* Sticky News Ticker */}
      <div className="sticky top-0 z-50">
        <NewsTicker news={news} />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-6">
        {/* Hero Section */}
        <Card className="mb-8 text-center">
          <div className="mb-6">
            <i className="pi pi-magic text-primary text-6xl mb-4"></i>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-primary">Market</span>
              <span>-</span>
              <span className="text-primary">Mage</span>
            </h1>
            <p className="text-xl mb-6">
              AI-powered trading insights and portfolio management
            </p>
            <Button
              label="Get Started"
              icon="pi pi-arrow-right"
              size="large"
              className="p-button-primary"
              onClick={() => (window.location.href = '/dashboard')}
            />
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 justify-items-center">
          {FEATURE_CARDS.map((card) => (
            <Card key={card.id} className="w-full max-w-sm text-center">
              <div className="mb-4">
                <i className={`${card.icon} text-4xl text-primary`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p>{card.description}</p>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        {stocks.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 justify-items-center">
            <Card className="w-full max-w-xs text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {stocks.length}
              </div>
              <div className="text-sm">Stocks Tracked</div>
            </Card>
            <Card className="w-full max-w-xs text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">
                {stocks.filter((s) => s.change >= 0).length}
              </div>
              <div className="text-sm">Gaining</div>
            </Card>
            <Card className="w-full max-w-xs text-center">
              <div className="text-2xl font-bold text-red-500 mb-1">
                {stocks.filter((s) => s.change < 0).length}
              </div>
              <div className="text-sm">Declining</div>
            </Card>
            <Card className="w-full max-w-xs text-center">
              <div
                className={`text-2xl font-bold mb-1 ${
                  stocks.reduce((sum, s) => sum + s.changePercent, 0) /
                    stocks.length >=
                  0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {stocks.reduce((sum, s) => sum + s.changePercent, 0) /
                  stocks.length >=
                0
                  ? '+'
                  : ''}
                {(
                  stocks.reduce((sum, s) => sum + s.changePercent, 0) /
                  stocks.length
                ).toFixed(2)}
                %
              </div>
              <div className="text-sm">Avg Change</div>
            </Card>
          </div>
        )}

        {/* Latest AI Insight Preview */}
        {insight && (
          <div className="flex justify-center mb-8">
            <Card className="w-full max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <i className="pi pi-lightbulb text-primary text-xl"></i>
                <h3 className="text-xl font-semibold">
                  Today&apos;s AI Insight
                </h3>
              </div>
              <p className="mb-4 line-clamp-3">
                {insight.content.substring(0, 200)}...
              </p>
              <Button
                label="Read Full Insight"
                icon="pi pi-arrow-right"
                className="p-button-text"
                onClick={() => (window.location.href = '/dashboard')}
              />
            </Card>
          </div>
        )}

        {/* Call to Action */}
        <Card className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Start Trading Smarter?
          </h2>
          <p className="mb-6">
            Join thousands of traders who are already using AI-powered insights
            to make better investment decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              label="View Dashboard"
              icon="pi pi-chart-line"
              size="large"
              className="p-button-primary"
              onClick={() => (window.location.href = '/dashboard')}
            />
            <Button
              label="Learn More"
              icon="pi pi-info-circle"
              size="large"
              className="p-button-outlined"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
