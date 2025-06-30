'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useGame } from '@/hooks/useGame'

// Page achievement mappings
const PAGE_ACHIEVEMENTS = {
  '/': 'home-visitor',
  '/dashboard': 'dashboard-visitor',
  '/crypto': 'crypto-visitor',
  '/market': 'market-visitor',
  '/news': 'news-visitor',
  '/crypto/news': 'crypto-news-visitor',
  '/game': 'game-visitor',
  '/faq': 'faq-visitor',
  '/about': 'about-visitor',
  '/terms': 'terms-visitor',
} as const

// Daily visit achievement mappings
const DAILY_PAGE_ACHIEVEMENTS = {
  '/': 'daily-home-visitor',
  '/dashboard': 'daily-dashboard-visitor',
  '/crypto': 'daily-crypto-visitor',
  '/market': 'daily-market-visitor',
  '/news': 'daily-news-visitor',
  '/crypto/news': 'daily-crypto-news-visitor',
  '/game': 'daily-game-visitor',
  '/faq': 'daily-faq-visitor',
  '/about': 'daily-about-visitor',
  '/terms': 'daily-terms-visitor',
} as const

export const usePageTracking = () => {
  const pathname = usePathname()
  const { user } = useAuth()
  const { unlockAchievement, addPoints } = useGame()

  useEffect(() => {
    if (!user || !pathname) return

    const trackPageVisit = async () => {
      const achievementId =
        PAGE_ACHIEVEMENTS[pathname as keyof typeof PAGE_ACHIEVEMENTS]
      const dailyAchievementId =
        DAILY_PAGE_ACHIEVEMENTS[
          pathname as keyof typeof DAILY_PAGE_ACHIEVEMENTS
        ]

      if (achievementId) {
        // Award basic page visit achievement
        await unlockAchievement(achievementId)
        await addPoints(5) // 5 points for page visit
      }

      if (dailyAchievementId) {
        // Award daily visit achievement (requires login)
        await unlockAchievement(dailyAchievementId)
      }

      // Check for "all pages explorer" achievement
      await unlockAchievement('all-pages-explorer')

      // Check for "daily all pages" achievement
      await unlockAchievement('daily-all-pages')
    }

    trackPageVisit()
  }, [pathname, user, unlockAchievement, addPoints])
}
