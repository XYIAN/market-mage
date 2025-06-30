'use client'

import { Card } from 'primereact/card'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useUserMetrics } from '@/hooks/useUserMetrics'

export const UserMetrics = () => {
  const { metrics, loading, error } = useUserMetrics()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
      </div>
    )
  }

  if (error || !metrics) {
    return null // Don't show anything if there's an error
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Community Stats
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of traders who are already using Market-Mage to make
            smarter investment decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:scale-105 transition-transform">
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {formatNumber(metrics.total_users)}
              </div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform">
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-green-400 mb-1">
                {formatNumber(metrics.active_dashboards)}
              </div>
              <div className="text-sm text-gray-400">Active Dashboards</div>
            </div>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform">
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {formatNumber(metrics.total_api_calls)}
              </div>
              <div className="text-sm text-gray-400">API Calls Today</div>
            </div>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform">
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">🚀</div>
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {formatNumber(metrics.cached_responses)}
              </div>
              <div className="text-sm text-gray-400">Cached Responses</div>
            </div>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Real-time data • Optimized performance • Shared caching
          </p>
        </div>
      </div>
    </section>
  )
}
