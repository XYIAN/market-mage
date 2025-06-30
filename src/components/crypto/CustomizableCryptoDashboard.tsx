'use client'

import { useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import { SpeedDial } from 'primereact/speeddial'
import { AssetTracker } from './AssetTracker'
import { CryptoAIOracle } from './CryptoAIOracle'
import { CryptoInsights } from './CryptoInsights'
import { MarketOverview } from './MarketOverview'
import { DashboardStepper } from '../dashboard/DashboardStepper'
import { DashboardEditDialog } from '../dashboard/DashboardEditDialog'
import { UserProfile } from '../dashboard/UserProfile'
import {
  DashboardConfig,
  DashboardSection,
  CryptoDashboardConfig,
} from '@/types/dashboard'
import { CryptoAsset } from '@/types/crypto'

const STORAGE_KEY = 'crypto-dashboard-config'

export function CustomizableCryptoDashboard() {
  const [config, setConfig] = useState<DashboardConfig | null>(null)
  const [showStepper, setShowStepper] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadDashboardConfig()
  }, [])

  const loadDashboardConfig = () => {
    if (typeof window === 'undefined') return
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY)
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig))
      }
    } catch (error) {
      console.error('Error loading dashboard config:', error)
    }
  }

  const saveDashboardConfig = (newConfig: DashboardConfig) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig))
      setConfig(newConfig)
    } catch (error) {
      console.error('Error saving dashboard config:', error)
    }
  }

  const handleAssetsChange = (assets: CryptoAsset[]) => {
    if (config && config.type === 'crypto') {
      const updatedConfig = { ...config, assets }
      saveDashboardConfig(updatedConfig)
    }
  }

  const handleAIOracleRefresh = (refreshCount: number) => {
    if (config && config.type === 'crypto') {
      const updatedConfig = {
        ...config,
        aiOracleRefreshCount: refreshCount,
        lastAiOracleRefresh: new Date().toISOString(),
      }
      saveDashboardConfig(updatedConfig)
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

  const renderSection = (section: DashboardSection) => {
    if (!section.enabled || config?.type !== 'crypto') return null
    const cryptoConfig = config as CryptoDashboardConfig

    switch (section.type) {
      case 'asset-tracker':
        return (
          <AssetTracker
            key={section.id}
            assets={cryptoConfig.assets || []}
            onAssetsChange={handleAssetsChange}
          />
        )
      case 'ai-oracle':
        return (
          <CryptoAIOracle
            key={section.id}
            assets={cryptoConfig.assets || []}
            refreshCount={cryptoConfig.aiOracleRefreshCount || 0}
            onRefreshCountChange={handleAIOracleRefresh}
            lastRefresh={
              cryptoConfig.lastAiOracleRefresh
                ? new Date(cryptoConfig.lastAiOracleRefresh)
                : undefined
            }
          />
        )
      case 'insights':
        return (
          <CryptoInsights key={section.id} assets={cryptoConfig.assets || []} />
        )
      case 'market-overview':
        return <MarketOverview key={section.id} />
      default:
        return null
    }
  }

  // If no configuration exists, show the initial setup
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center bg-transparent">
          <div className="py-12">
            <i className="pi pi-bitcoin text-6xl text-orange-500 mb-6"></i>
            <h1 className="text-3xl font-bold mb-4">
              Welcome to Your Crypto Dashboard
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Customize your dashboard by selecting features, charts, and
              cryptocurrencies to track. Get AI-powered insights and monitor
              your portfolio all in one place.
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
          dashboardType="crypto"
        />

        {/* Loading Overlay */}
        {saving && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <i className="pi pi-spin pi-spinner text-4xl text-white"></i>
          </div>
        )}
      </div>
    )
  }

  const enabledSections = config.sections
    .filter((s: DashboardSection) => s.enabled)
    .sort((a: DashboardSection, b: DashboardSection) => a.position - b.position)
  const assetCount =
    config.type === 'crypto'
      ? (config as CryptoDashboardConfig).assets?.length || 0
      : 0

  return (
    <div className="min-h-screen p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{config.name}</h1>
            <p className="text-gray-600">
              {assetCount} assets • {enabledSections.length} features
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <UserProfile />
            <Button
              label="Edit Dashboard"
              icon="pi pi-pencil"
              onClick={handleEditDashboard}
              className="p-button-outlined"
            />
          </div>
        </div>
      </div>

      {enabledSections.length === 0 ? (
        <div className="text-center py-12">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enabledSections.map((section: DashboardSection) => (
            <div key={section.id} className="h-full">
              {renderSection(section)}
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
            label: 'Add Asset',
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
        dashboardType="crypto"
      />

      {/* Loading Overlay */}
      {saving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <i className="pi pi-spin pi-spinner text-4xl text-white"></i>
        </div>
      )}
    </div>
  )
}
