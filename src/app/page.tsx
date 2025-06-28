'use client'

import Link from 'next/link'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { NewsTicker } from '@/components/news-ticker'
import { useNewsTicker } from '@/hooks/useNewsTicker'
import { useStockData } from '@/hooks/useStockData'
import { useAIInsight } from '@/hooks/useAIInsight'

export default function HomePage() {
	const { news } = useNewsTicker()
	const { stocks } = useStockData()
	const { insight } = useAIInsight()

	// Calculate summary stats
	const totalStocks = stocks.length
	const positiveStocks = stocks.filter(s => s.change >= 0).length
	const negativeStocks = stocks.filter(s => s.change < 0).length
	const avgChange = stocks.length > 0 
		? stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length 
		: 0

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
			{/* Sticky News Ticker */}
			<div className="sticky top-0 z-50">
				<NewsTicker news={news} />
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-8">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<div className="mb-6">
						<h1 className="text-5xl font-bold text-white mb-4">
							Market-Mage
						</h1>
						<p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
							Your AI-powered companion for intelligent trading decisions. 
							Get real-time market insights, track your portfolio, and receive 
							daily AI-generated trading recommendations.
						</p>
						<Link href="/dashboard">
							<Button 
								label="Launch Dashboard" 
								icon="pi pi-chart-line"
								className="p-button-primary p-button-lg"
								size="large"
							/>
						</Link>
					</div>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
					<Card className="text-center">
						<div className="mb-4">
							<i className="pi pi-chart-line text-4xl text-orange-500"></i>
						</div>
						<h3 className="text-xl font-semibold mb-2">Real-Time Data</h3>
						<p className="text-gray-600">
							Live stock prices and market data updated every 5 minutes
						</p>
					</Card>

					<Card className="text-center">
						<div className="mb-4">
							<i className="pi pi-magic text-4xl text-orange-500"></i>
						</div>
						<h3 className="text-xl font-semibold mb-2">AI Oracle</h3>
						<p className="text-gray-600">
							Daily AI-powered trading insights and market analysis
						</p>
					</Card>

					<Card className="text-center">
						<div className="mb-4">
							<i className="pi pi-book text-4xl text-orange-500"></i>
						</div>
						<h3 className="text-xl font-semibold mb-2">Portfolio Tracking</h3>
						<p className="text-gray-600">
							Manage your watchlist and track historical notes
						</p>
					</Card>
				</div>

				{/* Quick Stats */}
				{totalStocks > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
						<Card className="text-center">
							<div className="text-2xl font-bold text-orange-500 mb-1">
								{totalStocks}
							</div>
							<div className="text-sm text-gray-600">Stocks Tracked</div>
						</Card>
						<Card className="text-center">
							<div className="text-2xl font-bold text-green-500 mb-1">
								{positiveStocks}
							</div>
							<div className="text-sm text-gray-600">Gaining</div>
						</Card>
						<Card className="text-center">
							<div className="text-2xl font-bold text-red-500 mb-1">
								{negativeStocks}
							</div>
							<div className="text-sm text-gray-600">Declining</div>
						</Card>
						<Card className="text-center">
							<div className={`text-2xl font-bold mb-1 ${avgChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
								{avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
							</div>
							<div className="text-sm text-gray-600">Avg Change</div>
						</Card>
					</div>
				)}

				{/* Latest AI Insight Preview */}
				{insight && (
					<Card className="mb-8">
						<div className="flex items-center gap-2 mb-4">
							<i className="pi pi-lightbulb text-orange-500 text-xl"></i>
							<h3 className="text-xl font-semibold">Today&apos;s AI Insight</h3>
						</div>
						<p className="text-gray-600 mb-4 line-clamp-3">
							{insight.content.substring(0, 200)}...
						</p>
						<Link href="/dashboard">
							<Button 
								label="Read Full Insight" 
								icon="pi pi-arrow-right"
								className="p-button-text"
							/>
						</Link>
					</Card>
				)}

				{/* Call to Action */}
				<div className="text-center">
					<Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
						<h3 className="text-2xl font-bold mb-4">
							Ready to Start Trading Smarter?
						</h3>
						<p className="text-orange-100 mb-6">
							Join thousands of traders who use Market-Mage to make informed decisions
						</p>
						<Link href="/dashboard">
							<Button 
								label="Get Started Now" 
								icon="pi pi-rocket"
								className="p-button-outlined p-button-white"
								size="large"
							/>
						</Link>
					</Card>
				</div>
			</div>
		</div>
	)
}
