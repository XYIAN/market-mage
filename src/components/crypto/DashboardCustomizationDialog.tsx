'use client'

import { useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox'
import { TabView, TabPanel } from 'primereact/tabview'
import { Card } from 'primereact/card'
import { Chip } from 'primereact/chip'
import {
  CryptoAsset,
  CryptoDashboardConfig,
  DashboardCustomizationDialogProps,
} from '@/types/crypto'
import { useCoinbaseData } from '@/hooks/useCoinbaseData'

const POPULAR_PRESETS = [
  {
    name: 'Top 5 by Market Cap',
    assets: ['BTC', 'ETH', 'BNB', 'SOL', 'ADA'],
  },
  {
    name: 'DeFi Leaders',
    assets: ['UNI', 'AAVE', 'MKR', 'COMP', 'SNX'],
  },
  {
    name: 'Layer 1s',
    assets: ['ETH', 'SOL', 'ADA', 'AVAX', 'DOT'],
  },
  {
    name: 'Meme Coins',
    assets: ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK'],
  },
]

const LAYOUTS = [
  {
    name: 'Balanced',
    sections: ['asset-tracker', 'ai-oracle', 'insights', 'market-overview'],
  },
  {
    name: 'Minimal',
    sections: ['asset-tracker', 'insights'],
  },
  {
    name: 'Insights Focus',
    sections: ['insights', 'ai-oracle'],
  },
]

export function DashboardCustomizationDialog({
  visible,
  onHide,
  mode,
  initialConfig,
  onSave,
}: DashboardCustomizationDialogProps) {
  const [config, setConfig] = useState<CryptoDashboardConfig>({
    id: '',
    name: '',
    assets: [],
    sections: [],
    aiOracleRefreshCount: 0,
  })
  const [selectedAssets, setSelectedAssets] = useState<CryptoAsset[]>([])
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState(0)
  const { cryptoData, loading } = useCoinbaseData()

  const availableSections = [
    {
      id: 'asset-tracker',
      name: 'Asset Tracker',
      description: 'Track and manage your crypto portfolio',
    },
    {
      id: 'ai-oracle',
      name: 'AI Oracle',
      description: 'Get AI-powered trading insights (5x daily limit)',
    },
    {
      id: 'insights',
      name: 'Market Insights',
      description: 'Charts and technical analysis',
    },
    {
      id: 'market-overview',
      name: 'Market Overview',
      description: 'General market statistics and trends',
    },
  ]

  useEffect(() => {
    if (mode === 'edit' && initialConfig) {
      setConfig(initialConfig)
      setSelectedAssets(initialConfig.assets)
      setSelectedSections(
        initialConfig.sections.filter((s) => s.enabled).map((s) => s.id)
      )
    } else {
      // Default configuration for new dashboard
      setConfig({
        id: crypto.randomUUID(),
        name: 'My Crypto Dashboard',
        assets: [],
        sections: availableSections.map((section, index) => ({
          id: section.id,
          type: section.id as
            | 'asset-tracker'
            | 'ai-oracle'
            | 'insights'
            | 'market-overview',
          title: section.name,
          enabled: false,
          position: index,
        })),
        aiOracleRefreshCount: 0,
      })
      setSelectedAssets([])
      setSelectedSections([])
    }
  }, [mode, initialConfig, visible])

  const handleSave = () => {
    const updatedConfig: CryptoDashboardConfig = {
      ...config,
      assets: selectedAssets,
      sections: availableSections.map((section, index) => ({
        id: section.id,
        type: section.id as
          | 'asset-tracker'
          | 'ai-oracle'
          | 'insights'
          | 'market-overview',
        title: section.name,
        enabled: selectedSections.includes(section.id),
        position: index,
      })),
    }
    onSave(updatedConfig)
    onHide()
  }

  const handleSectionToggle = (sectionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSections((prev) => [...prev, sectionId])
    } else {
      setSelectedSections((prev) => prev.filter((id) => id !== sectionId))
    }
  }

  const handlePreset = (preset: (typeof POPULAR_PRESETS)[0]) => {
    const assets = cryptoData
      .filter((c) => preset.assets.includes(c.symbol))
      .map((crypto) => ({
        id: crypto.symbol,
        symbol: crypto.symbol,
        name: crypto.name,
        price: parseFloat(crypto.price),
        change24h: parseFloat(crypto.change.replace(/[+%]/g, '')),
        marketCap: crypto.marketCap,
        volume24h: parseFloat(crypto.volume.replace(/,/g, '')),
      }))
    setSelectedAssets(assets)
  }

  const handleLayout = (layout: (typeof LAYOUTS)[0]) => {
    setSelectedSections(layout.sections)
  }

  const footer = (
    <div className="flex justify-end space-x-2">
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text"
      />
      <Button
        label={mode === 'create' ? 'Create Dashboard' : 'Save Changes'}
        icon="pi pi-check"
        onClick={handleSave}
        disabled={selectedSections.length === 0}
      />
    </div>
  )

  return (
    <Dialog
      header={mode === 'create' ? 'Customize Your Dashboard' : 'Edit Dashboard'}
      visible={visible}
      onHide={onHide}
      style={{ width: '900px', maxWidth: '98vw' }}
      modal
      footer={footer}
      className="p-fluid"
    >
      <TabView
        activeIndex={activeTab}
        onTabChange={(e) => setActiveTab(e.index)}
      >
        <TabPanel header="Quick Start">
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Popular Presets</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              {POPULAR_PRESETS.map((preset) => (
                <Button
                  key={preset.name}
                  label={preset.name}
                  onClick={() => handlePreset(preset)}
                  className="p-button-sm p-button-outlined"
                />
              ))}
            </div>
            <h3 className="font-semibold mb-2">Dashboard Layouts</h3>
            <div className="flex flex-wrap gap-3">
              {LAYOUTS.map((layout) => (
                <Button
                  key={layout.name}
                  label={layout.name}
                  onClick={() => handleLayout(layout)}
                  className="p-button-sm p-button-secondary"
                />
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-500 mb-2">
            Tip: Use a preset and layout to get started fast, then fine-tune in
            the other tabs.
          </div>
        </TabPanel>
        <TabPanel header="Dashboard Info">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="dashboardName"
                className="block text-sm font-medium mb-2"
              >
                Dashboard Name
              </label>
              <InputText
                id="dashboardName"
                value={config.name}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter dashboard name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Selected Features ({selectedSections.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedSections.map((sectionId) => {
                  const section = availableSections.find(
                    (s) => s.id === sectionId
                  )
                  return section ? (
                    <Chip
                      key={sectionId}
                      label={section.name}
                      className="bg-blue-100 text-blue-800"
                    />
                  ) : null
                })}
                {selectedSections.length === 0 && (
                  <p className="text-gray-500 text-sm">No features selected</p>
                )}
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel header="Features & Sections">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Select which features and sections you want to include in your
              dashboard:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSections.map((section) => (
                <Card
                  key={section.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      inputId={section.id}
                      checked={selectedSections.includes(section.id)}
                      onChange={(e: CheckboxChangeEvent) =>
                        handleSectionToggle(section.id, e.checked || false)
                      }
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={section.id}
                        className="font-semibold cursor-pointer"
                      >
                        {section.name}
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabPanel>

        <TabPanel header="Crypto Assets">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Choose which cryptocurrencies to track in your dashboard:
            </p>

            {loading ? (
              <div className="text-center py-8">
                <i className="pi pi-spin pi-spinner text-2xl"></i>
                <p className="mt-2">Loading available cryptocurrencies...</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Selected Assets ({selectedAssets.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedAssets.map((asset) => (
                      <Chip
                        key={asset.symbol}
                        label={`${asset.symbol} - ${asset.name}`}
                        className="bg-green-100 text-green-800"
                      />
                    ))}
                    {selectedAssets.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        No assets selected
                      </p>
                    )}
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {cryptoData.slice(0, 20).map((crypto) => {
                      const asset: CryptoAsset = {
                        id: crypto.symbol,
                        symbol: crypto.symbol,
                        name: crypto.name,
                        price: parseFloat(crypto.price),
                        change24h: parseFloat(
                          crypto.change.replace(/[+%]/g, '')
                        ),
                        marketCap: crypto.marketCap,
                        volume24h: parseFloat(crypto.volume.replace(/,/g, '')),
                      }

                      const isSelected = selectedAssets.some(
                        (a) => a.symbol === asset.symbol
                      )

                      return (
                        <div
                          key={crypto.symbol}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAssets((prev) =>
                                prev.filter((a) => a.symbol !== asset.symbol)
                              )
                            } else {
                              setSelectedAssets((prev) => [...prev, asset])
                            }
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">{crypto.symbol}</p>
                              <p className="text-sm text-gray-600">
                                {crypto.name}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                ${parseFloat(crypto.price).toLocaleString()}
                              </p>
                              <p
                                className={`text-xs ${
                                  parseFloat(
                                    crypto.change.replace(/[+%]/g, '')
                                  ) >= 0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {crypto.change}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </TabPanel>
      </TabView>
    </Dialog>
  )
}
