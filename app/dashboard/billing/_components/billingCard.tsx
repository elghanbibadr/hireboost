// app/billing/_components/billingCard.tsx
'use client'

import React, { useState } from 'react'
import { Sparkles, Zap, Loader2, ExternalLink, AlertCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createCheckoutSession, createBillingPortalSession } from '../actions'

interface ProfileProps {
  profile: { plan: 'free' | 'pro'; credits: number } | null
}

export function BillingCard({ profile }: ProfileProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isPro = profile?.plan === 'pro'
  const creditsUsed = isPro ? 0 : 3 - (profile?.credits || 0)

  const handleAction = async (actionFn: () => Promise<any>) => {
    setError(null)
    setLoading(true)
    const res = await actionFn()
    if (res.success && res.url) {
      window.location.href = res.url
    } else {
      setError(res.message || 'Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className={`p-8 rounded-[32px] border transition-all duration-500 ${
        isPro ? 'bg-[#C8FF5E]/5 border-[#C8FF5E]/30 shadow-[0_0_40px_rgba(200,255,94,0.05)]' : 'bg-white/[0.02] border-white/10'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isPro ? 'bg-[#C8FF5E] text-black' : 'bg-white/5 text-white/40'}`}>
              {isPro ? <Sparkles className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white leading-none">
                {isPro ? 'Pro Member' : 'Free Member'}
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C8FF5E]">
                {isPro ? 'Active Subscription' : 'Limited Access'}
              </span>
            </div>
          </div>

          <Button
            variant={isPro ? 'outline' : 'default'}
            className={`rounded-xl px-8 h-12 font-bold transition-all ${
              isPro ? 'border-white/10 bg-[#C8FF5E]/5 text-white hover:bg-white/5' : 'bg-[#C8FF5E] text-black hover:scale-105'
            }`}
            onClick={() => handleAction(isPro ? createBillingPortalSession : createCheckoutSession)}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPro ? (
              <>
                <ExternalLink className="h-4 w-4 mr-2" /> Billing Portal
              </>
            ) : (
              'Get Pro Access'
            )}
          </Button>
        </div>

        {!isPro && (
          <div className="mt-8 pt-8 border-t border-white/5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Analysis Usage</p>
              <p className="text-xs font-bold text-white/60">{creditsUsed} / 3 Used</p>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full bg-[#C8FF5E] transition-all duration-1000"
                style={{ width: `${(creditsUsed / 3) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-white/20 mt-3 font-medium">Your credits will reset on the 1st of the month.</p>
          </div>
        )}
      </div>

      {isPro && (
        <div className="flex items-center gap-4 p-6 rounded-2xl border border-white/5">
          <FileText className="h-5 w-5 text-white/20 shrink-0" />
          <p className="text-xs text-white/40 font-medium">
            Need to download invoices or change your payment method? Open the{' '}
            <button onClick={() => handleAction(createBillingPortalSession)} className="text-[#C8FF5E] font-bold hover:underline">
              Stripe Billing Portal
            </button>
          </p>
        </div>
      )}
    </div>
  )
}