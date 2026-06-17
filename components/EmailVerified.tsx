'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function EmailVerifiedPage() {
  const router = useRouter()

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl text-center">
      {/* Sparkling Verified Badge */}
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-6 border border-emerald-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>

      <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">Email Verified Successfully!</h2>
      <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
        Your identity has been authenticated. Your premium workspace is ready, and you can now start optimizing your resumes with AI.
      </p>

      <button
        onClick={() => router.push('/dashboard')}
        className="mt-8 w-full py-3 px-4 rounded-xl bg-zinc-100 text-zinc-950 font-medium text-sm transition-all hover:bg-zinc-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-zinc-400"
      >
        Go to Dashboard →
      </button>
    </div>
  )
}