// app/analyze/_components/analysisForm.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AnalysisForm() {
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
      setError('Job description seems too short.')
      return
    }

    setIsLoading(true)

    try {
      setLoadingStep('Reading resume content...')
      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('jobDescription', jobDescription.trim())

      setLoadingStep('Cross-referencing with job requirements...')
      const response = await fetch('/api/analyze', { method: 'POST', body: formData })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || `Server error: ${response.status}`)
      }

      setLoadingStep('Generating optimization report...')
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
    <div className="space-y-10">
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <form onSubmit={handleAnalyze} className="space-y-10">
        {/* Resume Upload Box Area */}
        <div className="relative group">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={isLoading}
          />
          <div className={`p-10 rounded-[32px] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center ${
            resumeFile
              ? 'bg-[#C8FF5E]/5 border-[#C8FF5E]/30 shadow-[0_0_30px_rgba(200,255,94,0.05)]'
              : 'bg-white/[0.02] border-white/10 group-hover:border-white/20 group-hover:bg-white/[0.04]'
          }`}>
            {resumeFile ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-[#C8FF5E] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(200,255,94,0.3)]">
                  <CheckCircle2 className="h-8 w-8 text-black" />
                </div>
                <p className="text-xl font-bold text-white mb-1">{resumeFile.name}</p>
                <p className="text-xs font-black uppercase tracking-widest text-[#C8FF5E]">
                  {(resumeFile.size / 1024).toFixed(1)} KB · Ready to scan
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Upload className="h-7 w-7 text-white/40" />
                </div>
                <p className="text-xl font-bold text-white mb-2">Drop your resume here</p>
                <p className="text-sm font-medium text-white/30">PDF format only (Max 5MB)</p>
              </>
            )}
          </div>
        </div>

        {/* Job Description Area */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={e => { setJobDescription(e.target.value); setError(null) }}
            placeholder="Paste the requirements, responsibilities, and skills from the job posting..."
            className="w-full p-6 bg-white/[0.02] border border-white/10 rounded-[28px] text-white placeholder-white/10 focus:outline-none focus:border-[#C8FF5E]/40 focus:ring-4 focus:ring-[#C8FF5E]/5 transition-all resize-none min-h-[280px] font-medium"
            disabled={isLoading}
          />
          <div className="flex justify-end">
            <span className={`text-[10px] font-bold uppercase tracking-tighter ${jobDescription.length > 0 ? 'text-[#C8FF5E]' : 'text-white/20'}`}>
              {jobDescription.length} characters
            </span>
          </div>
        </div>

        {/* Loading Step Tracker and Trigger Actions */}
        <div className="pt-4 space-y-6">
          {isLoading && (
            <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 shadow-xl">
                <Loader2 className="h-4 w-4 animate-spin text-[#C8FF5E]" />
                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                  {loadingStep}
                </span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !resumeFile || !jobDescription.trim()}
            className={`w-full h-16 rounded-2xl text-lg font-black transition-all duration-500 ${
              isLoading
                ? 'bg-white/5 text-white/20'
                : 'bg-white text-black hover:bg-[#C8FF5E] hover:scale-[1.01] shadow-[0_20px_40px_rgba(255,255,255,0.05)]'
            }`}
          >
            {isLoading ? 'Processing...' : 'Run Analysis'}
          </Button>

          <p className="text-center text-sm font-medium text-white/20">
            Already a member?{' '}
            <Link href="/signin" className="text-white/40 hover:text-[#C8FF5E] transition-colors underline underline-offset-4">
              Sign in to save this analysis
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}