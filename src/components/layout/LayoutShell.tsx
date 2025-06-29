'use client'

import { ReactNode } from 'react'
import { NewsTicker } from '@/components/layout/news-ticker'
// import NavDial from '@/components/layout/NavDial' // Commented out for future use
import { Sidebar } from '@/components/layout/Sidebar'
import { CookieBanner } from '@/components/layout/CookieBanner'
import { useNewsTicker } from '@/hooks/useNewsTicker'

interface LayoutShellProps {
  children: ReactNode
}

export default function LayoutShell({ children }: LayoutShellProps) {
  const { news, loading } = useNewsTicker()
  return (
    <>
      <NewsTicker news={news} loading={loading} />
      <Sidebar />
      {children}
      {/* <NavDial /> */} {/* Commented out for future use */}
      <CookieBanner />
    </>
  )
}
