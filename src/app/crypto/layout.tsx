import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crypto Dashboard',
  description:
    'Real-time cryptocurrency dashboard with AI-powered trading insights, portfolio tracking, and market analysis. Monitor Bitcoin, Ethereum, and other cryptocurrencies with advanced AI oracle suggestions.',
  keywords: [
    'crypto dashboard',
    'cryptocurrency',
    'bitcoin',
    'ethereum',
    'crypto trading',
    'digital assets',
    'blockchain',
    'crypto portfolio',
    'AI trading',
    'crypto market',
    'cryptocurrency prices',
    'crypto analysis',
  ],
  openGraph: {
    title: 'Crypto Dashboard | Market-Mage',
    description:
      'Real-time cryptocurrency dashboard with AI-powered trading insights and portfolio tracking.',
    url: 'https://market-mage.netlify.app/crypto',
  },
  twitter: {
    title: 'Crypto Dashboard | Market-Mage',
    description:
      'Real-time cryptocurrency dashboard with AI-powered trading insights and portfolio tracking.',
  },
  alternates: {
    canonical: 'https://market-mage.netlify.app/crypto',
  },
}

export default function CryptoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
