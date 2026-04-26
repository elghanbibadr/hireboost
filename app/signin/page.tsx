'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Footer } from '@/components/footer'
import { Mail, Lock, AlertCircle, FileSearch, EyeOff, Eye, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignIn() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
    const [showPw, setShowPw]     = useState(false)

  const [isLoading, setIsisLoading] = useState(false)
  const [error, setError]       = useState<string | null>(null)

  // ── Email / password sign-in ──────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsisLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setIsisLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setError(null)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

    return (
    <div className="min-h-screen grid-bg flex flex-col" style={{ background: '#080808', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
 
      {/* Nav */}
      <nav className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#C8FF5E' }}>
            <FileSearch className="h-4 w-4 text-black" />
          </div>
          <span className="font-bold text-white text-[15px]">HireBoost</span>
        </Link>
      </nav>
 
      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md fade-up-d1">
 
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Welcome back
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
              Sign in to continue to HireBoost
            </p>
          </div>
 
          {/* Card */}
          <div style={{
            background: '#111', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: '32px',
          }}>
 
            {/* Google */}
            {/* <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.70)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
            >
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
              Continue with Google
            </button> */}
 
            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-grow h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>or</span>
              <div className="flex-grow h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            </div>
 
            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl mb-5"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p style={{ fontSize: 13 }}>{error}</p>
              </div>
            )}
 
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.50)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'rgba(255,255,255,0.25)' }} />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required disabled={isLoading}
                    style={{
                      width: '100%', background: '#161616', border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 10, padding: '11px 14px 11px 40px', color: '#fff', fontSize: 14,
                      outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(200,255,94,0.35)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,255,94,0.07)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              </div>
 
              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.50)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Password
                  </label>
                  <Link href="/forgot-password" style={{ fontSize: 12, color: '#C8FF5E' }}>
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'rgba(255,255,255,0.25)' }} />
                  <input
                    type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" required disabled={isLoading}
                    style={{
                      width: '100%', background: '#161616', border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 10, padding: '11px 44px 11px 40px', color: '#fff', fontSize: 14,
                      outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(200,255,94,0.35)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,255,94,0.07)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none' }}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
 
              {/* Submit */}
              <button
                type="submit" disabled={isLoading || !email || !password}
                style={{
                  width: '100%', background: isLoading || !email || !password ? 'rgba(200,255,94,0.4)' : '#C8FF5E',
                  color: '#000', fontWeight: 700, fontSize: 14, padding: '13px',
                  borderRadius: 12, border: 'none', cursor: isLoading || !email || !password ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'background 0.15s', marginTop: 8,
                }}
              >
                {isLoading ? (
                  <><div style={{ width: 16, height: 16, border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Signing in...</>
                ) : (
                  <>Sign in <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>
          </div>
 
          <p className="text-center mt-6" style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: '#C8FF5E', fontWeight: 600 }}>Create one free</Link>
          </p>
        </div>
      </main>
 
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        .fade-up-d1 { animation: fadeUp 0.6s ease 0.1s forwards; opacity: 0; }
      `}</style>
    </div>
  )
}