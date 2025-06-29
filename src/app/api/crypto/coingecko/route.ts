import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false',
      {
        headers: {
          'User-Agent': 'Market-Mage/2.0.0',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CoinGecko data' },
      { status: 500 }
    )
  }
}
