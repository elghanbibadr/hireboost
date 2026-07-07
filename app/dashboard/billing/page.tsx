// app/billing/page.tsx
import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CheckCircle } from 'lucide-react'

import { BillingCard } from './_components/billingCard'
import { PricingGrid } from './_components/pricingGrid'

export const metadata = {
  title: 'Subscription Settings',
}

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, credits, stripe_customer_id, stripe_subscription_id')
    .eq('id', user.id)
    .single()

  const isPro = profile?.plan === 'pro'

  return (
    <main className="space-y-10 max-w-4xl pb-20 animate-fade-in-up">
      {/* Page Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-4xl font-bold text-white tracking-tight font-serif">
          Subscription
        </h1>
        <p className="text-white/40 mt-1 text-sm">
          Select the plan that fits your career goals.
        </p>
      </div>

      {/* Main Account Subscription Card Context */}
      <BillingCard profile={profile} />

      {/* Pricing Matrix */}
      <PricingGrid isPro={isPro} />

      {/* FAQ Section */}
      <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.01]">
        <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {[
            {
              q: 'When do credits reset?',
              a: 'Free credits are topped up to 3 on the 1st of every month automatically.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes. Use the billing portal to cancel. You will retain Pro access until your current period ends.',
            },
          ].map(({ q, a }) => (
            <div key={q} className="space-y-2">
              <p className="text-sm font-bold text-white">{q}</p>
              <p className="text-sm text-white/40 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}