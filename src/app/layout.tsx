import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/styles/components/hero.css'
import { PrimeReactProvider } from 'primereact/api'
import { AppContent } from '@/components/layout/AppContent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Market-Mage - AI-Powered Stock Dashboard',
  description:
    'A modern stock dashboard with AI-powered trading insights, real-time market data, and portfolio management tools.',
  keywords:
    'stock dashboard, trading insights, AI trading, portfolio management, market data',
  authors: [{ name: 'Market-Mage Team' }],
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
        <PrimeReactProvider>
          <AppContent>{children}</AppContent>
        </PrimeReactProvider>
      </body>
    </html>
  )
}
