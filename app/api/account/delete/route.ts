import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 1. Initialize your existing cookie-based server client
    const supabaseUserClient = await createServerClient()
    
    // 2. Fetch the logged-in user from the session cookies
    const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 })
    }

    const userId = user.id

    // 3. Spin up an isolated Admin client using your environment's service role key
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, 
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // 4. Instruct the Auth admin module to hard-delete the user record
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}