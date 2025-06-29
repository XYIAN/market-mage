'use client'

import { useState, useEffect } from 'react'
import { Carousel } from 'primereact/carousel'
import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Button } from 'primereact/button'

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  url: string
}

interface StockChartData {
  symbol: string
  name: string
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      tension: number
    }[]
  }
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [stockCharts, setStockCharts] = useState<StockChartData[]>([])
  const [loading, setLoading] = useState(true)

  // Mock news data - in a real app, this would come from an API
  useEffect(() => {
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'Tech Stocks Rally on Strong Earnings Reports',
        summary:
          'Major technology companies reported better-than-expected earnings, driving the NASDAQ to new highs.',
        source: 'Financial Times',
        publishedAt: '2024-01-15T10:30:00Z',
        url: '#',
      },
      {
        id: '2',
        title: 'Federal Reserve Signals Potential Rate Cuts',
        summary:
          'The Fed indicated possible interest rate reductions in the coming months, boosting market sentiment.',
        source: 'Wall Street Journal',
        publishedAt: '2024-01-15T09:15:00Z',
        url: '#',
      },
      {
        id: '3',
        title: 'Oil Prices Surge on Middle East Tensions',
        summary:
          'Crude oil prices jumped 5% following escalating tensions in key oil-producing regions.',
        source: 'Reuters',
        publishedAt: '2024-01-15T08:45:00Z',
        url: '#',
      },
      {
        id: '4',
        title: 'Cryptocurrency Market Shows Signs of Recovery',
        summary:
          'Bitcoin and other major cryptocurrencies gained ground as institutional adoption increases.',
        source: 'Bloomberg',
        publishedAt: '2024-01-15T07:30:00Z',
        url: '#',
      },
      {
        id: '5',
        title: 'European Markets Open Higher on Positive Economic Data',
        summary:
          'European stocks rose as economic indicators showed stronger-than-expected growth.',
        source: 'CNBC',
        publishedAt: '2024-01-15T06:20:00Z',
        url: '#',
      },
    ]

    const mockStockCharts: StockChartData[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        data: {
          labels: ['Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14', 'Jan 15'],
          datasets: [
            {
              label: 'Stock Price',
              data: [185.59, 187.15, 188.63, 185.14, 185.92, 188.85],
              borderColor: '#FF6B35',
              backgroundColor: 'rgba(255, 107, 53, 0.1)',
              tension: 0.4,
            },
          ],
        },
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        data: {
          labels: ['Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14', 'Jan 15'],
          datasets: [
            {
              label: 'Stock Price',
              data: [374.58, 376.04, 378.85, 374.69, 376.04, 378.85],
              borderColor: '#4ECDC4',
              backgroundColor: 'rgba(78, 205, 196, 0.1)',
              tension: 0.4,
            },
          ],
        },
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        data: {
          labels: ['Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14', 'Jan 15'],
          datasets: [
            {
              label: 'Stock Price',
              data: [141.8, 142.56, 143.8, 141.8, 142.56, 143.8],
              borderColor: '#45B7D1',
              backgroundColor: 'rgba(69, 183, 209, 0.1)',
              tension: 0.4,
            },
          ],
        },
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        data: {
          labels: ['Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14', 'Jan 15'],
          datasets: [
            {
              label: 'Stock Price',
              data: [237.49, 237.49, 237.49, 237.49, 237.49, 237.49],
              borderColor: '#96CEB4',
              backgroundColor: 'rgba(150, 206, 180, 0.1)',
              tension: 0.4,
            },
          ],
        },
      },
    ]

    setNewsItems(mockNews)
    setStockCharts(mockStockCharts)
    setLoading(false)
  }, [])

  const newsItemTemplate = (news: NewsItem) => {
    return (
      <div className="news-item p-4">
        <Card className="h-full">
          <div className="flex flex-column h-full">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">{news.title}</h3>
              <p className="text-sm mb-3">{news.summary}</p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-column">
                <span className="text-xs font-medium">{news.source}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(news.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <Button
                label="Read More"
                icon="pi pi-external-link"
                className="p-button-sm"
                onClick={() => window.open(news.url, '_blank')}
              />
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  }

  const stockChartTemplate = (stock: StockChartData) => {
    return (
      <div className="stock-chart p-3">
        <Card className="h-full">
          <div className="flex flex-column h-full">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-bold m-0">{stock.symbol}</h4>
                <p className="text-sm text-muted-foreground m-0">
                  {stock.name}
                </p>
              </div>
              <Button
                icon="pi pi-chart-line"
                className="p-button-sm p-button-text"
                tooltip="View Details"
              />
            </div>
            <div style={{ height: '150px' }}>
              <Chart type="line" data={stock.data} options={chartOptions} />
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4">
        <div className="flex justify-center items-center h-64">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="grid">
        {/* Header */}
        <div className="col-12">
          <h1 className="text-4xl font-bold mb-4">Market News</h1>
        </div>

        {/* News Carousel */}
        <div className="col-12">
          <div className="dashboard-content">
            <h2 className="text-2xl font-bold mb-4">Latest News</h2>
            <Carousel
              value={newsItems}
              numVisible={3}
              numScroll={1}
              className="custom-carousel"
              itemTemplate={newsItemTemplate}
              autoplayInterval={5000}
              circular
            />
          </div>
        </div>

        {/* Stock Charts */}
        <div className="col-12">
          <div className="dashboard-content">
            <h2 className="text-2xl font-bold mb-4">Top Stocks</h2>
            <div className="grid">
              {stockCharts.map((stock) => (
                <div key={stock.symbol} className="col-12 md:col-6 lg:col-3">
                  {stockChartTemplate(stock)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
