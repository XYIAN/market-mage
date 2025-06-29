export interface FeatureCard {
  id: string
  title: string
  description: string
  icon: string
  url?: string
}

export interface StatCard {
  id: string
  title: string
  value: string
  description: string
  icon: string
}

export const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'real-time-data',
    title: 'Real-Time Data',
    description: 'Live stock prices and market data updated every 5 minutes',
    icon: 'pi pi-chart-line',
  },
  {
    id: 'ai-oracle',
    title: 'AI Oracle',
    description: 'Daily AI-powered trading insights and market analysis',
    icon: 'pi pi-magic',
  },
  {
    id: 'portfolio-tracking',
    title: 'Portfolio Tracking',
    description: 'Manage your watchlist and track historical notes',
    icon: 'pi pi-book',
  },
]

export const STATS_DATA: StatCard[] = [
  {
    id: 'market-cap',
    title: 'Market Cap',
    value: '$2.5T',
    description: 'Total market capitalization tracked',
    icon: 'pi pi-dollar',
  },
  {
    id: 'stocks-tracked',
    title: 'Stocks Tracked',
    value: '500+',
    description: 'Global stocks and indices',
    icon: 'pi pi-chart-bar',
  },
  {
    id: 'ai-insights',
    title: 'AI Insights',
    value: 'Daily',
    description: 'Fresh trading insights every day',
    icon: 'pi pi-brain',
  },
  {
    id: 'real-time',
    title: 'Real-Time',
    value: '24/7',
    description: 'Continuous market monitoring',
    icon: 'pi pi-clock',
  },
]
