export interface GameQuest {
  id: string
  title: string
  description: string
  type: 'stocks' | 'crypto' | 'advanced'
  difficulty: 'bronze' | 'silver' | 'gold'
  points: number
  requiredLevel?: number
  requiresLogin: boolean
  isUnlocked: boolean
  completed: boolean
  steps: QuestStep[]
  rewards: QuestReward[]
}

export interface QuestStep {
  id: string
  title: string
  description: string
  type: 'tutorial' | 'challenge' | 'quiz' | 'simulation'
  completed: boolean
  data?: Record<string, unknown>
}

export interface QuestReward {
  type: 'points' | 'avatar' | 'theme' | 'title'
  value: string | number
  description: string
}

export interface MageLevel {
  level: number
  title: string
  minPoints: number
  maxPoints: number
  unlockedAvatars: string[]
  theme: ThemeConfig
  description: string
}

export interface ThemeConfig {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  sidebar: string
  glow: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  category: AchievementCategory
  difficulty: 'bronze' | 'silver' | 'gold'
  points: number
  icon: string
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  maxProgress?: number
  requiresLogin?: boolean
}

export type AchievementCategory =
  | 'dashboard'
  | 'trading'
  | 'streak'
  | 'exploration'
  | 'mastery'
  | 'social'

export interface UserGameProgress {
  userId: string
  level: number
  points: number
  title: string
  currentAvatar: string
  unlockedAvatars: string[]
  achievements: Achievement[]
  completedQuests: string[]
  currentQuest?: string
  loginStreak: number
  lastLoginDate: string
  totalLogins: number
  createdAt: string
  updatedAt: string
}

export interface GameState {
  currentQuest?: GameQuest
  isPlaying: boolean
  gameData: Record<string, unknown>
  score: number
  timeElapsed: number
}
