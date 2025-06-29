import {
  cacheManager,
  CACHE_KEYS,
  withCache,
  createCacheKey,
} from '@/utils/cache'
import { historicalDataService } from './historicalDataService'

interface CoinbaseProduct {
  id: string
  base_currency: string
  quote_currency: string
  base_min_size: string
  base_max_size: string
  quote_increment: string
  base_increment: string
  display_name: string
  status: string
  status_message: string
  min_market_funds: string
  max_market_funds: string
  post_only: boolean
  limit_only: boolean
  cancel_only: boolean
  trading_disabled: boolean
  fx_stablecoin: boolean
  max_slippage_percentage: string
  auction_mode: boolean
  high_bid_limit_percentage: string
}

interface CoinbaseTicker {
  trade_id: number
  price: string
  size: string
  time: string
  bid: string
  ask: string
  volume: string
}

export interface CryptoData {
  symbol: string
  name: string
  price: string
  change: string
  volume: string
  marketCap: number
  lastUpdated: string
}

export interface MarketStats {
  totalMarketCap: number
  totalVolume: number
  topPerformer: CryptoData
  worstPerformer: CryptoData
  averagePrice: number
}

class CryptoService {
  private readonly CRYPTO_CACHE_TTL = 2 * 60 * 1000 // 2 minutes
  private readonly PRODUCTS_CACHE_TTL = 10 * 60 * 1000 // 10 minutes

  async fetchProducts(): Promise<CoinbaseProduct[]> {
    return withCache(
      CACHE_KEYS.COINBASE_PRODUCTS,
      async () => {
        const response = await fetch(
          'https://api.exchange.coinbase.com/products'
        )
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`)
        }
        return response.json()
      },
      this.PRODUCTS_CACHE_TTL
    )
  }

  async fetchTicker(productId: string): Promise<CoinbaseTicker> {
    const cacheKey = createCacheKey(CACHE_KEYS.COINBASE_TICKERS, { productId })
    return withCache(
      cacheKey,
      async () => {
        const response = await fetch(
          `https://api.exchange.coinbase.com/products/${productId}/ticker`
        )
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ticker for ${productId}: ${response.status}`
          )
        }
        return response.json()
      },
      this.CRYPTO_CACHE_TTL
    )
  }

  async getCryptoData(): Promise<CryptoData[]> {
    return withCache(
      CACHE_KEYS.CRYPTO_DATA,
      async () => {
        try {
          const products = await this.fetchProducts()

          // Filter for USD pairs and get top trading pairs
          const usdPairs = products
            .filter(
              (product) =>
                product.quote_currency === 'USD' &&
                product.status === 'online' &&
                !product.trading_disabled
            )
            .slice(0, 10)

          // Fetch ticker data for each product
          const tickerPromises = usdPairs.map(async (product) => {
            try {
              const ticker = await this.fetchTicker(product.id)
              const currentPrice = parseFloat(ticker.price)
              const currentVolume = parseFloat(ticker.volume)

              // Update historical data and get real change percentage
              const changeData =
                await historicalDataService.updateHistoricalData(
                  product.base_currency,
                  currentPrice,
                  currentVolume
                )

              return {
                symbol: product.base_currency,
                name: product.display_name,
                price: currentPrice.toFixed(2),
                change: historicalDataService.formatChangeDisplay(
                  changeData.changePercent
                ),
                volume: currentVolume.toLocaleString(),
                marketCap: currentPrice * currentVolume,
                lastUpdated: ticker.time,
              }
            } catch (error) {
              console.error(`Error fetching ticker for ${product.id}:`, error)
              return null
            }
          })

          const tickerResults = await Promise.all(tickerPromises)
          const validResults = tickerResults.filter(
            (result) => result !== null
          ) as CryptoData[]

          // Generate mock historical data for symbols that don't have it yet
          if (validResults.length > 0) {
            const symbols = validResults.map((crypto) => crypto.symbol)
            await historicalDataService.generateMockHistoricalData(symbols)
          }

          return validResults
        } catch (error) {
          console.error('Error fetching crypto data:', error)
          // Return fallback data
          return this.getFallbackCryptoData()
        }
      },
      this.CRYPTO_CACHE_TTL
    )
  }

  private getFallbackCryptoData(): CryptoData[] {
    return [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: '45000.00',
        change: '+2.5%',
        volume: '1,234,567',
        marketCap: 800000000000,
        lastUpdated: new Date().toISOString(),
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: '3200.00',
        change: '+1.8%',
        volume: '987,654',
        marketCap: 350000000000,
        lastUpdated: new Date().toISOString(),
      },
      {
        symbol: 'ADA',
        name: 'Cardano',
        price: '1.50',
        change: '-0.5%',
        volume: '456,789',
        marketCap: 50000000000,
        lastUpdated: new Date().toISOString(),
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        price: '120.00',
        change: '+5.2%',
        volume: '234,567',
        marketCap: 40000000000,
        lastUpdated: new Date().toISOString(),
      },
      {
        symbol: 'DOT',
        name: 'Polkadot',
        price: '25.00',
        change: '+3.1%',
        volume: '123,456',
        marketCap: 30000000000,
        lastUpdated: new Date().toISOString(),
      },
    ]
  }

  calculateMarketStats(cryptoData: CryptoData[]): MarketStats | null {
    if (!cryptoData.length) return null

    const totalMarketCap = cryptoData.reduce(
      (sum, crypto) => sum + crypto.marketCap,
      0
    )
    const totalVolume = cryptoData.reduce(
      (sum, crypto) => sum + parseFloat(crypto.volume.replace(/,/g, '')),
      0
    )

    const topPerformer = cryptoData.reduce((max, crypto) => {
      const change = parseFloat(crypto.change.replace(/[+%]/g, ''))
      const maxChange = parseFloat(max.change.replace(/[+%]/g, ''))
      return change > maxChange ? crypto : max
    })

    const worstPerformer = cryptoData.reduce((min, crypto) => {
      const change = parseFloat(crypto.change.replace(/[+%]/g, ''))
      const minChange = parseFloat(min.change.replace(/[+%]/g, ''))
      return change < minChange ? crypto : min
    })

    return {
      totalMarketCap,
      totalVolume,
      topPerformer,
      worstPerformer,
      averagePrice:
        cryptoData.reduce((sum, crypto) => sum + parseFloat(crypto.price), 0) /
        cryptoData.length,
    }
  }

  formatCurrency(value: number): string {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  invalidateCache(): void {
    cacheManager.invalidate(CACHE_KEYS.CRYPTO_DATA)
    cacheManager.invalidate(CACHE_KEYS.COINBASE_PRODUCTS)
    // Note: Individual ticker caches will expire naturally
  }
}

export const cryptoService = new CryptoService()
