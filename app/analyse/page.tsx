'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Upload, FileText, Loader2, AlertCircle, Lock } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// This page is PUBLIC — anyone can submit a resume.
// Guests get a blurred results page. Authenticated users get the full report.
// The same component is reused at /dashboard/analyze (inside the dashboard).
// ─────────────────────────────────────────────────────────────────────────────

export default function PublicAnalyzePage() {
  const router = useRouter()
  const [resumeFile, setResumeFile]     = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading]       = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [loadingStep, setLoadingStep]   = useState('')

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
    if (!resumeFile)                          { setError('Please upload your resume PDF.'); return }
    if (!jobDescription.trim())               { setError('Please paste the job description.'); return }
    if (jobDescription.trim().length < 50)    { setError('Job description seems too short.'); return }

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
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setIsLoading(false)
      setLoadingStep('')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Analyze Your Resume
          </h1>
          <p className="text-foreground/60">
            Upload your resume and a job description to get an instant AI match score.
          </p>
        </div>

        {/* Guest notice */}
        <div className="mb-6 flex items-start gap-3 p-4 rounded-lg bg-muted/60 border border-border">
          <Lock className="h-4 w-4 text-foreground/40 mt-0.5 shrink-0" />
          <p className="text-sm text-foreground/60">
            You&apos;re not signed in. You&apos;ll see your score for free —{' '}
            <Link href="/signup" className="text-primary font-semibold hover:underline">create a free account</Link>
            {' '}to unlock the full report, keywords, and suggestions.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleAnalyze} className="space-y-8">

          {/* Resume Upload */}
          <Card className="p-8 border-2 border-dashed border-border hover:border-primary/50 transition">
            <label className="cursor-pointer block">
              <div className="flex flex-col items-center justify-center py-10">
                {resumeFile ? (
                  <>
                    <FileText className="h-12 w-12 text-primary mb-4" />
                    <p className="text-lg font-semibold text-foreground mb-1">{resumeFile.name}</p>
                    <p className="text-sm text-foreground/60 mb-4">
                      {(resumeFile.size / 1024).toFixed(1)} KB · PDF
                    </p>
                    <Button type="button" variant="outline" size="sm" asChild>
                      <label className="cursor-pointer">
                        Change File
                        <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </Button>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-primary mb-4" />
                    <p className="text-lg font-semibold text-foreground mb-2">Drop your resume here</p>
                    <p className="text-sm text-foreground/50 mb-4">PDF only · max 5MB</p>
                    <Button type="button" variant="outline" asChild>
                      <label className="cursor-pointer">
                        Choose File
                        <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </Button>
                  </>
                )}
              </div>
            </label>
          </Card>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={e => { setJobDescription(e.target.value); setError(null) }}
              placeholder="Paste the full job description here — responsibilities, requirements, skills..."
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={10}
              disabled={isLoading}
            />
            <p className="text-xs text-foreground/50 mt-1.5">{jobDescription.length} characters</p>
          </div>

          {/* Tips */}
          <Card className="p-4 bg-primary/5 border border-border">
            <h4 className="font-semibold text-foreground mb-2 text-sm">Tips for best results</h4>
            <ul className="space-y-1 text-sm text-foreground/60">
              <li>• Use a text-based PDF (not a scanned image)</li>
              <li>• Include the complete job description with all requirements</li>
              <li>• Paste directly from the job posting — don&apos;t summarise it</li>
            </ul>
          </Card>

          {isLoading && loadingStep && (
            <div className="flex items-center gap-3 text-sm text-foreground/60">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              {loadingStep}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !resumeFile || !jobDescription.trim()}
            size="lg"
            className="w-full"
          >
            {isLoading
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{loadingStep || 'Analyzing...'}</>
              : 'Analyze Resume'}
          </Button>

          <p className="text-center text-sm text-foreground/50">
            Already have an account?{' '}
            <Link href="/signin" className="text-primary hover:underline font-medium">Sign in</Link>
            {' '}for saved history and full reports.
          </p>
        </form>
      </main>

      <Footer />
    </div>
  )
}