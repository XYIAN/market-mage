'use client'

import { useState } from 'react'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { WatchlistItem } from '@/types'
import { storageUtils } from '@/utils/storage'

interface QuickAddProps {
  onStockAdded: () => void
  onClose: () => void
}

export const QuickAdd = ({ onStockAdded, onClose }: QuickAddProps) => {
  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')

  const handleAddStock = () => {
    if (symbol.trim() && name.trim()) {
      const watchlistItem: WatchlistItem = {
        symbol: symbol.trim().toUpperCase(),
        name: name.trim(),
        addedAt: new Date().toISOString(),
      }
      storageUtils.addToWatchlist(watchlistItem)
      onStockAdded()
      onClose()
    }
  }

  return (
    <div className="grid">
      <div className="col-12">
        <Card>
          <div className="flex flex-column gap-4">
            <div className="flex flex-column gap-2">
              <label htmlFor="symbol" className="font-medium">
                Stock Symbol
              </label>
              <InputText
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g., AAPL"
                className="w-full"
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="name" className="font-medium">
                Company Name
              </label>
              <InputText
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Apple Inc."
                className="w-full"
              />
            </div>
            <Button
              label="Add Stock"
              icon="pi pi-plus"
              onClick={handleAddStock}
              disabled={!symbol.trim() || !name.trim()}
              className="p-button-primary"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
