'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, FileText, Loader2, AlertCircle, Zap } from 'lucide-react'

export default function DashboardAnalyzePage() {
  const router   = useRouter()
  const supabase = createClient()

  const [resumeFile, setResumeFile]         = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading]           = useState(false)
  const [error, setError]                   = useState<string | null>(null)
  const [loadingStep, setLoadingStep]       = useState('')
  const [credits, setCredits]               = useState<number | null>(null)
  const [plan, setPlan]                     = useState<'free' | 'pro'>('free')

  useEffect(() => {
    async function loadCredits() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('credits, plan')
        .eq('id', user.id)
        .single()
      if (data) { setCredits(data.credits); setPlan(data.plan) }
    }
    loadCredits()
  }, [supabase])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') { setError('Please upload a PDF file.'); return }
    if (file.size > 5 * 1024 * 1024)    { setError('File size must be under 5MB.'); return }
    setError(null)
    setResumeFile(file)
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!resumeFile)                       { setError('Please upload your resume PDF.'); return }
    if (!jobDescription.trim())            { setError('Please paste the job description.'); return }
    if (jobDescription.trim().length < 50) { setError('Job description seems too short.'); return }

    setIsLoading(true)

    try {
      setLoadingStep('Reading your resume...')
      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('jobDescription', jobDescription.trim())

      setLoadingStep('Analyzing with AI...')
      const response = await fetch('/api/analyze', { method: 'POST', body: formData })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || `Server error: ${response.status}`)
      }

      setLoadingStep('Almost done...')
      const data = await response.json()
      sessionStorage.setItem('analysisResult', JSON.stringify({
        ...data,
        resumeName: resumeFile.name,
        analyzedAt: new Date().toISOString(),
      }))
      router.push('/results')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setIsLoading(false)
      setLoadingStep('')
    }
  }

  const noCredits  = plan === 'free' && credits === 0
  const isPro      = plan === 'pro'
  const creditsLeft = isPro ? '∞' : (credits ?? '...')

  return (
    <div className="max-w-3xl space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">New Analysis</h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            Upload a resume and paste a job description to get your AI match report.
          </p>
        </div>
        {/* Credit pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-sm">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span className="text-foreground/70 font-medium">
            {isPro ? 'Unlimited' : `${creditsLeft} credit${creditsLeft !== 1 ? 's' : ''} left`}
          </span>
        </div>
      </div>

      {/* No credits warning */}
      {noCredits && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/8 border border-destructive/20 text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">No credits remaining</p>
            <p className="text-sm mt-0.5 opacity-80">
              Your free credits reset on the 1st of next month, or{' '}
              <Link href="/dashboard/billing" className="underline font-semibold">upgrade to Pro</Link>
              {' '}for unlimited analyses.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleAnalyze} className="space-y-6">

        {/* Resume upload */}
        <Card className="border-2 border-dashed border-border hover:border-primary/40 transition-colors">
          <label className="cursor-pointer block">
            <div className="flex flex-col items-center justify-center py-10 px-6">
              {resumeFile ? (
                <>
                  <FileText className="h-10 w-10 text-primary mb-3" />
                  <p className="font-semibold text-foreground mb-1">{resumeFile.name}</p>
                  <p className="text-xs text-foreground/40 mb-4">{(resumeFile.size / 1024).toFixed(1)} KB · PDF</p>
                  <Button type="button" variant="outline" size="sm" asChild>
                    <label className="cursor-pointer">
                      Change file
                      <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </Button>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-foreground/20 mb-3" />
                  <p className="font-semibold text-foreground mb-1">Drop your resume here</p>
                  <p className="text-xs text-foreground/40 mb-4">PDF only · max 5MB</p>
                  <Button type="button" variant="outline" size="sm" asChild>
                    <label className="cursor-pointer">
                      Choose file
                      <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </Button>
                </>
              )}
            </div>
          </label>
        </Card>

        {/* Job description */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={e => { setJobDescription(e.target.value); setError(null) }}
            placeholder="Paste the full job description — responsibilities, requirements, skills..."
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none text-sm"
            rows={10}
            disabled={isLoading || noCredits}
          />
          <p className="text-xs text-foreground/30 mt-1.5">{jobDescription.length} characters</p>
        </div>

        {isLoading && loadingStep && (
          <div className="flex items-center gap-2.5 text-sm text-foreground/50">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            {loadingStep}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !resumeFile || !jobDescription.trim() || noCredits}
          size="lg"
          className="w-full"
        >
          {isLoading
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{loadingStep || 'Analyzing...'}</>
            : 'Analyze Resume'}
        </Button>

      </form>
    </div>
  )
}