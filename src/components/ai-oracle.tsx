'use client'

import { useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { useAIInsight } from '@/hooks/useAIInsight'

export const AIOracle = () => {
  const {
    insight,
    loading,
    error,
    loadInsight,
    generateInsight,
    canGenerateInsight,
  } = useAIInsight()
  const toast = useRef<Toast>(null)

  useEffect(() => {
    loadInsight()
  }, [loadInsight])

  const handleGenerateInsight = async () => {
    try {
      await generateInsight()
      toast.current?.show({
        severity: 'success',
        summary: 'AI Insight Generated',
        detail: 'Your daily trading insight has been generated successfully!',
        life: 3000,
      })
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to generate AI insight. Please try again.',
        life: 5000,
      })
    }
  }

  if (loading) {
    return (
      <Card className="mb-4">
        <div className="flex items-center justify-center p-4">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
          <span className="ml-3">Generating AI insight...</span>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Toast ref={toast} />
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <i className="pi pi-magic text-primary text-xl"></i>
            <h3 className="text-xl font-semibold">AI Oracle</h3>
          </div>
          {canGenerateInsight() && (
            <Button
              label="Generate Insight"
              icon="pi pi-refresh"
              onClick={handleGenerateInsight}
              loading={loading}
              className="p-button-sm"
            />
          )}
        </div>

        {insight ? (
          <div>
            <div className="mb-3 p-3 bg-primary-50 border-round">
              <p className="text-sm text-primary-700 mb-2">
                Generated: {new Date(insight.generatedAt).toLocaleString()}
              </p>
              <p className="leading-relaxed">{insight.content}</p>
            </div>
            {!canGenerateInsight() && (
              <p className="text-sm text-500">
                <i className="pi pi-info-circle mr-1"></i>
                New insights available daily at midnight
              </p>
            )}
          </div>
        ) : (
          <div className="text-center p-4">
            <i className="pi pi-lightbulb text-4xl text-500 mb-3"></i>
            <p className="text-500 mb-3">No AI insight available</p>
            <Button
              label="Generate First Insight"
              icon="pi pi-magic"
              onClick={handleGenerateInsight}
              loading={loading}
            />
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 border-round">
            <p className="text-red-700 text-sm">
              <i className="pi pi-exclamation-triangle mr-1"></i>
              {error}
            </p>
          </div>
        )}
      </Card>
    </>
  )
}
