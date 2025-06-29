export interface FeatureCard {
  id: string
  title: string
  description: string
  icon: string
  url?: string
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
