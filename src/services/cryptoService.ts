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

interface BinanceTicker {
  symbol: string
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  prevClosePrice: string
  lastPrice: string
  lastQty: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number
  closeTime: number
  firstId: number
  lastId: number
  count: number
}

interface CoinGeckoCoin {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi: null | {
    currency: string
    percentage: number
    times: number
  }
  last_updated: string
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
  private readonly CRYPTO_CACHE_TTL = 10 * 60 * 1000 // 10 minutes
  private readonly PRODUCTS_CACHE_TTL = 10 * 60 * 1000 // 10 minutes
  private refreshInterval: NodeJS.Timeout | null = null

  constructor() {
    // Set up automatic refresh every 10 minutes
    this.startAutoRefresh()
  }

  private startAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }

    this.refreshInterval = setInterval(() => {
      console.log('Auto-refreshing crypto data...')
      this.invalidateCache()
    }, 10 * 60 * 1000) // 10 minutes
  }

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

  async fetchBinanceTickers(): Promise<BinanceTicker[]> {
    return withCache(
      `${CACHE_KEYS.CRYPTO_DATA}_binance`,
      async () => {
        const response = await fetch(
          'https://api.binance.com/api/v3/ticker/24hr'
        )
        if (!response.ok) {
          throw new Error(`Failed to fetch Binance data: ${response.status}`)
        }
        return response.json()
      },
      this.CRYPTO_CACHE_TTL
    )
  }

  async fetchCoinGeckoData(): Promise<CoinGeckoCoin[]> {
    return withCache(
      `${CACHE_KEYS.CRYPTO_DATA}_coingecko`,
      async () => {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false'
        )
        if (!response.ok) {
          throw new Error(`Failed to fetch CoinGecko data: ${response.status}`)
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
          // Fetch from Coinbase and Binance in parallel
          const [coinbaseData, binanceData] = await Promise.all([
            this.getCoinbaseData(),
            this.getBinanceData(),
          ])

          // Combine and deduplicate
          const allData: CryptoData[] = [...coinbaseData, ...binanceData]
          const uniqueData = this.removeDuplicates(allData)
          return uniqueData.slice(0, 20)
        } catch (error) {
          console.error('Error fetching crypto data:', error)
          return this.getFallbackCryptoData()
        }
      },
      this.CRYPTO_CACHE_TTL
    )
  }

  private async getCoinbaseData(): Promise<CryptoData[]> {
    try {
      const products = await this.fetchProducts()
      const usdPairs = products
        .filter(
          (product) =>
            product.quote_currency === 'USD' &&
            product.status === 'online' &&
            !product.trading_disabled
        )
        .slice(0, 10)

      const tickerPromises = usdPairs.map(async (product) => {
        try {
          const ticker = await this.fetchTicker(product.id)
          const currentPrice = parseFloat(ticker.price)
          const currentVolume = parseFloat(ticker.volume)

          const changeData = await historicalDataService.updateHistoricalData(
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
      return tickerResults.filter((result) => result !== null) as CryptoData[]
    } catch (error) {
      console.error('Error fetching Coinbase data:', error)
      return []
    }
  }

  private async getBinanceData(): Promise<CryptoData[]> {
    try {
      const tickers = await this.fetchBinanceTickers()
      const usdtPairs = tickers
        .filter((ticker) => ticker.symbol.endsWith('USDT'))
        .slice(0, 10)

      return usdtPairs.map((ticker) => {
        const symbol = ticker.symbol.replace('USDT', '')
        const price = parseFloat(ticker.lastPrice)
        const changePercent = parseFloat(ticker.priceChangePercent)
        const volume = parseFloat(ticker.volume)

        return {
          symbol,
          name: symbol,
          price: price.toFixed(2),
          change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(
            2
          )}%`,
          volume: volume.toLocaleString(),
          marketCap: price * volume,
          lastUpdated: new Date().toISOString(),
        }
      })
    } catch (error) {
      console.error('Error fetching Binance data:', error)
      return []
    }
  }

  private async getCoinGeckoData(): Promise<CryptoData[]> {
    try {
      const data = await this.fetchCoinGeckoData()
      return data.map((coin) => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price.toFixed(2),
        change: `${
          coin.price_change_percentage_24h >= 0 ? '+' : ''
        }${coin.price_change_percentage_24h.toFixed(2)}%`,
        volume: coin.total_volume.toLocaleString(),
        marketCap: coin.market_cap,
        lastUpdated: new Date().toISOString(),
      }))
    } catch (error) {
      console.error('Error fetching CoinGecko data:', error)
      return []
    }
  }

  private removeDuplicates(data: CryptoData[]): CryptoData[] {
    const seen = new Set<string>()
    return data.filter((item) => {
      const key = item.symbol.toLowerCase()
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
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
        change: '+3.2%',
        volume: '789,123',
        marketCap: 40000000000,
        lastUpdated: new Date().toISOString(),
      },
      {
        symbol: 'DOT',
        name: 'Polkadot',
        price: '25.00',
        change: '+1.1%',
        volume: '234,567',
        marketCap: 25000000000,
        lastUpdated: new Date().toISOString(),
      },
    ]
  }

  calculateMarketStats(cryptoData: CryptoData[]): MarketStats | null {
    if (cryptoData.length === 0) return null

    const totalMarketCap = cryptoData.reduce(
      (sum, crypto) => sum + crypto.marketCap,
      0
    )
    const totalVolume = cryptoData.reduce(
      (sum, crypto) => sum + parseFloat(crypto.volume.replace(/,/g, '')),
      0
    )
    const averagePrice =
      cryptoData.reduce((sum, crypto) => sum + parseFloat(crypto.price), 0) /
      cryptoData.length

    // Find top and worst performers
    let topPerformer = cryptoData[0]
    let worstPerformer = cryptoData[0]

    cryptoData.forEach((crypto) => {
      const change = parseFloat(crypto.change.replace(/[+%]/g, ''))
      const topChange = parseFloat(topPerformer.change.replace(/[+%]/g, ''))
      const worstChange = parseFloat(worstPerformer.change.replace(/[+%]/g, ''))

      if (change > topChange) {
        topPerformer = crypto
      }
      if (change < worstChange) {
        worstPerformer = crypto
      }
    })

    return {
      totalMarketCap,
      totalVolume,
      topPerformer,
      worstPerformer,
      averagePrice,
    }
  }

  formatCurrency(value: number): string {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`
    }
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`
    }
    if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`
    }
    return `$${value.toLocaleString()}`
  }

  invalidateCache(): void {
    cacheManager.invalidate(CACHE_KEYS.CRYPTO_DATA)
    cacheManager.invalidate(CACHE_KEYS.COINBASE_PRODUCTS)
    cacheManager.invalidate(`${CACHE_KEYS.CRYPTO_DATA}_binance`)
    cacheManager.invalidate(`${CACHE_KEYS.CRYPTO_DATA}_coingecko`)
  }

  destroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
    }
  }
}

export const cryptoService = new CryptoService()
