import { useEffect } from 'react'
import { useGlobalData } from '@/providers/GlobalDataProvider'

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
  const { globalCryptoData, marketLoading, refreshMarketData, loadMarketData } =
    useGlobalData()

  // Load market data when this hook is used
  useEffect(() => {
    loadMarketData()
  }, [loadMarketData])

  // Transform the global crypto data
  const cryptoData: CryptoData[] = globalCryptoData
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

  // Create market cap data for donut chart
  const top5Data = globalCryptoData.slice(0, 5)
  const marketCapData: MarketCapData | null =
    top5Data.length > 0
      ? {
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
      : null

  return {
    cryptoData,
    marketCapData,
    loading: marketLoading,
    refetch: refreshMarketData,
  }
}
