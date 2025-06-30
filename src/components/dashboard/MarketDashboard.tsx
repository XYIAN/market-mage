'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { SpeedDial } from 'primereact/speeddial'
import { Toast } from 'primereact/toast'
import { StockTable } from './StockTable'
import { AIOracle } from './AIOracle'
import { HistoricalNotes } from './HistoricalNotes'
import { DashboardStepper } from './DashboardStepper'
import { DashboardEditDialog } from './DashboardEditDialog'
import { UserProfile } from './UserProfile'
import {
  DashboardConfig,
  DashboardSection,
  MarketDashboardConfig,
} from '@/types/dashboard'
import { StockData, HistoricalNote } from '@/types'
import { storageUtils } from '@/utils/storage'
import { stockService } from '@/services/stockService'

const STORAGE_KEY = 'market-dashboard-config'

export function MarketDashboard() {
  const [config, setConfig] = useState<DashboardConfig | null>(null)
  const [showStepper, setShowStepper] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [stockData, setStockData] = useState<StockData[]>([])
  const [notes, setNotes] = useState<HistoricalNote[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const toast = useRef<Toast>(null)

  useEffect(() => {
    loadDashboardConfig()
    loadInitialData()
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
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load dashboard configuration',
        life: 3000,
      })
    }
  }

  const loadInitialData = () => {
    const savedWatchlist = storageUtils.getWatchlist()
    console.log('Saved watchlist:', savedWatchlist)

    if (savedWatchlist.length === 0) {
      // Add some default stocks if watchlist is empty
      storageUtils.addToWatchlist('AAPL', 'Apple Inc.')
      storageUtils.addToWatchlist('GOOGL', 'Alphabet Inc.')
      storageUtils.addToWatchlist('MSFT', 'Microsoft Corporation')
      storageUtils.addToWatchlist('TSLA', 'Tesla Inc.')
      storageUtils.addToWatchlist('AMZN', 'Amazon.com Inc.')

      const updatedWatchlist = storageUtils.getWatchlist()
      fetchStockData(updatedWatchlist.map((item) => item.symbol))
    } else {
      fetchStockData(savedWatchlist.map((item) => item.symbol))
    }

    setNotes(storageUtils.getHistoricalNotes())
  }

  const fetchStockData = async (symbols: string[]) => {
    setLoading(true)
    console.log('Fetching stock data for:', symbols)

    try {
      const data = await stockService.getStockData(symbols)
      console.log('Stock data received:', data)
      setStockData(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching stock data:', err)
      toast.current?.show({
        severity: 'warn',
        summary: 'Data Unavailable',
        detail: 'Using mock data due to API limitations',
        life: 3000,
      })
      // Set mock data if API fails
      setStockData([
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 150.25 + Math.random() * 10,
          change: (Math.random() - 0.5) * 5,
          changePercent: (Math.random() - 0.5) * 3,
          volume: Math.floor(Math.random() * 100000000),
          marketCap: Math.floor(Math.random() * 1000000000),
          lastUpdated: new Date().toISOString(),
        },
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          price: 2800.5 + Math.random() * 50,
          change: (Math.random() - 0.5) * 20,
          changePercent: (Math.random() - 0.5) * 2,
          volume: Math.floor(Math.random() * 50000000),
          marketCap: Math.floor(Math.random() * 1000000000),
          lastUpdated: new Date().toISOString(),
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          price: 320.75 + Math.random() * 15,
          change: (Math.random() - 0.5) * 8,
          changePercent: (Math.random() - 0.5) * 2.5,
          volume: Math.floor(Math.random() * 80000000),
          marketCap: Math.floor(Math.random() * 1000000000),
          lastUpdated: new Date().toISOString(),
        },
      ])
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  const saveDashboardConfig = (newConfig: DashboardConfig) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig))
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

  const handleNotesChange = () => {
    setNotes(storageUtils.getHistoricalNotes())
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
    if (!section.enabled || config?.type !== 'market') return null

    switch (section.type) {
      case 'stock-table':
        return (
          <StockTable
            key={section.id}
            stocks={stockData}
            loading={loading}
            lastUpdated={lastUpdated}
          />
        )
      case 'ai-oracle':
        return <AIOracle key={section.id} />
      case 'historical-notes':
        return (
          <HistoricalNotes
            key={section.id}
            notes={notes}
            onNotesChange={handleNotesChange}
          />
        )
      case 'market-sentiment':
        return (
          <div key={section.id} className="p-4">
            <h3 className="text-lg font-semibold mb-4">Market Sentiment</h3>
            <p className="text-gray-600">
              Market sentiment analysis will be available here.
            </p>
          </div>
        )
      case 'portfolio-overview':
        return (
          <div key={section.id} className="p-4">
            <h3 className="text-lg font-semibold mb-4">Portfolio Overview</h3>
            <p className="text-gray-600">
              Portfolio performance and allocation will be available here.
            </p>
          </div>
        )
      default:
        return null
    }
  }

  // If no configuration exists, show the initial setup
  if (!config) {
    return (
      <>
        <Toast ref={toast} />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl text-center bg-transparent">
            <div className="py-12">
              <i className="pi pi-chart-bar text-6xl text-orange-500 mb-6"></i>
              <h1 className="text-3xl font-bold mb-4">
                Welcome to Your Market Dashboard
              </h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Customize your dashboard by selecting features, charts, and
                stocks to track. Get AI-powered insights and monitor your
                portfolio all in one place.
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
            dashboardType="market"
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
    .filter((s: DashboardSection) => s.enabled)
    .sort((a: DashboardSection, b: DashboardSection) => a.position - b.position)
  const stockCount =
    config.type === 'market'
      ? (config as MarketDashboardConfig).stocks?.length || 0
      : 0

  return (
    <>
      <Toast ref={toast} />
      <div className="min-h-screen p-4 flex flex-col items-center">
        <div className="mb-6 w-full max-w-4xl">
          {/* Title and Edit Button Row */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{config.name}</h1>
              <p className="text-gray-600">
                {stockCount} stocks • {enabledSections.length} features
              </p>
            </div>
            <Button
              label="Edit Dashboard"
              icon="pi pi-pencil"
              onClick={handleEditDashboard}
              className="p-button-outlined flex-shrink-0"
            />
          </div>

          {/* User Profile Card - Responsive Layout */}
          <div className="flex justify-center md:justify-start">
            <UserProfile />
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
            {enabledSections.map((section: DashboardSection) => (
              <div
                key={section.id}
                className="w-full max-w-3xl flex justify-center"
              >
                <div className="w-full flex flex-col items-center">
                  {renderSection(section)}
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
              label: 'Add Stock',
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
          dashboardType="market"
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
