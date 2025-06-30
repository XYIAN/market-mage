'use client'

import { useGlobalData } from '@/providers/GlobalDataProvider'

export const useNewsTicker = () => {
  const { globalNews, newsLoading, refreshNews } = useGlobalData()

  return {
    news: globalNews,
    loading: newsLoading,
    error: null,
    refresh: refreshNews,
  }
}
