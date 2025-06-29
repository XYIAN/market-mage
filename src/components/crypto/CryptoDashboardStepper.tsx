'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Steps } from 'primereact/steps'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Chip } from 'primereact/chip'
import { ProgressSpinner } from 'primereact/progressspinner'
import { CryptoAsset, CryptoDashboardConfig } from '@/types/crypto'
import { useCoinbaseData } from '@/hooks/useCoinbaseData'

interface CryptoDashboardStepperProps {
  visible: boolean
  onHide: () => void
  onSave: (config: CryptoDashboardConfig) => void
}

interface FormData {
  dashboardName: string
  selectedSections: string[]
  selectedAssets: CryptoAsset[]
}

const POPULAR_PRESETS = [
  {
    name: 'Top 5 by Market Cap',
    assets: ['BTC', 'ETH', 'BNB', 'SOL', 'ADA'],
    description: 'Track the largest cryptocurrencies by market capitalization',
  },
  {
    name: 'DeFi Leaders',
    assets: ['UNI', 'AAVE', 'MKR', 'COMP', 'SNX'],
    description: 'Focus on decentralized finance protocols',
  },
  {
    name: 'Layer 1s',
    assets: ['ETH', 'SOL', 'ADA', 'AVAX', 'DOT'],
    description: 'Blockchain platforms and smart contract networks',
  },
  {
    name: 'Meme Coins',
    assets: ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK'],
    description: 'Popular meme-based cryptocurrencies',
  },
]

const LAYOUTS = [
  {
    name: 'Balanced',
    sections: ['asset-tracker', 'ai-oracle', 'insights', 'market-overview'],
    description: 'Complete dashboard with all features',
  },
  {
    name: 'Minimal',
    sections: ['asset-tracker', 'insights'],
    description: 'Simple tracking with basic insights',
  },
  {
    name: 'Insights Focus',
    sections: ['insights', 'ai-oracle'],
    description: 'Heavy focus on AI insights and charts',
  },
]

const AVAILABLE_SECTIONS = [
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

export function CryptoDashboardStepper({
  visible,
  onHide,
  onSave,
}: CryptoDashboardStepperProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const { cryptoData, loading } = useCoinbaseData()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      dashboardName: 'My Crypto Dashboard',
      selectedSections: [],
      selectedAssets: [],
    },
  })

  const watchedSections = watch('selectedSections')
  const watchedAssets = watch('selectedAssets')

  const steps = [
    { label: 'Dashboard Name', icon: 'pi pi-pencil' },
    { label: 'Choose Layout', icon: 'pi pi-th-large' },
    { label: 'Select Features', icon: 'pi pi-cog' },
    { label: 'Add Assets', icon: 'pi pi-bitcoin' },
    { label: 'Review & Create', icon: 'pi pi-check' },
  ]

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
    setValue('selectedAssets', assets)
  }

  const handleLayout = (layout: (typeof LAYOUTS)[0]) => {
    setValue('selectedSections', layout.sections)
  }

  const handleSectionToggle = (sectionId: string, checked: boolean) => {
    const currentSections = watchedSections
    if (checked) {
      setValue('selectedSections', [...currentSections, sectionId])
    } else {
      setValue(
        'selectedSections',
        currentSections.filter((id) => id !== sectionId)
      )
    }
  }

  const handleAssetToggle = (asset: CryptoAsset, checked: boolean) => {
    const currentAssets = watchedAssets
    if (checked) {
      setValue('selectedAssets', [...currentAssets, asset])
    } else {
      setValue(
        'selectedAssets',
        currentAssets.filter((a) => a.symbol !== asset.symbol)
      )
    }
  }

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate save delay

    const config: CryptoDashboardConfig = {
      id: crypto.randomUUID(),
      name: data.dashboardName,
      assets: data.selectedAssets,
      sections: AVAILABLE_SECTIONS.map((section, index) => ({
        id: section.id,
        type: section.id as
          | 'asset-tracker'
          | 'ai-oracle'
          | 'insights'
          | 'market-overview',
        title: section.name,
        enabled: data.selectedSections.includes(section.id),
        position: index,
      })),
      aiOracleRefreshCount: 0,
    }

    onSave(config)
    setSaving(false)
  }

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Name Your Dashboard</h2>
              <p className="text-gray-600">
                Give your crypto dashboard a memorable name
              </p>
            </div>
            <Controller
              name="dashboardName"
              control={control}
              rules={{ required: 'Dashboard name is required' }}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dashboard Name
                  </label>
                  <InputText
                    {...field}
                    placeholder="Enter dashboard name"
                    className={errors.dashboardName ? 'p-invalid' : ''}
                  />
                  {errors.dashboardName && (
                    <small className="p-error">
                      {errors.dashboardName.message}
                    </small>
                  )}
                </div>
              )}
            />
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Choose Your Layout</h2>
              <p className="text-gray-600">
                Select a preset layout or customize your own
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LAYOUTS.map((layout) => (
                <Card
                  key={layout.name}
                  className={`cursor-pointer transition-all ${
                    watchedSections.length === layout.sections.length &&
                    layout.sections.every((s) => watchedSections.includes(s))
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleLayout(layout)}
                >
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">{layout.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {layout.description}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {layout.sections.map((sectionId) => {
                        const section = AVAILABLE_SECTIONS.find(
                          (s) => s.id === sectionId
                        )
                        return section ? (
                          <Chip
                            key={sectionId}
                            label={section.name}
                            className="text-xs"
                          />
                        ) : null
                      })}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Select Features</h2>
              <p className="text-gray-600">
                Choose which dashboard features to enable
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_SECTIONS.map((section) => (
                <Card
                  key={section.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      inputId={section.id}
                      checked={watchedSections.includes(section.id)}
                      onChange={(e) =>
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
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Add Crypto Assets</h2>
              <p className="text-gray-600">
                Select cryptocurrencies to track in your dashboard
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                <p className="mt-4">Loading available cryptocurrencies...</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Quick Presets</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {POPULAR_PRESETS.map((preset) => (
                      <Button
                        key={preset.name}
                        label={preset.name}
                        onClick={() => handlePreset(preset)}
                        className="p-button-sm p-button-outlined"
                        tooltip={preset.description}
                      />
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Selected Assets ({watchedAssets.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {watchedAssets.map((asset) => (
                        <Chip
                          key={asset.symbol}
                          label={`${asset.symbol} - ${asset.name}`}
                          className="bg-green-100 text-green-800"
                        />
                      ))}
                      {watchedAssets.length === 0 && (
                        <p className="text-gray-500 text-sm">
                          No assets selected
                        </p>
                      )}
                    </div>
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
                      const isSelected = watchedAssets.some(
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
                          onClick={() => handleAssetToggle(asset, !isSelected)}
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
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Review Your Dashboard</h2>
              <p className="text-gray-600">
                Confirm your selections before creating
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Dashboard Name</h3>
                <p className="text-gray-600">{watch('dashboardName')}</p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">
                  Selected Features ({watchedSections.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {watchedSections.map((sectionId) => {
                    const section = AVAILABLE_SECTIONS.find(
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
                  {watchedSections.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      No features selected
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">
                  Selected Assets ({watchedAssets.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {watchedAssets.map((asset) => (
                    <Chip
                      key={asset.symbol}
                      label={`${asset.symbol} - ${asset.name}`}
                      className="bg-green-100 text-green-800"
                    />
                  ))}
                  {watchedAssets.length === 0 && (
                    <p className="text-gray-500 text-sm">No assets selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              Customize Your Crypto Dashboard
            </h1>
            <Button
              icon="pi pi-times"
              onClick={onHide}
              className="p-button-text"
            />
          </div>
          <Steps model={steps} activeIndex={activeStep} />
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStepContent()}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between">
            <Button
              label="Previous"
              icon="pi pi-chevron-left"
              onClick={prevStep}
              disabled={activeStep === 0}
              className="p-button-outlined"
            />

            {activeStep === steps.length - 1 ? (
              <Button
                label="Create Dashboard"
                icon="pi pi-check"
                onClick={handleSubmit(onSubmit)}
                loading={saving}
                disabled={watchedSections.length === 0}
                className="p-button-success"
              />
            ) : (
              <Button
                label="Next"
                icon="pi pi-chevron-right"
                onClick={nextStep}
                disabled={
                  (activeStep === 0 && !watch('dashboardName')) ||
                  (activeStep === 1 && watchedSections.length === 0) ||
                  (activeStep === 2 && watchedSections.length === 0)
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
