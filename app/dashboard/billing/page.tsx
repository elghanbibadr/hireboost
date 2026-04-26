'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  CheckCircle, Sparkles, Zap, FileText,
  Loader2, ExternalLink, AlertCircle,
} from 'lucide-react'

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
        <Loader2 className="h-5 w-5 animate-spin text-foreground/30" />
      </div>
    )
  }

  const isPro       = profile?.plan === 'pro'
  const creditsLeft = isPro ? '∞' : (profile?.credits ?? 0)
  const creditsUsed = isPro ? '—' : 3 - (profile?.credits ?? 0)

  return (
    <div className="space-y-8 max-w-3xl">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Billing</h1>
        <p className="text-sm text-foreground/50 mt-0.5">Manage your plan and subscription.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Current plan summary */}
      <Card className={`p-6 ${isPro ? 'border-primary/30 bg-primary/5' : ''}`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isPro
                ? <Sparkles className="h-4 w-4 text-primary" />
                : <Zap className="h-4 w-4 text-foreground/40" />
              }
              <p className="font-semibold text-foreground">{isPro ? 'Pro Plan' : 'Free Plan'}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                isPro ? 'bg-primary/15 text-primary' : 'bg-muted text-foreground/50'
              }`}>
                {isPro ? 'Active' : 'Current'}
              </span>
            </div>
            <p className="text-sm text-foreground/60">
              {isPro ? '$9.99 / month · Unlimited analyses' : 'Free forever · 3 analyses per month'}
            </p>
          </div>
          {isPro ? (
            <Button variant="outline" size="sm" onClick={handlePortal} disabled={actionLoading}>
              {actionLoading
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <><ExternalLink className="h-3.5 w-3.5 mr-1.5" />Manage billing</>}
            </Button>
          ) : (
            <Button size="sm" onClick={handleUpgrade} disabled={actionLoading}>
              {actionLoading
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : 'Upgrade to Pro'}
            </Button>
          )}
        </div>

        {/* Usage bar for free plan */}
        {!isPro && (
          <div className="mt-5 pt-5 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-foreground/60">Monthly usage</p>
              <p className="text-xs text-foreground/40">{creditsUsed} of 3 used</p>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${((creditsUsed as number) / 3) * 100}%` }}
              />
            </div>
            <p className="text-xs text-foreground/40 mt-2">
              {creditsLeft} credit{creditsLeft !== 1 ? 's' : ''} remaining · resets on the 1st of next month
            </p>
          </div>
        )}
      </Card>

      {/* Plan comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Free */}
        <Card className={`p-6 ${!isPro ? 'border-primary/30' : ''}`}>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-foreground">Free</p>
              {!isPro && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-foreground/50">
                  Current plan
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">$0<span className="text-sm font-normal text-foreground/40">/mo</span></p>
          </div>
          <ul className="space-y-2.5">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/70">
                <CheckCircle className="h-4 w-4 text-foreground/30 shrink-0" />{f}
              </li>
            ))}
          </ul>
        </Card>

        {/* Pro */}
        <Card className={`p-6 relative overflow-hidden ${isPro ? 'border-primary/30 bg-primary/5' : 'border-primary/20'}`}>
          {/* Popular badge */}
          <div className="absolute top-3 right-3">
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary text-primary-foreground">
              {isPro ? 'Your plan' : 'Most popular'}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="font-semibold text-foreground">Pro</p>
            </div>
            <p className="text-2xl font-bold text-foreground">$9.99<span className="text-sm font-normal text-foreground/40">/mo</span></p>
          </div>

          <ul className="space-y-2.5 mb-6">
            {PRO_FEATURES.map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/80">
                <CheckCircle className="h-4 w-4 text-primary shrink-0" />{f}
              </li>
            ))}
          </ul>

          {!isPro && (
            <Button className="w-full" onClick={handleUpgrade} disabled={actionLoading}>
              {actionLoading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : 'Upgrade to Pro →'}
            </Button>
          )}

          {isPro && (
            <Button variant="outline" className="w-full" onClick={handlePortal} disabled={actionLoading}>
              {actionLoading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : 'Manage subscription'}
            </Button>
          )}
        </Card>
      </div>

      {/* FAQ */}
      <Card className="p-6 space-y-5">
        <h2 className="text-sm font-semibold text-foreground">Common questions</h2>
        {[
          {
            q: 'What happens when my free credits run out?',
            a: "You'll need to wait until the 1st of next month when they reset, or upgrade to Pro for unlimited access.",
          },
          {
            q: 'Can I cancel Pro at any time?',
            a: "Yes. Click 'Manage billing' above to access the Stripe portal where you can cancel with one click. You keep Pro until the end of your billing period.",
          },
          {
            q: 'Is my payment information secure?',
            a: 'All billing is handled by Stripe. We never store your card details on our servers.',
          },
        ].map(({ q, a }) => (
          <div key={q}>
            <p className="text-sm font-medium text-foreground mb-1">{q}</p>
            <p className="text-sm text-foreground/50">{a}</p>
          </div>
        ))}
      </Card>

      {/* Invoice note for Pro users */}
      {isPro && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/60 border border-border">
          <FileText className="h-4 w-4 text-foreground/40 mt-0.5 shrink-0" />
          <p className="text-sm text-foreground/60">
            To view past invoices and payment history, open the{' '}
            <button onClick={handlePortal} className="text-primary font-medium hover:underline">
              billing portal
            </button>
            .
          </p>
        </div>
      )}
    </div>
  )
}