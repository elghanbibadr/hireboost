import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  // 1. Extract the secure verification code sent by Supabase from the URL
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // 2. Exchange the single-use code for a permanent, secure user session cookie
    await supabase.auth.exchangeCodeForSession(code)
  }

  // 3. Send them to your verified page with the success flag we handled earlier!
  return NextResponse.redirect(new URL('/verify-email?success=true', request.url))
}