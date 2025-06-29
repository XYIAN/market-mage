'use client'

import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Skeleton } from 'primereact/skeleton'
import { CryptoData } from '@/types'
import { apiUtils } from '@/utils/api'
import { storageUtils } from '@/utils/storage'

export default function CryptoDashboard() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [watchlist, setWatchlist] = useState<string[]>([])

  useEffect(() => {
    loadWatchlist()
    loadCryptoData()
  }, [])

  const loadWatchlist = () => {
    const savedWatchlist = storageUtils.getCryptoWatchlist()
    setWatchlist(savedWatchlist.map((item) => item.symbol))
  }

  const loadCryptoData = async () => {
    setLoading(true)
    try {
      if (watchlist.length > 0) {
        const data = await apiUtils.fetchCryptoData(watchlist)
        setCryptoData(data)
      } else {
        setCryptoData([])
      }
    } catch (error) {
      console.error('Error loading crypto data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadCryptoData()
  }

  const priceBodyTemplate = (rowData: CryptoData) => {
    return (
      <span
        className={`font-bold ${
          rowData.change >= 0 ? 'text-green-500' : 'text-red-500'
        }`}
      >
        ${rowData.price.toFixed(2)}
      </span>
    )
  }

  const changeBodyTemplate = (rowData: CryptoData) => {
    const isPositive = rowData.change >= 0
    return (
      <span
        className={`font-bold ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {isPositive ? '+' : ''}
        {rowData.change.toFixed(2)} ({isPositive ? '+' : ''}
        {rowData.changePercent.toFixed(2)}%)
      </span>
    )
  }

  const marketCapBodyTemplate = (rowData: CryptoData) => {
    const formatMarketCap = (marketCap: number) => {
      if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
      if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
      if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
      return `$${marketCap.toLocaleString()}`
    }
    return <span>{formatMarketCap(rowData.marketCap)}</span>
  }

  const volumeBodyTemplate = (rowData: CryptoData) => {
    const formatVolume = (volume: number) => {
      if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`
      if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`
      return volume.toLocaleString()
    }
    return <span>{formatVolume(rowData.volume)}</span>
  }

  const emptyMessage = () => {
    return (
      <div className="text-center py-8">
        <i className="pi pi-bitcoin text-6xl text-gray-400 mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No Cryptocurrencies Added
        </h3>
        <p className="text-gray-500 mb-4">
          Start by adding cryptocurrencies to your watchlist to track their
          performance.
        </p>
        <Button
          label="Add Cryptocurrency"
          icon="pi pi-plus"
          className="p-button-primary"
          onClick={() => (window.location.href = '/crypto/add')}
        />
      </div>
    )
  }

  const loadingTemplate = () => {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 border rounded"
          >
            <Skeleton shape="circle" size="3rem" />
            <div className="flex-1 space-y-2">
              <Skeleton height="1rem" width="30%" />
              <Skeleton height="0.75rem" width="60%" />
            </div>
            <div className="space-y-2">
              <Skeleton height="1rem" width="80px" />
              <Skeleton height="0.75rem" width="60px" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Crypto Dashboard</h1>
        <p className="text-gray-600">
          Track your favorite cryptocurrencies with real-time data and AI
          insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {cryptoData.length}
          </div>
          <div className="text-gray-600">Cryptocurrencies</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">
            $
            {cryptoData
              .reduce((sum, crypto) => sum + crypto.price, 0)
              .toFixed(2)}
          </div>
          <div className="text-gray-600">Total Value</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {cryptoData.filter((crypto) => crypto.change >= 0).length}
          </div>
          <div className="text-gray-600">Gaining</div>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Cryptocurrency Watchlist</h2>
          <div className="flex space-x-2">
            <Button
              icon="pi pi-refresh"
              label="Refresh"
              onClick={handleRefresh}
              loading={loading}
              className="p-button-outlined"
            />
            <Button
              icon="pi pi-plus"
              label="Add Crypto"
              onClick={() => (window.location.href = '/crypto/add')}
              className="p-button-primary"
            />
          </div>
        </div>

        {loading ? (
          loadingTemplate()
        ) : (
          <DataTable
            value={cryptoData}
            emptyMessage={emptyMessage}
            className="p-datatable-sm"
          >
            <Column field="symbol" header="Symbol" style={{ width: '100px' }} />
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
              style={{ width: '140px' }}
            />
            <Column
              field="marketCap"
              header="Market Cap"
              body={marketCapBodyTemplate}
              style={{ width: '120px' }}
            />
            <Column
              field="volume"
              header="Volume"
              body={volumeBodyTemplate}
              style={{ width: '100px' }}
            />
          </DataTable>
        )}
      </Card>
    </div>
  )
}
