'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { TabView, TabPanel } from 'primereact/tabview'
import { Card } from 'primereact/card'
import { Checkbox } from 'primereact/checkbox'
import { OrderList } from 'primereact/orderlist'
import { ScrollPanel } from 'primereact/scrollpanel'
import { Toast } from 'primereact/toast'
import {
  DashboardConfig,
  DashboardType,
  DASHBOARD_SECTIONS,
  DashboardSection,
  DashboardSectionType,
} from '@/types/dashboard'
import { CryptoAsset } from '@/types/crypto'
import { WatchlistItem } from '@/types'

interface DashboardEditDialogProps {
  visible: boolean
  onHide: () => void
  onSave: (config: DashboardConfig) => void
  mode: 'edit' | 'create'
  initialConfig?: DashboardConfig
  dashboardType: DashboardType
}

interface FormData {
  dashboardName: string
  selectedSections: DashboardSection[]
  assets: (CryptoAsset | WatchlistItem)[]
}

export function DashboardEditDialog({
  visible,
  onHide,
  onSave,
  mode,
  initialConfig,
  dashboardType,
}: DashboardEditDialogProps) {
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const toast = useRef<Toast>(null)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      dashboardName: '',
      selectedSections: [],
      assets: [],
    },
  })

  const selectedSections = watch('selectedSections')

  useEffect(() => {
    if (visible && initialConfig) {
      reset({
        dashboardName: initialConfig.name,
        selectedSections: initialConfig.sections,
        assets:
          dashboardType === 'crypto'
            ? (initialConfig as DashboardConfig & { assets?: CryptoAsset[] })
                .assets || []
            : (initialConfig as DashboardConfig & { stocks?: WatchlistItem[] })
                .stocks || [],
      })
    }
  }, [visible, initialConfig, dashboardType, reset])

  const availableSections = DASHBOARD_SECTIONS.filter((section) =>
    section.availableFor.includes(dashboardType)
  )

  const handleSectionToggle = (sectionType: string, enabled: boolean) => {
    const currentSections = [...selectedSections]
    const existingIndex = currentSections.findIndex(
      (s) => s.type === sectionType
    )

    if (enabled && existingIndex === -1) {
      const sectionInfo = DASHBOARD_SECTIONS.find((s) => s.type === sectionType)
      const newSection: DashboardSection = {
        id: `${sectionType}-${Date.now()}`,
        type: sectionType as DashboardSectionType,
        name: sectionInfo?.name || sectionType,
        description: sectionInfo?.description || '',
        enabled: true,
        position: currentSections.length,
        icon: sectionInfo?.icon || 'pi pi-cog',
      }
      currentSections.push(newSection)
      toast.current?.show({
        severity: 'success',
        summary: 'Feature Added',
        detail: `${sectionInfo?.name || sectionType} has been enabled`,
        life: 2000,
      })
    } else if (!enabled && existingIndex !== -1) {
      const removedSection = currentSections[existingIndex]
      currentSections.splice(existingIndex, 1)
      toast.current?.show({
        severity: 'info',
        summary: 'Feature Disabled',
        detail: `${removedSection.name} has been disabled`,
        life: 2000,
      })
    }

    setValue('selectedSections', currentSections)
  }

  const handleSectionReorder = (event: { value: DashboardSection[] }) => {
    const reorderedSections = event.value.map(
      (section: DashboardSection, index: number) => ({
        ...section,
        position: index,
      })
    )
    setValue('selectedSections', reorderedSections)
    toast.current?.show({
      severity: 'info',
      summary: 'Layout Updated',
      detail: 'Dashboard layout has been reordered',
      life: 2000,
    })
  }

  const onSubmit = async (data: FormData) => {
    setSaving(true)

    try {
      const now = new Date().toISOString()

      if (dashboardType === 'crypto') {
        const updatedConfig: DashboardConfig = {
          ...(initialConfig || {}),
          id: initialConfig?.id || `dashboard-${Date.now()}`,
          name: data.dashboardName,
          type: 'crypto',
          createdAt: initialConfig?.createdAt || now,
          updatedAt: now,
          sections: data.selectedSections,
          assets: data.assets as CryptoAsset[],
          aiOracleRefreshCount: 0,
        }
        await new Promise((resolve) => setTimeout(resolve, 900)) // Simulate save delay
        onSave(updatedConfig)
        toast.current?.show({
          severity: 'success',
          summary: 'Dashboard Saved',
          detail: `${data.dashboardName} has been updated successfully!`,
          life: 3000,
        })
      } else {
        const updatedConfig: DashboardConfig = {
          ...(initialConfig || {}),
          id: initialConfig?.id || `dashboard-${Date.now()}`,
          name: data.dashboardName,
          type: 'market',
          createdAt: initialConfig?.createdAt || now,
          updatedAt: now,
          sections: data.selectedSections,
          stocks: data.assets as WatchlistItem[],
          aiOracleRefreshCount: 0,
        }
        await new Promise((resolve) => setTimeout(resolve, 900)) // Simulate save delay
        onSave(updatedConfig)
        toast.current?.show({
          severity: 'success',
          summary: 'Dashboard Saved',
          detail: `${data.dashboardName} has been updated successfully!`,
          life: 3000,
        })
      }
    } catch (error) {
      console.error('Error saving dashboard:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save dashboard. Please try again.',
        life: 3000,
      })
    } finally {
      setSaving(false)
    }
  }

  const renderFeaturesTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-2">Dashboard Features</h2>
        <p className="text-gray-600">
          Enable or disable features for your dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableSections.map((section) => {
          const isEnabled = selectedSections.some(
            (s) => s.type === section.type
          )
          return (
            <Card
              key={section.type}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isEnabled ? 'ring-2 ring-orange-500' : ''
              }`}
              onClick={() => handleSectionToggle(section.type, !isEnabled)}
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={isEnabled}
                  onChange={() => handleSectionToggle(section.type, !isEnabled)}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className={`${section.icon} text-orange-500`}></i>
                    <h3 className="font-semibold">{section.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderLayoutTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-2">Layout & Order</h2>
        <p className="text-gray-600">Reorder your dashboard sections</p>
      </div>

      {selectedSections.length > 0 ? (
        <OrderList
          value={selectedSections}
          onChange={handleSectionReorder}
          dataKey="id"
          className="w-full"
          listStyle={{ height: '300px' }}
          itemTemplate={(section) => (
            <div className="flex items-center space-x-3 p-3">
              <i className={`${section.icon} text-orange-500`}></i>
              <div className="flex-1">
                <h4 className="font-medium">{section.name}</h4>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            </div>
          )}
        />
      ) : (
        <div className="text-center py-8">
          <i className="pi pi-list text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">
            No features enabled yet. Add some features first!
          </p>
        </div>
      )}
    </div>
  )

  const renderAssetsTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-2">
          {dashboardType === 'crypto' ? 'Cryptocurrencies' : 'Stocks'}
        </h2>
        <p className="text-gray-600">
          {dashboardType === 'crypto'
            ? 'Manage your cryptocurrency assets'
            : 'Manage your stock watchlist'}
        </p>
      </div>

      <div className="text-center py-8">
        <i className="pi pi-plus-circle text-4xl text-gray-400 mb-4"></i>
        <p className="text-gray-600 mb-4">
          {dashboardType === 'crypto'
            ? 'Asset management will be available in the main dashboard'
            : 'Stock management will be available in the main dashboard'}
        </p>
      </div>
    </div>
  )

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        onHide={onHide}
        header={`${mode === 'edit' ? 'Edit' : 'Create'} Dashboard`}
        style={{ width: '90vw', maxWidth: '900px' }}
        modal
        className="dashboard-edit-dialog"
      >
        <div className="space-y-6">
          {/* Dashboard Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Dashboard Name</label>
            <Controller
              name="dashboardName"
              control={control}
              rules={{ required: 'Dashboard name is required' }}
              render={({ field }) => (
                <InputText
                  {...field}
                  placeholder="My Dashboard"
                  className="w-full"
                />
              )}
            />
            {errors.dashboardName && (
              <small className="text-red-500">
                {errors.dashboardName.message}
              </small>
            )}
          </div>

          {/* Tabs */}
          <TabView
            activeIndex={activeTab}
            onTabChange={(e) => setActiveTab(e.index)}
          >
            <TabPanel header="Features" leftIcon="pi pi-cog">
              <ScrollPanel style={{ height: '400px' }}>
                {renderFeaturesTab()}
              </ScrollPanel>
            </TabPanel>

            <TabPanel header="Layout" leftIcon="pi pi-list">
              <ScrollPanel style={{ height: '400px' }}>
                {renderLayoutTab()}
              </ScrollPanel>
            </TabPanel>

            <TabPanel
              header={dashboardType === 'crypto' ? 'Assets' : 'Stocks'}
              leftIcon="pi pi-wallet"
            >
              <ScrollPanel style={{ height: '400px' }}>
                {renderAssetsTab()}
              </ScrollPanel>
            </TabPanel>
          </TabView>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={onHide}
              className="p-button-outlined"
            />
            <Button
              label={saving ? 'Saving...' : 'Save Changes'}
              icon={saving ? 'pi pi-spinner pi-spin' : 'pi pi-check'}
              onClick={handleSubmit(onSubmit)}
              loading={saving}
              disabled={saving}
            />
          </div>
        </div>
      </Dialog>
    </>
  )
}
