'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Credentials updated successfully! Returning to workspace...' })
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] bg-[#050505] text-white flex items-center justify-center px-6 selection:bg-[#C8FF5E] selection:text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        .glass-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>

      <div className="text-center max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Decorative Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/40 flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-[#C8FF5E]" /> Identity Confirmed
          </span>
        </div>

        {/* Form Container Wrapper */}
        <div className="relative p-8 glass-card rounded-[40px] border-white/10 overflow-hidden text-left">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#C8FF5E]/5 blur-[80px] -z-10" />
          
          <h1 
            className="text-6xl font-black mb-1 text-center tracking-tighter text-[#C8FF5E] drop-shadow-[0_0_15px_rgba(200,255,94,0.15)]"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Update Password
          </h1>
          <p className="text-white/50 text-xs text-center leading-relaxed font-medium max-w-xs mx-auto mb-8">
            Enter a secure new cryptographic phrase below to finish unlocking your context session workspace.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-2">
                New Account Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C8FF5E]/40 focus:ring-1 focus:ring-[#C8FF5E]/40 transition"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C8FF5E]/40 focus:ring-1 focus:ring-[#C8FF5E]/40 transition"
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
              className="w-full bg-[#C8FF5E] text-black font-bold rounded-xl hover:scale-[1.02] transition-all gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin stroke-[2.5]" />
                  Saving Changes...
                </>
              ) : (
                'Save New Password'
              )}
            </Button>
          </form>
        </div>

      </div>
    </div>
  )
}