export interface FeatureCard {
  id: string
  title: string
  description: string
  icon: string
  url: string
  image?: string
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
    id: 'market-dashboard',
    title: 'Market Dashboard',
    description:
      'Comprehensive stock market analysis with real-time data, AI insights, and portfolio tracking',
    icon: 'pi pi-chart-line',
    url: '/market',
    image: '/icon-mm-1.png',
  },
  {
    id: 'crypto-dashboard',
    title: 'Crypto Dashboard',
    description:
      'Cryptocurrency market overview with live prices, trends, and digital asset analytics',
    icon: 'pi pi-bitcoin',
    url: '/crypto',
    image: '/icon-ph-1.png',
  },
  {
    id: 'market-news',
    title: 'Market News',
    description:
      'Latest stock market news, analysis, and insights from trusted financial sources',
    icon: 'pi pi-globe',
    url: '/news',
    image: '/icon-mm-1.png',
  },
  {
    id: 'crypto-news',
    title: 'Crypto News',
    description:
      'Breaking cryptocurrency news, blockchain updates, and digital asset market trends',
    icon: 'pi pi-bolt',
    url: '/crypto/news',
    image: '/icon-ph-1.png',
  },
  {
    id: 'ai-oracle',
    title: 'AI Oracle',
    description:
      'Daily AI-powered trading insights and market predictions using advanced algorithms',
    icon: 'pi pi-robot',
    url: '/market?view=oracle',
    image: '/icon-mm-1.png',
  },
  {
    id: 'faq',
    title: 'FAQ & Help',
    description:
      'Frequently asked questions, tutorials, and support for using Market-Mage effectively',
    icon: 'pi pi-question-circle',
    url: '/faq',
    image: '/icon-ph-1.png',
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
