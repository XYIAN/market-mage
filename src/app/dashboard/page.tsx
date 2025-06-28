'use client'

import { useState, useEffect } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import { StockTable } from '@/components/stock-table'
import { AIOracle } from '@/components/ai-oracle'
import { HistoricalNotes } from '@/components/historical-notes'
import { AddStock } from '@/components/add-stock'
import { useStockData } from '@/hooks/useStockData'
import { useAIInsight } from '@/hooks/useAIInsight'
import { storageUtils } from '@/utils/storage'
import { HistoricalNote } from '@/types'

export default function DashboardPage() {
	const { stocks, loading, lastUpdated, refresh } = useStockData()
	const { insight, loading: aiLoading, error: aiError, canGenerate, generateInsight } = useAIInsight()
	const [notes, setNotes] = useState<HistoricalNote[]>([])
	const [activeIndex, setActiveIndex] = useState(0)

	useEffect(() => {
		setNotes(storageUtils.getHistoricalNotes())
	}, [])

	const handleStockAdded = () => {
		refresh()
	}

	const handleNotesChange = () => {
		setNotes(storageUtils.getHistoricalNotes())
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-white mb-2">
								Market-Mage Dashboard
							</h1>
							<p className="text-gray-300">
								AI-powered trading insights and portfolio management
							</p>
						</div>
						<AddStock onStockAdded={handleStockAdded} />
					</div>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Stock Table - Takes 2/3 of the space */}
					<div className="lg:col-span-2">
						<StockTable 
							stocks={stocks} 
							loading={loading} 
							lastUpdated={lastUpdated}
						/>
					</div>

					{/* Sidebar - Takes 1/3 of the space */}
					<div className="space-y-6">
						{/* AI Oracle */}
						<AIOracle
							insight={insight}
							loading={aiLoading}
							error={aiError}
							canGenerate={canGenerate}
							onGenerate={generateInsight}
						/>

						{/* Historical Notes */}
						<HistoricalNotes 
							notes={notes}
							onNotesChange={handleNotesChange}
						/>
					</div>
				</div>

				{/* Mobile TabView for smaller screens */}
				<div className="lg:hidden mt-8">
					<TabView 
						activeIndex={activeIndex} 
						onTabChange={(e) => setActiveIndex(e.index)}
						className="bg-transparent"
					>
						<TabPanel header="Watchlist">
							<StockTable 
								stocks={stocks} 
								loading={loading} 
								lastUpdated={lastUpdated}
							/>
						</TabPanel>
						<TabPanel header="AI Oracle">
							<AIOracle
								insight={insight}
								loading={aiLoading}
								error={aiError}
								canGenerate={canGenerate}
								onGenerate={generateInsight}
							/>
						</TabPanel>
						<TabPanel header="Notes">
							<HistoricalNotes 
								notes={notes}
								onNotesChange={handleNotesChange}
							/>
						</TabPanel>
					</TabView>
				</div>
			</div>
		</div>
	)
} 