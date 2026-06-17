'use client'

import React from 'react'

export default function VerifyEmailRequestPage() {
  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl text-center">
      {/* Animated Envelope Icon */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 mb-6 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      </div>

      <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">Check your inbox</h2>
      <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
        We sent a verification link to your email address. Please click the link to secure your account and activate your workspace.
      </p>

      <div className="mt-8 pt-6 border-t border-zinc-800 text-xs text-zinc-500">
        Didn't receive the email? Check your spam folder or try signing in again to resend.
      </div>
    </div>
  )
}