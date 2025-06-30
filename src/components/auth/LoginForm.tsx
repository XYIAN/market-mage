'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { Divider } from 'primereact/divider'
import { createClient } from '@/lib/supabase/client'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        // Show success message for signup
        setError('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-4xl mb-4 block">🧙</span>
          <h1 className="text-2xl font-bold mb-2">Market-Mage</h1>
          <p className="text-gray-400">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="field">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Password
            </label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
              placeholder="Enter your password"
              toggleMask
              feedback={false}
            />
          </div>

          {error && (
            <Message
              severity={
                isSignUp && error.includes('Check your email')
                  ? 'success'
                  : 'error'
              }
              text={error}
              className="w-full"
            />
          )}

          <Button
            type="submit"
            label={isSignUp ? 'Sign Up' : 'Sign In'}
            className="w-full"
            loading={loading}
            disabled={!email || !password}
          />
        </form>

        <Divider />

        <div className="text-center">
          <Button
            link
            onClick={() => setIsSignUp(!isSignUp)}
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
