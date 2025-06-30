import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Check cache first
    const { data: cachedStocks } = await supabase
      .from('api_cache')
      .select('data, expires_at')
      .eq('cache_key', 'market_stocks')
      .single()

    if (cachedStocks && new Date(cachedStocks.expires_at) > new Date()) {
      console.log(
        `[${new Date().toISOString()}] [Market API] Using cached stock data`
      )
      return NextResponse.json(cachedStocks.data)
    }

    // Fetch fresh stock data
    console.log(
      `[${new Date().toISOString()}] [Market API] Fetching fresh stock data`
    )

    // For now, return mock data until we implement proper stock API
    const stockData = [
      {
        id: 'AAPL',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        current_price: 185.64,
        price_change_percentage_24h: 2.15,
        market_cap: 2900000000000,
        volume: 45000000,
      },
      {
        id: 'MSFT',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        current_price: 378.85,
        price_change_percentage_24h: 1.87,
        market_cap: 2800000000000,
        volume: 22000000,
      },
      {
        id: 'GOOGL',
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        current_price: 142.56,
        price_change_percentage_24h: -0.45,
        market_cap: 1800000000000,
        volume: 18000000,
      },
      {
        id: 'AMZN',
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        current_price: 151.94,
        price_change_percentage_24h: 3.21,
        market_cap: 1600000000000,
        volume: 35000000,
      },
      {
        id: 'TSLA',
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        current_price: 248.42,
        price_change_percentage_24h: 4.67,
        market_cap: 790000000000,
        volume: 65000000,
      },
    ]

    // Store in database with 5-minute expiration
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    await supabase.from('api_cache').upsert({
      cache_key: 'market_stocks',
      data: { data: stockData },
      expires_at: expiresAt.toISOString(),
    })

    console.log(
      `[${new Date().toISOString()}] [Market API] Cached stock data successfully`
    )

    return NextResponse.json({ data: stockData })
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [Market API] Error:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    )
  }
}
