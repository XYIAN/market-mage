'use client'

import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { CryptoAsset } from '@/types/crypto'

interface CryptoInsightsProps {
  assets: CryptoAsset[]
}

export function CryptoInsights({ assets }: CryptoInsightsProps) {
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null)
  const [chartType, setChartType] = useState('line')
  const [chartData, setChartData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (assets.length > 0 && !selectedAsset) {
      setSelectedAsset(assets[0])
    }
  }, [assets, selectedAsset])

  useEffect(() => {
    if (selectedAsset) {
      generateChartData()
    }
  }, [selectedAsset, chartType])

  const generateChartData = () => {
    if (!selectedAsset) return

    setLoading(true)

    // Simulate historical data for the selected asset
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const basePrice = selectedAsset.price
    const data = labels.map(() => {
      const variation = (Math.random() - 0.5) * 0.2 // ±10% variation
      return basePrice * (1 + variation)
    })

    const chartData = {
      labels,
      datasets: [
        {
          label: `${selectedAsset.symbol} Price`,
          data,
          borderColor: '#FF6B35',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    }

    setChartData(chartData)
    setLoading(false)
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        },
      },
    },
  }

  const chartTypes = [
    { label: 'Line Chart', value: 'line' },
    { label: 'Bar Chart', value: 'bar' },
    { label: 'Area Chart', value: 'line' }, // Using line with fill for area effect
  ]

  if (assets.length === 0) {
    return (
      <Card title="Crypto Insights" className="h-full">
        <div className="text-center py-8">
          <i className="pi pi-chart-line text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-500 mb-2">No crypto assets added</p>
          <p className="text-sm text-gray-400">
            Add some cryptocurrencies to view insights and charts
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card title="Crypto Insights" className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Market Analysis & Charts</h3>
        <div className="flex items-center space-x-2">
          <Dropdown
            value={selectedAsset}
            options={assets}
            onChange={(e) => setSelectedAsset(e.value)}
            optionLabel="name"
            placeholder="Select Asset"
            className="w-48"
          />
          <Dropdown
            value={chartType}
            options={chartTypes}
            onChange={(e) => setChartType(e.value)}
            placeholder="Chart Type"
            className="w-32"
          />
          <Button
            icon="pi pi-refresh"
            onClick={generateChartData}
            loading={loading}
            className="p-button-sm"
            tooltip="Refresh Chart"
          />
        </div>
      </div>

      {selectedAsset && (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-lg font-semibold">
                  {selectedAsset.name} ({selectedAsset.symbol})
                </h4>
                <p className="text-sm text-gray-400">
                  Current Price: ${selectedAsset.price.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    selectedAsset.change24h >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {selectedAsset.change24h > 0 ? '+' : ''}
                  {selectedAsset.change24h.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-400">24h Change</p>
              </div>
            </div>

            <div className="h-64">
              <Chart
                type={chartType as 'line' | 'bar'}
                data={chartData}
                options={chartOptions}
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400">Market Cap</p>
              <p className="text-lg font-semibold">
                ${(selectedAsset.marketCap / 1e9).toFixed(2)}B
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400">24h Volume</p>
              <p className="text-lg font-semibold">
                ${(selectedAsset.volume24h / 1e6).toFixed(2)}M
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400">Price Range</p>
              <p className="text-lg font-semibold">
                ${(selectedAsset.price * 0.9).toFixed(2)} - $
                {(selectedAsset.price * 1.1).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
