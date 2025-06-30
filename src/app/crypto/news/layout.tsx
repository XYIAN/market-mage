import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crypto News & Insights',
  description:
    'Get the latest cryptocurrency news, AI-powered insights, and interactive charts. Stay ahead with trending crypto news, sentiment analysis, and digital asset updates.',
  keywords: [
    'crypto news',
    'cryptocurrency news',
    'bitcoin news',
    'ethereum news',
    'AI crypto insights',
    'crypto charts',
    'digital assets',
    'blockchain news',
    'crypto sentiment',
    'crypto analysis',
  ],
  openGraph: {
    title: 'Crypto News & Insights | Market-Mage',
    description:
      'Latest cryptocurrency news, AI-powered insights, and interactive charts.',
    url: 'https://market-mage.netlify.app/crypto/news',
  },
  twitter: {
    title: 'Crypto News & Insights | Market-Mage',
    description:
      'Latest cryptocurrency news, AI-powered insights, and interactive charts.',
  },
  alternates: {
    canonical: 'https://market-mage.netlify.app/crypto/news',
  },
}

export default function CryptoNewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
