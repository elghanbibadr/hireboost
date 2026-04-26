'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  CheckCircle, Sparkles, Zap, FileText,
  Loader2, ExternalLink, AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

interface Profile {
  plan: 'free' | 'pro'
  credits: number
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
}

const FREE_FEATURES = [
  '3 analyses per month',
  'Match score',
  'Basic keyword breakdown',
  'Missing keywords list',
]
const PRO_FEATURES = [
  'Unlimited analyses',
  'Full keyword analysis',
  'AI-rewritten bullet points',
  'Prioritised suggestions',
  'Score history & trends',
  'Priority support',
]

export default function BillingPage() {
  const supabase = createClient()
  const [profile, setProfile]           = useState<Profile | null>(null)
  const [loading, setLoading]           = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError]               = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('plan, credits, stripe_customer_id, stripe_subscription_id')
        .eq('id', user.id)
        .single()
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [supabase])

  const handleUpgrade = async () => {
    setError(null)
    setActionLoading(true)
    const res  = await fetch('/api/stripe/checkout', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else { setError(data.message ?? 'Something went wrong.'); setActionLoading(false) }
  }

  const handlePortal = async () => {
    setError(null)
    setActionLoading(true)
    const res  = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else { setError(data.message ?? 'Something went wrong.'); setActionLoading(false) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-5 w-5 animate-spin text-[#C8FF5E]" />
      </div>
    )
  }

  const isPro       = profile?.plan === 'pro'
  const creditsUsed = isPro ? 0 : 3 - (profile?.credits ?? 0)

  return (
    <div className="space-y-10 max-w-4xl pb-20 fade-up">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        .fade-up { animation: fadeUp 0.5s ease-out forwards; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Page Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Subscription
        </h1>
        <p className="text-white/40 mt-1 text-sm">
          Select the plan that fits your career goals.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Current Plan Summary Card */}
      <div className={`p-8 rounded-[32px] border transition-all duration-500 ${
        isPro 
          ? 'bg-[#C8FF5E]/5 border-[#C8FF5E]/30 shadow-[0_0_40px_rgba(200,255,94,0.05)]' 
          : 'bg-white/[0.02] border-white/10'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="space-y-1">
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
          </div>
          
          <Button 
            variant={isPro ? "outline" : "default"} 
            className={`rounded-xl px-8 h-12 font-bold transition-all ${
              isPro 
                ? 'border-white/10 text-white hover:bg-white/5' 
                : 'bg-[#C8FF5E] text-black hover:scale-105'
            }`}
            onClick={isPro ? handlePortal : handleUpgrade} 
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPro ? (
              <><ExternalLink className="h-4 w-4 mr-2" /> Billing Portal</>
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
                className="h-full rounded-full bg-[#C8FF5E] transition-all duration-1000 shadow-[0_0_10px_rgba(200,255,94,0.5)]"
                style={{ width: `${(creditsUsed / 3) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-white/20 mt-3 font-medium">
              Your credits will reset on the 1st of the month.
            </p>
          </div>
        )}
      </div>

      {/* Pricing Grid */}
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
          <ul className="space-y-4 mb-8">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-center gap-3 text-sm text-white/50">
                <CheckCircle className="h-4 w-4 text-white/20 shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Plan Card */}
        <div className={`p-8 rounded-[32px] border relative overflow-hidden transition-all duration-300 ${
          isPro 
            ? 'border-[#C8FF5E]/40 bg-[#C8FF5E]/5' 
            : 'border-white/10 bg-white/[0.01] hover:border-white/20'
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
            {PRO_FEATURES.map(f => (
              <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                <CheckCircle className="h-4 w-4 text-[#C8FF5E] shrink-0 shadow-[0_0_10px_rgba(200,255,94,0.3)]" /> {f}
              </li>
            ))}
          </ul>

          {!isPro && (
            <Button 
              className="w-full h-14 rounded-2xl bg-white text-black hover:bg-[#C8FF5E] transition-all font-bold text-md"
              onClick={handleUpgrade}
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Get Started'}
            </Button>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.01]">
        <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {[
            {
              q: 'When do credits reset?',
              a: "Free credits are topped up to 3 on the 1st of every month automatically.",
            },
            {
              q: 'Can I cancel anytime?',
              a: "Yes. Use the billing portal to cancel. You'll retain Pro access until your current period ends.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="space-y-2">
              <p className="text-sm font-bold text-white">{q}</p>
              <p className="text-sm text-white/40 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Invoice Note */}
      {isPro && (
        <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/5">
          <FileText className="h-5 w-5 text-white/20 shrink-0" />
          <p className="text-xs text-white/40 font-medium">
            Need to download invoices or change your payment method? Open the{' '}
            <button onClick={handlePortal} className="text-[#C8FF5E] font-bold hover:underline">
              Stripe Billing Portal
            </button>
          </p>
        </div>
      )}
    </div>
  )
}