import { useState, useEffect } from 'react'

interface CryptoData {
  symbol: string
  name: string
  price: string
  change: string
  marketCap: number
}

interface MarketCapData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }[]
}

interface CoinGeckoCoin {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
}

export const useCryptoData = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [marketCapData, setMarketCapData] = useState<MarketCapData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCryptoData()
  }, [])

  const fetchCryptoData = async () => {
    setLoading(true)
    try {
      // Using CoinGecko API for real crypto data
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
      )
      const data: CoinGeckoCoin[] = await response.json()

      // Transform the data
      const transformedData: CryptoData[] = data
        .slice(0, 5)
        .map((coin: CoinGeckoCoin) => ({
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: `$${coin.current_price.toLocaleString()}`,
          change: `${
            coin.price_change_percentage_24h >= 0 ? '+' : ''
          }${coin.price_change_percentage_24h.toFixed(2)}%`,
          marketCap: coin.market_cap,
        }))

      setCryptoData(transformedData)

      // Create market cap data for donut chart
      const top5Data = data.slice(0, 5)
      const chartData: MarketCapData = {
        labels: top5Data.map((coin: CoinGeckoCoin) => coin.name),
        datasets: [
          {
            label: 'Market Cap (Billions)',
            data: top5Data.map(
              (coin: CoinGeckoCoin) => coin.market_cap / 1000000000
            ), // Convert to billions
            backgroundColor: [
              'rgba(255, 99, 132, 1)', // Red
              'rgba(54, 162, 235, 1)', // Blue
              'rgba(255, 205, 86, 1)', // Yellow
              'rgba(75, 192, 192, 1)', // Teal
              'rgba(153, 102, 255, 1)', // Purple
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 205, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 2,
          },
        ],
      }

      setMarketCapData(chartData)
    } catch (error) {
      console.error('Error fetching crypto data:', error)
      // Fallback to mock data if API fails
      setCryptoData([
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          price: '$45,000',
          change: '+2.5%',
          marketCap: 800,
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          price: '$3,200',
          change: '+1.8%',
          marketCap: 350,
        },
        {
          symbol: 'ADA',
          name: 'Cardano',
          price: '$1.50',
          change: '-0.5%',
          marketCap: 50,
        },
        {
          symbol: 'SOL',
          name: 'Solana',
          price: '$120',
          change: '+5.2%',
          marketCap: 40,
        },
        {
          symbol: 'DOT',
          name: 'Polkadot',
          price: '$25',
          change: '+3.1%',
          marketCap: 30,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return { cryptoData, marketCapData, loading, refetch: fetchCryptoData }
}
