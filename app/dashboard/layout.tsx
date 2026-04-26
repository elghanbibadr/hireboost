import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Sidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, credits, full_name, email')
    .eq('id', user.id)
    .single()

  const creditsLeft = profile?.plan === 'pro' ? '∞' : (profile?.credits ?? 0)

  return (
    <div className="flex min-h-screen bg-[#080808]/90 backdrop-blur-xl border-b border-white/[0.06]">
      <Sidebar
        userEmail={profile?.email ?? user.email ?? ''}
        userName={profile?.full_name ?? ''}
        plan={profile?.plan ?? 'free'}
        creditsLeft={creditsLeft}
      />

      {/* Main content area */}
      <div className="flex-grow flex flex-col min-w-0">
        <main className="flex-grow px-4 sm:px-8 py-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}