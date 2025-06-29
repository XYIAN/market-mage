'use client'

import { Button } from 'primereact/button'

interface DashboardTitleProps {
  title: string
  subtitle: string
  onRefresh?: () => void
  showRefreshButton?: boolean
}

export const DashboardTitle = ({
  title,
  subtitle,
  onRefresh,
  showRefreshButton = true,
}: DashboardTitleProps) => {
  return (
    <div className="dashboard-title-section">
      <div className="flex flex-col items-center justify-center text-center mb-6">
        <div className="title-container">
          <h1 className="dashboard-title dark-blue-glow">{title}</h1>
          <div className="title-underline"></div>
        </div>
        <p className="dashboard-subtitle">{subtitle}</p>
        {showRefreshButton && onRefresh && (
          <Button
            label="Refresh Data"
            icon="pi pi-refresh"
            onClick={onRefresh}
            className="mt-4 space-button"
          />
        )}
      </div>
    </div>
  )
}
