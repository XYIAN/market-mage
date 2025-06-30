import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Confirm Account | Market-Mage',
  description:
    'Confirm your Market-Mage account to unlock your AI-powered trading dashboard, personalized insights, and portfolio features. Secure onboarding for new users.',
  keywords: [
    'confirm account',
    'account confirmation',
    'email confirmation',
    'user onboarding',
    'market-mage confirmation',
    'trading dashboard signup',
    'crypto dashboard signup',
    'stock dashboard signup',
  ],
  openGraph: {
    title: 'Confirm Account | Market-Mage',
    description:
      'Confirm your Market-Mage account to unlock your AI-powered trading dashboard and portfolio.',
    url: 'https://market-mage.netlify.app/confirm',
  },
  twitter: {
    title: 'Confirm Account | Market-Mage',
    description:
      'Confirm your Market-Mage account to unlock your AI-powered trading dashboard and portfolio.',
  },
  alternates: {
    canonical: 'https://market-mage.netlify.app/confirm',
  },
}

export default function ConfirmLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
