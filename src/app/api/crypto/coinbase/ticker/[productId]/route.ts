import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const response = await fetch(
      `https://api.exchange.coinbase.com/products/${productId}/ticker`,
      {
        headers: {
          'User-Agent': 'Market-Mage/2.0.0',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Coinbase API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching Coinbase ticker:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Coinbase ticker' },
      { status: 500 }
    )
  }
}
