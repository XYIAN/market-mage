'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSupabase } from '@/lib/providers/SupabaseProvider'

export interface WatchlistItem {
  id: string
  user_id: string
  symbol: string
  created_at: string
}

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useSupabase()
  const supabase = createClient()

  // Fetch user's watchlist
  const fetchWatchlist = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('watchlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWatchlist(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch watchlist')
    } finally {
      setLoading(false)
    }
  }

  // Add item to watchlist
  const addToWatchlist = async (symbol: string) => {
    if (!user) return

    try {
      setError(null)
      const { error } = await supabase.from('watchlists').insert({
        user_id: user.id,
        symbol: symbol.toUpperCase(),
      })

      if (error) throw error
      await fetchWatchlist() // Refresh the list
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to add to watchlist'
      )
    }
  }

  // Remove item from watchlist
  const removeFromWatchlist = async (id: string) => {
    if (!user) return

    try {
      setError(null)
      const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      await fetchWatchlist() // Refresh the list
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to remove from watchlist'
      )
    }
  }

  // Check if symbol is in watchlist
  const isInWatchlist = (symbol: string) => {
    return watchlist.some((item) => item.symbol === symbol.toUpperCase())
  }

  // Fetch watchlist on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchWatchlist()
    } else {
      setWatchlist([])
      setLoading(false)
    }
  }, [user])

  return {
    watchlist,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    refresh: fetchWatchlist,
  }
}
