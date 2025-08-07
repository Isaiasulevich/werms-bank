import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/dashboard'

  console.log('🔍 OAuth callback received:', { code: !!code, next, origin })

  if (code) {
    console.log('✅ Authorization code found, exchanging for session...')
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Error exchanging code for session:', error.message)
        return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(error.message)}`)
      }

      if (data.user) {
        console.log('✅ User authenticated successfully:', data.user.email)
        
        // Ensure next path starts with /
        if (!next.startsWith('/')) {
          next = '/dashboard'
        }
        
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (err) {
      console.error('❌ Unexpected error during code exchange:', err)
      return NextResponse.redirect(`${origin}/auth/error?message=Unexpected error during authentication`)
    }
  } else {
    console.error('❌ No authorization code received')
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error?message=No authorization code received`)
}
