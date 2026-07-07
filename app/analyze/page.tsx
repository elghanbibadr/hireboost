// app/analyze/page.tsx
import React from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import Navbar from '@/components/navbar'
import { AnalysisForm } from './_components/analysisForm'

export const metadata = {
  title: 'Analyze Your Resume',
}

export default function PublicAnalyzePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-[#C8FF5E] selection:text-black">
      <Navbar user={null} />

      <main className="flex-grow mt-10 md:mt-20 max-w-4xl mx-auto w-full px-6 py-16 animate-fade-in-up">
        {/* Typography Block */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight mb-4 font-serif">
            Analyze Your Resume
          </h1>
          <p className="text-white/40 max-w-2xl text-lg font-medium leading-relaxed">
            Get an instant AI-powered match score and professional optimization report in seconds.
          </p>
        </div>

        {/* Guest conversion notice */}
        <div className="mb-10 flex items-center gap-4 p-5 rounded-[24px] bg-[#C8FF5E]/5 border border-[#C8FF5E]/10">
          <div className="w-10 h-10 rounded-full bg-[#C8FF5E]/10 flex items-center justify-center shrink-0">
            <Lock className="h-4 w-4 text-[#C8FF5E]" />
          </div>
          <p className="text-sm text-white/60 font-medium">
            You&apos;re in guest mode.{' '}
            <Link href="/signup" className="text-[#C8FF5E] hover:underline font-bold">
              Create a free account
            </Link>{' '}
            to save your history and unlock full AI suggestions.
          </p>
        </div>

        {/* Dynamic Client Form Engine */}
        <AnalysisForm />
      </main>
    </div>
  )
}