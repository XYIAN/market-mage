'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'
import { StockData, HistoricalNote } from '@/types'
import { useStockData } from '@/hooks/useStockData'
import { AIOracle, HistoricalNotes } from '@/components'
import { storageUtils } from '@/utils/storage'
import { apiUtils } from '@/utils/api'

export default function DashboardPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newSymbol, setNewSymbol] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [notes, setNotes] = useState<HistoricalNote[]>([])
  const [watchlist, setWatchlist] = useState<
    { symbol: string; name: string }[]
  >([])
  const toast = useRef<Toast>(null)

  useEffect(() => {
    setNotes(storageUtils.getHistoricalNotes())
    setWatchlist(storageUtils.getWatchlist())
  }, [])

  const symbols = watchlist.map((item) => item.symbol)
  const { stockData, loading, refresh } = useStockData(symbols)

  const handleAddStock = async () => {
    if (!newSymbol.trim()) return

    setAddLoading(true)
    try {
      const stockData = await apiUtils.fetchStockData([newSymbol.toUpperCase()])
      if (stockData.length > 0) {
        const stock = stockData[0]
        storageUtils.addToWatchlist(stock.symbol, stock.name)
        setNewSymbol('')
        setShowAddDialog(false)
        setWatchlist(storageUtils.getWatchlist())
        refresh() // Refresh the stock data

        toast.current?.show({
          severity: 'success',
          summary: 'Stock Added',
          detail: `${stock.symbol} has been added to your watchlist`,
          life: 3000,
        })
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Stock not found. Please check the symbol and try again.',
          life: 3000,
        })
      }
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add stock. Please try again.',
        life: 3000,
      })
    } finally {
      setAddLoading(false)
    }
  }

  const handleRemoveStock = (symbol: string) => {
    storageUtils.removeFromWatchlist(symbol)
    setWatchlist(storageUtils.getWatchlist())
    refresh() // Refresh the stock data

    toast.current?.show({
      severity: 'info',
      summary: 'Stock Removed',
      detail: `${symbol} has been removed from your watchlist`,
      life: 3000,
    })
  }

  const handleNotesChange = () => {
    setNotes(storageUtils.getHistoricalNotes())
  }

  const priceBodyTemplate = (rowData: StockData) => {
    return (
      <span
        className={`font-semibold ${
          rowData.change >= 0 ? 'text-green-500' : 'text-red-500'
        }`}
      >
        ${rowData.price.toFixed(2)}
      </span>
    )
  }

  const changeBodyTemplate = (rowData: StockData) => {
    const isPositive = rowData.change >= 0
    return (
      <div
        className={`flex items-center gap-1 ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}
      >
        <i className={`pi ${isPositive ? 'pi-arrow-up' : 'pi-arrow-down'}`}></i>
        <span className="font-semibold">
          {isPositive ? '+' : ''}
          {rowData.change.toFixed(2)} ({isPositive ? '+' : ''}
          {rowData.changePercent.toFixed(2)}%)
        </span>
      </div>
    )
  }

  const actionsBodyTemplate = (rowData: StockData) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => handleRemoveStock(rowData.symbol)}
      />
    )
  }

  if (stockData.length === 0 && !loading) {
    return (
      <div className="min-h-screen p-4">
        <Toast ref={toast} />
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Empty State */}
            <div className="lg:col-span-2">
              <Card>
                <div className="text-center py-8">
                  <i className="pi pi-chart-line text-6xl text-500 mb-4"></i>
                  <h2 className="text-2xl font-semibold mb-2">
                    No Stocks Added
                  </h2>
                  <p className="text-500 mb-4">
                    Start building your watchlist by adding some stocks to
                    track.
                  </p>
                  <Button
                    label="Add Your First Stock"
                    icon="pi pi-plus"
                    onClick={() => setShowAddDialog(true)}
                    className="p-button-primary"
                  />
                </div>
              </Card>
            </div>

            {/* AI Oracle */}
            <div className="lg:col-span-1">
              <AIOracle />
            </div>
          </div>
        </div>

        {/* Add Stock Dialog */}
        <Dialog
          header="Add Stock"
          visible={showAddDialog}
          onHide={() => setShowAddDialog(false)}
          style={{ width: '90vw', maxWidth: '400px' }}
        >
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="symbol"
                className="block text-sm font-medium mb-2"
              >
                Stock Symbol
              </label>
              <InputText
                id="symbol"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                placeholder="e.g., AAPL"
                className="w-full"
                onKeyPress={(e) => e.key === 'Enter' && handleAddStock()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                label="Cancel"
                onClick={() => setShowAddDialog(false)}
                className="p-button-text"
              />
              <Button
                label="Add Stock"
                onClick={handleAddStock}
                loading={addLoading}
                disabled={!newSymbol.trim()}
              />
            </div>
          </div>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <Toast ref={toast} />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock Table */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h2 className="text-2xl font-semibold text-center sm:text-left">
                  Watchlist
                </h2>
                <div className="flex flex-col sm:flex-row gap-2 justify-center sm:justify-end">
                  <Button
                    label="Refresh"
                    icon="pi pi-refresh"
                    onClick={refresh}
                    loading={loading}
                    className="p-button-outlined"
                  />
                  <Button
                    label="Add Stock"
                    icon="pi pi-plus"
                    onClick={() => setShowAddDialog(true)}
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                  <span className="ml-3">Loading stock data...</span>
                </div>
              ) : (
                <DataTable
                  value={stockData}
                  responsiveLayout="scroll"
                  className="p-datatable-sm"
                  scrollable
                  scrollHeight="400px"
                >
                  <Column
                    field="symbol"
                    header="Symbol"
                    style={{ width: '100px' }}
                    frozen
                  />
                  <Column field="name" header="Name" />
                  <Column
                    field="price"
                    header="Price"
                    body={priceBodyTemplate}
                    style={{ width: '120px' }}
                  />
                  <Column
                    field="change"
                    header="Change"
                    body={changeBodyTemplate}
                    style={{ width: '150px' }}
                  />
                  <Column
                    field="volume"
                    header="Volume"
                    style={{ width: '120px' }}
                  />
                  <Column
                    body={actionsBodyTemplate}
                    style={{ width: '80px' }}
                    frozen={true}
                  />
                </DataTable>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <AIOracle />
              <HistoricalNotes
                notes={notes}
                onNotesChange={handleNotesChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Stock Dialog */}
      <Dialog
        header="Add Stock"
        visible={showAddDialog}
        onHide={() => setShowAddDialog(false)}
        style={{ width: '90vw', maxWidth: '400px' }}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium mb-2">
              Stock Symbol
            </label>
            <InputText
              id="symbol"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="e.g., AAPL"
              className="w-full"
              onKeyPress={(e) => e.key === 'Enter' && handleAddStock()}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              onClick={() => setShowAddDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Add Stock"
              onClick={handleAddStock}
              loading={addLoading}
              disabled={!newSymbol.trim()}
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
