'use client'

import { useState, useCallback } from 'react'
import { AIInsight } from '@/types'
import { storageUtils } from '@/utils/storage'
import { dateUtils } from '@/utils/date'
import { apiUtils } from '@/utils/api'

export const useAIInsight = () => {
  const [insight, setInsight] = useState<AIInsight | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadInsight = useCallback(() => {
    const storedInsight = storageUtils.getAIInsight()
    if (storedInsight) {
      setInsight(storedInsight)
    }
  }, [])

  const generateInsight = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const content = await apiUtils.generateAIInsight()
      const now = new Date()
      const expiresAt = dateUtils.getNextDayStart()

      const newInsight: AIInsight = {
        id: crypto.randomUUID(),
        content,
        generatedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      }

      storageUtils.setAIInsight(newInsight)
      setInsight(newInsight)

      // Toast will be handled by the component using this hook
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate AI insight'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const canGenerateInsight = useCallback(() => {
    const lastInsight = storageUtils.getAIInsight()
    if (!lastInsight) return true

    return dateUtils.isNewDay(lastInsight.generatedAt)
  }, [])

  return {
    insight,
    loading,
    error,
    loadInsight,
    generateInsight,
    canGenerateInsight,
  }
}
