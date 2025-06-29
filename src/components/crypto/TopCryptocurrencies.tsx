'use client'

import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Skeleton } from 'primereact/skeleton'
import { useCoinbaseData } from '@/hooks/useCoinbaseData'

interface CryptoData {
  symbol: string
  name: string
  price: string
  change: string
  volume: string
  marketCap: number
  lastUpdated: string
}

export const TopCryptocurrencies = () => {
  const { cryptoData, loading } = useCoinbaseData()

  const changeBodyTemplate = (rowData: CryptoData) => {
    const isPositive = rowData.change.startsWith('+')
    return (
      <span
        className={`font-semibold ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {rowData.change}
      </span>
    )
  }

  const priceBodyTemplate = (rowData: CryptoData) => {
    return <span className="font-semibold">${rowData.price}</span>
  }

  const volumeBodyTemplate = (rowData: CryptoData) => {
    return <span className="text-sm">{rowData.volume}</span>
  }

  const loadingTemplate = () => {
    return (
      <div className="space-y-2">
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
      </div>
    )
  }

  if (loading) {
    return (
      <Card>
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Top Cryptocurrencies</h2>
        </div>
        <div className="p-4">{loadingTemplate()}</div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">Top Cryptocurrencies</h2>
      </div>
      <DataTable
        value={cryptoData}
        responsiveLayout="scroll"
        className="p-datatable-sm"
      >
        <Column field="symbol" header="Symbol" style={{ width: '80px' }} />
        <Column field="name" header="Name" />
        <Column
          field="price"
          header="Price"
          body={priceBodyTemplate}
          style={{ width: '120px' }}
        />
        <Column
          field="change"
          header="Change"
          body={changeBodyTemplate}
          style={{ width: '100px' }}
        />
        <Column
          field="volume"
          header="Volume"
          body={volumeBodyTemplate}
          style={{ width: '120px' }}
        />
      </DataTable>
    </Card>
  )
}
