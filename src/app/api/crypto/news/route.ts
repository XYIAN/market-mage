import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Check cache first
    const { data: cachedNews } = await supabase
      .from('api_cache')
      .select('data, expires_at')
      .eq('cache_key', 'crypto_news')
      .single()

    if (cachedNews && new Date(cachedNews.expires_at) > new Date()) {
      console.log(
        `[${new Date().toISOString()}] [Crypto News API] Using cached crypto news`
      )
      return NextResponse.json(cachedNews.data)
    }

    // Fetch fresh crypto news
    console.log(
      `[${new Date().toISOString()}] [Crypto News API] Fetching fresh crypto news`
    )

    // For now, return mock data until we implement proper crypto news API
    const cryptoNewsData = [
      {
        id: '1',
        title: 'Bitcoin Surges Past $45,000 as Institutional Adoption Grows',
        description:
          'Bitcoin reaches new yearly highs as major financial institutions continue to show interest in cryptocurrency investments.',
        url: 'https://cointelegraph.com/news/bitcoin-surges-past-45000',
        publishedAt: new Date().toISOString(),
        source: 'CoinTelegraph',
        sentiment: 'positive',
      },
      {
        id: '2',
        title: 'Ethereum Layer 2 Solutions Show Promising Growth',
        description:
          'Layer 2 scaling solutions on Ethereum network demonstrate significant adoption and performance improvements.',
        url: 'https://decrypt.co/news/ethereum-layer-2-growth',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: 'Decrypt',
        sentiment: 'positive',
      },
      {
        id: '3',
        title: 'DeFi Protocols Face Regulatory Scrutiny',
        description:
          'Decentralized finance protocols come under increased regulatory attention as the sector continues to grow.',
        url: 'https://coindesk.com/news/defi-regulatory-scrutiny',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: 'CoinDesk',
        sentiment: 'neutral',
      },
    ]

    // Store in database with 2-hour expiration
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000)

    await supabase.from('api_cache').upsert({
      cache_key: 'crypto_news',
      data: { articles: cryptoNewsData },
      expires_at: expiresAt.toISOString(),
    })

    console.log(
      `[${new Date().toISOString()}] [Crypto News API] Cached crypto news successfully`
    )

    return NextResponse.json({ articles: cryptoNewsData })
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] [Crypto News API] Error:`,
      error
    )
    return NextResponse.json(
      { error: 'Failed to fetch crypto news data' },
      { status: 500 }
    )
  }
}
