'use client'

import NavDial from '@/components/layout/NavDial'
import { NewsTicker } from '@/components/news-ticker'
import { useNewsTicker } from '@/hooks/useNewsTicker'

interface AppContentProps {
  children: React.ReactNode
}

export const AppContent = ({ children }: AppContentProps) => {
  const { news, loading } = useNewsTicker()

  return (
    <>
      <NewsTicker news={news} loading={loading} />
      {children}
      <NavDial />
    </>
  )
}
