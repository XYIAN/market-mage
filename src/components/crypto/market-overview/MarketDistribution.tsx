'use client'

import { MarketDistributionBar } from '../MarketDistributionBar'

interface MarketDistributionItem {
  symbol: string
  percentage: number
  value: string
}

interface MarketDistributionProps {
  marketDistribution: MarketDistributionItem[]
}

export const MarketDistribution = ({
  marketDistribution,
}: MarketDistributionProps) => {
  return (
    <div className="mb-2 flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2 text-blue-200 tracking-wide">
        Market Distribution
      </h3>
      <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto">
        {marketDistribution.map((item) => (
          <MarketDistributionBar
            key={item.symbol}
            label={item.symbol}
            percentage={item.percentage}
            value={item.value}
          />
        ))}
      </div>
    </div>
  )
}
