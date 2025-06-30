'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { Dropdown } from 'primereact/dropdown'
import { createClient } from '@/lib/supabase/client'
import { useWizardToast } from '../layout/WizardToastProvider'

interface UserProfile {
  email: string
  password: string
  full_name?: string
  address?: string
  occupation?: string
  favorite_stock?: string
  favorite_crypto?: string
  bio?: string
  avatar?: string
}

const AVATARS = [
  // Male avatars
  { label: '🧙‍♂️ Wizard', value: 'wizard-male', gender: 'male' },
  { label: '🦹‍♂️ Dark Mage', value: 'dark-mage-male', gender: 'male' },
  { label: '🧙‍♂️ Light Sage', value: 'light-sage-male', gender: 'male' },
  { label: '🦹‍♂️ Shadow Walker', value: 'shadow-walker-male', gender: 'male' },
  { label: '🧙‍♂️ Crystal Seer', value: 'crystal-seer-male', gender: 'male' },
  { label: '🦹‍♂️ Storm Caller', value: 'storm-caller-male', gender: 'male' },
  { label: '🧙‍♂️ Time Keeper', value: 'time-keeper-male', gender: 'male' },
  // Female avatars
  { label: '🧙‍♀️ Enchantress', value: 'enchantress-female', gender: 'female' },
  { label: '🦹‍♀️ Mystic', value: 'mystic-female', gender: 'female' },
  { label: '🧙‍♀️ Star Weaver', value: 'star-weaver-female', gender: 'female' },
  { label: '🦹‍♀️ Moon Dancer', value: 'moon-dancer-female', gender: 'female' },
  {
    label: '🧙‍♀️ Crystal Guardian',
    value: 'crystal-guardian-female',
    gender: 'female',
  },
  { label: '🦹‍♀️ Fire Spirit', value: 'fire-spirit-female', gender: 'female' },
  { label: '🧙‍♀️ Dream Walker', value: 'dream-walker-female', gender: 'female' },
]

const OCCUPATIONS = [
  'Software Engineer',
  'Data Scientist',
  'Financial Analyst',
  'Trader',
  'Student',
  'Entrepreneur',
  'Consultant',
  'Manager',
  'Designer',
  'Other',
]

export const LoginForm = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    email: '',
    password: '',
  })
  const router = useRouter()
  const supabase = createClient()
  const { show } = useWizardToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: profile.email,
          password: profile.password,
          options: {
            data: {
              full_name: profile.full_name,
              address: profile.address,
              occupation: profile.occupation,
              favorite_stock: profile.favorite_stock,
              favorite_crypto: profile.favorite_crypto,
              bio: profile.bio,
              avatar: profile.avatar,
            },
            emailRedirectTo: `${window.location.origin}/confirm?type=signup`,
          },
        })
        if (error) throw error
        show({
          severity: 'success',
          summary: 'Account Created',
          detail:
            '🎉 Account created! Check your email for the confirmation link.',
          life: 5000,
          closable: true,
        })
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email: profile.email,
          password: profile.password,
        })
        if (error) throw error
        show({
          severity: 'success',
          summary: 'Logged In',
          detail: `Welcome, ${
            data.user?.user_metadata?.full_name ||
            data.user?.email ||
            profile.email
          }!`,
          life: 4000,
          closable: true,
        })
        router.push('/market')
      }
    } catch (error) {
      show({
        severity: 'error',
        summary: 'Authentication Failed',
        detail: error instanceof Error ? error.message : 'An error occurred',
        life: 5000,
        closable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <span className="text-4xl mb-4 block">🧙</span>
          <h1 className="text-2xl font-bold mb-2">Market-Mage</h1>
          <p className="text-gray-400">
            {isSignUp ? 'Create your magical account' : 'Welcome back, wizard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Auth Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <InputText
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile('email', e.target.value)}
                className="w-full"
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="field">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password *
              </label>
              <Password
                id="password"
                value={profile.password}
                onChange={(e) => updateProfile('password', e.target.value)}
                className="w-full"
                required
                placeholder="Enter your password"
                toggleMask
                feedback={false}
              />
            </div>
          </div>

          {/* Extended Profile Fields (Sign Up Only) */}
          {isSignUp && (
            <>
              <Divider />
              <h3 className="text-lg font-semibold mb-4">
                ✨ Tell us about yourself (Optional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="field">
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium mb-2"
                  >
                    Full Name
                  </label>
                  <InputText
                    id="full_name"
                    value={profile.full_name || ''}
                    onChange={(e) => updateProfile('full_name', e.target.value)}
                    className="w-full"
                    placeholder="Your magical name"
                  />
                </div>

                <div className="field">
                  <label
                    htmlFor="occupation"
                    className="block text-sm font-medium mb-2"
                  >
                    Occupation
                  </label>
                  <Dropdown
                    id="occupation"
                    value={profile.occupation}
                    onChange={(e) =>
                      updateProfile('occupation', e.value as string)
                    }
                    options={OCCUPATIONS}
                    className="w-full"
                    placeholder="Select your profession"
                  />
                </div>
              </div>

              <div className="field">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium mb-2"
                >
                  Location
                </label>
                <InputText
                  id="address"
                  value={profile.address || ''}
                  onChange={(e) => updateProfile('address', e.target.value)}
                  className="w-full"
                  placeholder="Where in the world are you?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="field">
                  <label
                    htmlFor="favorite_stock"
                    className="block text-sm font-medium mb-2"
                  >
                    Favorite Stock
                  </label>
                  <InputText
                    id="favorite_stock"
                    value={profile.favorite_stock || ''}
                    onChange={(e) =>
                      updateProfile('favorite_stock', e.target.value)
                    }
                    className="w-full"
                    placeholder="e.g., AAPL, GOOGL"
                  />
                </div>

                <div className="field">
                  <label
                    htmlFor="favorite_crypto"
                    className="block text-sm font-medium mb-2"
                  >
                    Favorite Crypto
                  </label>
                  <InputText
                    id="favorite_crypto"
                    value={profile.favorite_crypto || ''}
                    onChange={(e) =>
                      updateProfile('favorite_crypto', e.target.value)
                    }
                    className="w-full"
                    placeholder="e.g., BTC, ETH"
                  />
                </div>
              </div>

              <div className="field">
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium mb-2"
                >
                  Choose Your Avatar
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.value}
                      type="button"
                      onClick={() => updateProfile('avatar', avatar.value)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        profile.avatar === avatar.value
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <span className="text-2xl">
                        {avatar.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label htmlFor="bio" className="block text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={profile.bio || ''}
                  onChange={(e) => updateProfile('bio', e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-surface-800 text-white resize-none"
                  rows={3}
                  placeholder="Tell us about your trading journey..."
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            label={isSignUp ? 'Create Account' : 'Sign In'}
            className="w-full"
            loading={loading}
            disabled={!profile.email || !profile.password}
          />
        </form>

        <Divider />

        <div className="text-center">
          <Button
            link
            onClick={() => {
              setIsSignUp(!isSignUp)
            }}
            label={
              isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"
            }
          />
        </div>
      </Card>
    </div>
  )
}
