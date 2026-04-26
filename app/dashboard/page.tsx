'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  FileText, Zap, TrendingUp, Clock, ChevronRight,
  Loader2, Plus, Sparkles,
} from 'lucide-react'

interface Analysis {
  id: string
  resume_name: string
  score: number
  created_at: string
}
interface Profile {
  plan: 'free' | 'pro'
  credits: number
  full_name: string
  email: string
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

function StatCard({
  label, value, sub, icon: Icon, accent,
}: {
  label: string; value: string | number; sub?: string
  icon: React.ElementType; accent?: string
}) {
  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-foreground/50 uppercase tracking-wide">{label}</p>
        <div className={`w-7 h-7 rounded-md flex items-center justify-center ${accent ?? 'bg-muted'}`}>
          <Icon className="h-3.5 w-3.5 text-foreground/50" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
        {sub && <p className="text-xs text-foreground/40 mt-1">{sub}</p>}
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const supabase = createClient()
  const [profile, setProfile]   = useState<Profile | null>(null)
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
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
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-5 w-5 animate-spin text-foreground/30" />
      </div>
    )
  }

  const isPro      = profile?.plan === 'pro'
  const avgScore   = analyses.length
    ? Math.round(analyses.reduce((s, a) => s + a.score, 0) / analyses.length)
    : 0
  const best       = analyses.length ? Math.max(...analyses.map(a => a.score)) : 0
  const creditsLeft = isPro ? '∞' : (profile?.credits ?? 0)

  const chartData  = [...analyses].reverse().slice(-10).map(a => ({
    name:  new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: a.score,
  }))

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {profile?.full_name ? `Good to see you, ${profile.full_name.split(' ')[0]}` : 'Overview'}
          </h1>
          <p className="text-sm text-foreground/50 mt-0.5">Here&apos;s how your job applications are doing.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/analyze">
            <Plus className="h-4 w-4 mr-2" /> New Analysis
          </Link>
        </Button>
      </div>

      {/* Free plan nudge */}
      {!isPro && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <p className="text-sm text-foreground/70">
              <span className="font-semibold text-foreground">{creditsLeft} credit{creditsLeft !== 1 ? 's' : ''} left</span> this month.
              Upgrade to Pro for unlimited analyses.
            </p>
          </div>
          <Button size="sm" asChild className="shrink-0">
            <Link href="/dashboard/billing">Upgrade</Link>
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total analyses" value={analyses.length}    icon={FileText}   sub="All time" />
        <StatCard label="Average score"  value={analyses.length ? avgScore : '—'} icon={TrendingUp} sub={analyses.length ? scoreLabel(avgScore) : 'No analyses yet'} />
        <StatCard label="Best score"     value={analyses.length ? best : '—'}     icon={TrendingUp} sub={analyses.length ? scoreLabel(best) : undefined} />
        <StatCard label="Credits left"   value={creditsLeft} icon={Zap} sub={isPro ? 'Pro · unlimited' : 'Resets monthly'} />
      </div>

      {/* Chart */}
      {chartData.length >= 2 ? (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-foreground">Score history</h2>
            <p className="text-xs text-foreground/40">Last {chartData.length} analyses</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={24} barCategoryGap="30%">
              <XAxis
                dataKey="name"
                axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af' } as React.SVGProps<SVGTextElement>}
              />
              <YAxis
                domain={[0, 100]} axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af' } as React.SVGProps<SVGTextElement>}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.04)', radius: 6 }}
                contentStyle={{
                  fontSize: 12, borderRadius: 8,
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
              />
              <Bar dataKey="score" radius={[5, 5, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={scoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      ) : (
        <Card className="p-6 flex items-center justify-center h-40 border-dashed">
          <p className="text-sm text-foreground/40">Run at least 2 analyses to see your score trend.</p>
        </Card>
      )}

      {/* History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Recent analyses</h2>
          {analyses.length > 5 && (
            <p className="text-xs text-foreground/40">Showing latest 20</p>
          )}
        </div>

        {analyses.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <FileText className="h-10 w-10 text-foreground/15 mx-auto mb-3" />
            <p className="text-sm text-foreground/40 mb-5">No analyses yet — upload your first resume to get started.</p>
            <Button asChild>
              <Link href="/dashboard/analyze">
                <Plus className="h-4 w-4 mr-2" /> Analyze a resume
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {analyses.map(a => (
              <Card
                key={a.id}
                className="p-4 flex items-center gap-4 hover:border-primary/25 hover:shadow-sm transition-all cursor-pointer"
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                  style={{ background: scoreColor(a.score) }}
                >
                  {a.score}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{a.resume_name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="h-3 w-3 text-foreground/30" />
                    <p className="text-xs text-foreground/40">
                      {new Date(a.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                    </p>
                    <span className="text-foreground/20 mx-0.5">·</span>
                    <span className="text-xs font-medium" style={{ color: scoreColor(a.score) }}>
                      {scoreLabel(a.score)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-foreground/20 shrink-0" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}