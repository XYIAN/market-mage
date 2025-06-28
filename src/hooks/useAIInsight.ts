'use client'

import { useState, useEffect, useCallback } from 'react'
import { AIInsight } from '@/types'
import { storageUtils } from '@/utils/storage'
import { dateUtils } from '@/utils/date'
import { apiUtils } from '@/utils/api'

export const useAIInsight = () => {
	const [insight, setInsight] = useState<AIInsight | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const loadInsight = useCallback(() => {
		const stored = storageUtils.getAIInsight()
		setInsight(stored)
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
				expiresAt: expiresAt.toISOString()
			}
			
			storageUtils.setAIInsight(newInsight)
			setInsight(newInsight)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to generate AI insight')
		} finally {
			setLoading(false)
		}
	}, [])

	const canGenerateInsight = useCallback(() => {
		if (!insight) return true
		
		return dateUtils.isNewDay(insight.generatedAt)
	}, [insight])

	// Load insight on mount
	useEffect(() => {
		loadInsight()
	}, [loadInsight])

	// Check for new day at midnight
	useEffect(() => {
		const checkNewDay = () => {
			if (insight && dateUtils.isNewDay(insight.generatedAt)) {
				setInsight(null)
				localStorage.removeItem('market-mage-ai-insight')
			}
		}

		// Check immediately
		checkNewDay()

		// Set up interval to check every minute
		const interval = setInterval(checkNewDay, 60 * 1000)
		
		return () => clearInterval(interval)
	}, [insight])

	return {
		insight,
		loading,
		error,
		canGenerate: canGenerateInsight(),
		generateInsight,
		refresh: loadInsight
	}
} 