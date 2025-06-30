import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Market News & Insights',
  description:
    'Stay updated with the latest stock and crypto market news, AI-powered insights, and interactive charts. Explore trending financial news, sentiment analysis, and market data in one place.',
  keywords: [
    'market news',
    'crypto news',
    'financial news',
    'stock news',
    'news carousel',
    'market sentiment',
    'AI insights',
    'market charts',
    'trending news',
    'financial analysis',
  ],
  openGraph: {
    title: 'Market News & Insights | Market-Mage',
    description:
      'Latest stock and crypto market news, AI-powered insights, and interactive charts.',
    url: 'https://market-mage.netlify.app/news',
  },
  twitter: {
    title: 'Market News & Insights | Market-Mage',
    description:
      'Latest stock and crypto market news, AI-powered insights, and interactive charts.',
  },
  alternates: {
    canonical: 'https://market-mage.netlify.app/news',
  },
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
