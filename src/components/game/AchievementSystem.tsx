'use client'

import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { ProgressBar } from 'primereact/progressbar'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { TabView, TabPanel } from 'primereact/tabview'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { Achievement, AchievementCategory } from '@/types/game'
import { ACHIEVEMENTS } from '@/data/game-data'
import { useGame } from '@/hooks/useGame'

interface AchievementSystemProps {
  visible: boolean
  onHide: () => void
}

export function AchievementSystem({ visible, onHide }: AchievementSystemProps) {
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null)
  const [showAchievementDialog, setShowAchievementDialog] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const toast = useRef<Toast>(null)
  const {
    userProgress,
    achievements,
    unlockAchievement,
    updateAchievementProgress,
  } = useGame()

  const categories: AchievementCategory[] = [
    'dashboard',
    'trading',
    'streak',
    'exploration',
    'mastery',
    'social',
  ]

  const getCategoryIcon = (category: AchievementCategory) => {
    switch (category) {
      case 'dashboard':
        return 'pi pi-th-large'
      case 'trading':
        return 'pi pi-chart-line'
      case 'streak':
        return 'pi pi-calendar'
      case 'exploration':
        return 'pi pi-compass'
      case 'mastery':
        return 'pi pi-star'
      case 'social':
        return 'pi pi-users'
      default:
        return 'pi pi-question'
    }
  }

  const getCategoryName = (category: AchievementCategory) => {
    switch (category) {
      case 'dashboard':
        return 'Dashboard'
      case 'trading':
        return 'Trading'
      case 'streak':
        return 'Streaks'
      case 'exploration':
        return 'Exploration'
      case 'mastery':
        return 'Mastery'
      case 'social':
        return 'Social'
      default:
        return 'Other'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze':
        return 'text-orange-400'
      case 'silver':
        return 'text-gray-300'
      case 'gold':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  const getDifficultyBgColor = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze':
        return 'bg-orange-100 border-orange-200'
      case 'silver':
        return 'bg-gray-100 border-gray-200'
      case 'gold':
        return 'bg-yellow-100 border-yellow-200'
      default:
        return 'bg-gray-100 border-gray-200'
    }
  }

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement)
    setShowAchievementDialog(true)
  }

  const renderAchievementCard = (achievement: Achievement) => {
    const userAchievement = achievements.find((a) => a.id === achievement.id)
    const isUnlocked = userAchievement?.unlocked || false
    const progress = userAchievement?.progress || 0
    const maxProgress = achievement.maxProgress || 1

    return (
      <Card
        key={achievement.id}
        className={`cursor-pointer transition-all hover:shadow-lg ${
          isUnlocked ? 'ring-2 ring-green-500' : ''
        }`}
        onClick={() => handleAchievementClick(achievement)}
      >
        <div className="flex items-start space-x-4">
          <div
            className={`text-2xl ${
              isUnlocked ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            <i className={achievement.icon}></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{achievement.title}</h3>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm font-medium ${getDifficultyColor(
                    achievement.difficulty
                  )}`}
                >
                  {achievement.difficulty.toUpperCase()}
                </span>
                <span className="text-sm text-gray-400">
                  {achievement.points} pts
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {achievement.description}
            </p>

            {achievement.maxProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Progress</span>
                  <span>
                    {progress}/{maxProgress}
                  </span>
                </div>
                <ProgressBar
                  value={(progress / maxProgress) * 100}
                  className="h-2"
                  color={isUnlocked ? '#10b981' : '#f59e0b'}
                />
              </div>
            )}

            {isUnlocked && (
              <div className="mt-2 flex items-center space-x-1">
                <i className="pi pi-check-circle text-green-500 text-sm"></i>
                <span className="text-xs text-green-600">Unlocked</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  const renderCategoryTab = (category: AchievementCategory) => {
    const categoryAchievements = ACHIEVEMENTS.filter(
      (a) => a.category === category
    )
    const unlockedCount = categoryAchievements.filter(
      (a) => achievements.find((ua) => ua.id === a.id)?.unlocked
    ).length

    return (
      <TabPanel
        key={category}
        header={
          <div className="flex items-center space-x-2">
            <i className={getCategoryIcon(category)}></i>
            <span>{getCategoryName(category)}</span>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
              {unlockedCount}/{categoryAchievements.length}
            </span>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryAchievements.map(renderAchievementCard)}
        </div>
      </TabPanel>
    )
  }

  const getStats = () => {
    const totalAchievements = ACHIEVEMENTS.length
    const unlockedAchievements = achievements.filter((a) => a.unlocked).length
    const totalPoints = achievements
      .filter((a) => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0)

    const bronzeUnlocked = achievements.filter(
      (a) => a.unlocked && a.difficulty === 'bronze'
    ).length
    const silverUnlocked = achievements.filter(
      (a) => a.unlocked && a.difficulty === 'silver'
    ).length
    const goldUnlocked = achievements.filter(
      (a) => a.unlocked && a.difficulty === 'gold'
    ).length

    return {
      totalAchievements,
      unlockedAchievements,
      totalPoints,
      bronzeUnlocked,
      silverUnlocked,
      goldUnlocked,
      completionPercentage: (unlockedAchievements / totalAchievements) * 100,
    }
  }

  const stats = getStats()

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        visible={visible}
        onHide={onHide}
        header={
          <div className="flex items-center space-x-3">
            <i className="pi pi-trophy text-2xl text-yellow-500"></i>
            <span className="text-xl font-semibold">Achievements</span>
          </div>
        }
        style={{ width: '95vw', maxWidth: '1200px' }}
        modal
        className="achievement-system"
      >
        <div className="space-y-6">
          {/* Stats Overview */}
          <Card className="bg-gradient-to-r from-orange-50 to-yellow-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.unlockedAchievements}
                </div>
                <div className="text-sm text-gray-600">Unlocked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalPoints}
                </div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.completionPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Completion</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {userProgress?.level || 1}
                </div>
                <div className="text-sm text-gray-600">Mage Level</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Overall Progress</span>
                <span>
                  {stats.unlockedAchievements}/{stats.totalAchievements}
                </span>
              </div>
              <ProgressBar value={stats.completionPercentage} className="h-3" />
            </div>
          </Card>

          {/* Difficulty Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`text-center ${getDifficultyBgColor('bronze')}`}>
              <div className="text-2xl font-bold text-orange-600">
                {stats.bronzeUnlocked}
              </div>
              <div className="text-sm text-gray-600">Bronze Achievements</div>
            </Card>
            <Card className={`text-center ${getDifficultyBgColor('silver')}`}>
              <div className="text-2xl font-bold text-gray-600">
                {stats.silverUnlocked}
              </div>
              <div className="text-sm text-gray-600">Silver Achievements</div>
            </Card>
            <Card className={`text-center ${getDifficultyBgColor('gold')}`}>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.goldUnlocked}
              </div>
              <div className="text-sm text-gray-600">Gold Achievements</div>
            </Card>
          </div>

          {/* Achievement Categories */}
          <TabView
            activeIndex={activeTab}
            onTabChange={(e) => setActiveTab(e.index)}
          >
            {categories.map(renderCategoryTab)}
          </TabView>
        </div>
      </Dialog>

      {/* Achievement Detail Dialog */}
      <Dialog
        visible={showAchievementDialog}
        onHide={() => setShowAchievementDialog(false)}
        header={
          selectedAchievement && (
            <div className="flex items-center space-x-3">
              <i
                className={`${selectedAchievement.icon} text-2xl text-orange-500`}
              ></i>
              <span className="text-lg font-semibold">
                {selectedAchievement.title}
              </span>
            </div>
          )
        }
        style={{ width: '500px' }}
        modal
      >
        {selectedAchievement && (
          <div className="space-y-4">
            <div className="text-center">
              <div
                className={`text-4xl mb-4 ${getDifficultyColor(
                  selectedAchievement.difficulty
                )}`}
              >
                <i className={selectedAchievement.icon}></i>
              </div>
              <p className="text-gray-600 mb-4">
                {selectedAchievement.description}
              </p>

              <div className="flex items-center justify-center space-x-4 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyBgColor(
                    selectedAchievement.difficulty
                  )} ${getDifficultyColor(selectedAchievement.difficulty)}`}
                >
                  {selectedAchievement.difficulty.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">
                  {selectedAchievement.points} Points
                </span>
              </div>

              {selectedAchievement.maxProgress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>
                      {selectedAchievement.progress || 0}/
                      {selectedAchievement.maxProgress}
                    </span>
                  </div>
                  <ProgressBar
                    value={
                      ((selectedAchievement.progress || 0) /
                        selectedAchievement.maxProgress) *
                      100
                    }
                    className="h-3"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                label="Close"
                icon="pi pi-times"
                onClick={() => setShowAchievementDialog(false)}
                className="p-button-outlined"
              />
            </div>
          </div>
        )}
      </Dialog>
    </>
  )
}
