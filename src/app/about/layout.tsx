import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Market-Mage',
  description:
    'Learn about Market-Mage, the AI-powered trading dashboard for stocks and crypto. Discover our mission, features, and the team behind the platform.',
  keywords: [
    'about Market-Mage',
    'about us',
    'AI trading platform',
    'team',
    'mission',
    'features',
    'stock dashboard',
    'crypto dashboard',
    'market-mage team',
  ],
  openGraph: {
    title: 'About Market-Mage',
    description:
      'Learn about Market-Mage, the AI-powered trading dashboard for stocks and crypto.',
    url: 'https://market-mage.netlify.app/about',
  },
  twitter: {
    title: 'About Market-Mage',
    description:
      'Learn about Market-Mage, the AI-powered trading dashboard for stocks and crypto.',
  },
  alternates: {
    canonical: 'https://market-mage.netlify.app/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
