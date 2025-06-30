'use client'

import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { GameQuest, UserGameProgress } from '@/types/game'
import { BASIC_QUESTS, ADVANCED_QUESTS } from '@/data/game-data'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { StockTradingGame } from '@/components/game/StockTradingGame'
import { AchievementSystem } from '@/components/game/AchievementSystem'

export default function GamePage() {
  const [selectedQuest, setSelectedQuest] = useState<GameQuest | null>(null)
  const [showQuestDialog, setShowQuestDialog] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showGame, setShowGame] = useState(false)
  const [userProgress, setUserProgress] = useState<UserGameProgress | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const toast = useRef<Toast>(null)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadUserProgress()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadUserProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_game_progress')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user progress:', error)
      }

      if (data) {
        setUserProgress(data)
      } else {
        // Create new user progress
        const newProgress: UserGameProgress = {
          userId: user?.id || '',
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
      }
    } catch (error) {
      console.error('Error loading user progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuestSelect = (quest: GameQuest) => {
    if (quest.requiresLogin && !user) {
      setShowLoginDialog(true)
      return
    }

    if (!quest.isUnlocked) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Quest Locked',
        detail: 'This quest requires a higher level or login to unlock.',
        life: 3000,
      })
      return
    }

    setSelectedQuest(quest)
    setShowQuestDialog(true)
  }

  const handleStartGame = () => {
    setShowGame(true)
    setShowQuestDialog(false)
  }

  const getQuestIcon = (type: string) => {
    switch (type) {
      case 'stocks':
        return 'pi pi-chart-bar'
      case 'crypto':
        return 'pi pi-bitcoin'
      case 'advanced':
        return 'pi pi-star'
      default:
        return 'pi pi-question'
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

  const renderQuestCard = (quest: GameQuest) => (
    <Card
      key={quest.id}
      className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
        !quest.isUnlocked ? 'opacity-50' : ''
      }`}
      onClick={() => handleQuestSelect(quest)}
    >
      <div className="flex items-start space-x-4">
        <div className={`text-2xl ${getDifficultyColor(quest.difficulty)}`}>
          <i className={getQuestIcon(quest.type)}></i>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{quest.title}</h3>
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm font-medium ${getDifficultyColor(
                  quest.difficulty
                )}`}
              >
                {quest.difficulty.toUpperCase()}
              </span>
              <span className="text-sm text-gray-400">{quest.points} pts</span>
            </div>
          </div>
          <p className="text-gray-600 mb-3">{quest.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {quest.steps.length} steps
              </span>
              {quest.requiresLogin && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Login Required
                </span>
              )}
            </div>
            {quest.completed && (
              <i className="pi pi-check-circle text-green-500"></i>
            )}
          </div>
        </div>
      </div>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="pi pi-spin pi-spinner text-4xl text-orange-500"></i>
      </div>
    )
  }

  if (showGame) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              label="Back to Quests"
              icon="pi pi-arrow-left"
              onClick={() => setShowGame(false)}
              className="p-button-outlined"
            />
            <h1 className="text-2xl font-bold">Stock Trading Simulation</h1>
            <Button
              label="Achievements"
              icon="pi pi-trophy"
              onClick={() => setShowAchievements(true)}
              className="p-button-outlined"
            />
          </div>
          <StockTradingGame />
        </div>

        <AchievementSystem
          visible={showAchievements}
          onHide={() => setShowAchievements(false)}
        />
      </div>
    )
  }

  return (
    <>
      <Toast ref={toast} />

      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="text-4xl">🧙</span>
              <h1 className="text-3xl font-bold">Trading Academy</h1>
              <span className="text-4xl">⚡</span>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Embark on a magical journey to master the art of trading. Complete
              quests, earn achievements, and become a legendary market mage!
            </p>
          </div>

          {/* User Progress */}
          {userProgress && (
            <Card className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    <span>{userProgress.currentAvatar}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {userProgress.title}{' '}
                      {user?.user_metadata?.full_name || user?.email}
                    </h2>
                    <p className="text-gray-600">
                      Level {userProgress.level} • {userProgress.points} Points
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    label="Achievements"
                    icon="pi pi-trophy"
                    onClick={() => setShowAchievements(true)}
                    className="p-button-outlined"
                  />
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Login Streak</p>
                    <p className="text-lg font-semibold">
                      {userProgress.loginStreak} days
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Basic Quests */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <i className="pi pi-rocket text-orange-500 mr-2"></i>
              Beginner Quests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BASIC_QUESTS.map(renderQuestCard)}
            </div>
          </div>

          {/* Advanced Quests */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <i className="pi pi-star text-yellow-500 mr-2"></i>
              Advanced Quests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ADVANCED_QUESTS.map(renderQuestCard)}
            </div>
          </div>
        </div>
      </div>

      {/* Quest Dialog */}
      <Dialog
        visible={showQuestDialog}
        onHide={() => setShowQuestDialog(false)}
        header={
          <div className="flex items-center space-x-3">
            <i
              className={`${getQuestIcon(
                selectedQuest?.type || ''
              )} text-2xl text-orange-500`}
            ></i>
            <span className="text-xl font-semibold">
              {selectedQuest?.title}
            </span>
          </div>
        }
        style={{ width: '90vw', maxWidth: '800px' }}
        modal
        className="quest-dialog"
      >
        {selectedQuest && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">{selectedQuest.description}</p>
              <div className="flex items-center justify-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                    selectedQuest.difficulty
                  )}`}
                >
                  {selectedQuest.difficulty.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">
                  {selectedQuest.points} Points
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quest Steps</h3>
              {selectedQuest.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 border rounded-lg ${
                    step.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {step.completed ? (
                        <i className="pi pi-check text-sm"></i>
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rewards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedQuest.rewards.map((reward, index) => (
                  <div
                    key={index}
                    className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <i className="pi pi-gift text-orange-500"></i>
                      <div>
                        <p className="font-medium">{reward.description}</p>
                        <p className="text-sm text-gray-600">{reward.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                label="Close"
                icon="pi pi-times"
                onClick={() => setShowQuestDialog(false)}
                className="p-button-outlined"
              />
              <Button
                label="Start Quest"
                icon="pi pi-play"
                onClick={handleStartGame}
              />
            </div>
          </div>
        )}
      </Dialog>

      {/* Login Required Dialog */}
      <Dialog
        visible={showLoginDialog}
        onHide={() => setShowLoginDialog(false)}
        header="Login Required"
        style={{ width: '400px' }}
        modal
      >
        <div className="text-center space-y-4">
          <i className="pi pi-lock text-4xl text-orange-500"></i>
          <h3 className="text-lg font-semibold">
            Advanced Quests Require Login
          </h3>
          <p className="text-gray-600">
            Create an account to unlock advanced quests, track your progress,
            and earn achievements on your journey to becoming a market mage!
          </p>
          <div className="flex justify-center space-x-2">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setShowLoginDialog(false)}
              className="p-button-outlined"
            />
            <Button
              label="Sign Up"
              icon="pi pi-user-plus"
              onClick={() => {
                window.location.href = '/login'
              }}
            />
          </div>
        </div>
      </Dialog>

      {/* Achievement System */}
      <AchievementSystem
        visible={showAchievements}
        onHide={() => setShowAchievements(false)}
      />
    </>
  )
}
