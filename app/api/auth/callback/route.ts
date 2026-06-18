import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // 1. Look for a 'next' destination dynamically. 
  // If none is provided, default back to your verification success screen.
  const nextTarget = requestUrl.searchParams.get('next') ?? '/verify-email?success=true'

  console.log("code from route:", code)
  console.log("redirecting next to:", nextTarget)

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error("Auth session exchange failed:", error.message)
      return NextResponse.redirect(new URL('/auth/auth-error', request.url))
    }
  }

  // 2. 🌟 FIX: Instead of hardcoding /verify-email, route them to nextTarget!
  return NextResponse.redirect(new URL(nextTarget, request.url))
}