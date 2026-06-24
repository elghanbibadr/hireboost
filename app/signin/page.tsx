'use client'

import Link from 'next/link'
import { useState, useActionState } from 'react' 
import { Mail, Lock, AlertCircle, FileSearch, EyeOff, Eye, ArrowRight } from 'lucide-react'
import { signInAction, type FormState } from '../auth/actions'

// ⚠️ FIX: Make sure the initial state structure matches your FormState type definition
const initialState: FormState = {
  error: null,
}

export default function SignIn() {
  const [showPw, setShowPw] = useState(false) 
  const [state, formAction, pending] = useActionState(signInAction, initialState)

  return (
    <div className="min-h-screen grid-bg flex flex-col" style={{ background: '#080808/10', fontFamily: "'DM Sans', sans-serif" }}>
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
      <main className="flex-grow flex items-center justify-center px-4 py-6 md:py-0">
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
 
            {/* Conditional Error Display */}
            {state?.error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl mb-5"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p style={{ fontSize: 13 }}>{state.error}</p>
              </div>
            )}
 
            <form action={formAction} className="space-y-4">
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.50)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'rgba(255,255,255,0.25)' }} />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    disabled={pending}
                    style={{
                      width: '100%', background: '#161616', border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 10, padding: '11px 14px 11px 40px', color: '#fff', fontSize: 14,
                      outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                    }}
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
                    type={showPw ? 'text' : 'password'} // 👈 FIX: Connected dynamically to your toggle state hook
                    name="password"
                    placeholder="••••••••"
                    required
                    disabled={pending}
                    style={{
                      width: '100%', background: '#161616', border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 10, padding: '11px 44px 11px 40px', color: '#fff', fontSize: 14,
                      outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={pending}
                style={{
                  width: '100%',
                  background: pending ? 'rgba(200,255,94,0.4)' : '#C8FF5E',
                  color: '#000', fontWeight: 700, fontSize: 14, padding: '13px',
                  borderRadius: 12, border: 'none', cursor: pending ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'background 0.15s', marginTop: 8,
                }}
              >
                {pending ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Signing in...
                  </>
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
 
      {/* <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        .fade-up-d1 { animation: fadeUp 0.6s ease 0.1s forwards; opacity: 0; }
      `}</style> */}
    </div>
  )
}