import { StockData, NewsItem, NewsApiResponse } from '@/types'

// Using Alpha Vantage API (free tier) for stock data
const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo'
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || 'demo'

export const apiUtils = {
	// Fetch stock data for multiple symbols
	fetchStockData: async (symbols: string[]): Promise<StockData[]> => {
		try {
			const promises = symbols.map(async (symbol) => {
				const response = await fetch(
					`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
				)
				
				if (!response.ok) {
					throw new Error(`Failed to fetch data for ${symbol}`)
				}
				
				const data = await response.json()
				const quote = data['Global Quote']
				
				if (!quote || Object.keys(quote).length === 0) {
					throw new Error(`No data available for ${symbol}`)
				}
				
				return {
					symbol: quote['01. symbol'],
					name: quote['01. symbol'], // Alpha Vantage doesn't provide company names in global quote
					price: parseFloat(quote['05. price']),
					change: parseFloat(quote['09. change']),
					changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
					volume: parseInt(quote['06. volume']),
					lastUpdated: new Date().toISOString()
				}
			})
			
			const results = await Promise.allSettled(promises)
			return results
				.filter((result): result is PromiseFulfilledResult<StockData> => 
					result.status === 'fulfilled'
				)
				.map(result => result.value)
		} catch (error) {
			console.error('Error fetching stock data:', error)
			return []
		}
	},

	// Fetch financial news
	fetchNews: async (): Promise<NewsItem[]> => {
		try {
			const response = await fetch(
				`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${NEWS_API_KEY}&pageSize=20`
			)
			
			if (!response.ok) {
				throw new Error('Failed to fetch news')
			}
			
			const data: NewsApiResponse = await response.json()
			
			return data.articles.map((article, index) => ({
				id: `news-${index}`,
				title: article.title,
				summary: article.description || 'No description available',
				url: article.url,
				publishedAt: article.publishedAt,
				source: article.source.name
			}))
		} catch (error) {
			console.error('Error fetching news:', error)
			// Return mock data if API fails
			return [
				{
					id: 'mock-1',
					title: 'Market Update: Tech Stocks Rally on Strong Earnings',
					summary: 'Major technology companies report better-than-expected quarterly results, driving market optimism.',
					url: '#',
					publishedAt: new Date().toISOString(),
					source: 'Market News'
				},
				{
					id: 'mock-2',
					title: 'Federal Reserve Signals Potential Rate Changes',
					summary: 'Central bank officials hint at possible adjustments to monetary policy in upcoming meetings.',
					url: '#',
					publishedAt: new Date().toISOString(),
					source: 'Financial Times'
				},
				{
					id: 'mock-3',
					title: 'Oil Prices Stabilize After Recent Volatility',
					summary: 'Crude oil markets find equilibrium following weeks of geopolitical uncertainty.',
					url: '#',
					publishedAt: new Date().toISOString(),
					source: 'Energy Report'
				}
			]
		}
	},

	// Generate AI trading insight
	generateAIInsight: async (): Promise<string> => {
		try {
			const response = await fetch('/api/ai-insight', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			})
			
			if (!response.ok) {
				throw new Error('Failed to generate AI insight')
			}
			
			const data = await response.json()
			return data.insight
		} catch (error) {
			console.error('Error generating AI insight:', error)
			return 'Unable to generate AI insight at this time. Please try again later.'
		}
	}
} 