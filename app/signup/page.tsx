'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Footer } from '@/components/footer'
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignUp() {
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
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

    const { error } = await supabase.auth.signUp({
      email: formData.email,          // ← was hardcoded before, now fixed
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

  // ── Success state — tell user to check email ──────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="border-b border-border bg-background sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-16 flex items-center">
              <Link href="/" className="font-bold text-xl text-primary">HireBoost</Link>
            </div>
          </div>
        </div>
        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md p-8 text-center border border-border">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
            <p className="text-foreground/60 mb-6">
              We sent a confirmation link to <strong>{formData.email}</strong>.
              Click it to activate your account then sign in.
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href="/signin">Go to Sign In</Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center">
            <Link href="/" className="font-bold text-xl text-primary">HireBoost</Link>
          </div>
        </div>
      </div>

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <Card className="w-full max-w-md p-8 border border-border">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Create your account</h1>
            <p className="text-foreground/60">3 free analyses every month — no credit card needed</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                <Input id="name" name="name" type="text" placeholder="John Doe"
                  value={formData.name} onChange={handleChange} className="pl-10" required disabled={isLoading} />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                <Input id="email" name="email" type="email" placeholder="you@example.com"
                  value={formData.email} onChange={handleChange} className="pl-10" required disabled={isLoading} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                <Input id="password" name="password" type="password" placeholder="At least 8 characters"
                  value={formData.password} onChange={handleChange} className="pl-10" required disabled={isLoading} />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repeat your password"
                  value={formData.confirmPassword} onChange={handleChange} className="pl-10" required disabled={isLoading} />
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <Checkbox id="terms" checked={agreeToTerms}
                onCheckedChange={checked => setAgreeToTerms(checked as boolean)} className="mt-1" />
              <label htmlFor="terms" className="text-sm text-foreground/70 cursor-pointer">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
              className="w-full" size="lg"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-background text-foreground/60">or</span>
            </div>
          </div>

          <Button variant="outline" className="w-full mb-6" size="lg" onClick={async () => {
            await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: `${location.origin}/auth/callback` },
            })
          }}>
            Sign up with Google
          </Button>

          <p className="text-center text-sm text-foreground/60">
            Already have an account?{' '}
            <Link href="/signin" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </Card>
      </main>
      <Footer />
    </div>
  )
}