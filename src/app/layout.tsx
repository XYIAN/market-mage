import type { Metadata, Viewport } from 'next'
import { Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import '@/styles/components/hero.css'
import { PrimeReactProvider } from 'primereact/api'
import { AppContent } from '@/components/layout/AppContent'
import { WizardToastProvider } from '@/components/layout/WizardToastProvider'
import LayoutShell from '@/components/layout/LayoutShell'
import { SupabaseProvider } from '@/lib/providers/SupabaseProvider'

const inter = Inter({ subsets: ['latin'] })

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-ibm-plex-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'Market-Mage | AI-Powered Stock & Crypto Dashboard',
    template: '%s | Market-Mage',
  },
  description:
    'Advanced AI-powered trading dashboard with real-time stock and cryptocurrency data, market insights, and intelligent trading suggestions. Track your portfolio, get AI oracle insights, and stay ahead of the markets.',
  keywords: [
    'stock dashboard',
    'crypto dashboard',
    'AI trading',
    'market analysis',
    'portfolio tracker',
    'trading insights',
    'real-time data',
    'cryptocurrency',
    'stocks',
    'investment tools',
    'trading platform',
    'market intelligence',
    'financial dashboard',
  ],
  authors: [{ name: 'Market-Mage Team' }],
  creator: 'Market-Mage',
  publisher: 'Market-Mage',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://market-mage.netlify.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://market-mage.netlify.app',
    siteName: 'Market-Mage',
    title: 'Market-Mage | AI-Powered Stock & Crypto Dashboard',
    description:
      'Advanced AI-powered trading dashboard with real-time stock and cryptocurrency data, market insights, and intelligent trading suggestions.',
    images: [
      {
        url: '/icon-mm-1.png',
        width: 1200,
        height: 630,
        alt: 'Market-Mage Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@marketmage',
    creator: '@marketmage',
    title: 'Market-Mage | AI-Powered Stock & Crypto Dashboard',
    description:
      'Advanced AI-powered trading dashboard with real-time stock and cryptocurrency data, market insights, and intelligent trading suggestions.',
    images: ['/icon-mm-1.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'finance',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <PrimeReactProvider>
            <WizardToastProvider>
              <LayoutShell>
                <AppContent>{children}</AppContent>
              </LayoutShell>
            </WizardToastProvider>
          </PrimeReactProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
