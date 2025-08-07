'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      console.log('🔍 Checking Supabase user after redirect...')

      // 👇 Log the session object
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        console.error('❌ Error fetching session:', sessionError)
      } else {
        console.log('🧾 Session:', sessionData)
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        console.error('❌ Failed to retrieve user:', error.message)
        router.push('/')
        return
      }

      if (user) {
        console.log('✅ Logged in user:', user)
        setRedirecting(true)
        router.push('/dashboard')
      } else {
        console.warn('⚠️ No user found. Redirecting to home.')
        router.push('/')
      }
    }

    checkUser()
  }, [supabase, router])

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-muted-foreground text-sm">
        {redirecting ? 'Redirecting to dashboard…' : 'Verifying login…'}
      </p>
    </div>
  )
}