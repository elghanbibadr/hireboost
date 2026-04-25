'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Lock, CheckCircle, XCircle, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react'

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

function scoreColor(score: number) {
  if (score >= 75) return 'text-green-600'
  if (score >= 50) return 'text-yellow-500'
  return 'text-red-500'
}
function scoreLabel(score: number) {
  if (score >= 75) return 'Strong match'
  if (score >= 50) return 'Moderate match'
  return 'Weak match'
}

const priorityStyles: Record<string, string> = {
  high:   'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  low:    'bg-green-50 text-green-700 border-green-200',
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground/40">Loading results...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-8">
          <p className="text-sm text-foreground/50 mb-1">{result.resumeName}</p>
          <h1 className="text-3xl font-bold text-foreground mb-1">Resume Analysis</h1>
          <p className="text-foreground/50 text-sm">
            {new Date(result.analyzedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
          </p>
        </div>

        {/* Score card — always visible */}
        <Card className="p-8 mb-6 text-center">
          <p className={`text-7xl font-bold mb-2 ${scoreColor(result.score)}`}>{result.score}</p>
          <p className="text-lg font-semibold text-foreground mb-2">{scoreLabel(result.score)}</p>
          <p className="text-foreground/60 text-sm max-w-lg mx-auto">{result.scoreExplanation}</p>
        </Card>

        {/* ── NOT SIGNED IN: blur gate ─────────────────────────────────────── */}
        {!isAuthed && (
          <div className="relative rounded-xl overflow-hidden mb-6">
            {/* blurred dummy content */}
            <div className="blur-md pointer-events-none select-none p-6 grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-4 space-y-2">
                  <div className="h-4 bg-foreground/10 rounded w-2/3" />
                  <div className="h-3 bg-foreground/10 rounded w-full" />
                  <div className="h-3 bg-foreground/10 rounded w-4/5" />
                  <div className="h-3 bg-foreground/10 rounded w-1/2" />
                </Card>
              ))}
            </div>

            {/* overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/75 backdrop-blur-sm">
              <Lock className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-bold text-foreground mb-2 text-center">Unlock the full report</h2>
              <p className="text-foreground/60 text-sm mb-6 text-center max-w-xs">
                Keywords, missing skills, rewritten bullets and prioritised suggestions — free account, no card required.
              </p>
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <Button asChild size="lg"><Link href="/signup">Create free account <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/signin">Sign in</Link></Button>
              </div>
            </div>
          </div>
        )}

        {/* ── SIGNED IN: full report ───────────────────────────────────────── */}
        {isAuthed && (
          <div className="space-y-6">

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Keyword Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-green-600 mb-2 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Matched ({result.keywords.matched.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.matched.map(kw => (
                      <span key={kw} className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">{kw}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-500 mb-2 flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> Missing ({result.keywords.missing.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.missing.map(kw => (
                      <span key={kw} className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" /> Strengths
              </h2>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" /> Suggestions
              </h2>
              <div className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${priorityStyles[s.priority]}`}>
                      {s.priority}
                    </span>
                    <p className="text-sm text-foreground/80">{s.content}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Rewritten Bullet Points</h2>
              <div className="space-y-5">
                {result.improvedBullets.map((b, i) => (
                  <div key={i}>
                    <div className="p-3 rounded-lg bg-red-50 border border-red-100 mb-2">
                      <p className="text-xs font-semibold text-red-500 mb-1">Before</p>
                      <p className="text-sm text-foreground/70">{b.original}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                      <p className="text-xs font-semibold text-green-600 mb-1">After</p>
                      <p className="text-sm text-foreground/80">{b.improved}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button asChild variant="outline" className="flex-1"><Link href="/dashboard">Analyze another</Link></Button>
          {isAuthed && <Button asChild className="flex-1"><Link href="/dashboard">Dashboard</Link></Button>}
        </div>

      </main>
      <Footer />
    </div>
  )
}