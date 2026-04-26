'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Footer } from '@/components/footer'
import { Upload, FileText, Loader2, AlertCircle, Lock, Zap, CheckCircle2 } from 'lucide-react'
import { Navbar } from '../page'

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
    if (file.size > 5 * 1024 * 1024)     { setError('File size must be under 5MB.'); return }
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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-[#C8FF5E] selection:text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        .glass-panel { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>
      
      <Navbar user={null} />

      <main className="flex-grow mt-10 md:mt-20 max-w-4xl mx-auto w-full px-6 py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Analyze Your Resume
          </h1>
          <p className="text-white/40 max-w-2xl text-lg font-medium leading-relaxed">
            Get an instant AI-powered match score and professional optimization report in seconds.
          </p>
        </div>

        {/* Guest notice */}
        <div className="mb-10 flex items-center gap-4 p-5 rounded-[24px] bg-[#C8FF5E]/5 border border-[#C8FF5E]/10">
          <div className="w-10 h-10 rounded-full bg-[#C8FF5E]/10 flex items-center justify-center shrink-0">
            <Lock className="h-4 w-4 text-[#C8FF5E]" />
          </div>
          <p className="text-sm text-white/60 font-medium">
            You&apos;re in guest mode. <Link href="/signup" className="text-[#C8FF5E] hover:underline font-bold">Create a free account</Link> to save your history and unlock full AI suggestions.
          </p>
        </div>

        {error && (
          <div className="mb-8 flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleAnalyze} className="space-y-10">

          {/* Resume Upload Area */}
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
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Job Description</label>
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

          {/* Best Practice Tips */}
          {/* <div className="p-6 rounded-[28px] bg-white/[0.02] border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-xs font-black text-white/80 uppercase tracking-tighter">Text-Based</p>
              <p className="text-[11px] text-white/30 font-medium leading-relaxed">Avoid scanned images or photo-based PDFs.</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-white/80 uppercase tracking-tighter">Full Copy</p>
              <p className="text-[11px] text-white/30 font-medium leading-relaxed">Paste the whole job post, including company info.</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-white/80 uppercase tracking-tighter">No Summaries</p>
              <p className="text-[11px] text-white/30 font-medium leading-relaxed">Let our AI find the keywords for you.</p>
            </div>
          </div> */}

          {/* Loading and Submit */}
          <div className="pt-4 space-y-6">
            {isLoading && (
              <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 shadow-xl">
                  <Loader2 className="h-4 w-4 animate-spin text-[#C8FF5E]" />
                  <span className="text-xs font-bold text-white/80 uppercase tracking-widest">{loadingStep}</span>
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
      </main>

    </div>
  )
}