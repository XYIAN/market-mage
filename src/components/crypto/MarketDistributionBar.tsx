import { ProgressBar } from 'primereact/progressbar'

interface MarketDistributionBarProps {
  label: string
  percentage: number
  value?: string
}

export const MarketDistributionBar = ({
  label,
  percentage,
  value,
}: MarketDistributionBarProps) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="market-distribution-label">{label}</div>
      <div className="flex-grow">
        <ProgressBar value={percentage} showValue={false} className="h-2" />
      </div>
      <div className="w-16 text-sm text-right flex-shrink-0">
        {value ?? `${percentage.toFixed(1)}%`}
      </div>
    </div>
  )
}
