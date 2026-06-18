'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, KeyRound, Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }

      setMessage({
        type: 'success',
        text: 'Password reset link sent! Check your inbox for instructions.',
      })
      setEmail('')
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to send reset link.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 selection:bg-[#C8FF5E] selection:text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        .glass-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>

      <div className="text-center max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Decorative Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/40 flex items-center gap-1.5">
            <KeyRound className="h-3 w-3 text-[#C8FF5E]" /> Security Access
          </span>
        </div>

        {/* Form Container Wrapper */}
        <div className="relative mb-6 p-8 glass-card rounded-[40px] border-white/10 overflow-hidden text-left">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#C8FF5E]/5 blur-[80px] -z-10" />
          
          <h1 
            className="text-6xl font-black mb-1 text-center tracking-tighter text-[#C8FF5E] drop-shadow-[0_0_15px_rgba(200,255,94,0.15)]"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Recover Account
          </h1>
          <p className="text-white/50 text-xs text-center leading-relaxed font-medium max-w-xs mx-auto mb-8">
            Enter your credentials down below to dispatch an authenticated password override link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C8FF5E]/40 focus:ring-1 focus:ring-[#C8FF5E]/40 transition disabled:opacity-50"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-xs font-semibold border ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <Button 
              type="submit"
              disabled={isLoading}
              size="lg" 
              className="w-full bg-[#C8FF5E] text-black font-bold rounded-xl hover:scale-[1.02] transition-all gap-2 disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin stroke-[2.5]" />
                  Sending Verification...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        </div>

        {/* Return Button */}
        <div className="flex justify-center">
          <Link 
            href="/signin" 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40 hover:text-[#C8FF5E] transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Log In
          </Link>
        </div>

      </div>
    </div>
  )
}