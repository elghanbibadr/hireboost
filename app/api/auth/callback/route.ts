import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log("code from route:", code)

  if (code) {
    // 🌟 FIX: Add "await" right here because createClient() is an async function!
    const supabase = await createClient()
    
    // Now TypeScript knows 'supabase' is the fully resolved client instance
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error("Auth session exchange failed:", error.message)
      // Optional: Redirect to a dedicated error page if the link is expired/invalid
      return NextResponse.redirect(new URL('/auth/auth-error', request.url))
    }
  }

  // Send them to your verified page with the success flag
  return NextResponse.redirect(new URL('/verify-email?success=true', request.url))
}