'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff, ArrowRight, FileSearch } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignUp() {
  const supabase = createClient()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
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
      setError('Please agree to the Terms.')
      return
    }

    setIsLoading(true)

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: { full_name: formData.name },
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
  }

  // ✅ Success UI (styled like your app)
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#080808' }}>
        <div style={{
          background: '#111',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: 32,
          maxWidth: 420,
          width: '100%',
          textAlign: 'center'
        }}>
          <CheckCircle className="h-10 w-10 mx-auto mb-4" style={{ color: '#C8FF5E' }} />
          <h2 className="text-white text-xl font-bold mb-2">Check your email</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
            We sent a confirmation link to {formData.email}
          </p>

          <button
            onClick={() => router.push('/signin')}
            className="mt-6 w-full"
            style={{
              background: '#C8FF5E',
              color: '#000',
              padding: '12px',
              borderRadius: 12,
              fontWeight: 600
            }}
          >
            Go to Sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080808' }}>

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
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create account
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
              Start using HireBoost today
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: 32,
          }}>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl mb-5"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <p style={{ fontSize: 13 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User className="icon" />
                  <input name="name" value={formData.name} onChange={handleChange}
                    placeholder="John Doe" required disabled={isLoading}
                    className="input"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="label">Email</label>
                <div className="relative">
                  <Mail className="icon" />
                  <input name="email" type="email"
                    value={formData.email} onChange={handleChange}
                    placeholder="you@example.com"
                    className="input"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="icon" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input pr-10"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="eye">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div>
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <Lock className="icon" />
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input pr-10"
                  />
                  <button type="button" onClick={() => setShowConfirmPw(v => !v)} className="eye">
                    {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-center gap-2 text-sm text-white/50">
                <input type="checkbox" checked={agreeToTerms}
                  onChange={e => setAgreeToTerms(e.target.checked)} />
                I agree to Terms
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn"
              >
                {isLoading ? 'Creating...' : <>Create Account <ArrowRight size={16} /></>}
              </button>

            </form>

            <p className="text-center mt-6 text-sm text-white/40">
              Already have an account? <Link href="/signin" style={{ color: '#C8FF5E' }}>Sign in</Link>
            </p>

          </div>
        </div>
      </main>
    </div>
  )
}