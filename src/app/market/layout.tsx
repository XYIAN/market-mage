import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stock Dashboard',
  description:
    'Real-time stock market dashboard with AI-powered trading insights, portfolio tracking, and market analysis. Monitor your favorite stocks, get AI oracle suggestions, and track your investment performance.',
  keywords: [
    'stock dashboard',
    'stock market',
    'portfolio tracker',
    'trading insights',
    'market analysis',
    'AI trading',
    'investment tracking',
    'stock prices',
    'market data',
    'trading platform',
  ],
  openGraph: {
    title: 'Stock Dashboard | Market-Mage',
    description:
      'Real-time stock market dashboard with AI-powered trading insights and portfolio tracking.',
    url: 'https://market-mage.netlify.app/market',
  },
  twitter: {
    title: 'Stock Dashboard | Market-Mage',
    description:
      'Real-time stock market dashboard with AI-powered trading insights and portfolio tracking.',
  },
  alternates: {
    canonical: 'https://market-mage.netlify.app/market',
  },
}

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
