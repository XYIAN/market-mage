import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

export const useUsername = () => {
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  // Load username from user metadata
  const loadUsername = useCallback(async () => {
    if (!user) {
      setUsername(null)
      setLoading(false)
      return
    }

    try {
      // First try to get from user metadata
      const metadataUsername = user.user_metadata?.username
      if (metadataUsername) {
        setUsername(metadataUsername)
        setLoading(false)
        return
      }

      // If not in metadata, try to get from user_profiles table
      const { data, error } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading username:', error)
      }

      if (data?.username) {
        setUsername(data.username)
      }
    } catch (error) {
      console.error('Error loading username:', error)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  // Set username
  const updateUsername = useCallback(
    async (newUsername: string) => {
      if (!user) return false

      try {
        // Check if username is already taken
        const { data: existingUser } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('username', newUsername)
          .neq('id', user.id)
          .single()

        if (existingUser) {
          throw new Error('Username already taken')
        }

        // Update user metadata
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { username: newUsername },
        })

        if (metadataError) {
          console.error('Error updating user metadata:', metadataError)
          return false
        }

        // Update user_profiles table
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            username: newUsername,
            updated_at: new Date().toISOString(),
          })

        if (profileError) {
          console.error('Error updating user profile:', profileError)
          return false
        }

        setUsername(newUsername)
        return true
      } catch (error) {
        console.error('Error updating username:', error)
        return false
      }
    },
    [user, supabase]
  )

  // Check if username is available
  const checkUsernameAvailability = useCallback(
    async (username: string): Promise<boolean> => {
      if (!username.trim()) return false

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('username', username)
          .single()

        if (error && error.code === 'PGRST116') {
          // No user found with this username, so it's available
          return true
        }

        if (error) {
          console.error('Error checking username availability:', error)
          return false
        }

        // If we found a user, check if it's the current user
        return data?.id === user?.id
      } catch (error) {
        console.error('Error checking username availability:', error)
        return false
      }
    },
    [user, supabase]
  )

  // Load username on mount and when user changes
  useEffect(() => {
    loadUsername()
  }, [loadUsername])

  return {
    username,
    loading,
    updateUsername,
    checkUsernameAvailability,
    refreshUsername: loadUsername,
  }
}
