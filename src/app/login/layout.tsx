import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Market-Mage',
  description:
    'Sign in to your Market-Mage account to access your AI-powered trading dashboard, portfolio, and personalized insights. Secure authentication for all users.',
  keywords: [
    'login',
    'sign in',
    'user authentication',
    'secure login',
    'account access',
    'market-mage login',
    'trading dashboard login',
    'crypto dashboard login',
    'stock dashboard login',
  ],
  openGraph: {
    title: 'Login | Market-Mage',
    description:
      'Sign in to your Market-Mage account to access your AI-powered trading dashboard and portfolio.',
    url: 'https://market-mage.netlify.app/login',
  },
  twitter: {
    title: 'Login | Market-Mage',
    description:
      'Sign in to your Market-Mage account to access your AI-powered trading dashboard and portfolio.',
  },
  alternates: {
    canonical: 'https://market-mage.netlify.app/login',
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
