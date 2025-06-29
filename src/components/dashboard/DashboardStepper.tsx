'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Dialog } from 'primereact/dialog'
import { Steps } from 'primereact/steps'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Card } from 'primereact/card'
import { Fieldset } from 'primereact/fieldset'
import { Checkbox } from 'primereact/checkbox'
import {
  DashboardConfig,
  DashboardType,
  DASHBOARD_SECTIONS,
  DASHBOARD_PRESETS,
  DashboardPreset,
  DashboardSectionType,
} from '@/types/dashboard'
import { CryptoAsset } from '@/types/crypto'
import { WatchlistItem } from '@/types'

interface DashboardStepperProps {
  visible: boolean
  onHide: () => void
  onSave: (config: DashboardConfig) => void
  dashboardType: DashboardType
}

interface FormData {
  dashboardName: string
  selectedPreset?: DashboardPreset
  selectedSections: string[]
  assets: (CryptoAsset | WatchlistItem)[]
}

const STEPS = [
  { label: 'Dashboard Name', icon: 'pi pi-pencil' },
  { label: 'Quick Start', icon: 'pi pi-rocket' },
  { label: 'Features', icon: 'pi pi-cog' },
  { label: 'Assets', icon: 'pi pi-wallet' },
  { label: 'Review', icon: 'pi pi-check' },
]

export function DashboardStepper({
  visible,
  onHide,
  onSave,
  dashboardType,
}: DashboardStepperProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      dashboardName: '',
      selectedSections: [],
      assets: [],
    },
  })

  const selectedSections = watch('selectedSections')
  const selectedPreset = watch('selectedPreset')

  const availableSections = DASHBOARD_SECTIONS.filter((section) =>
    section.availableFor.includes(dashboardType)
  )

  const availablePresets = DASHBOARD_PRESETS.filter(
    (preset) => preset.type === dashboardType
  )

  const handlePresetSelect = (preset: DashboardPreset) => {
    setValue('selectedPreset', preset)
    setValue('selectedSections', preset.sections)
  }

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const onSubmit = async (data: FormData) => {
    setSaving(true)

    try {
      const now = new Date().toISOString()
      const sections = data.selectedSections.map((sectionType, index) => {
        const sectionInfo = DASHBOARD_SECTIONS.find(
          (s) => s.type === sectionType
        )
        return {
          id: `${sectionType}-${index}`,
          type: sectionType as DashboardSectionType,
          name: sectionInfo?.name || sectionType,
          description: sectionInfo?.description || '',
          enabled: true,
          position: index,
          icon: sectionInfo?.icon || 'pi pi-cog',
        }
      })

      let config: DashboardConfig
      if (dashboardType === 'crypto') {
        config = {
          id: `dashboard-${Date.now()}`,
          name: data.dashboardName,
          type: 'crypto',
          createdAt: now,
          updatedAt: now,
          sections,
          aiOracleRefreshCount: 0,
          assets: data.assets as CryptoAsset[],
        }
      } else {
        config = {
          id: `dashboard-${Date.now()}`,
          name: data.dashboardName,
          type: 'market',
          createdAt: now,
          updatedAt: now,
          sections,
          aiOracleRefreshCount: 0,
          stocks: data.assets as WatchlistItem[],
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate save delay
      onSave(config)
    } catch (error) {
      console.error('Error saving dashboard:', error)
    } finally {
      setSaving(false)
    }
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <i
                className={`pi ${
                  dashboardType === 'crypto' ? 'pi-bitcoin' : 'pi-chart-bar'
                } text-4xl text-orange-500 mb-4`}
              ></i>
              <h2 className="text-2xl font-bold mb-2">Name Your Dashboard</h2>
              <p className="text-gray-600">
                Give your dashboard a memorable name
              </p>
            </div>

            <Controller
              name="dashboardName"
              control={control}
              rules={{ required: 'Dashboard name is required' }}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Dashboard Name
                  </label>
                  <InputText
                    {...field}
                    placeholder="My Awesome Dashboard"
                    className="w-full"
                  />
                  {errors.dashboardName && (
                    <small className="text-red-500">
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
              <h2 className="text-2xl font-bold mb-2">Quick Start</h2>
              <p className="text-gray-600">
                Choose a preset or start from scratch
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availablePresets.map((preset) => (
                <Card
                  key={preset.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedPreset?.id === preset.id
                      ? 'ring-2 ring-orange-500'
                      : ''
                  }`}
                  onClick={() => handlePresetSelect(preset)}
                >
                  <div className="text-center">
                    <i
                      className={`${preset.icon} text-3xl text-orange-500 mb-3`}
                    ></i>
                    <h3 className="text-lg font-semibold mb-2">
                      {preset.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {preset.description}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {preset.sections.map((section) => {
                        const sectionInfo = DASHBOARD_SECTIONS.find(
                          (s) => s.type === section
                        )
                        return (
                          <span
                            key={section}
                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            {sectionInfo?.name}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </Card>
              ))}

              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  !selectedPreset ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => {
                  setValue('selectedPreset', undefined)
                  setValue('selectedSections', [])
                }}
              >
                <div className="text-center">
                  <i className="pi pi-plus text-3xl text-orange-500 mb-3"></i>
                  <h3 className="text-lg font-semibold mb-2">Custom Setup</h3>
                  <p className="text-sm text-gray-600">
                    Build your dashboard from scratch
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Select Features</h2>
              <p className="text-gray-600">
                Choose which features to include in your dashboard
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSections.map((section) => (
                <div
                  key={section.type}
                  className="flex items-start space-x-3 p-4 border rounded-lg"
                >
                  <Controller
                    name="selectedSections"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        inputId={section.type}
                        checked={field.value.includes(section.type)}
                        onChange={(e) => {
                          const newValue = e.checked
                            ? [...field.value, section.type]
                            : field.value.filter(
                                (s: string) => s !== section.type
                              )
                          field.onChange(newValue)
                        }}
                      />
                    )}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={section.type}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <i className={`${section.icon} text-orange-500`}></i>
                      <span className="font-medium">{section.name}</span>
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Add Assets</h2>
              <p className="text-gray-600">
                {dashboardType === 'crypto'
                  ? 'Add cryptocurrencies to track'
                  : 'Add stocks to your watchlist'}
              </p>
            </div>

            <div className="text-center py-8">
              <i className="pi pi-plus-circle text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600 mb-4">
                {dashboardType === 'crypto'
                  ? 'You can add cryptocurrencies after setting up your dashboard'
                  : 'You can add stocks after setting up your dashboard'}
              </p>
            </div>
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

            <Fieldset legend="Dashboard Details" className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Name
                  </label>
                  <p className="font-medium">{watch('dashboardName')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Type
                  </label>
                  <p className="font-medium capitalize">{dashboardType}</p>
                </div>
              </div>
            </Fieldset>

            <Fieldset legend="Selected Features" className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedSections.map((sectionType) => {
                  const sectionInfo = DASHBOARD_SECTIONS.find(
                    (s) => s.type === sectionType
                  )
                  return (
                    <div
                      key={sectionType}
                      className="flex items-center space-x-2"
                    >
                      <i className={`${sectionInfo?.icon} text-orange-500`}></i>
                      <span>{sectionInfo?.name}</span>
                    </div>
                  )
                })}
              </div>
            </Fieldset>

            {selectedPreset && (
              <Fieldset legend="Selected Preset">
                <div className="flex items-center space-x-2">
                  <i className={`${selectedPreset.icon} text-orange-500`}></i>
                  <span className="font-medium">{selectedPreset.name}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedPreset.description}
                </p>
              </Fieldset>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Setup Your Dashboard"
      style={{ width: '90vw', maxWidth: '800px' }}
      modal
      closable={false}
      className="dashboard-stepper"
    >
      <div className="space-y-6">
        <Steps model={STEPS} activeIndex={activeStep} />

        <div className="min-h-[400px]">{renderStepContent()}</div>

        <div className="flex justify-between">
          <Button
            label="Previous"
            icon="pi pi-chevron-left"
            onClick={handlePrev}
            disabled={activeStep === 0}
            className="p-button-outlined"
          />

          {activeStep === STEPS.length - 1 ? (
            <Button
              label={saving ? 'Creating...' : 'Create Dashboard'}
              icon={saving ? 'pi pi-spinner pi-spin' : 'pi pi-check'}
              onClick={handleSubmit(onSubmit)}
              loading={saving}
              disabled={saving}
            />
          ) : (
            <Button
              label="Next"
              icon="pi pi-chevron-right"
              iconPos="right"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && !watch('dashboardName')) ||
                (activeStep === 2 && selectedSections.length === 0)
              }
            />
          )}
        </div>
      </div>
    </Dialog>
  )
}
