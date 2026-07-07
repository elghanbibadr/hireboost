// app/account/page.tsx
import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

import { ProfileCard } from './_components/profileCard'
import { NameForm } from './_components/nameForm'
import { PasswordForm } from './_components/passwordForm'
import { DangerZone } from './_components/dangerZone'

export const metadata = {
  title: 'Account Settings',
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Pure Server-side Data Fetching
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, plan, created_at')
    .eq('id', user.id)
    .single()

  return (
    <main className="space-y-10 max-w-3xl pb-20 animate-fade-in-up">
      {/* Page Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-4xl font-bold text-white tracking-tight font-serif">
          Account Settings
        </h1>
        <p className="text-white/40 mt-1 text-sm">
          Manage your personal details and security.
        </p>
      </div>

      {/* Render Subcomponents with pure data attributes */}
      <ProfileCard profile={profile} defaultEmail={user.email || ''} />
      <NameForm defaultName={profile?.full_name || ''} />
      <PasswordForm />
      <DangerZone />
    </main>
  )
}