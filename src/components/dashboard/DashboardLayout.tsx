'use client'

import { ReactNode } from 'react'
import { Card } from 'primereact/card'
import { DashboardTitle } from '@/components/layout/DashboardTitle'

interface DashboardLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  showRefreshButton?: boolean
}

export const DashboardLayout = ({
  title,
  subtitle,
  children,
  showRefreshButton = false,
}: DashboardLayoutProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-8">
      {/* Dashboard Title */}
      <DashboardTitle
        title={title}
        subtitle={subtitle}
        showRefreshButton={showRefreshButton}
      />

      {/* Dashboard Content */}
      <div className="w-full max-w-7xl space-y-8">{children}</div>
    </div>
  )
}

// Wrapper component for dashboard sections
export const DashboardSection = ({ children }: { children: ReactNode }) => (
  <Card className="space-card w-full">{children}</Card>
)
