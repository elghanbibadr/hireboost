'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Star,
  TrendingUp,
} from 'lucide-react'

interface Keywords {
  matched: string[]
  missing: string[]
}

interface ImprovedBullet {
  original: string
  improved: string
}

interface Suggestion {
  content: string
  priority: 'high' | 'medium' | 'low'
}

interface AnalysisResult {
  score: number
  scoreExplanation: string
  keywords: Keywords
  improvedBullets: ImprovedBullet[]
  suggestions: Suggestion[]
  strengths: string[]
  resumeName: string
  analyzedAt: string
}

const importanceColor: Record<string, string> = {
  high: 'bg-destructive/10 text-destructive border-destructive/30',
  medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
  low: 'bg-muted text-muted-foreground border-border',
}

const scoreColor = (score: number) => {
  if (score >= 75) return 'text-green-600'
  if (score >= 50) return 'text-yellow-600'
  return 'text-destructive'
}

const scoreLabel = (score: number) => {
  if (score >= 75) return 'Strong Match'
  if (score >= 50) return 'Moderate Match'
  return 'Weak Match'
}

export default function Results() {
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [expandedBullet, setExpandedBullet] = useState<number | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('analysisResult')
    if (!stored) {
      router.replace('/dashboard')
      return
    }
    try {
      setResult(JSON.parse(stored))
    } catch {
      router.replace('/dashboard')
    }
  }, [router])

  if (!result) return null

  const circumference = 2 * Math.PI * 54
  const dashOffset = circumference - (result.score / 100) * circumference

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground mb-3 transition">
              <ArrowLeft className="h-4 w-4" /> Analyze another resume
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Analysis Results</h1>
            <p className="text-sm text-foreground/60 mt-1">
              {result.resumeName} · {new Date(result.analyzedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Score Card */}
        <Card className="p-8 mb-6 flex flex-col sm:flex-row items-center gap-8">
          <div className="relative shrink-0">
            <svg width="128" height="128" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="10"/>
              <circle
                cx="64" cy="64" r="54" fill="none"
                stroke={result.score >= 75 ? '#16a34a' : result.score >= 50 ? '#ca8a04' : '#dc2626'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 64 64)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${scoreColor(result.score)}`}>{result.score}</span>
              <span className="text-xs text-foreground/50">/ 100</span>
            </div>
          </div>

          <div>
            <div className={`text-xl font-bold mb-2 ${scoreColor(result.score)}`}>
              {scoreLabel(result.score)}
            </div>
            <p className="text-foreground/70 text-sm leading-relaxed">
              {result.scoreExplanation}
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Strengths */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-green-600" />
              <h2 className="font-semibold text-foreground">Your Strengths</h2>
            </div>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>

          {/* Missing Keywords */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h2 className="font-semibold text-foreground">Missing Keywords</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.keywords.missing.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-full border font-medium bg-destructive/10 text-destructive border-destructive/30"
                >
                  {kw}
                </span>
              ))}
            </div>
            <p className="text-xs text-foreground/50 mt-3">
              Add these to your resume where truthfully applicable.
            </p>
          </Card>
        </div>

        {/* Improved Bullets */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">AI-Improved Bullet Points</h2>
          </div>
          <div className="space-y-4">
            {result.improvedBullets.map((bullet, i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
                <button
                  className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition"
                  onClick={() => setExpandedBullet(expandedBullet === i ? null : i)}
                >
                  <span className="text-sm text-foreground/70 line-clamp-1 mr-4">
                    {bullet.original}
                  </span>
                  <span className="text-xs text-primary shrink-0">
                    {expandedBullet === i ? 'Hide' : 'See improved'}
                  </span>
                </button>
                {expandedBullet === i && (
                  <div className="px-4 pb-4 pt-0 border-t border-border">
                    <p className="text-xs text-foreground/50 mb-1">Original</p>
                    <p className="text-sm text-foreground/70 mb-3 line-through">{bullet.original}</p>
                    <p className="text-xs text-green-600 mb-1 font-medium">Improved ✨</p>
                    <p className="text-sm text-foreground">{bullet.improved}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Suggestions */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h2 className="font-semibold text-foreground">Actionable Suggestions</h2>
          </div>
          <ul className="space-y-3">
            {result.suggestions
              .sort((a, b) => {
                const order = { high: 0, medium: 1, low: 2 }
                return order[a.priority] - order[b.priority]
              })
              .map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium mt-0.5 shrink-0 ${importanceColor[s.priority]}`}>
                    {s.priority}
                  </span>
                  <p className="text-sm text-foreground/80">{s.content}</p>
                </li>
              ))}
          </ul>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1">
            <Link href="/dashboard">Analyze Another Resume</Link>
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => window.print()}>
            Save as PDF
          </Button>
        </div>

      </main>
      <Footer />
    </div>
  )
}