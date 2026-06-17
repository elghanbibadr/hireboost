'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, AlertCircle, CheckCircle, FileSearch, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignUp() {

  const router=useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  
  const [showPw, setShowPw] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service.')
      return
    }

    setIsLoading(true)

   const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: { full_name: formData.name },
    },
  })

  if (error) {
    setError(error.message)
    setIsLoading(false)
    return
  }

  // 🌟 THE CRITICAL CHECK
  if (data?.user && !data.session) {
    // This means the user account was created, but email confirmation is REQUIRED.
    // Show a clean success state telling them to check their inbox.
    router.push('/verify-email?email=' + encodeURIComponent(formData.email))
    return
  }

  // Fallback: If a session does exist (e.g., email confirmation is off), log them in
  if (data?.session) {
    router.push('/dashboard')
  }
  }

  const handleGoogle = async () => {
    setError(null)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/api/auth/callback` },
    })
  }

  // Input Style Object to keep JSX clean
  const inputStyle = {
    width: '100%', background: '#161616', border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 10, padding: '11px 14px 11px 40px', color: '#fff', fontSize: 14,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const,
  }

  const labelStyle = { 
    display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.50)', 
    marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' as const 
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#080808', fontFamily: "'DM Sans', sans-serif" }}>
        <div className="w-full max-w-md text-center p-8 rounded-[20px]" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(200,255,94,0.1)' }}>
            <CheckCircle className="h-8 w-8" style={{ color: '#C8FF5E' }} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Instrument Serif', serif" }}>Check your email</h1>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
            We sent a confirmation link to <span className="text-white font-medium">{formData.email}</span>.
          </p>
          <Link href="/signin" className="inline-flex items-center justify-center w-full py-3 rounded-xl font-bold text-sm transition-all" style={{ background: '#C8FF5E', color: '#000' }}>
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid-bg flex flex-col" style={{ background: '#080808', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        .fade-up-d1 { animation: fadeUp 0.6s ease 0.1s forwards; opacity: 0; }
        input:focus { border-color: rgba(200,255,94,0.35) !important; box-shadow: 0 0 0 3px rgba(200,255,94,0.07) !important; }
      `}</style>

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
      <main className="flex-grow flex items-center justify-center px-4 md:py-6">
        <div className="w-full max-w-md fade-up-d1">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Create an account
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
              3 free analyses every month — no credit card needed
            </p>
          </div>

          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px' }}>
     

           

            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl mb-5"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p style={{ fontSize: 13 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'rgba(255,255,255,0.25)' }} />
                  <input name="name" type="text" value={formData.name} onChange={handleChange}
                    placeholder="John Doe" required disabled={isLoading} style={inputStyle} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'rgba(255,255,255,0.25)' }} />
                  <input name="email" type="email" value={formData.email} onChange={handleChange}
                    placeholder="you@example.com" required disabled={isLoading} style={inputStyle} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'rgba(255,255,255,0.25)' }} />
                  <input name="password" type={showPw ? 'text' : 'password'} value={formData.password}
                    onChange={handleChange} placeholder="••••••••" required disabled={isLoading}
                    style={{ ...inputStyle, paddingRight: '44px' }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'rgba(255,255,255,0.25)' }} />
                  <input name="confirmPassword" type="password" value={formData.confirmPassword}
                    onChange={handleChange} placeholder="••••••••" required disabled={isLoading} style={inputStyle} />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 py-1">
                <input type="checkbox" id="terms" checked={agreeToTerms} 
                  onChange={e => setAgreeToTerms(e.target.checked)}
                  className="mt-1 accent-[#C8FF5E]" style={{ cursor: 'pointer' }} />
                <label htmlFor="terms" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', lineHeight: '1.4' }}>
                  I agree to the <Link href="/terms" className="text-white hover:underline">Terms</Link> and <Link href="/privacy" className="text-white hover:underline">Privacy Policy</Link>
                </label>
              </div>

              <button type="submit" disabled={isLoading || !formData.name || !formData.email || !formData.password || !agreeToTerms}
                style={{
                  width: '100%', background: (isLoading || !formData.name || !formData.email || !formData.password || !agreeToTerms) ? 'rgba(200,255,94,0.4)' : '#C8FF5E',
                  color: '#000', fontWeight: 700, fontSize: 14, padding: '13px', borderRadius: 12, border: 'none',
                  cursor: (isLoading || !formData.name) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8,
                }}
              >
                {isLoading ? (
                  <><div style={{ width: 16, height: 16, border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Creating account...</>
                ) : (
                  <>Create account <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-6" style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
            Already have an account?{' '}
            <Link href="/signin" style={{ color: '#C8FF5E', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  )
}