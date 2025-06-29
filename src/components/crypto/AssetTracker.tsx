'use client'

import { useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Chip } from 'primereact/chip'
import { Dialog } from 'primereact/dialog'
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete'
import { ProgressSpinner } from 'primereact/progressspinner'
import { CryptoAsset } from '@/types/crypto'
import { CryptoData } from '@/types'
import { useCoinbaseData } from '@/hooks/useCoinbaseData'

interface AssetTrackerProps {
  assets: CryptoAsset[]
  onAssetsChange: (assets: CryptoAsset[]) => void
}

export function AssetTracker({ assets, onAssetsChange }: AssetTrackerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCoins, setFilteredCoins] = useState<CryptoData[]>([])
  const { cryptoData, loading: coinsLoading } = useCoinbaseData()

  const handleAddAsset = (cryptoData: CryptoData) => {
    const asset: CryptoAsset = {
      id: cryptoData.symbol,
      symbol: cryptoData.symbol,
      name: cryptoData.name,
      price: parseFloat(cryptoData.price),
      change24h: parseFloat(cryptoData.change.replace(/[+%]/g, '')),
      marketCap: cryptoData.marketCap,
      volume24h: parseFloat(cryptoData.volume.replace(/,/g, '')),
    }

    if (!assets.find((a) => a.symbol === asset.symbol)) {
      onAssetsChange([...assets, asset])
    }
    setShowAddDialog(false)
    setSearchQuery('')
  }

  const handleRemoveAsset = (symbol: string) => {
    onAssetsChange(assets.filter((asset) => asset.symbol !== symbol))
  }

  const searchCoins = (event: AutoCompleteCompleteEvent) => {
    const query = event.query
    setSearchQuery(query)
    if (query.trim()) {
      const filtered = cryptoData.filter(
        (coin: CryptoData) =>
          coin.name.toLowerCase().includes(query.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredCoins(filtered.slice(0, 10))
    } else {
      setFilteredCoins([])
    }
  }

  const priceBodyTemplate = (rowData: CryptoAsset) => (
    <span className="font-semibold">
      $
      {rowData.price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  )

  const changeBodyTemplate = (rowData: CryptoAsset) => (
    <Chip
      label={`${rowData.change24h > 0 ? '+' : ''}${rowData.change24h.toFixed(
        2
      )}%`}
      className={
        rowData.change24h >= 0
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }
    />
  )

  const marketCapBodyTemplate = (rowData: CryptoAsset) => (
    <span>${(rowData.marketCap / 1e9).toFixed(2)}B</span>
  )

  const actionsBodyTemplate = (rowData: CryptoAsset) => (
    <Button
      icon="pi pi-trash"
      className="p-button-danger p-button-text p-button-sm"
      onClick={() => handleRemoveAsset(rowData.symbol)}
      tooltip="Remove asset"
    />
  )

  return (
    <Card title="Tracked Assets" className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Your Crypto Portfolio</h3>
        <Button
          label="Add Asset"
          icon="pi pi-plus"
          onClick={() => setShowAddDialog(true)}
          className="p-button-sm"
        />
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-8">
          <i className="pi pi-bitcoin text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-500 mb-4">No assets added yet</p>
          <Button
            label="Add Your First Asset"
            icon="pi pi-plus"
            onClick={() => setShowAddDialog(true)}
          />
        </div>
      ) : (
        <DataTable
          value={assets}
          responsiveLayout="scroll"
          className="text-sm"
          emptyMessage="No assets found"
        >
          <Column field="symbol" header="Symbol" style={{ width: '80px' }} />
          <Column field="name" header="Name" style={{ width: '150px' }} />
          <Column
            field="price"
            header="Price"
            body={priceBodyTemplate}
            style={{ width: '120px' }}
          />
          <Column
            field="change24h"
            header="24h Change"
            body={changeBodyTemplate}
            style={{ width: '120px' }}
          />
          <Column
            field="marketCap"
            header="Market Cap"
            body={marketCapBodyTemplate}
            style={{ width: '120px' }}
          />
          <Column body={actionsBodyTemplate} style={{ width: '80px' }} />
        </DataTable>
      )}

      <Dialog
        header="Add Crypto Asset"
        visible={showAddDialog}
        onHide={() => setShowAddDialog(false)}
        style={{ width: '500px' }}
        modal
      >
        <div className="space-y-4">
          <AutoComplete
            value={searchQuery}
            suggestions={filteredCoins}
            completeMethod={searchCoins}
            field="name"
            placeholder="Search for a cryptocurrency..."
            delay={300}
            minLength={1}
            itemTemplate={(item: CryptoData) => (
              <div className="flex items-center space-x-3 p-2">
                <span className="font-semibold">{item.symbol}</span>
                <span className="text-gray-600">{item.name}</span>
              </div>
            )}
            onSelect={(e) => handleAddAsset(e.value)}
          />
          {coinsLoading && (
            <div className="flex justify-center">
              <ProgressSpinner style={{ width: '30px', height: '30px' }} />
            </div>
          )}
        </div>
      </Dialog>
    </Card>
  )
}
