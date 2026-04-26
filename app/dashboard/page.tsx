'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  FileText, Zap, TrendingUp, Clock, ChevronRight,
  Loader2, Plus, Sparkles, FileSearch
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

// Updated colors to match the neon/dark theme
function scoreColor(n: number) {
  if (n >= 75) return '#C8FF5E' // Neon Green
  if (n >= 50) return '#ca8a04' // Gold/Amber
  return '#ef4444' // Red
}

function scoreLabel(n: number) {
  if (n >= 75) return 'Strong'
  if (n >= 50) return 'Moderate'
  return 'Weak'
}

function StatCard({
  label, value, sub, icon: Icon,
}: {
  label: string; value: string | number; sub?: string
  icon: React.ElementType;
}) {
  return (
    <div style={{
      background: '#111', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 20, padding: '24px',
    }}>
      <div className="flex items-center justify-between mb-4">
        <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Icon className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.6)' }} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        {sub && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{sub}</p>}
      </div>
    </div>
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: '#C8FF5E' }} />
      </div>
    )
  }

  const isPro       = profile?.plan === 'pro'
  const avgScore    = analyses.length
    ? Math.round(analyses.reduce((s, a) => s + a.score, 0) / analyses.length)
    : 0
  const best        = analyses.length ? Math.max(...analyses.map(a => a.score)) : 0
  const creditsLeft = isPro ? '∞' : (profile?.credits ?? 0)

  const chartData  = [...analyses].reverse().slice(-10).map(a => ({
    name:  new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: a.score,
  }))

  return (
    <div className="space-y-8 fade-up-d1">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');
        .fade-up-d1 { animation: fadeUp 0.6s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
            {profile?.full_name ? `Good to see you, ${profile.full_name.split(' ')[0]}` : 'Overview'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Here&apos;s how your job applications are doing.</p>
        </div>
        <Link href="/dashboard/analyze" 
          style={{ 
            background: '#C8FF5E', color: '#000', fontWeight: 700, fontSize: 14, 
            padding: '10px 20px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8 
          }}>
          <Plus className="h-4 w-4" /> New Analysis
        </Link>
      </div>

      {/* Free plan nudge */}
      {!isPro && (
        <div className="flex items-center justify-between gap-4 p-5 rounded-[20px]" 
          style={{ background: 'rgba(200,255,94,0.03)', border: '1px solid rgba(200,255,94,0.15)' }}>
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 shrink-0" style={{ color: '#C8FF5E' }} />
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
              <span className="font-semibold text-white">{creditsLeft} credit{creditsLeft !== 1 ? 's' : ''} left</span> this month.
              Upgrade to Pro for unlimited analyses.
            </p>
          </div>
          <Link href="/dashboard/billing" style={{ fontSize: 13, fontWeight: 700, color: '#C8FF5E' }}>
            Upgrade
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total analyses" value={analyses.length} icon={FileText} sub="All time" />
        <StatCard label="Average score"  value={analyses.length ? avgScore : '—'} icon={TrendingUp} sub={analyses.length ? scoreLabel(avgScore) : 'No data'} />
        <StatCard label="Best score"     value={analyses.length ? best : '—'}     icon={TrendingUp} sub={analyses.length ? scoreLabel(best) : undefined} />
        <StatCard label="Credits left"   value={creditsLeft} icon={Zap} sub={isPro ? 'Pro Account' : 'Resets monthly'} />
      </div>

      {/* Chart */}
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '24px' }}>
        <div className="flex items-center justify-between mb-8">
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Score history</h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Last {chartData.length} analyses</p>
        </div>
        {chartData.length >= 2 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={28}>
              <XAxis
                dataKey="name"
                axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }}
              />
              <YAxis
                domain={[0, 100]} axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }}
                contentStyle={{
                  background: '#161616', borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: 12
                }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={scoreColor(entry.score)} fillOpacity={0.9} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 border border-dashed border-white/10 rounded-xl">
             <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Run at least 2 analyses to see your score trend.</p>
          </div>
        )}
      </div>

      {/* History */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Recent analyses</h2>
          {analyses.length > 5 && (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Showing latest 20</p>
          )}
        </div>

        {analyses.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-white/10 rounded-[24px]">
            <FileText className="h-10 w-10 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.1)' }} />
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>No analyses yet — upload your first resume to get started.</p>
            <Link href="/dashboard/analyze" 
               style={{ background: '#C8FF5E', color: '#000', fontWeight: 700, padding: '10px 24px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Plus className="h-4 w-4" /> Analyze a resume
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map(a => (
              <div
                key={a.id}
                className="group p-4 flex items-center gap-4 transition-all cursor-pointer"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,255,94,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-[13px] font-bold shrink-0"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${scoreColor(a.score)}40`, color: scoreColor(a.score) }}
                >
                  {a.score}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{a.resume_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3" style={{ color: 'rgba(255,255,255,0.2)' }} />
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                      {new Date(a.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                    </p>
                    <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: scoreColor(a.score) }}>
                      {scoreLabel(a.score)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" style={{ color: 'rgba(255,255,255,0.2)' }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}