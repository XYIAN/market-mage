import { Chart } from 'primereact/chart'
import { Skeleton } from 'primereact/skeleton'
import type { ChartData, ChartOptions } from 'chart.js'

interface NewsChartProps {
  data: ChartData<'doughnut'>
  options: ChartOptions<'doughnut'>
  loading: boolean
}

export function NewsChart({ data, options, loading }: NewsChartProps) {
  return (
    <div className="h-64">
      {loading ? (
        <Skeleton width="100%" height="100%" className="h-64" />
      ) : (
        <Chart type="doughnut" data={data} options={options} />
      )}
    </div>
  )
}
