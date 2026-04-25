'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react'

export default function Analyze() {
  const router = useRouter()
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingStep, setLoadingStep] = useState('')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.')
      return
    }

    setError(null)
    setResumeFile(file)
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!resumeFile) {
      setError('Please upload your resume PDF.')
      return
    }
    if (!jobDescription.trim()) {
      setError('Please paste the job description.')
      return
    }
    if (jobDescription.trim().length < 50) {
      setError('Job description seems too short. Please paste the full description.')
      return
    }

    setIsLoading(true)

    try {
      // Step 1 — Build the form data payload
      setLoadingStep('Reading your resume...')
      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('jobDescription', jobDescription.trim())

      // Step 2 — Call the API route
      setLoadingStep('Analyzing with AI...')
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Server error: ${response.status}`)
      }

      // Step 3 — Parse and store results
      setLoadingStep('Almost done...')
      const data = await response.json()

      // Store results in sessionStorage to pass to /results page
      sessionStorage.setItem('analysisResult', JSON.stringify({
        ...data,
        resumeName: resumeFile.name,
        analyzedAt: new Date().toISOString(),
      }))

      // Step 4 — Navigate to results
      router.push('/results')

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
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
          <p className="text-foreground/70">
            Upload your resume and paste a job description to get instant AI analysis
          </p>
        </div>

        {/* Error Banner */}
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
              <div className="flex flex-col items-center justify-center py-12">
                {resumeFile ? (
                  <>
                    <FileText className="h-12 w-12 text-primary mb-4" />
                    <p className="text-lg font-semibold text-foreground mb-1">
                      {resumeFile.name}
                    </p>
                    <p className="text-sm text-foreground/60 mb-4">
                      {(resumeFile.size / 1024).toFixed(2)} KB · PDF
                    </p>
                    <Button type="button" variant="outline" size="sm" asChild>
                      <label className="cursor-pointer">
                        Change File
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </Button>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-primary mb-4" />
                    <p className="text-lg font-semibold text-foreground mb-2">
                      Drag and drop your resume
                    </p>
                    <p className="text-sm text-foreground/60 mb-4">
                      PDF only · max 5MB
                    </p>
                    <Button type="button" variant="outline" asChild>
                      <label className="cursor-pointer">
                        Upload PDF
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </Button>
                  </>
                )}
              </div>
            </label>
          </Card>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value)
                setError(null)
              }}
              placeholder="Paste the full job description here — include responsibilities, requirements, and skills..."
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent resize-none"
              rows={10}
              disabled={isLoading}
            />
            <p className="text-xs text-foreground/60 mt-2">
              {jobDescription.length} characters
              {jobDescription.length < 50 && jobDescription.length > 0 && (
                <span className="text-destructive ml-2">· paste the full description for best results</span>
              )}
            </p>
          </div>

          {/* Tips */}
          <Card className="p-4 bg-primary/5 border border-border">
            <h4 className="font-semibold text-foreground mb-2">Tips for best results:</h4>
            <ul className="space-y-1 text-sm text-foreground/70">
              <li>• Use a text-based PDF (not a scanned image)</li>
              <li>• Include the complete job description with all requirements</li>
              <li>• Make sure your resume lists your real skills and experience</li>
            </ul>
          </Card>

          {/* Loading Steps */}
          {isLoading && loadingStep && (
            <div className="flex items-center gap-3 text-sm text-foreground/70 px-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>{loadingStep}</span>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading || !resumeFile || !jobDescription.trim()}
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingStep || 'Analyzing...'}
              </>
            ) : (
              'Analyze Resume'
            )}
          </Button>

          <p className="text-center text-sm text-foreground/60">
            or{' '}
            <Link href="/" className="text-primary hover:underline">
              go back home
            </Link>
          </p>
        </form>
      </main>

      <Footer />
    </div>
  )
}