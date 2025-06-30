'use client'

import { useAuth } from '@/hooks/useAuth'
import { useGame } from '@/hooks/useGame'
import { Card } from 'primereact/card'
import { Avatar } from 'primereact/avatar'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { useState } from 'react'
import { AchievementSystem } from '@/components/game/AchievementSystem'

/**
 * User Profile Component
 *
 * Displays the current user's game profile including avatar, mage level,
 * points, achievements, and progress. Provides quick access to the
 * achievement system and game features.
 *
 * @component
 * @example
 * ```tsx
 * <UserProfile />
 * ```
 *
 * @returns {JSX.Element | null} The user profile card or null if not logged in
 */
export function UserProfile() {
  const { user } = useAuth()
  const { userProgress, achievements } = useGame()
  const [showAchievements, setShowAchievements] = useState(false)

  if (!user || !userProgress) {
    return null
  }

  const currentLevel = userProgress.level
  const currentPoints = userProgress.points
  const currentTitle = userProgress.title
  const currentAvatar = userProgress.currentAvatar
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length
  const totalAchievements = achievements.length

  // Calculate progress to next level
  const getLevelProgress = () => {
    const levels = [0, 100, 250, 500, 1000, 2000, 4000, 7000]
    const currentLevelIndex = currentLevel - 1
    const currentLevelPoints = levels[currentLevelIndex] || 0
    const nextLevelPoints =
      levels[currentLevelIndex + 1] || currentLevelPoints + 100
    const progress =
      ((currentPoints - currentLevelPoints) /
        (nextLevelPoints - currentLevelPoints)) *
      100
    return Math.min(Math.max(progress, 0), 100)
  }

  const levelProgress = getLevelProgress()

  return (
    <>
      <Card className="user-profile-card">
        <div className="flex flex-column gap-3">
          {/* User Avatar and Basic Info */}
          <div className="flex align-items-center gap-3">
            <Avatar
              image={`/avatars/${currentAvatar}.png`}
              size="xlarge"
              shape="circle"
              className="border-2 border-primary"
            />
            <div className="flex flex-column">
              <h3 className="m-0 text-primary font-bold">{currentTitle}</h3>
              <p className="m-0 text-500">Level {currentLevel}</p>
              <p className="m-0 text-600 text-sm">{currentPoints} Points</p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="flex flex-column gap-2">
            <div className="flex justify-content-between align-items-center">
              <span className="text-sm font-medium">Level Progress</span>
              <span className="text-sm text-500">
                {Math.round(levelProgress)}%
              </span>
            </div>
            <ProgressBar
              value={levelProgress}
              className="h-1rem"
              color="#ff6b35"
            />
          </div>

          {/* Achievements Summary */}
          <div className="flex justify-content-between align-items-center">
            <div className="flex flex-column">
              <span className="text-sm font-medium">Achievements</span>
              <span className="text-sm text-500">
                {unlockedAchievements} / {totalAchievements}
              </span>
            </div>
            <Badge
              value={unlockedAchievements}
              severity="success"
              size="large"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              label="View Achievements"
              icon="pi pi-trophy"
              size="small"
              onClick={() => setShowAchievements(true)}
              className="flex-1"
            />
            <Button
              label="Game"
              icon="pi pi-gamepad"
              size="small"
              link
              onClick={() => (window.location.href = '/game')}
            />
          </div>
        </div>
      </Card>

      {/* Achievements Modal */}
      <AchievementSystem
        visible={showAchievements}
        onHide={() => setShowAchievements(false)}
      />
    </>
  )
}
