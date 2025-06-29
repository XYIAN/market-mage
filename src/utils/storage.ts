import {
  AIInsight,
  WatchlistItem,
  CryptoWatchlistItem,
  HistoricalNote,
} from '@/types'

const STORAGE_KEYS = {
  AI_INSIGHT: 'market-mage-ai-insight',
  WATCHLIST: 'market-mage-watchlist',
  CRYPTO_WATCHLIST: 'market-mage-crypto-watchlist',
  HISTORICAL_NOTES: 'market-mage-historical-notes',
} as const

export const storageUtils = {
  // AI Insight management
  getAIInsight: (): AIInsight | null => {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AI_INSIGHT)
      if (!stored) return null

      const insight: AIInsight = JSON.parse(stored)
      const now = new Date()
      const expiresAt = new Date(insight.expiresAt)

      // Check if insight has expired
      if (now > expiresAt) {
        localStorage.removeItem(STORAGE_KEYS.AI_INSIGHT)
        return null
      }

      return insight
    } catch (error) {
      console.error('Error reading AI insight from storage:', error)
      return null
    }
  },

  setAIInsight: (insight: AIInsight): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEYS.AI_INSIGHT, JSON.stringify(insight))
    } catch (error) {
      console.error('Error saving AI insight to storage:', error)
    }
  },

  // Stock Watchlist management
  getWatchlist: (): WatchlistItem[] => {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WATCHLIST)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading watchlist from storage:', error)
      return []
    }
  },

  setWatchlist: (watchlist: WatchlistItem[]): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist))
    } catch (error) {
      console.error('Error saving watchlist to storage:', error)
    }
  },

  addToWatchlist: (symbol: string, name: string): void => {
    const watchlist = storageUtils.getWatchlist()
    const exists = watchlist.some((item) => item.symbol === symbol)

    if (!exists) {
      watchlist.push({
        symbol,
        name,
        addedAt: new Date().toISOString(),
      })
      storageUtils.setWatchlist(watchlist)
    }
  },

  removeFromWatchlist: (symbol: string): void => {
    const watchlist = storageUtils.getWatchlist()
    const filtered = watchlist.filter((item) => item.symbol !== symbol)
    storageUtils.setWatchlist(filtered)
  },

  // Crypto Watchlist management
  getCryptoWatchlist: (): CryptoWatchlistItem[] => {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CRYPTO_WATCHLIST)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading crypto watchlist from storage:', error)
      return []
    }
  },

  setCryptoWatchlist: (watchlist: CryptoWatchlistItem[]): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(
        STORAGE_KEYS.CRYPTO_WATCHLIST,
        JSON.stringify(watchlist)
      )
    } catch (error) {
      console.error('Error saving crypto watchlist to storage:', error)
    }
  },

  addToCryptoWatchlist: (symbol: string, name: string): void => {
    const watchlist = storageUtils.getCryptoWatchlist()
    const exists = watchlist.some((item) => item.symbol === symbol)

    if (!exists) {
      watchlist.push({
        symbol,
        name,
        addedAt: new Date().toISOString(),
      })
      storageUtils.setCryptoWatchlist(watchlist)
    }
  },

  removeFromCryptoWatchlist: (symbol: string): void => {
    const watchlist = storageUtils.getCryptoWatchlist()
    const filtered = watchlist.filter((item) => item.symbol !== symbol)
    storageUtils.setCryptoWatchlist(filtered)
  },

  // Historical notes management
  getHistoricalNotes: (): HistoricalNote[] => {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORICAL_NOTES)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading historical notes from storage:', error)
      return []
    }
  },

  setHistoricalNotes: (notes: HistoricalNote[]): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEYS.HISTORICAL_NOTES, JSON.stringify(notes))
    } catch (error) {
      console.error('Error saving historical notes to storage:', error)
    }
  },

  addHistoricalNote: (title: string, content: string): void => {
    const notes = storageUtils.getHistoricalNotes()
    const newNote: HistoricalNote = {
      id: `note-${Date.now()}`,
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    notes.unshift(newNote) // Add to beginning
    storageUtils.setHistoricalNotes(notes)
  },

  updateHistoricalNote: (id: string, title: string, content: string): void => {
    const notes = storageUtils.getHistoricalNotes()
    const index = notes.findIndex((n) => n.id === id)

    if (index !== -1) {
      notes[index] = {
        ...notes[index],
        title,
        content,
        updatedAt: new Date().toISOString(),
      }
      storageUtils.setHistoricalNotes(notes)
    }
  },

  deleteHistoricalNote: (id: string): void => {
    const notes = storageUtils.getHistoricalNotes()
    const filtered = notes.filter((n) => n.id !== id)
    storageUtils.setHistoricalNotes(filtered)
  },
}
