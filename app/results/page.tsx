'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Lock, CheckCircle, XCircle, TrendingUp, 
  AlertTriangle, ArrowRight, Zap, Sparkles 
} from 'lucide-react'

interface AnalysisResult {
  score: number
  scoreExplanation: string
  strengths: string[]
  keywords: { matched: string[]; missing: string[] }
  improvedBullets: { original: string; improved: string }[]
  suggestions: { content: string; priority: 'high' | 'medium' | 'low' }[]
  resumeName: string
  analyzedAt: string
}

const scoreStyles = (score: number) => {
  if (score >= 75) return { color: 'text-[#C8FF5E]', shadow: 'shadow-[#C8FF5E]/20', label: 'Strong Match' }
  if (score >= 50) return { color: 'text-yellow-400', shadow: 'shadow-yellow-400/20', label: 'Moderate Match' }
  return { color: 'text-red-500', shadow: 'shadow-red-500/20', label: 'Weak Match' }
}

const priorityStyles: Record<string, string> = {
  high:   'bg-red-500/10 text-red-400 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low:    'bg-[#C8FF5E]/10 text-[#C8FF5E] border-[#C8FF5E]/20',
}

export default function Results() {
  const router   = useRouter()
  const supabase = createClient()

  const [result, setResult]           = useState<AnalysisResult | null>(null)
  const [isAuthed, setIsAuthed]       = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('analysisResult')
    if (!raw) { router.push('/dashboard'); return }
    setResult(JSON.parse(raw))
  }, [router])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthed(!!user)
      setAuthChecked(true)
    })
  }, [supabase])

  if (!result || !authChecked) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Zap className="h-8 w-8 text-[#C8FF5E] animate-pulse" />
          <p className="text-white/40 text-sm font-medium tracking-widest uppercase">Calculating Scores...</p>
        </div>
      </div>
    )
  }

  const styles = scoreStyles(result.score)

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-[#C8FF5E] selection:text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        .glass-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>
      
      {/* <Navbar /> */}
      
      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/40">
               Analysis Report
             </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
            {result.resumeName}
          </h1>
          <p className="text-white/30 text-sm font-medium italic">
            Generated on {new Date(result.analyzedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
          </p>
        </div>

        {/* Hero Score Card */}
        <Card className="p-12 mb-10 glass-card rounded-[40px] relative overflow-hidden text-center border-white/10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#C8FF5E]/5 blur-[100px] -z-10" />
          
          <div className={`text-8xl font-black mb-4 tracking-tighter ${styles.color} drop-shadow-[0_0_15px_rgba(200,255,94,0.2)]`}>
            {result.score}
          </div>
          <h2 className="text-xl font-bold mb-4 uppercase tracking-[0.1em]">{styles.label}</h2>
          <p className="text-white/50 text-sm max-w-lg mx-auto leading-relaxed font-medium">
            {result.scoreExplanation}
          </p>
        </Card>

        {/* ── GATE: If Not Logged In ─────────────────────────────────────── */}
        {!isAuthed && (
          <div className="relative rounded-[40px] overflow-hidden border border-white/10 bg-white/[0.01]">
            <div className="blur-xl grayscale opacity-20 pointer-events-none select-none p-8 space-y-8">
              <div className="h-32 bg-white/10 rounded-3xl w-full" />
              <div className="h-64 bg-white/10 rounded-3xl w-full" />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]/60 backdrop-blur-md p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#C8FF5E] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(200,255,94,0.3)]">
                <Lock className="h-8 w-8 text-black" />
              </div>
              <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Instrument Serif', serif" }}>Full Insights Locked</h2>
              <p className="text-white/50 text-sm mb-8 max-w-xs font-medium">
                Unlock keyword matching, AI bullet point rewriting, and priority suggestions with a free account.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Button asChild size="lg" className="flex-1 bg-[#C8FF5E] text-black font-bold rounded-xl hover:scale-105 transition-all">
                  <Link href="/signup">Create Free Account</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1 border-white/10 bg-white/5 rounded-xl font-bold">
                  <Link href="/signin">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── CONTENT: Full Report ───────────────────────────────────────── */}
        {isAuthed && (
          <div className="space-y-8">
            
            {/* Keywords */}
            <Card className="p-8 glass-card rounded-[32px]">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-8 flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#C8FF5E]" /> Keyword Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-[#C8FF5E] uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" /> Found ({result.keywords.matched.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.matched.map(kw => (
                      <span key={kw} className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#C8FF5E]/5 text-[#C8FF5E] border border-[#C8FF5E]/10 italic">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                    <XCircle className="h-4 w-4" /> Missing ({result.keywords.missing.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.missing.map(kw => (
                      <span key={kw} className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-red-500/5 text-red-400 border border-red-500/10 italic">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Strengths & Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 glass-card rounded-[32px]">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-6 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#C8FF5E]" /> Key Strengths
                </h3>
                <ul className="space-y-4">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-white/70 leading-relaxed">
                      <CheckCircle className="h-4 w-4 text-[#C8FF5E] shrink-0 mt-0.5" /> {s}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-8 glass-card rounded-[32px]">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-6 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" /> Improvement Area
                </h3>
                <div className="space-y-3">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${priorityStyles[s.priority]}`}>
                        {s.priority} Priority
                      </span>
                      <p className="text-sm text-white/60 font-medium leading-relaxed">{s.content}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Improved Bullets */}
            <Card className="p-8 glass-card rounded-[32px]">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-8 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C8FF5E]" /> AI Optimized Content
              </h3>
              <div className="space-y-8">
                {result.improvedBullets.map((b, i) => (
                  <div key={i} className="relative space-y-4">
                    <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 italic">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Original</p>
                      <p className="text-sm text-white/40">{b.original}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-[#C8FF5E]/5 border border-[#C8FF5E]/20 shadow-[0_0_20px_rgba(200,255,94,0.03)]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#C8FF5E] mb-2">HireBoost Improved</p>
                      <p className="text-sm text-white/90 font-medium leading-relaxed">{b.improved}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        )}

        {/* Footer Actions */}
    

      </main>
      
    </div>
  )
}