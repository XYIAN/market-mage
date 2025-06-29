'use client'

import { Card } from 'primereact/card'
import { useStockData } from '@/hooks/useStockData'

export const StatsSection = () => {
  const { stocks } = useStockData()

  // Calculate summary stats
  const totalStocks = stocks.length
  const positiveStocks = stocks.filter((s) => s.change >= 0).length
  const negativeStocks = stocks.filter((s) => s.change < 0).length
  const avgChange =
    stocks.length > 0
      ? stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length
      : 0

  if (totalStocks === 0) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 justify-items-center">
      <Card className="w-full max-w-xs text-center">
        <div className="p-1rem">
          <div className="text-2xl font-bold text-primary mb-1">
            {totalStocks}
          </div>
          <div className="text-sm">Stocks Tracked</div>
        </div>
      </Card>
      <Card className="w-full max-w-xs text-center">
        <div className="p-1rem">
          <div className="text-2xl font-bold text-green-500 mb-1">
            {positiveStocks}
          </div>
          <div className="text-sm">Gaining</div>
        </div>
      </Card>
      <Card className="w-full max-w-xs text-center">
        <div className="p-1rem">
          <div className="text-2xl font-bold text-red-500 mb-1">
            {negativeStocks}
          </div>
          <div className="text-sm">Declining</div>
        </div>
      </Card>
      <Card className="w-full max-w-xs text-center">
        <div className="p-1rem">
          <div
            className={`text-2xl font-bold mb-1 ${
              avgChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {avgChange >= 0 ? '+' : ''}
            {avgChange.toFixed(2)}%
          </div>
          <div className="text-sm">Avg Change</div>
        </div>
      </Card>
    </div>
  )
}
