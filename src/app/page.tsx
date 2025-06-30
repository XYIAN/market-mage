'use client'

import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useGlobalData } from '@/providers/GlobalDataProvider'
import { DetailedNewsCard } from '@/components/news'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const { globalNews, newsLoading, lastNewsUpdate } = useGlobalData()
  const { user } = useAuth()

  // Format the last update time
  const formatLastUpdate = (date: Date | null) => {
    if (!date) return 'Never'
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} minutes ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours ago`
    const days = Math.floor(hours / 24)
    return `${days} days ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Market Mage
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Your AI-powered companion for intelligent market analysis and
              trading insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                label="Start Trading"
                icon="pi pi-chart-line"
                size="large"
                className="p-button-primary text-lg px-8 py-3"
                onClick={() => (window.location.href = '/dashboard')}
              />
              <Button
                label="Learn More"
                icon="pi pi-info-circle"
                size="large"
                className="p-button-outlined p-button-secondary text-lg px-8 py-3"
                onClick={() => (window.location.href = '/about')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Back Section (if user is logged in) */}
      {user && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, {user.email}!
              </h2>
              <p className="text-gray-300">
                Ready to continue your trading journey? Check out the latest
                market insights below.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* News Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Latest Market News
            </h2>
            <p className="text-gray-400">
              Stay informed with real-time market updates and insights
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">
              Last updated: {formatLastUpdate(lastNewsUpdate)}
            </div>
            {newsLoading && (
              <div className="flex items-center gap-2 mt-2">
                <ProgressSpinner style={{ width: '16px', height: '16px' }} />
                <span className="text-xs text-blue-400">Updating...</span>
              </div>
            )}
          </div>
        </div>

        {newsLoading && globalNews.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <ProgressSpinner style={{ width: '50px', height: '50px' }} />
              <p className="text-gray-400 mt-4">Loading latest news...</p>
            </div>
          </div>
        ) : globalNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {globalNews.slice(0, 6).map((news) => (
              <DetailedNewsCard
                key={news.id}
                news={news}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300"
              />
            ))}
          </div>
        ) : (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <div className="text-center py-8">
              <i className="pi pi-newspaper text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-white mb-2">
                No News Available
              </h3>
              <p className="text-gray-400">
                Check back later for the latest market updates.
              </p>
            </div>
          </Card>
        )}

        {globalNews.length > 6 && (
          <div className="text-center mt-8">
            <Button
              label="View All News"
              icon="pi pi-arrow-right"
              className="p-button-outlined p-button-secondary"
              onClick={() => (window.location.href = '/news')}
            />
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Why Choose Market Mage?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <div className="p-6">
              <i className="pi pi-brain text-4xl text-blue-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-white mb-3">
                AI-Powered Insights
              </h3>
              <p className="text-gray-300">
                Get intelligent market analysis and trading recommendations
                powered by advanced AI algorithms.
              </p>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <div className="p-6">
              <i className="pi pi-chart-bar text-4xl text-green-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-white mb-3">
                Real-Time Data
              </h3>
              <p className="text-gray-300">
                Access live market data, news, and analytics to make informed
                trading decisions.
              </p>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <div className="p-6">
              <i className="pi pi-shield text-4xl text-purple-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-white mb-3">
                Risk Management
              </h3>
              <p className="text-gray-300">
                Advanced risk assessment tools to help protect your investments
                and maximize returns.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-blue-100 mb-6 text-lg">
              Join thousands of traders who trust Market Mage for their
              investment decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                label="Get Started Free"
                icon="pi pi-rocket"
                size="large"
                className="p-button-primary text-lg px-8 py-3"
                onClick={() => (window.location.href = '/dashboard')}
              />
              <Button
                label="Learn More"
                icon="pi pi-info-circle"
                size="large"
                className="p-button-outlined p-button-secondary text-lg px-8 py-3"
                onClick={() => (window.location.href = '/about')}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
