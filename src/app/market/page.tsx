'use client'

import { useState, useEffect } from 'react'
import { ProgressSpinner } from 'primereact/progressspinner'
import { StockData, HistoricalNote } from '@/types'
import { AIOracle, HistoricalNotes, StockTable } from '@/components'
import {
  DashboardLayout,
  DashboardSection,
} from '@/components/dashboard/DashboardLayout'
import { storageUtils } from '@/utils/storage'
import { apiUtils } from '@/utils/api'

export default function MarketDashboard() {
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [stockData, setStockData] = useState<StockData[]>([])
  const [notes, setNotes] = useState<HistoricalNote[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    const savedWatchlist = storageUtils.getWatchlist()
    console.log('Saved watchlist:', savedWatchlist)

    if (savedWatchlist.length === 0) {
      // Add some default stocks if watchlist is empty
      storageUtils.addToWatchlist('AAPL', 'Apple Inc.')
      storageUtils.addToWatchlist('GOOGL', 'Alphabet Inc.')
      storageUtils.addToWatchlist('MSFT', 'Microsoft Corporation')
      storageUtils.addToWatchlist('TSLA', 'Tesla Inc.')
      storageUtils.addToWatchlist('AMZN', 'Amazon.com Inc.')

      const updatedWatchlist = storageUtils.getWatchlist()
      setWatchlist(updatedWatchlist.map((item) => item.symbol))
    } else {
      setWatchlist(savedWatchlist.map((item) => item.symbol))
    }

    setNotes(storageUtils.getHistoricalNotes())
  }, [])

  useEffect(() => {
    if (watchlist.length > 0) {
      fetchStockData()
    } else {
      setLoading(false)
    }
  }, [watchlist])

  const fetchStockData = async () => {
    setLoading(true)
    console.log('Fetching stock data for:', watchlist)

    try {
      const data = await apiUtils.fetchStockData(watchlist)
      console.log('Stock data received:', data)
      setStockData(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching stock data:', err)
      // Set mock data if API fails
      setStockData([
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 150.25 + Math.random() * 10,
          change: (Math.random() - 0.5) * 5,
          changePercent: (Math.random() - 0.5) * 3,
          volume: Math.floor(Math.random() * 100000000),
          lastUpdated: new Date().toISOString(),
        },
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          price: 2800.5 + Math.random() * 50,
          change: (Math.random() - 0.5) * 20,
          changePercent: (Math.random() - 0.5) * 2,
          volume: Math.floor(Math.random() * 50000000),
          lastUpdated: new Date().toISOString(),
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          price: 320.75 + Math.random() * 15,
          change: (Math.random() - 0.5) * 8,
          changePercent: (Math.random() - 0.5) * 2.5,
          volume: Math.floor(Math.random() * 80000000),
          lastUpdated: new Date().toISOString(),
        },
      ])
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  const handleNotesChange = () => {
    setNotes(storageUtils.getHistoricalNotes())
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
      </div>
    )
  }

  return (
    <DashboardLayout
      title="Market Dashboard"
      subtitle="Track your stocks and get AI-powered insights"
      showRefreshButton={true}
    >
      {/* Stock Table Section */}
      <DashboardSection>
        <StockTable
          stocks={stockData}
          loading={loading}
          lastUpdated={lastUpdated}
        />
      </DashboardSection>

      {/* AI Oracle Section */}
      <DashboardSection>
        <AIOracle />
      </DashboardSection>

      {/* Historical Notes Section */}
      <DashboardSection>
        <HistoricalNotes notes={notes} onNotesChange={handleNotesChange} />
      </DashboardSection>
    </DashboardLayout>
  )
}
