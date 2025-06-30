import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | Market-Mage',
  description:
    'Frequently asked questions about Market-Mage. Find help, support, and answers to common questions about our AI-powered trading dashboard.',
  keywords: [
    'FAQ',
    'help',
    'support',
    'questions',
    'trading dashboard help',
    'market-mage support',
    'AI trading FAQ',
    'crypto dashboard help',
    'stock dashboard help',
  ],
  openGraph: {
    title: 'FAQ | Market-Mage',
    description:
      'Frequently asked questions about Market-Mage. Find help, support, and answers to common questions.',
    url: 'https://market-mage.netlify.app/faq',
  },
  twitter: {
    title: 'FAQ | Market-Mage',
    description:
      'Frequently asked questions about Market-Mage. Find help, support, and answers to common questions.',
  },
  alternates: {
    canonical: 'https://market-mage.netlify.app/faq',
  },
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children
}
