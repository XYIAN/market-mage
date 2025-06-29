'use client'

import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Carousel } from 'primereact/carousel'
import { Chart } from 'primereact/chart'
import { NewsItem } from '@/types'
import { apiUtils } from '@/utils/api'

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    setLoading(true)
    try {
      const newsData = await apiUtils.fetchNews()
      setNews(newsData)
    } catch (error) {
      console.error('Error loading news:', error)
    } finally {
      setLoading(false)
    }
  }

  const newsTemplate = (item: NewsItem) => {
    return (
      <Card className="h-full">
        <div className="h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {item.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
            {item.summary}
          </p>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{item.source}</span>
            <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    )
  }

  const chartData = {
    labels: ['S&P 500', 'NASDAQ', 'DOW', 'Russell 2000', 'VIX'],
    datasets: [
      {
        label: 'Market Performance',
        data: [4200, 13500, 34000, 1800, 15],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Market News & Analysis</h1>
        <p className="text-gray-600">
          Stay updated with the latest market news and trends.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
          <div className="h-64">
            <Chart type="doughnut" data={chartData} options={chartOptions} />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Top Stocks</h2>
          <div className="space-y-3">
            {[
              {
                symbol: 'AAPL',
                name: 'Apple Inc.',
                price: '$150.00',
                change: '+2.5%',
              },
              {
                symbol: 'MSFT',
                name: 'Microsoft Corp.',
                price: '$320.00',
                change: '+1.8%',
              },
              {
                symbol: 'GOOGL',
                name: 'Alphabet Inc.',
                price: '$120.00',
                change: '-0.5%',
              },
              {
                symbol: 'AMZN',
                name: 'Amazon.com Inc.',
                price: '$130.00',
                change: '+5.2%',
              },
              {
                symbol: 'TSLA',
                name: 'Tesla Inc.',
                price: '$250.00',
                change: '+3.1%',
              },
            ].map((stock, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border rounded"
              >
                <div>
                  <div className="font-semibold">{stock.symbol}</div>
                  <div className="text-sm text-gray-600">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{stock.price}</div>
                  <div
                    className={`text-sm ${
                      stock.change.startsWith('+')
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {stock.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Latest News</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        ) : (
          <Carousel
            value={news}
            numVisible={3}
            numScroll={1}
            className="custom-carousel"
            itemTemplate={newsTemplate}
            autoplayInterval={5000}
          />
        )}
      </Card>
    </div>
  )
}
