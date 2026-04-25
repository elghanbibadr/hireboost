'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  FileText, Zap, CreditCard, TrendingUp, Clock, ChevronRight,
  CheckCircle, Sparkles, Loader2,
} from 'lucide-react'

interface Profile {
  plan: 'free' | 'pro'
  credits: number
  email: string
  full_name: string
  stripe_customer_id: string | null
}
interface Analysis {
  id: string
  resume_name: string
  score: number
  created_at: string
}

function scoreColor(n: number) {
  if (n >= 75) return '#16a34a'
  if (n >= 50) return '#ca8a04'
  return '#dc2626'
}
function scoreLabel(n: number) {
  if (n >= 75) return 'Strong'
  if (n >= 50) return 'Moderate'
  return 'Weak'
}

function StatCard({ label, value, icon: Icon, sub }: {
  label: string; value: string | number; icon: React.ElementType; sub?: string
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-foreground/60">{label}</p>
        <Icon className="h-4 w-4 text-foreground/30" />
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-foreground/50 mt-1">{sub}</p>}
    </Card>
  )
}

export default function Dashboard() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const supabase     = createClient()

  const [profile, setProfile]               = useState<Profile | null>(null)
  const [analyses, setAnalyses]             = useState<Analysis[]>([])
  const [loading, setLoading]               = useState(true)
  const [billingLoading, setBillingLoading] = useState(false)
  const [upgraded, setUpgraded]             = useState(false)

  useEffect(() => {
    if (searchParams.get('upgraded') === 'true') setUpgraded(true)
  }, [searchParams])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/signin'); return }

      const [{ data: prof }, { data: hist }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('analyses')
          .select('id, resume_name, score, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20),
      ])
      setProfile(prof)
      setAnalyses(hist ?? [])
      setLoading(false)
    }
    load()
  }, [supabase, router])

  const handleUpgrade = async () => {
    setBillingLoading(true)
    const res  = await fetch('/api/stripe/checkout', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setBillingLoading(false)
  }

  const handleManageBilling = async () => {
    setBillingLoading(true)
    const res  = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setBillingLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-foreground/40" />
      </div>
    )
  }

  const chartData = [...analyses].reverse().slice(-10).map(a => ({
    name:  new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: a.score,
  }))

  const avgScore    = analyses.length ? Math.round(analyses.reduce((s, a) => s + a.score, 0) / analyses.length) : 0
  const creditsLeft = profile?.plan === 'pro' ? '∞' : (profile?.credits ?? 0)
  const isPro       = profile?.plan === 'pro'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {upgraded && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">You&apos;re now on Pro — unlimited analyses unlocked.</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {profile?.full_name ? `Hi, ${profile.full_name.split(' ')[0]}` : 'Dashboard'}
            </h1>
            <p className="text-foreground/50 text-sm">{profile?.email}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button asChild size="sm"><Link href="/dashboard/analyze">New Analysis</Link></Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>Sign out</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total analyses" value={analyses.length} icon={FileText} />
          <StatCard
            label="Average score" value={analyses.length ? avgScore : '—'} icon={TrendingUp}
            sub={analyses.length ? scoreLabel(avgScore) : undefined}
          />
          <StatCard
            label="Credits left" value={creditsLeft} icon={Zap}
            sub={isPro ? 'Unlimited · Pro' : 'Free · resets monthly'}
          />
          <StatCard
            label="Plan" value={isPro ? 'Pro' : 'Free'} icon={CreditCard}
            sub={isPro ? 'Unlimited analyses' : '3 analyses/month'}
          />
        </div>

        {/* Billing */}
        <Card className={`p-6 mb-8 ${isPro ? 'border-primary/30 bg-primary/5' : ''}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              {isPro ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <p className="font-semibold text-foreground">HireBoost Pro</p>
                  </div>
                  <p className="text-sm text-foreground/60">Unlimited analyses · $9.99/month</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-foreground mb-1">Upgrade to Pro</p>
                  <p className="text-sm text-foreground/60">Unlimited analyses, no monthly reset — $9.99/month</p>
                </>
              )}
            </div>
            <Button
              variant={isPro ? 'outline' : 'default'}
              onClick={isPro ? handleManageBilling : handleUpgrade}
              disabled={billingLoading}
              className="shrink-0"
            >
              {billingLoading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : isPro ? 'Manage billing' : 'Upgrade — $9.99/mo'}
            </Button>
          </div>
          {!isPro && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {['Unlimited analyses', 'Full keyword reports', 'Rewritten bullet points'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-foreground/70">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />{f}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Chart */}
        {chartData.length > 1 && (
          <Card className="p-6 mb-8">
            <h2 className="text-base font-semibold text-foreground mb-4">Score history</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barSize={28}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888' } as React.SVGProps<SVGTextElement>} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#888' } as React.SVGProps<SVGTextElement>} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={scoreColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* History */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">Analysis history</h2>
          {analyses.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-10 w-10 text-foreground/20 mx-auto mb-3" />
              <p className="text-foreground/50 mb-4">No analyses yet. Upload your first resume to get started.</p>
              <Button asChild><Link href="/dashboard/analyze">Analyze a resume</Link></Button>
            </Card>
          ) : (
            <div className="space-y-2">
              {analyses.map(a => (
                <Card key={a.id} className="p-4 flex items-center gap-4 hover:border-primary/30 transition-colors">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-white"
                    style={{ background: scoreColor(a.score) }}
                  >
                    {a.score}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{a.resume_name}</p>
                    <p className="text-xs text-foreground/50 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {new Date(a.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                      <span className="mx-1">·</span>
                      <span style={{ color: scoreColor(a.score) }}>{scoreLabel(a.score)}</span>
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-foreground/30 shrink-0" />
                </Card>
              ))}
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  )
}