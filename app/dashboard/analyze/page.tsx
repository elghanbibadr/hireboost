'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Upload, FileText, Loader2, AlertCircle, Zap, X } from 'lucide-react'

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
    <div className="max-w-3xl space-y-8 fade-up">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        .fade-up { animation: fadeUp 0.5s ease-out forwards; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Page header */}
      <div className="flex items-end justify-between flex-wrap gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
            New Analysis
          </h1>
          <p className="text-white/40 mt-1 text-sm">
            Match your profile against any job description in seconds.
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
          <Zap className="h-3.5 w-3.5 text-[#C8FF5E]" />
          <span className="text-white/70 text-xs font-bold uppercase tracking-wider">
            {isPro ? 'Pro Member' : `${creditsLeft} Credits Left`}
          </span>
        </div>
      </div>

      {/* Alerts */}
      {(noCredits || error) && (
        <div className={`flex items-start gap-3 p-4 rounded-2xl border ${error ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-[#C8FF5E]/5 border-[#C8FF5E]/20 text-[#C8FF5E]'}`}>
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold">{error ? 'Analysis Error' : 'Out of Credits'}</p>
            <p className="opacity-80 mt-0.5">
              {error || (
                <>Your free credits reset on the 1st of next month, or <Link href="/dashboard/billing" className="underline font-bold">upgrade to Pro</Link> for unlimited access.</>
              )}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleAnalyze} className="space-y-8">
        {/* Resume upload */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">1. Your Resume</label>
          <div 
            className={`relative group border-2 border-dashed rounded-[32px] transition-all duration-300 ${
              resumeFile ? 'border-[#C8FF5E]/50 bg-[#C8FF5E]/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
            }`}
          >
            <label className="cursor-pointer block">
              <div className="flex flex-col items-center justify-center py-12 px-6">
                {resumeFile ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#C8FF5E] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(200,255,94,0.3)]">
                      <FileText className="h-8 w-8 text-black" />
                    </div>
                    <p className="font-bold text-white text-lg mb-1">{resumeFile.name}</p>
                    <p className="text-xs text-white/40 mb-6 uppercase tracking-widest">{(resumeFile.size / 1024).toFixed(1)} KB • PDF</p>
                    <Button type="button" variant="ghost" className="text-white/60 hover:text-white" asChild>
                      <label className="cursor-pointer">
                        Change File
                        <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform">
                      <Upload className="h-6 w-6 text-white/40" />
                    </div>
                    <p className="font-bold text-white text-lg mb-1">Upload Resume</p>
                    <p className="text-xs text-white/30 mb-6">Drag & drop or click to browse (PDF, Max 5MB)</p>
                    <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" id="resume-upload" />
                    <Button type="button" className="bg-white text-black hover:bg-white/90 font-bold px-8 rounded-xl" onClick={() => document.getElementById('resume-upload')?.click()}>
                      Choose File
                    </Button>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Job description */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">2. Job Description</label>
          <div className="relative">
            <textarea
              value={jobDescription}
              onChange={e => { setJobDescription(e.target.value); setError(null) }}
              placeholder="Paste the target job description here..."
              className="w-full px-6 py-6 border border-white/10 rounded-[24px] bg-white/[0.02] text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#C8FF5E]/20 focus:border-[#C8FF5E]/40 transition-all text-base min-h-[300px] resize-none"
              disabled={isLoading || noCredits}
            />
            <div className="absolute bottom-4 right-6 flex items-center gap-3">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">
                {jobDescription.length} chars
              </span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading || !resumeFile || !jobDescription.trim() || noCredits}
            className={`w-full py-8 rounded-2xl text-lg font-bold transition-all shadow-xl ${
              isLoading ? 'bg-white/5 text-white/40' : 'bg-[#C8FF5E] text-black hover:scale-[1.01] hover:shadow-[#C8FF5E]/10'
            }`}
          >
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{loadingStep || 'Processing...'}</span>
                </div>
              </div>
            ) : (
              'Start AI Analysis'
            )}
          </Button>
          <p className="text-center text-white/20 text-[10px] uppercase tracking-[0.2em] mt-4">
            Powered by GPT-4o Vision & Analysis
          </p>
        </div>
      </form>
    </div>
  )
}