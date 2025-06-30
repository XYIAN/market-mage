'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { SpeedDial } from 'primereact/speeddial'
import { Toast } from 'primereact/toast'
import { DashboardConfig, DashboardType } from '@/types/dashboard'
import { DashboardStepper } from './DashboardStepper'
import { DashboardEditDialog } from './DashboardEditDialog'

interface CustomizableDashboardProps {
  dashboardType: DashboardType
  storageKey: string
  renderSection: (
    section: DashboardConfig['sections'][number],
    config: DashboardConfig
  ) => React.ReactNode
}

export function CustomizableDashboard({
  dashboardType,
  storageKey,
  renderSection,
}: CustomizableDashboardProps) {
  const [config, setConfig] = useState<DashboardConfig | null>(null)
  const [showStepper, setShowStepper] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const toast = useRef<Toast>(null)

  useEffect(() => {
    loadDashboardConfig()
  }, [])

  const loadDashboardConfig = () => {
    if (typeof window === 'undefined') return
    try {
      const savedConfig = localStorage.getItem(storageKey)
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig))
      }
    } catch (error) {
      console.error('Error loading dashboard config:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load dashboard configuration',
        life: 3000,
      })
    }
  }

  const saveDashboardConfig = (newConfig: DashboardConfig) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(storageKey, JSON.stringify(newConfig))
      setConfig(newConfig)
      toast.current?.show({
        severity: 'success',
        summary: 'Dashboard Saved',
        detail: `${newConfig.name} has been updated successfully!`,
        life: 3000,
      })
    } catch (error) {
      console.error('Error saving dashboard config:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save dashboard configuration',
        life: 3000,
      })
    }
  }

  const handleInitialSetup = () => {
    setShowStepper(true)
    console.log('Opening initial setup stepper')
  }

  const handleEditDashboard = () => {
    setEditMode(true)
    setShowEditDialog(true)
    console.log('Opening edit dialog')
  }

  const handleSaveConfig = async (newConfig: DashboardConfig) => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 900)) // Simulate save delay
    saveDashboardConfig(newConfig)
    setSaving(false)
    setShowEditDialog(false)
    console.log('Edit dialog closed after save')
  }

  const handleStepperSave = async (newConfig: DashboardConfig) => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate save delay
    saveDashboardConfig(newConfig)
    setSaving(false)
    setShowStepper(false)
    console.log('Stepper closed after initial setup')
  }

  const getDashboardIcon = () => {
    return dashboardType === 'crypto' ? 'pi-bitcoin' : 'pi-chart-bar'
  }

  const getDashboardTitle = () => {
    return dashboardType === 'crypto' ? 'Crypto Dashboard' : 'Market Dashboard'
  }

  const getDashboardDescription = () => {
    return dashboardType === 'crypto'
      ? 'Customize your dashboard by selecting features, charts, and cryptocurrencies to track. Get AI-powered insights and monitor your portfolio all in one place.'
      : 'Customize your dashboard by selecting features, charts, and stocks to track. Get AI-powered insights and monitor your portfolio all in one place.'
  }

  // If no configuration exists, show the initial setup
  if (!config) {
    return (
      <>
        <Toast ref={toast} />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl text-center bg-transparent">
            <div className="py-12">
              <i
                className={`pi ${getDashboardIcon()} text-6xl text-orange-500 mb-6`}
              ></i>
              <h1 className="text-3xl font-bold mb-4">
                Welcome to Your {getDashboardTitle()}
              </h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {getDashboardDescription()}
              </p>
              <Button
                label="Customize My Dashboard"
                icon="pi pi-cog"
                onClick={handleInitialSetup}
                className="p-button-lg"
              />
            </div>
          </div>

          {/* Initial Setup Stepper */}
          <DashboardStepper
            visible={showStepper}
            onHide={() => setShowStepper(false)}
            onSave={handleStepperSave}
            dashboardType={dashboardType}
          />

          {/* Loading Overlay */}
          {saving && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <i className="pi pi-spin pi-spinner text-4xl text-white"></i>
            </div>
          )}
        </div>
      </>
    )
  }

  const enabledSections = config.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.position - b.position)
  const assetCount = (() => {
    if (dashboardType === 'crypto' && 'assets' in config!) {
      return (
        (config as DashboardConfig & { assets?: unknown[] }).assets?.length || 0
      )
    } else if (dashboardType === 'market' && 'stocks' in config!) {
      return (
        (config as DashboardConfig & { stocks?: unknown[] }).stocks?.length || 0
      )
    }
    return 0
  })()

  return (
    <>
      <Toast ref={toast} />
      <div className="min-h-screen p-4 flex flex-col items-center">
        <div className="mb-6 w-full max-w-4xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{config.name}</h1>
              <p className="text-gray-600">
                {assetCount} {dashboardType === 'crypto' ? 'assets' : 'stocks'}{' '}
                • {enabledSections.length} features
              </p>
            </div>
            <Button
              label="Edit Dashboard"
              icon="pi pi-pencil"
              onClick={handleEditDashboard}
              className="p-button-outlined"
            />
          </div>
        </div>

        {enabledSections.length === 0 ? (
          <div className="text-center py-12 w-full max-w-2xl">
            <i className="pi pi-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">No Features Enabled</h2>
            <p className="text-gray-600 mb-4">
              Your dashboard doesn&apos;t have any features enabled yet.
            </p>
            <Button
              label="Add Features"
              icon="pi pi-plus"
              onClick={handleEditDashboard}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 w-full">
            {enabledSections.map((section) => (
              <div
                key={section.id}
                className="w-full max-w-3xl flex justify-center"
              >
                <div className="w-full flex flex-col items-center">
                  {renderSection(section, config)}
                </div>
              </div>
            ))}
          </div>
        )}

        <SpeedDial
          model={[
            {
              label: 'Edit Dashboard',
              icon: 'pi pi-pencil',
              command: handleEditDashboard,
            },
            {
              label: dashboardType === 'crypto' ? 'Add Asset' : 'Add Stock',
              icon: 'pi pi-plus',
              command: handleEditDashboard,
            },
          ]}
          radius={80}
          type="semi-circle"
          className="fixed bottom-6 left-6"
        />

        {/* Edit Dialog */}
        <DashboardEditDialog
          visible={showEditDialog}
          onHide={() => setShowEditDialog(false)}
          mode={editMode ? 'edit' : 'create'}
          initialConfig={editMode && config ? config : undefined}
          onSave={handleSaveConfig}
          dashboardType={dashboardType}
        />

        {/* Loading Overlay */}
        {saving && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <i className="pi pi-spin pi-spinner text-4xl text-white"></i>
          </div>
        )}
      </div>
    </>
  )
}
