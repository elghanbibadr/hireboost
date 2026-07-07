// app/billing/_components/pricingGrid.tsx
'use client'

import React, { useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createCheckoutSession } from '../actions'

const FREE_FEATURES = ['3 analyses per month', 'Match score', 'Basic keyword breakdown', 'Missing keywords list']
const PRO_FEATURES = ['Unlimited analyses', 'Full keyword analysis', 'AI-rewritten bullet points', 'Prioritised suggestions', 'Score history & trends', 'Priority support']

export function PricingGrid({ isPro }: { isPro: boolean }) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    const res = await createCheckoutSession()
    if (res.success && res.url) {
      window.location.href = res.url
    } else {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Free Plan Card */}
      <div className={`p-8 rounded-[32px] border ${!isPro ? 'border-white/20 bg-white/[0.03]' : 'border-white/5 bg-transparent'}`}>
        <div className="mb-8">
          <h4 className="text-lg font-bold text-white mb-1">Free</h4>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">$0</span>
            <span className="text-white/30 text-sm">/month</span>
          </div>
        </div>
        <ul className="space-y-4">
          {FREE_FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-white/50">
              <CheckCircle className="h-4 w-4 text-white/20 shrink-0" /> {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Pro Plan Card */}
      <div className={`p-8 rounded-[32px] border relative overflow-hidden ${
        isPro ? 'border-[#C8FF5E]/40 bg-[#C8FF5E]/5' : 'border-white/10 bg-white/[0.01] hover:border-white/20'
      }`}>
        <div className="absolute top-6 right-6">
          <div className="bg-[#C8FF5E] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {isPro ? 'Your Plan' : 'Most Popular'}
          </div>
        </div>

        <div className="mb-8">
          <h4 className="text-lg font-bold text-white mb-1">Pro</h4>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">$9.99</span>
            <span className="text-white/30 text-sm">/month</span>
          </div>
        </div>

        <ul className="space-y-4 mb-10">
          {PRO_FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle className="h-4 w-4 text-[#C8FF5E] shrink-0" /> {f}
            </li>
          ))}
        </ul>

        {!isPro && (
          <Button
            className="w-full h-14 rounded-2xl bg-white text-black hover:bg-[#C8FF5E] transition-all font-bold text-md"
            onClick={handleUpgrade}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Get Started'}
          </Button>
        )}
      </div>
    </div>
  )
}