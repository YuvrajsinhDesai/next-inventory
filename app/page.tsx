'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import LandingPage from '@/components/landing-page'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error

        if (session) {
          router.replace('/dashboard')
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error checking session:', error)
        setIsLoading(false)
      }
    }

    checkSession()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.replace('/dashboard')
        }
        if (event === 'SIGNED_OUT') {
          router.replace('/')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  if (isLoading) {
    return null // Or return a loading spinner if preferred
  }

  return <LandingPage />
}