'use client'

import { useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog'
import { Message } from 'primereact/message'
import { WatchlistItem } from '@/types'
import { storageUtils } from '@/utils/storage'

interface AddStockProps {
	onStockAdded: () => void
}

export const AddStock = ({ onStockAdded }: AddStockProps) => {
	const [showDialog, setShowDialog] = useState(false)
	const [symbol, setSymbol] = useState('')
	const [name, setName] = useState('')
	const [error, setError] = useState('')

	const handleAddStock = () => {
		if (!symbol.trim()) {
			setError('Please enter a stock symbol')
			return
		}

		if (!name.trim()) {
			setError('Please enter a company name')
			return
		}

		const stockItem: WatchlistItem = {
			symbol: symbol.trim().toUpperCase(),
			name: name.trim(),
			addedAt: new Date().toISOString()
		}

		storageUtils.addToWatchlist(stockItem)
		setSymbol('')
		setName('')
		setError('')
		setShowDialog(false)
		onStockAdded()
	}

	const handleCancel = () => {
		setSymbol('')
		setName('')
		setError('')
		setShowDialog(false)
	}

	return (
		<>
			<Button
				label="Add Stock"
				icon="pi pi-plus"
				onClick={() => setShowDialog(true)}
				className="p-button-primary"
			/>

			<Dialog
				header="Add Stock to Watchlist"
				visible={showDialog}
				onHide={handleCancel}
				style={{ width: '90vw', maxWidth: '400px' }}
				modal
			>
				<div className="flex flex-col gap-4">
					{error && (
						<Message 
							severity="error" 
							text={error}
						/>
					)}

					<div>
						<label htmlFor="symbol" className="block text-sm font-medium mb-2">
							Stock Symbol *
						</label>
						<InputText
							id="symbol"
							value={symbol}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSymbol(e.target.value)}
							placeholder="e.g., AAPL"
							className="w-full"
							autoFocus
						/>
					</div>

					<div>
						<label htmlFor="name" className="block text-sm font-medium mb-2">
							Company Name *
						</label>
						<InputText
							id="name"
							value={name}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
							placeholder="e.g., Apple Inc."
							className="w-full"
						/>
					</div>

					<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
						<div className="flex items-start gap-2">
							<i className="pi pi-info-circle text-blue-500 mt-1"></i>
							<div className="text-sm text-blue-700 dark:text-blue-300">
								<p className="font-medium mb-1">Popular Stock Symbols:</p>
								<p>AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA, NFLX</p>
							</div>
						</div>
					</div>

					<div className="flex justify-end gap-2">
						<Button
							label="Cancel"
							onClick={handleCancel}
							className="p-button-text"
						/>
						<Button
							label="Add Stock"
							onClick={handleAddStock}
							disabled={!symbol.trim() || !name.trim()}
						/>
					</div>
				</div>
			</Dialog>
		</>
	)
} 