'use client'

import { useStockData } from '@/hooks/useStockData'

/**
 * Stats Section Component
 *
 * Displays key market statistics including stocks tracked, total volume,
 * and market cap. Shows real-time data from the stock service.
 *
 * @component
 * @example
 * ```tsx
 * <StatsSection />
 * ```
 *
 * @returns {JSX.Element} A grid of market statistics cards
 */
export const StatsSection = () => {
  const { stockData } = useStockData([])

  const stats = [
    {
      label: 'Stocks Tracked',
      value: stockData.length,
      icon: 'pi pi-chart-line',
    },
    {
      label: 'Total Volume',
      value: stockData
        .reduce((sum, stock) => sum + (stock.volume || 0), 0)
        .toLocaleString(),
      icon: 'pi pi-chart-bar',
    },
    {
      label: 'Market Cap',
      value: `$${(
        stockData.reduce((sum, stock) => sum + (stock.marketCap || 0), 0) / 1e9
      ).toFixed(1)}B`,
      icon: 'pi pi-dollar',
    },
  ]

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-8">Market Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-card p-6 rounded-lg border border-border text-center"
          >
            <i className={`${stat.icon} text-3xl text-primary mb-4`}></i>
            <div className="text-2xl font-bold mb-2">{stat.value}</div>
            <div className="text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
