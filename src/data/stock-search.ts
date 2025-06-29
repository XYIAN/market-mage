export interface StockSearchItem {
  symbol: string
  name: string
  exchange: string
  type: string
  marketCap?: string
  sector?: string
}

export const POPULAR_STOCKS: StockSearchItem[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    type: 'Stock',
    marketCap: '2.8T',
    sector: 'Technology',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    type: 'Stock',
    marketCap: '2.7T',
    sector: 'Technology',
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    exchange: 'NASDAQ',
    type: 'Stock',
    marketCap: '1.8T',
    sector: 'Technology',
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    exchange: 'NASDAQ',
    type: 'Stock',
    marketCap: '1.6T',
    sector: 'Consumer Cyclical',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    type: 'Stock',
    marketCap: '1.2T',
    sector: 'Technology',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    exchange: 'NASDAQ',
    type: 'Stock',
    marketCap: '800B',
    sector: 'Consumer Cyclical',
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    exchange: 'NASDAQ',
    type: 'Stock',
    marketCap: '900B',
    sector: 'Technology',
  },
  {
    symbol: 'BRK.A',
    name: 'Berkshire Hathaway Inc.',
    exchange: 'NYSE',
    type: 'Stock',
    marketCap: '700B',
    sector: 'Financial Services',
  },
  {
    symbol: 'UNH',
    name: 'UnitedHealth Group Inc.',
    exchange: 'NYSE',
    type: 'Stock',
    marketCap: '500B',
    sector: 'Healthcare',
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    exchange: 'NYSE',
    type: 'Stock',
    marketCap: '400B',
    sector: 'Healthcare',
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    exchange: 'NYSE',
    type: 'Stock',
    marketCap: '450B',
    sector: 'Financial Services',
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    exchange: 'NYSE',
    type: 'Stock',
    marketCap: '500B',
    sector: 'Financial Services',
  },
  {
    symbol: 'PG',
    name: 'Procter & Gamble Co.',
    exchange: 'NYSE',
    type: 'Stock',
    marketCap: '350B',
    sector: 'Consumer Defensive',
  },
  {
    symbol: 'HD',
    name: 'The Home Depot Inc.',
    exchange: 'NYSE',
    type: 'Stock',
    marketCap: '300B',
    sector: 'Consumer Cyclical',
  },
  {
    symbol: 'MA',
    name: 'Mastercard Inc.',
    exchange: 'NYSE',
    type: 'Stock',
    marketCap: '400B',
    sector: 'Financial Services',
  },
  {
    symbol: 'DIS',
    name: 'The Walt Disney Company',
    exchange: 'NYSE',
    type: 'Stock',
    marketCap: '200B',
    sector: 'Communication Services',
  },
  {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    exchange: 'NASDAQ',
    type: 'Stock',
    marketCap: '250B',
    sector: 'Communication Services',
  },
  {
    symbol: 'CRM',
    name: 'Salesforce Inc.',
    exchange: 'NYSE',
    type: 'Stock',
    marketCap: '200B',
    sector: 'Technology',
  },
  {
    symbol: 'ADBE',
    name: 'Adobe Inc.',
    exchange: 'NASDAQ',
    type: 'Stock',
    marketCap: '250B',
    sector: 'Technology',
  },
  {
    symbol: 'PYPL',
    name: 'PayPal Holdings Inc.',
    exchange: 'NASDAQ',
    type: 'Stock',
    marketCap: '70B',
    sector: 'Financial Services',
  },
]

export const searchStocks = (query: string): StockSearchItem[] => {
  if (!query) return POPULAR_STOCKS

  const lowerQuery = query.toLowerCase()
  return POPULAR_STOCKS.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(lowerQuery) ||
      stock.name.toLowerCase().includes(lowerQuery) ||
      stock.sector?.toLowerCase().includes(lowerQuery)
  )
}
