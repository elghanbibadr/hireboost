// app/dashboard/analyze/page.tsx
import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardAnalysisForm } from './_components/dashboardAnalysisForm'

export const metadata = {
  title: 'New Analysis',
}

export default async function DashboardAnalyzePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  // Fetch metrics server-side to prevent client-side hydration delays
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits, plan')
    .eq('id', user.id)
    .single()

  const credits = profile?.credits ?? 0
  const plan = profile?.plan ?? 'free'

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in-up">
      {/* Structural Framework Frame */}
      <div className="flex items-end justify-between flex-wrap gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight font-serif">
            New Analysis
          </h1>
          <p className="text-white/40 mt-1 text-sm">
            Match your profile against any job description in seconds.
          </p>
        </div>
      </div>

      {/* Embedded Operational View */}
      <DashboardAnalysisForm initialCredits={credits} initialPlan={plan} />
    </div>
  )
}