import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'stocks'

  try {
    const supabase = await createClient()

    // Check cache first
    const { data: cachedNews } = await supabase
      .from('api_cache')
      .select('data, expires_at')
      .eq('cache_key', `news_${type}`)
      .single()

    if (cachedNews && new Date(cachedNews.expires_at) > new Date()) {
      console.log(
        `[${new Date().toISOString()}] [News API] Using cached ${type} news`
      )
      return NextResponse.json(cachedNews.data)
    }

    // Fetch fresh news
    console.log(
      `[${new Date().toISOString()}] [News API] Fetching fresh ${type} news`
    )

    let newsData: Array<{
      id: string
      title: string
      description: string
      url: string
      publishedAt: string
      source: string
      sentiment: 'positive' | 'negative' | 'neutral'
    }> = []

    if (type === 'stocks') {
      // Fetch from Yahoo Finance or other stock news source
      const response = await fetch(
        'https://query1.finance.yahoo.com/v8/finance/chart/AAPL',
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        }
      )

      if (response.ok) {
        // For now, return mock data until we implement proper news API
        newsData = [
          {
            id: '1',
            title: 'Tech Stocks Rally on Strong Earnings Reports',
            description:
              'Major technology companies report better-than-expected quarterly results, driving market optimism.',
            url: 'https://finance.yahoo.com/news/tech-stocks-rally-strong-earnings',
            publishedAt: new Date().toISOString(),
            source: 'Yahoo Finance',
            sentiment: 'positive',
          },
          {
            id: '2',
            title: 'Federal Reserve Signals Potential Rate Changes',
            description:
              'Central bank officials hint at possible adjustments to monetary policy in upcoming meetings.',
            url: 'https://finance.yahoo.com/news/fed-signals-rate-changes',
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            source: 'Financial Times',
            sentiment: 'neutral',
          },
          {
            id: '3',
            title: 'Market Volatility Expected as Earnings Season Continues',
            description:
              'Analysts predict increased market volatility as more companies report quarterly earnings.',
            url: 'https://finance.yahoo.com/news/market-volnings-season',
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            source: 'MarketWatch',
            sentiment: 'neutral',
          },
        ]
      }
    }

    // Store in database with 2-hour expiration
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000)

    await supabase.from('api_cache').upsert({
      cache_key: `news_${type}`,
      data: { articles: newsData },
      expires_at: expiresAt.toISOString(),
    })

    console.log(
      `[${new Date().toISOString()}] [News API] Cached ${type} news successfully`
    )

    return NextResponse.json({ articles: newsData })
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [News API] Error:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
      { status: 500 }
    )
  }
}
