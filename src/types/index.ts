export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  lastUpdated: string
}

export interface CryptoData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  lastUpdated: string
}

export interface NewsItem {
  id: string
  title: string
  summary: string
  url: string
  publishedAt: string
  source: string
  sentiment: 'positive' | 'negative' | 'neutral'
  category: string
  image?: string
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
  title: string
  content: string
  createdAt: string
  updatedAt: string
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
