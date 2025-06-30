import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Privacy | Market-Mage',
  description:
    'Read the terms of service and privacy policy for Market-Mage. Learn how we protect your data and your rights as a user.',
  keywords: [
    'terms of service',
    'privacy policy',
    'legal',
    'user rights',
    'data protection',
    'market-mage terms',
    'market-mage privacy',
    'compliance',
    'security',
  ],
  openGraph: {
    title: 'Terms & Privacy | Market-Mage',
    description:
      'Read the terms of service and privacy policy for Market-Mage.',
    url: 'https://market-mage.netlify.app/terms',
  },
  twitter: {
    title: 'Terms & Privacy | Market-Mage',
    description:
      'Read the terms of service and privacy policy for Market-Mage.',
  },
  alternates: {
    canonical: 'https://market-mage.netlify.app/terms',
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
