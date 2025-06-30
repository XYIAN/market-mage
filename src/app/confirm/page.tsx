'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import { createClient } from '@/lib/supabase/client'

function ConfirmContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get the token from URL parameters
        const token = searchParams.get('token')
        const type = searchParams.get('type')

        if (type === 'signup' && token) {
          // Handle email confirmation
          const { error: confirmError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
          })

          if (confirmError) {
            throw confirmError
          }

          // Get user data to display name
          const {
            data: { user: confirmedUser },
          } = await supabase.auth.getUser()
          if (confirmedUser?.user_metadata?.full_name) {
            setUserName(confirmedUser.user_metadata.full_name)
          }
        } else if (type === 'recovery' && token) {
          // Handle password recovery
          const { error: resetError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery',
          })

          if (resetError) {
            throw resetError
          }
        } else {
          throw new Error('Invalid confirmation link')
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred during confirmation'
        )
      } finally {
        setLoading(false)
      }
    }

    handleEmailConfirmation()
  }, [searchParams, supabase.auth])

  const handleContinue = () => {
    router.push('/market')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <span className="text-6xl mb-4 block animate-pulse">🧙</span>
            <h1 className="text-3xl font-bold text-white mb-2">
              Confirming Your Account
            </h1>
            <p className="text-gray-400">
              Please wait while we verify your email...
            </p>
          </div>
          <ProgressSpinner style={{ width: '60px', height: '60px' }} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <div className="mb-6">
              <span className="text-6xl mb-4 block">❌</span>
              <h1 className="text-2xl font-bold text-white mb-2">
                Confirmation Failed
              </h1>
              <p className="text-red-400 mb-4">{error}</p>
            </div>
            <Button
              label="Go Back to Login"
              icon="pi pi-arrow-left"
              onClick={() => router.push('/login')}
              className="w-full"
            />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <div className="text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="relative">
              <span className="text-8xl mb-4 block animate-bounce">✨</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl animate-ping">🌟</span>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 hero-glow">
              Welcome to Market-Mage!
            </h1>
            {userName && (
              <p className="text-xl text-blue-300 mb-2">
                Hello, <span className="font-semibold">{userName}</span>! 👋
              </p>
            )}
            <p className="text-gray-400 text-lg">
              Your account has been successfully confirmed and you&apos;re now
              logged in.
            </p>
          </div>

          {/* Success Details */}
          <div className="mb-8 p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl mr-3">✅</span>
              <h2 className="text-xl font-semibold text-green-300">
                Account Confirmed
              </h2>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• Your email has been verified</p>
              <p>• Your account is now active</p>
              <p>• You can access all features</p>
              <p>• Your data is securely stored</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">
              What&apos;s Next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <span className="text-2xl mb-2 block">📊</span>
                <p className="text-gray-300">Create your first dashboard</p>
              </div>
              <div className="text-center">
                <span className="text-2xl mb-2 block">⚡</span>
                <p className="text-gray-300">Track crypto & stocks</p>
              </div>
              <div className="text-center">
                <span className="text-2xl mb-2 block">🧠</span>
                <p className="text-gray-300">Get AI insights</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              label="Start Trading Smarter"
              icon="pi pi-rocket"
              onClick={handleContinue}
              className="w-full p-3 text-lg"
              size="large"
            />
            <Button
              label="Learn More About Features"
              icon="pi pi-info-circle"
              onClick={() => router.push('/')}
              className="w-full p-button-outlined"
            />
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-600">
            <p className="text-sm text-gray-500">
              Need help? Check out our{' '}
              <button
                onClick={() => router.push('/faq')}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                FAQ
              </button>{' '}
              or contact support.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmContent />
    </Suspense>
  )
}
