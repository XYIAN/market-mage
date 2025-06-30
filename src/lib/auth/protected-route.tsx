'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../providers/SupabaseProvider'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export const ProtectedRoute = ({
  children,
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { user, loading } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <span className="text-4xl mb-4 block">🧙</span>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
