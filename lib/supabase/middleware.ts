// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: never add any logic between createServerClient and
  // getUser(). A stale session gets refreshed here — skipping it
  // means users get randomly logged out.
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Define which routes are protected
  const isProtected =
    // pathname.startsWith('/dashboard') ||
    // pathname.startsWith('/results') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/billing')

  // Define auth routes (logged-in users shouldn't see these)
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup')

  if (isProtected && !user) {
    // Not logged in → redirect to login, preserve intended destination
  const redirectUrl = new URL('/signin', request.url)
return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && user) {
    // Already logged in → skip login/signup, go to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}