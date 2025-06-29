import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
      headers: {
        'User-Agent': 'Market-Mage/2.0.0',
      },
    })

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching Binance data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Binance data' },
      { status: 500 }
    )
  }
}
