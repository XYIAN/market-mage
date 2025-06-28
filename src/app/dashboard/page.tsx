'use client'

import { useState, useEffect } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import { Card } from 'primereact/card'
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
  const {
    insight,
    loading: aiLoading,
    error: aiError,
    canGenerate,
    generateInsight,
  } = useAIInsight()
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-6">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <Card className="w-full max-w-4xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                    Market
                  </span>
                  <span className="text-primary-foreground">-</span>
                  <span className="bg-gradient-to-r from-primary-foreground to-primary bg-clip-text text-transparent">
                    Mage
                  </span>
                </h1>
                <p className="text-muted-foreground">
                  AI-powered trading insights and portfolio management
                </p>
              </div>
              <AddStock onStockAdded={handleStockAdded} />
            </div>
          </Card>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {/* Stock Table - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <Card>
              <StockTable
                stocks={stocks}
                loading={loading}
                lastUpdated={lastUpdated}
              />
            </Card>
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
            <HistoricalNotes notes={notes} onNotesChange={handleNotesChange} />
          </div>
        </div>

        {/* Mobile TabView */}
        <div className="lg:hidden">
          <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            <TabPanel header="Watchlist">
              <Card>
                <StockTable
                  stocks={stocks}
                  loading={loading}
                  lastUpdated={lastUpdated}
                />
              </Card>
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
