'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (!session) {
          router.replace('/')
          return
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.replace('/')
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.replace('/')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full md:ml-20">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}