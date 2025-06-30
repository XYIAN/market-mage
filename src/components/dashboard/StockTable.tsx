'use client'

import { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { StockData } from '@/types'
import { storageUtils } from '@/utils/storage'
import { dateUtils } from '@/utils/date'
import { useWizardToast } from '../layout/WizardToastProvider'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

interface StockTableProps {
  stocks: StockData[]
  loading: boolean
  lastUpdated: Date | null
}

export const StockTable = ({
  stocks,
  loading,
  lastUpdated,
}: StockTableProps) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const { show } = useWizardToast()

  const priceBodyTemplate = (rowData: StockData) => {
    return <span className="font-semibold">${rowData.price.toFixed(2)}</span>
  }

  const changeBodyTemplate = (rowData: StockData) => {
    const isPositive = rowData.change >= 0
    return (
      <div className="flex flex-col">
        <span
          className={`font-semibold ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {isPositive ? '+' : ''}
          {rowData.change.toFixed(2)}
        </span>
        <span
          className={`text-xs ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {isPositive ? '+' : ''}
          {rowData.changePercent.toFixed(2)}%
        </span>
      </div>
    )
  }

  const volumeBodyTemplate = (rowData: StockData) => {
    return <span className="text-sm">{rowData.volume.toLocaleString()}</span>
  }

  const actionsBodyTemplate = (rowData: StockData) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => handleRemoveStock(rowData.symbol)}
        tooltip="Remove from watchlist"
      />
    )
  }

  const handleRemoveStock = (symbol: string) => {
    confirmDialog({
      message: `Are you sure you want to remove ${symbol} from your watchlist?`,
      header: 'Confirm Remove',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        try {
          storageUtils.removeFromWatchlist(symbol)
          show({
            severity: 'success',
            summary: 'Stock Removed',
            detail: `${symbol} was removed from your watchlist.`,
            life: 4000,
            closable: true,
          })
          window.location.reload()
        } catch (error) {
          show({
            severity: 'error',
            summary: 'Remove Failed',
            detail:
              error instanceof Error
                ? error.message
                : 'Failed to remove stock.',
            life: 4000,
            closable: true,
          })
        }
      },
      reject: () => {
        show({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Stock removal cancelled.',
          life: 3000,
          closable: true,
        })
      },
    })
  }

  const exportCSV = () => {
    const csvContent = [
      [
        'Symbol',
        'Name',
        'Price',
        'Change',
        'Change %',
        'Volume',
        'Last Updated',
      ],
      ...stocks.map((stock) => [
        stock.symbol,
        stock.name,
        stock.price.toFixed(2),
        stock.change.toFixed(2),
        stock.changePercent.toFixed(2) + '%',
        stock.volume.toLocaleString(),
        dateUtils.formatDate(stock.lastUpdated),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `market-mage-portfolio-${
      new Date().toISOString().split('T')[0]
    }.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const header = (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold">Stock Watchlist</h2>
        {lastUpdated && (
          <span className="text-sm">
            Last updated: {dateUtils.formatRelativeTime(lastUpdated)}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          icon="pi pi-download"
          label="Export CSV"
          className="p-button-outlined p-button-sm"
          onClick={exportCSV}
          disabled={stocks.length === 0}
        />
        <InputText
          placeholder="Search stocks..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full sm:w-auto"
        />
      </div>
    </div>
  )

  const emptyMessage = (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <i className="pi pi-chart-line text-6xl mb-4"></i>
      <h3 className="text-xl font-semibold mb-2">No Stocks Added Yet</h3>
      <p className="mb-6 max-w-md">
        Your watchlist is empty. Add some stocks to start tracking their
        performance and get AI-powered insights.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          label="Add Your First Stock"
          icon="pi pi-plus"
          className="p-button-primary"
        />
        <Button
          label="View Popular Stocks"
          icon="pi pi-star"
          className="p-button-outlined"
        />
      </div>
    </div>
  )

  return (
    <>
      <ConfirmDialog />
      <DataTable
        value={stocks}
        globalFilter={globalFilter}
        header={header}
        loading={loading}
        emptyMessage={emptyMessage}
        className="p-datatable-sm"
        stripedRows
        showGridlines
      >
        <Column
          field="symbol"
          header="Symbol"
          sortable
          style={{ minWidth: '100px' }}
        />
        <Column
          field="name"
          header="Company"
          sortable
          style={{ minWidth: '150px' }}
        />
        <Column
          field="price"
          header="Price"
          body={priceBodyTemplate}
          sortable
          style={{ minWidth: '100px' }}
        />
        <Column
          field="change"
          header="Change"
          body={changeBodyTemplate}
          sortable
          style={{ minWidth: '120px' }}
        />
        <Column
          field="volume"
          header="Volume"
          body={volumeBodyTemplate}
          sortable
          style={{ minWidth: '120px' }}
        />
        <Column body={actionsBodyTemplate} style={{ width: '80px' }} />
      </DataTable>
    </>
  )
}
