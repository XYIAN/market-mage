import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://api.exchange.coinbase.com/products', {
      headers: {
        'User-Agent': 'Market-Mage/2.0.0',
      },
    })

    if (!response.ok) {
      throw new Error(`Coinbase API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching Coinbase products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Coinbase products' },
      { status: 500 }
    )
  }
}
