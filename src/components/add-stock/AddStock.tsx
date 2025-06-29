'use client'

import { useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { AutoComplete } from 'primereact/autocomplete'
import { PickList } from 'primereact/picklist'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { TabView, TabPanel } from 'primereact/tabview'
import { Fieldset } from 'primereact/fieldset'
import { ScrollPanel } from 'primereact/scrollpanel'
import { DataView } from 'primereact/dataview'
import { Chip } from 'primereact/chip'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'

import {
  StockSearchItem,
  POPULAR_STOCKS,
  searchStocks,
} from '@/data/stock-search'
import { storageUtils } from '@/utils/storage'

interface AddStockProps {
  onStockAdded: () => void
}

export const AddStock = ({ onStockAdded }: AddStockProps) => {
  const [visible, setVisible] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [activeAccordion, setActiveAccordion] = useState<number | number[]>([])

  // AutoComplete state
  const [filteredStocks, setFilteredStocks] = useState<StockSearchItem[]>([])
  const [selectedStock, setSelectedStock] = useState<StockSearchItem | null>(
    null
  )

  // PickList state
  const [sourceStocks, setSourceStocks] = useState<StockSearchItem[]>([])
  const [targetStocks, setTargetStocks] = useState<StockSearchItem[]>([])

  // Quick add state
  const [quickAddSymbol, setQuickAddSymbol] = useState('')
  const [quickAddName, setQuickAddName] = useState('')

  // Filter state
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [selectedExchanges, setSelectedExchanges] = useState<string[]>([])
  const [marketCapFilter, setMarketCapFilter] = useState<string | null>(null)

  useEffect(() => {
    if (visible) {
      setSourceStocks([...POPULAR_STOCKS])
      setTargetStocks([])
    }
  }, [visible])

  const searchStocksHandler = (event: { query: string }) => {
    const query = event.query

    if (query.trim().length === 0) {
      setFilteredStocks(POPULAR_STOCKS)
    } else {
      const results = searchStocks(query)
      setFilteredStocks(results)
    }
  }

  const handleAddStock = (stock: StockSearchItem) => {
    storageUtils.addToWatchlist(stock.symbol, stock.name)
    onStockAdded()
    setVisible(false)
    resetForm()
  }

  const handleQuickAdd = () => {
    if (quickAddSymbol.trim() && quickAddName.trim()) {
      storageUtils.addToWatchlist(
        quickAddSymbol.trim().toUpperCase(),
        quickAddName.trim()
      )
      onStockAdded()
      setVisible(false)
      resetForm()
    }
  }

  const handlePickListChange = (event: {
    source: StockSearchItem[]
    target: StockSearchItem[]
  }) => {
    setSourceStocks(event.source)
    setTargetStocks(event.target)
  }

  const handleAddSelected = () => {
    targetStocks.forEach((stock) => {
      storageUtils.addToWatchlist(stock.symbol, stock.name)
    })
    onStockAdded()
    setVisible(false)
    resetForm()
  }

  const resetForm = () => {
    setQuickAddSymbol('')
    setQuickAddName('')
    setSelectedStock(null)
    setSelectedSectors([])
    setSelectedExchanges([])
    setMarketCapFilter(null)
    setActiveTab(0)
    setActiveAccordion([])
  }

  const getSectors = () => {
    const sectors = new Set(
      POPULAR_STOCKS.map((stock) => stock.sector).filter(Boolean)
    )
    return Array.from(sectors)
  }

  const getExchanges = () => {
    const exchanges = new Set(
      POPULAR_STOCKS.map((stock) => stock.exchange).filter(Boolean)
    )
    return Array.from(exchanges)
  }

  const getMarketCapOptions = () => [
    { label: 'Large Cap (>$10B)', value: 'large' },
    { label: 'Mid Cap ($2B-$10B)', value: 'mid' },
    { label: 'Small Cap (<$2B)', value: 'small' },
  ]

  const getFilteredStocks = () => {
    let filtered = [...POPULAR_STOCKS]

    if (selectedSectors.length > 0) {
      filtered = filtered.filter(
        (stock) => stock.sector && selectedSectors.includes(stock.sector)
      )
    }

    if (selectedExchanges.length > 0) {
      filtered = filtered.filter(
        (stock) => stock.exchange && selectedExchanges.includes(stock.exchange)
      )
    }

    return filtered
  }

  const stockItemTemplate = (stock: StockSearchItem) => {
    return (
      <Card
        style={{
          background:
            'linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(59, 130, 246, 0.05))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '16px',
          margin: '0.5rem 0',
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="m-0 font-bold text-lg">{stock.symbol}</h3>
            <p className="m-0 text-sm mb-2">{stock.name}</p>
            <div className="flex gap-2">
              <Chip label={stock.exchange} className="text-xs" />
              {stock.sector && (
                <Chip label={stock.sector} className="text-xs" />
              )}
            </div>
          </div>
          <Button
            label="Add"
            icon="pi pi-plus"
            onClick={() => handleAddStock(stock)}
            className="p-button-primary p-button-sm"
          />
        </div>
      </Card>
    )
  }

  const pickListItemTemplate = (stock: StockSearchItem) => {
    return (
      <div className="flex justify-between items-center p-2">
        <div>
          <div className="font-bold">{stock.symbol}</div>
          <div className="text-sm">{stock.name}</div>
        </div>
        <Chip label={stock.exchange} className="text-xs" />
      </div>
    )
  }

  // Quick Add Component
  const QuickAddComponent = () => (
    <Card
      style={{
        background:
          'linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(59, 130, 246, 0.05))',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '16px',
      }}
    >
      <div className="flex flex-column gap-4">
        <div className="flex flex-column gap-2">
          <label htmlFor="symbol" className="font-medium">
            Stock Symbol
          </label>
          <InputText
            id="symbol"
            value={quickAddSymbol}
            onChange={(e) => setQuickAddSymbol(e.target.value)}
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
            value={quickAddName}
            onChange={(e) => setQuickAddName(e.target.value)}
            placeholder="e.g., Apple Inc."
            className="w-full"
          />
        </div>
        <Button
          label="Add Stock"
          icon="pi pi-plus"
          onClick={handleQuickAdd}
          disabled={!quickAddSymbol.trim() || !quickAddName.trim()}
          className="p-button-primary"
        />
      </div>
    </Card>
  )

  // Search & Add Component
  const SearchAddComponent = () => (
    <Card
      style={{
        background:
          'linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(59, 130, 246, 0.05))',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '16px',
      }}
    >
      <div className="flex flex-column gap-4">
        <div className="flex flex-column gap-2">
          <label htmlFor="search" className="font-medium">
            Search Stocks
          </label>
          <AutoComplete
            id="search"
            value={selectedStock}
            suggestions={filteredStocks}
            completeMethod={searchStocksHandler}
            field="symbol"
            placeholder="Search by symbol, name, or sector..."
            className="w-full"
            onChange={(e) => setSelectedStock(e.value)}
            itemTemplate={(stock) => (
              <div className="flex align-items-center gap-2">
                <span className="font-bold">{stock?.symbol}</span>
                <span className="text-sm">- {stock?.name}</span>
                {stock?.sector && (
                  <Chip label={stock.sector} className="text-xs" />
                )}
              </div>
            )}
          />
        </div>
        {selectedStock && (
          <Card
            style={{
              background: 'rgba(30, 64, 175, 0.05)',
              border: '1px solid rgba(30, 64, 175, 0.1)',
              borderRadius: '12px',
            }}
          >
            <div className="flex justify-between align-items-center">
              <div>
                <h3 className="m-0">{selectedStock.symbol}</h3>
                <p className="m-0 text-sm">{selectedStock.name}</p>
                <div className="flex gap-2 mt-2">
                  <Chip label={selectedStock.exchange} />
                  {selectedStock.sector && (
                    <Chip label={selectedStock.sector} />
                  )}
                </div>
              </div>
              <Button
                label="Add to Watchlist"
                icon="pi pi-plus"
                onClick={() => handleAddStock(selectedStock)}
                className="p-button-primary"
              />
            </div>
          </Card>
        )}
      </div>
    </Card>
  )

  // Pick from List Component
  const PickListComponent = () => (
    <div className="space-y-4">
      <Accordion
        activeIndex={activeAccordion}
        onTabChange={(e) => setActiveAccordion(e.index)}
      >
        <AccordionTab header="Filters">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-medium mb-2 block">Sector</label>
              <MultiSelect
                value={selectedSectors}
                onChange={(e) => setSelectedSectors(e.value)}
                options={getSectors()}
                placeholder="Select sectors"
                className="w-full"
              />
            </div>
            <div>
              <label className="font-medium mb-2 block">Exchange</label>
              <MultiSelect
                value={selectedExchanges}
                onChange={(e) => setSelectedExchanges(e.value)}
                options={getExchanges()}
                placeholder="Select exchanges"
                className="w-full"
              />
            </div>
            <div>
              <label className="font-medium mb-2 block">Market Cap</label>
              <Dropdown
                value={marketCapFilter}
                onChange={(e) => setMarketCapFilter(e.value)}
                options={getMarketCapOptions()}
                placeholder="Select market cap"
                className="w-full"
              />
            </div>
          </div>
        </AccordionTab>
      </Accordion>

      <PickList
        dataKey="symbol"
        source={sourceStocks}
        target={targetStocks}
        onChange={handlePickListChange}
        itemTemplate={pickListItemTemplate}
        filter
        filterBy="symbol,name,sector"
        breakpoint="1280px"
        sourceHeader="Available Stocks"
        targetHeader="Selected Stocks"
        sourceStyle={{ height: '20rem' }}
        targetStyle={{ height: '20rem' }}
        sourceFilterPlaceholder="Search stocks..."
        targetFilterPlaceholder="Search selected..."
      />

      {targetStocks.length > 0 && (
        <div className="flex justify-end">
          <Button
            label={`Add ${targetStocks.length} Stock${
              targetStocks.length > 1 ? 's' : ''
            }`}
            icon="pi pi-check"
            onClick={handleAddSelected}
            className="p-button-primary"
          />
        </div>
      )}
    </div>
  )

  // Browse Popular Component
  const BrowsePopularComponent = () => (
    <Card
      style={{
        background:
          'linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(59, 130, 246, 0.05))',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '16px',
      }}
    >
      <ScrollPanel style={{ height: '400px' }}>
        <DataView
          value={getFilteredStocks()}
          itemTemplate={stockItemTemplate}
          layout="list"
          paginator
          rows={10}
        />
      </ScrollPanel>
    </Card>
  )

  return (
    <>
      <Button
        label="Add Stock"
        icon="pi pi-plus"
        onClick={() => setVisible(true)}
        className="p-button-primary"
      />

      <Dialog
        header="Add Stock to Watchlist"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: '95vw', maxWidth: '900px' }}
        maximizable
        modal
        className="p-fluid"
      >
        {/* Desktop TabView */}
        <div className="hidden lg:block">
          <TabView
            activeIndex={activeTab}
            onTabChange={(e) => setActiveTab(e.index)}
          >
            <TabPanel header="Quick Add">
              <QuickAddComponent />
            </TabPanel>
            <TabPanel header="Search & Add">
              <SearchAddComponent />
            </TabPanel>
            <TabPanel header="Pick from List">
              <PickListComponent />
            </TabPanel>
            <TabPanel header="Browse Popular">
              <BrowsePopularComponent />
            </TabPanel>
          </TabView>
        </div>

        {/* Mobile FieldSet */}
        <div className="lg:hidden">
          <div className="space-y-6">
            <Fieldset legend="Quick Add" toggleable>
              <QuickAddComponent />
            </Fieldset>

            <Fieldset legend="Search & Add" toggleable>
              <SearchAddComponent />
            </Fieldset>

            <Fieldset legend="Pick from List" toggleable>
              <PickListComponent />
            </Fieldset>

            <Fieldset legend="Browse Popular" toggleable>
              <BrowsePopularComponent />
            </Fieldset>
          </div>
        </div>
      </Dialog>
    </>
  )
}
