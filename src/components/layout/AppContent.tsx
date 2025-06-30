'use client'

import { usePageTracking } from '@/hooks/usePageTracking'

interface AppContentProps {
  children: React.ReactNode
}

export const AppContent = ({ children }: AppContentProps) => {
  // Track page visits for achievements
  usePageTracking()

  return <>{children}</>
}
