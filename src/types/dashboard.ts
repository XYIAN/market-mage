import { CryptoAsset } from './crypto'
import { WatchlistItem } from './index'

export type DashboardType = 'crypto' | 'market'

export interface BaseDashboardConfig {
  id: string
  name: string
  type: DashboardType
  createdAt: string
  updatedAt: string
  sections: DashboardSection[]
}

export interface CryptoDashboardConfig extends BaseDashboardConfig {
  type: 'crypto'
  assets: CryptoAsset[]
  aiOracleRefreshCount: number
  lastAiOracleRefresh?: string
}

export interface MarketDashboardConfig extends BaseDashboardConfig {
  type: 'market'
  stocks: WatchlistItem[]
  aiOracleRefreshCount: number
  lastAiOracleRefresh?: string
}

export type DashboardConfig = CryptoDashboardConfig | MarketDashboardConfig

export interface DashboardSection {
  id: string
  type: DashboardSectionType
  name: string
  description: string
  enabled: boolean
  position: number
  icon: string
}

export type DashboardSectionType =
  // Crypto sections
  | 'asset-tracker'
  | 'ai-oracle'
  | 'insights'
  | 'market-overview'
  // Market sections
  | 'stock-table'
  | 'historical-notes'
  | 'market-sentiment'
  | 'portfolio-overview'

export interface DashboardSectionOption {
  type: DashboardSectionType
  name: string
  description: string
  icon: string
  availableFor: DashboardType[]
}

export const DASHBOARD_SECTIONS: DashboardSectionOption[] = [
  // Crypto sections
  {
    type: 'asset-tracker',
    name: 'Asset Tracker',
    description: 'Track your cryptocurrency holdings and performance',
    icon: 'pi pi-wallet',
    availableFor: ['crypto'],
  },
  {
    type: 'ai-oracle',
    name: 'AI Oracle',
    description: 'Get AI-powered trading insights and predictions',
    icon: 'pi pi-bolt',
    availableFor: ['crypto', 'market'],
  },
  {
    type: 'insights',
    name: 'Trading Insights',
    description: 'Advanced charts and technical analysis',
    icon: 'pi pi-chart-line',
    availableFor: ['crypto'],
  },
  {
    type: 'market-overview',
    name: 'Market Overview',
    description: 'Overall market statistics and trends',
    icon: 'pi pi-globe',
    availableFor: ['crypto'],
  },
  // Market sections
  {
    type: 'stock-table',
    name: 'Stock Table',
    description: 'Track your stock portfolio and watchlist',
    icon: 'pi pi-table',
    availableFor: ['market'],
  },
  {
    type: 'historical-notes',
    name: 'Historical Notes',
    description: 'Keep track of your trading decisions and notes',
    icon: 'pi pi-book',
    availableFor: ['market'],
  },
  {
    type: 'market-sentiment',
    name: 'Market Sentiment',
    description: 'News sentiment analysis and market mood',
    icon: 'pi pi-heart',
    availableFor: ['market'],
  },
  {
    type: 'portfolio-overview',
    name: 'Portfolio Overview',
    description: 'Overall portfolio performance and allocation',
    icon: 'pi pi-pie-chart',
    availableFor: ['market'],
  },
]

export interface DashboardPreset {
  id: string
  name: string
  description: string
  type: DashboardType
  sections: DashboardSectionType[]
  icon: string
}

export const DASHBOARD_PRESETS: DashboardPreset[] = [
  {
    id: 'crypto-basic',
    name: 'Crypto Basics',
    description: 'Essential crypto tracking with asset management',
    type: 'crypto',
    sections: ['asset-tracker', 'market-overview'],
    icon: 'pi pi-bitcoin',
  },
  {
    id: 'crypto-advanced',
    name: 'Crypto Pro',
    description: 'Full crypto dashboard with AI insights',
    type: 'crypto',
    sections: ['asset-tracker', 'ai-oracle', 'insights', 'market-overview'],
    icon: 'pi pi-rocket',
  },
  {
    id: 'market-basic',
    name: 'Stock Basics',
    description: 'Essential stock tracking and notes',
    type: 'market',
    sections: ['stock-table', 'historical-notes'],
    icon: 'pi pi-chart-bar',
  },
  {
    id: 'market-advanced',
    name: 'Stock Pro',
    description: 'Full stock dashboard with AI and insights',
    type: 'market',
    sections: [
      'stock-table',
      'ai-oracle',
      'historical-notes',
      'market-sentiment',
      'portfolio-overview',
    ],
    icon: 'pi pi-star',
  },
]
