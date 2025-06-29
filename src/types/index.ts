export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  lastUpdated: string
}

export interface CryptoData {
  symbol: string
  name: string
  price: string
  change: string
  marketCap: number
  volume: number
  lastUpdated: string
}

export interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  sentiment?: 'positive' | 'negative' | 'neutral'
}

export interface AIInsight {
  id: string
  content: string
  generatedAt: string
  expiresAt: string
}

export interface WatchlistItem {
  symbol: string
  name: string
  addedAt: string
}

export interface CryptoWatchlistItem {
  symbol: string
  name: string
  addedAt: string
}

export interface HistoricalNote {
  id: string
  symbol: string
  note: string
  timestamp: string
  type: 'buy' | 'sell' | 'hold' | 'note'
}

export interface StockApiResponse {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
}

export interface CryptoApiResponse {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
}

export interface NewsApiResponse {
  articles: Array<{
    title: string
    description: string
    url: string
    publishedAt: string
    source: {
      name: string
    }
  }>
}

export interface MarketStats {
  totalMarketCap: number
  totalVolume: number
  averagePrice: number
  topPerformer: {
    symbol: string
    name: string
    price: string
    change: string
  }
  worstPerformer: {
    symbol: string
    name: string
    price: string
    change: string
  }
}
