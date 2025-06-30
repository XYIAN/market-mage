'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Steps } from 'primereact/steps'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputSwitch } from 'primereact/inputswitch'
import { MultiSelect } from 'primereact/multiselect'
import { Fieldset } from 'primereact/fieldset'
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
    name: '🚀 Top 5 by Market Cap',
    assets: ['BTC', 'ETH', 'BNB', 'SOL', 'ADA'],
    description: 'Track the largest cryptocurrencies by market capitalization',
    icon: 'pi pi-chart-line',
  },
  {
    name: '🏦 DeFi Leaders',
    assets: ['UNI', 'AAVE', 'MKR', 'COMP', 'SNX'],
    description: 'Focus on decentralized finance protocols',
    icon: 'pi pi-wallet',
  },
  {
    name: '🔗 Layer 1s',
    assets: ['ETH', 'SOL', 'ADA', 'AVAX', 'DOT'],
    description: 'Blockchain platforms and smart contract networks',
    icon: 'pi pi-link',
  },
  {
    name: '🐕 Meme Coins',
    assets: ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK'],
    description: 'Popular meme-based cryptocurrencies',
    icon: 'pi pi-star',
  },
]

const LAYOUTS = [
  {
    name: '⚖️ Balanced',
    sections: ['asset-tracker', 'ai-oracle', 'insights', 'market-overview'],
    description: 'Complete dashboard with all features',
    icon: 'pi pi-th-large',
  },
  {
    name: '📱 Minimal',
    sections: ['asset-tracker', 'insights'],
    description: 'Simple tracking with basic insights',
    icon: 'pi pi-mobile',
  },
  {
    name: '🧠 Insights Focus',
    sections: ['insights', 'ai-oracle'],
    description: 'Heavy focus on AI insights and charts',
    icon: 'pi pi-brain',
  },
]

const AVAILABLE_SECTIONS = [
  {
    id: 'asset-tracker',
    name: 'Asset Tracker',
    description: 'Track and manage your crypto portfolio',
    icon: 'pi pi-bitcoin',
  },
  {
    id: 'ai-oracle',
    name: 'AI Oracle',
    description: 'Get AI-powered trading insights (5x daily limit)',
    icon: 'pi pi-magic',
  },
  {
    id: 'insights',
    name: 'Market Insights',
    description: 'Charts and technical analysis',
    icon: 'pi pi-chart-bar',
  },
  {
    id: 'market-overview',
    name: 'Market Overview',
    description: 'General market statistics and trends',
    icon: 'pi pi-globe',
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
              <h2 className="text-2xl font-bold mb-2 text-white">
                Name Your Dashboard
              </h2>
              <p className="text-gray-400">
                Give your crypto dashboard a memorable name
              </p>
            </div>
            <Controller
              name="dashboardName"
              control={control}
              rules={{ required: 'Dashboard name is required' }}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Dashboard Name
                  </label>
                  <InputText
                    {...field}
                    placeholder="Enter dashboard name"
                    className={`w-full ${
                      errors.dashboardName ? 'p-invalid' : ''
                    }`}
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
              <h2 className="text-2xl font-bold mb-2 text-white">
                Choose Your Layout
              </h2>
              <p className="text-gray-400">
                Select a preset layout or customize your own
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LAYOUTS.map((layout) => (
                <Card
                  key={layout.name}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    watchedSections.length === layout.sections.length &&
                    layout.sections.every((s) => watchedSections.includes(s))
                      ? 'ring-2 ring-blue-500 bg-blue-500/20'
                      : 'hover:bg-surface-800/50'
                  }`}
                  onClick={() => handleLayout(layout)}
                >
                  <div className="text-center">
                    <i
                      className={`${layout.icon} text-2xl mb-2 text-blue-400`}
                    ></i>
                    <h3 className="font-semibold mb-2 text-white">
                      {layout.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
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
                            className="text-xs bg-blue-500/20 text-blue-300"
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
              <h2 className="text-2xl font-bold mb-2 text-white">
                Select Features
              </h2>
              <p className="text-gray-400">
                Choose which dashboard features to enable
              </p>
            </div>
            <Fieldset
              legend="Dashboard Features"
              className="border-blue-500/30"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_SECTIONS.map((section) => (
                  <Card
                    key={section.id}
                    className="hover:bg-surface-800/50 transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <Controller
                        name="selectedSections"
                        control={control}
                        render={({ field }) => (
                          <InputSwitch
                            checked={field.value.includes(section.id)}
                            onChange={(e) => {
                              const newValue = e.checked
                                ? [...field.value, section.id]
                                : field.value.filter((id) => id !== section.id)
                              field.onChange(newValue)
                            }}
                          />
                        )}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <i className={`${section.icon} text-blue-400`}></i>
                          <label className="font-semibold cursor-pointer text-white">
                            {section.name}
                          </label>
                        </div>
                        <p className="text-sm text-gray-400">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Fieldset>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 text-white">
                Add Crypto Assets
              </h2>
              <p className="text-gray-400">
                Select cryptocurrencies to track in your dashboard
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                <p className="mt-4 text-gray-400">
                  Loading available cryptocurrencies...
                </p>
              </div>
            ) : (
              <>
                <Fieldset
                  legend="Quick Presets"
                  className="border-green-500/30 mb-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {POPULAR_PRESETS.map((preset) => (
                      <Button
                        key={preset.name}
                        label={preset.name}
                        icon={preset.icon}
                        onClick={() => handlePreset(preset)}
                        className="p-button-outlined p-button-sm"
                        tooltip={preset.description}
                        tooltipOptions={{ position: 'top' }}
                      />
                    ))}
                  </div>
                </Fieldset>

                <Fieldset
                  legend="Selected Assets"
                  className="border-purple-500/30 mb-6"
                >
                  <div className="flex flex-wrap gap-2">
                    {watchedAssets.map((asset) => (
                      <Chip
                        key={asset.symbol}
                        label={`${asset.symbol} - ${asset.name}`}
                        className="bg-green-500/20 text-green-300"
                      />
                    ))}
                    {watchedAssets.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        No assets selected
                      </p>
                    )}
                  </div>
                </Fieldset>

                <Fieldset
                  legend="Available Assets"
                  className="border-orange-500/30"
                >
                  <Controller
                    name="selectedAssets"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        options={cryptoData.slice(0, 50).map((crypto) => ({
                          id: crypto.symbol,
                          symbol: crypto.symbol,
                          name: crypto.name,
                          price: parseFloat(crypto.price),
                          change24h: parseFloat(
                            crypto.change.replace(/[+%]/g, '')
                          ),
                          marketCap: crypto.marketCap,
                          volume24h: parseFloat(
                            crypto.volume.replace(/,/g, '')
                          ),
                        }))}
                        optionLabel="name"
                        placeholder="Select cryptocurrencies"
                        className="w-full"
                        itemTemplate={(option) => (
                          <div className="flex justify-between items-center w-full">
                            <div>
                              <span className="font-semibold">
                                {option.symbol}
                              </span>
                              <span className="text-gray-400 ml-2">
                                - {option.name}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                ${option.price.toLocaleString()}
                              </div>
                              <div
                                className={`text-xs ${
                                  option.change24h >= 0
                                    ? 'text-green-400'
                                    : 'text-red-400'
                                }`}
                              >
                                {option.change24h >= 0 ? '+' : ''}
                                {option.change24h.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        )}
                      />
                    )}
                  />
                </Fieldset>
              </>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 text-white">
                Review Your Dashboard
              </h2>
              <p className="text-gray-400">
                Confirm your selections before creating
              </p>
            </div>

            <div className="space-y-4">
              <Fieldset legend="Dashboard Name" className="border-blue-500/30">
                <p className="text-white">{watch('dashboardName')}</p>
              </Fieldset>

              <Fieldset
                legend="Selected Features"
                className="border-green-500/30"
              >
                <div className="flex flex-wrap gap-2">
                  {watchedSections.map((sectionId) => {
                    const section = AVAILABLE_SECTIONS.find(
                      (s) => s.id === sectionId
                    )
                    return section ? (
                      <Chip
                        key={sectionId}
                        label={section.name}
                        className="bg-blue-500/20 text-blue-300"
                      />
                    ) : null
                  })}
                  {watchedSections.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      No features selected
                    </p>
                  )}
                </div>
              </Fieldset>

              <Fieldset
                legend="Selected Assets"
                className="border-purple-500/30"
              >
                <div className="flex flex-wrap gap-2">
                  {watchedAssets.map((asset) => (
                    <Chip
                      key={asset.symbol}
                      label={`${asset.symbol} - ${asset.name}`}
                      className="bg-green-500/20 text-green-300"
                    />
                  ))}
                  {watchedAssets.length === 0 && (
                    <p className="text-gray-500 text-sm">No assets selected</p>
                  )}
                </div>
              </Fieldset>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-surface-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-blue-500/30">
        <div className="p-6 border-b border-blue-500/30">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">
              🚀 Customize Your Crypto Dashboard
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

        <div className="p-6 border-t border-blue-500/30 bg-surface-800">
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
