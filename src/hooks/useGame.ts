import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { UserGameProgress, Achievement } from '@/types/game'
import {
  MAGE_LEVELS,
  ACHIEVEMENTS,
  BASIC_QUESTS,
  ADVANCED_QUESTS,
} from '@/data/game-data'

export const useGame = () => {
  const [userProgress, setUserProgress] = useState<UserGameProgress | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const { user } = useAuth()
  const supabase = createClient()

  // Load user progress
  const loadUserProgress = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_game_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user progress:', error)
      }

      if (data) {
        setUserProgress(data)
        setAchievements(data.achievements || [])
      } else {
        // Create new user progress
        const newProgress: UserGameProgress = {
          userId: user.id,
          level: 1,
          points: 0,
          title: 'Apprentice',
          currentAvatar: 'wizard-male',
          unlockedAvatars: ['wizard-male', 'enchantress-female'],
          achievements: [],
          completedQuests: [],
          loginStreak: 0,
          lastLoginDate: new Date().toISOString(),
          totalLogins: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setUserProgress(newProgress)
        setAchievements([])

        // Save to database
        await saveUserProgress(newProgress)
      }
    } catch (error) {
      console.error('Error loading user progress:', error)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  // Save user progress
  const saveUserProgress = async (progress: UserGameProgress) => {
    if (!user) return

    try {
      const { error } = await supabase.from('user_game_progress').upsert({
        user_id: user.id,
        level: progress.level,
        points: progress.points,
        title: progress.title,
        current_avatar: progress.currentAvatar,
        unlocked_avatars: progress.unlockedAvatars,
        achievements: progress.achievements,
        completed_quests: progress.completedQuests,
        current_quest: progress.currentQuest,
        login_streak: progress.loginStreak,
        last_login_date: progress.lastLoginDate,
        total_logins: progress.totalLogins,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error('Error saving user progress:', error)
      }
    } catch (error) {
      console.error('Error saving user progress:', error)
    }
  }

  // Update login streak
  const updateLoginStreak = useCallback(async () => {
    if (!userProgress || !user) return

    const today = new Date().toISOString().split('T')[0]
    const lastLogin = userProgress.lastLoginDate.split('T')[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]

    let newStreak = userProgress.loginStreak
    if (lastLogin === yesterday) {
      newStreak += 1
    } else if (lastLogin !== today) {
      newStreak = 1
    }

    const updatedProgress = {
      ...userProgress,
      loginStreak: newStreak,
      lastLoginDate: new Date().toISOString(),
      totalLogins: userProgress.totalLogins + 1,
      updatedAt: new Date().toISOString(),
    }

    setUserProgress(updatedProgress)
    await saveUserProgress(updatedProgress)
  }, [userProgress, user, saveUserProgress])

  // Add points and check level up
  const addPoints = useCallback(
    async (points: number) => {
      if (!userProgress) return

      const newPoints = userProgress.points + points
      const currentLevel = userProgress.level
      const newLevel =
        MAGE_LEVELS.find(
          (level) =>
            newPoints >= level.minPoints && newPoints <= level.maxPoints
        )?.level || currentLevel

      const updatedProgress = {
        ...userProgress,
        points: newPoints,
        level: newLevel,
        title:
          MAGE_LEVELS.find((level) => level.level === newLevel)?.title ||
          userProgress.title,
        updatedAt: new Date().toISOString(),
      }

      setUserProgress(updatedProgress)
      await saveUserProgress(updatedProgress)

      // Check for level up
      if (newLevel > currentLevel) {
        const newLevelData = MAGE_LEVELS.find(
          (level) => level.level === newLevel
        )
        if (newLevelData) {
          // Unlock new avatars
          const updatedAvatars = [
            ...new Set([
              ...updatedProgress.unlockedAvatars,
              ...newLevelData.unlockedAvatars,
            ]),
          ]
          updatedProgress.unlockedAvatars = updatedAvatars
          setUserProgress(updatedProgress)
          await saveUserProgress(updatedProgress)
        }
      }

      return { newPoints, newLevel, leveledUp: newLevel > currentLevel }
    },
    [userProgress, saveUserProgress]
  )

  // Unlock achievement
  const unlockAchievement = useCallback(
    async (achievementId: string) => {
      if (!userProgress) return

      const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId)
      if (!achievement) return

      const existingAchievement = userProgress.achievements.find(
        (a) => a.id === achievementId
      )

      // For daily achievements, check if already unlocked today
      if (achievementId.startsWith('daily-')) {
        if (existingAchievement?.unlocked) {
          const lastUnlocked = new Date(existingAchievement.unlockedAt || '')
          const today = new Date()
          const isToday = lastUnlocked.toDateString() === today.toDateString()

          if (isToday) {
            // Already unlocked today, just update progress
            const updatedProgress = (existingAchievement.progress || 0) + 1
            const updatedAchievement = {
              ...existingAchievement,
              progress: updatedProgress,
            }

            // Check if achievement should be unlocked
            if (
              achievement.maxProgress &&
              updatedProgress >= achievement.maxProgress
            ) {
              // Achievement completed, keep it unlocked
              return existingAchievement
            }

            const updatedAchievements = userProgress.achievements.map((a) =>
              a.id === achievementId ? updatedAchievement : a
            )

            const updatedProgressData = {
              ...userProgress,
              achievements: updatedAchievements,
              updatedAt: new Date().toISOString(),
            }

            setUserProgress(updatedProgressData)
            setAchievements(updatedAchievements)
            await saveUserProgress(updatedProgressData)
            return existingAchievement
          }
        }
      } else {
        // For regular achievements, don't unlock if already unlocked
        if (existingAchievement?.unlocked) return existingAchievement
      }

      const unlockedAchievement = {
        ...achievement,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        progress: achievementId.startsWith('daily-') ? 1 : undefined,
      }

      const updatedAchievements = [
        ...userProgress.achievements.filter((a) => a.id !== achievementId),
        unlockedAchievement,
      ]
      const updatedProgress = {
        ...userProgress,
        achievements: updatedAchievements,
        updatedAt: new Date().toISOString(),
      }

      setUserProgress(updatedProgress)
      setAchievements(updatedAchievements)
      await saveUserProgress(updatedProgress)

      // Add points for achievement (only for first-time unlocks)
      if (!existingAchievement?.unlocked) {
        await addPoints(achievement.points)
      }

      return unlockedAchievement
    },
    [userProgress, addPoints, saveUserProgress]
  )

  // Update achievement progress
  const updateAchievementProgress = useCallback(
    async (achievementId: string, progress: number) => {
      if (!userProgress) return

      const achievement = userProgress.achievements.find(
        (a) => a.id === achievementId
      )
      if (!achievement || achievement.unlocked) return

      const updatedAchievement = {
        ...achievement,
        progress: progress,
      }

      // Check if achievement should be unlocked
      if (achievement.maxProgress && progress >= achievement.maxProgress) {
        await unlockAchievement(achievementId)
        return
      }

      const updatedAchievements = userProgress.achievements.map((a) =>
        a.id === achievementId ? updatedAchievement : a
      )

      const updatedProgress = {
        ...userProgress,
        achievements: updatedAchievements,
        updatedAt: new Date().toISOString(),
      }

      setUserProgress(updatedProgress)
      setAchievements(updatedAchievements)
      await saveUserProgress(updatedProgress)
    },
    [userProgress, unlockAchievement, saveUserProgress]
  )

  // Complete quest
  const completeQuest = useCallback(
    async (questId: string) => {
      if (!userProgress) return

      const quest = [...BASIC_QUESTS, ...ADVANCED_QUESTS].find(
        (q) => q.id === questId
      )
      if (!quest) return

      const updatedProgress = {
        ...userProgress,
        completedQuests: [...userProgress.completedQuests, questId],
        updatedAt: new Date().toISOString(),
      }

      setUserProgress(updatedProgress)
      await saveUserProgress(updatedProgress)

      // Add points for quest completion
      await addPoints(quest.points)

      return quest
    },
    [userProgress, addPoints, saveUserProgress]
  )

  // Get current theme
  const getCurrentTheme = useCallback(() => {
    if (!userProgress) return MAGE_LEVELS[0].theme
    return (
      MAGE_LEVELS.find((level) => level.level === userProgress.level)?.theme ||
      MAGE_LEVELS[0].theme
    )
  }, [userProgress])

  // Get next level info
  const getNextLevelInfo = useCallback(() => {
    if (!userProgress) return null
    const currentLevelData = MAGE_LEVELS.find(
      (level) => level.level === userProgress.level
    )
    const nextLevelData = MAGE_LEVELS.find(
      (level) => level.level === userProgress.level + 1
    )

    if (!nextLevelData || !currentLevelData) return null

    return {
      currentLevel: currentLevelData,
      nextLevel: nextLevelData,
      pointsNeeded: nextLevelData.minPoints - userProgress.points,
      progress:
        ((userProgress.points - currentLevelData.minPoints) /
          (nextLevelData.minPoints - currentLevelData.minPoints)) *
        100,
    }
  }, [userProgress])

  // Initialize
  useEffect(() => {
    loadUserProgress()
  }, [loadUserProgress])

  // Update login streak on mount
  useEffect(() => {
    if (userProgress && user) {
      updateLoginStreak()
    }
  }, [userProgress, user, updateLoginStreak])

  return {
    userProgress,
    achievements,
    loading,
    addPoints,
    unlockAchievement,
    updateAchievementProgress,
    completeQuest,
    getCurrentTheme,
    getNextLevelInfo,
    updateLoginStreak,
    saveUserProgress,
  }
}
