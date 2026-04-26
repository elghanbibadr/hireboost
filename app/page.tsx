'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowRight, FileSearch, Zap, BarChart3, CheckCircle2,
  Sparkles, ChevronRight, Star, Shield, Clock,
} from 'lucide-react'

// ── Auth-aware navbar ─────────────────────────────────────────────────────────
function Navbar({ user }: { user: { email: string; name: string } | null }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? ''

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#080808]/90 backdrop-blur-xl border-b border-white/[0.06]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-[#C8FF5E] flex items-center justify-center">
            <FileSearch className="h-4 w-4 text-black" />
          </div>
          <span className="font-bold text-white text-[15px] tracking-tight">HireBoost</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it works', 'Pricing'].map(label => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s/g, '-')}`}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#C8FF5E] flex items-center justify-center">
                  <span className="text-xs font-bold text-black">{initials}</span>
                </div>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold bg-[#C8FF5E] text-black px-4 py-2 rounded-lg hover:bg-[#d4ff75] transition-colors"
              >
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      let start = 0
      const step = target / 60
      const timer = setInterval(() => {
        start += step
        if (start >= target) { setCount(target); clearInterval(timer) }
        else setCount(Math.floor(start))
      }, 16)
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count}{suffix}</span>
}

// ── Score card mockup ─────────────────────────────────────────────────────────
function ScoreCard() {
  return (
    <div className="relative">
      {/* Glow */}
      <div className="absolute inset-0 bg-[#C8FF5E]/20 blur-3xl rounded-3xl scale-75" />

      <div className="relative bg-[#111]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-white/40 mb-0.5">Senior Frontend Engineer · Stripe</p>
            <p className="text-sm font-medium text-white">resume_v3_final.pdf</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#C8FF5E]/15 flex items-center justify-center">
            <FileSearch className="h-4 w-4 text-[#C8FF5E]" />
          </div>
        </div>

        {/* Big score */}
        <div className="flex items-end gap-3 mb-5">
          <div className="text-6xl font-black text-white tracking-tighter">87</div>
          <div className="mb-2">
            <div className="text-xs font-semibold text-[#C8FF5E] bg-[#C8FF5E]/10 px-2 py-0.5 rounded-full mb-1">
              Strong match
            </div>
            <div className="text-xs text-white/30">out of 100</div>
          </div>
        </div>

        {/* Score bar */}
        <div className="h-1.5 rounded-full bg-white/8 mb-5 overflow-hidden">
          <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-[#C8FF5E] to-[#8bff00]" />
        </div>

        {/* Keywords */}
        <div className="space-y-3 mb-5">
          <div>
            <p className="text-xs text-white/40 mb-1.5">Matched keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {['React', 'TypeScript', 'Next.js', 'REST APIs', 'CI/CD'].map(k => (
                <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-[#C8FF5E]/10 text-[#C8FF5E] border border-[#C8FF5E]/20">
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1.5">Missing keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {['GraphQL', 'Redis'].map(k => (
                <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestions preview */}
        <div className="border-t border-white/8 pt-4 space-y-2">
          {[
            { priority: 'high', text: 'Add quantified metrics to leadership bullet' },
            { priority: 'medium', text: 'Include GraphQL experience from side project' },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                s.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {s.priority}
              </span>
              <p className="text-xs text-white/50">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute -top-4 -right-4 bg-[#C8FF5E] text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
        ✦ AI-powered
      </div>
      <div className="absolute -bottom-4 -left-4 bg-[#111] border border-white/10 text-white/70 text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
        <Clock className="h-3 w-3" /> Ready in 10 seconds
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const supabase = createClient()
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser({
        email: user.email ?? '',
        name: user.user_metadata?.full_name ?? '',
      })
    })
  }, [supabase])

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');

        .font-display { font-family: 'Instrument Serif', serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }

        * { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes pulse-lime {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200, 255, 94, 0.3); }
          50%       { box-shadow: 0 0 0 12px rgba(200, 255, 94, 0); }
        }

        .fade-up-1 { animation: fadeUp 0.7s ease forwards; opacity: 0; animation-delay: 0.1s; }
        .fade-up-2 { animation: fadeUp 0.7s ease forwards; opacity: 0; animation-delay: 0.25s; }
        .fade-up-3 { animation: fadeUp 0.7s ease forwards; opacity: 0; animation-delay: 0.4s; }
        .fade-up-4 { animation: fadeUp 0.7s ease forwards; opacity: 0; animation-delay: 0.55s; }

        .ticker-track { animation: ticker 28s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }

        .lime-pulse { animation: pulse-lime 2.5s ease infinite; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .card-hover {
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .card-hover:hover {
          border-color: rgba(200,255,94,0.25);
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }
      `}</style>

      <Navbar user={user} />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 grid-bg">
        {/* Radial glow behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#C8FF5E]/6 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div>
            <div className="fade-up-1 inline-flex items-center gap-2 border border-[#C8FF5E]/30 bg-[#C8FF5E]/8 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF5E] lime-pulse shrink-0" />
              <span className="text-[#C8FF5E] text-xs font-semibold tracking-wide">AI-powered resume intelligence</span>
            </div>

            <h1 className="fade-up-2 font-display text-5xl md:text-6xl lg:text-[68px] leading-[1.05] tracking-tight text-white mb-6">
              Your resume
              <span className="block italic text-white/40">deserves to</span>
              <span className="block text-[#C8FF5E]">get noticed.</span>
            </h1>

            <p className="fade-up-3 text-base text-white/50 leading-relaxed mb-10 max-w-md">
              Upload your resume, paste a job description, and get an instant AI analysis with
              your match score, missing keywords, and rewritten bullet points — in under 10 seconds.
            </p>

            <div className="fade-up-4 flex flex-col sm:flex-row gap-3">
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center gap-2 bg-[#C8FF5E] text-black font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-[#d4ff75] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Analyze my resume <ArrowRight className="h-4 w-4" />
              </Link>
              {!user && (
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/70 font-medium text-sm px-6 py-3.5 rounded-xl hover:border-white/30 hover:text-white transition-all"
                >
                  Create free account
                </Link>
              )}
              {user && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/70 font-medium text-sm px-6 py-3.5 rounded-xl hover:border-white/30 hover:text-white transition-all"
                >
                  Go to dashboard <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            <p className="fade-up-4 text-xs text-white/25 mt-5">
              Free tier available · No credit card required · Cancel anytime
            </p>
          </div>

          {/* Right — mock card */}
          <div className="fade-up-3 hidden lg:block">
            <ScoreCard />
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF TICKER ────────────────────────────────────────────── */}
      <div className="border-y border-white/[0.06] bg-[#0d0d0d] py-4 overflow-hidden">
        <div className="flex ticker-track whitespace-nowrap">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex items-center gap-12 px-6">
              {[
                'Landed a role at Google',
                'Score improved from 42 to 91',
                'Got 3 interviews in one week',
                'Finally passed ATS screening',
                'Offer from Stripe in 2 weeks',
                'Rewrote 6 bullet points · hired',
                'From 0 callbacks to 4 in a month',
                '10,000+ resumes analyzed',
              ].map(t => (
                <div key={t} className="flex items-center gap-3 shrink-0">
                  <Star className="h-3 w-3 text-[#C8FF5E] fill-[#C8FF5E]" />
                  <span className="text-sm text-white/40">{t}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
          {[
            { value: 10000, suffix: '+', label: 'Resumes analyzed' },
            { value: 87,    suffix: '%', label: 'Avg score after optimization' },
            { value: 3,     suffix: 'x', label: 'More interview callbacks' },
            { value: 10,    suffix: 's', label: 'Average analysis time' },
          ].map(({ value, suffix, label }) => (
            <div key={label} className="bg-[#0d0d0d] p-8 lg:p-10">
              <p className="font-display text-5xl text-[#C8FF5E] mb-2">
                <Counter target={value} suffix={suffix} />
              </p>
              <p className="text-sm text-white/40">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-xs font-bold text-[#C8FF5E] tracking-[0.2em] uppercase mb-4">What you get</p>
            <h2 className="font-display text-4xl md:text-5xl text-white max-w-lg leading-tight">
              Everything your resume<br />
              <span className="italic text-white/40">has been missing.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Zap,
                title: 'Instant Match Score',
                description: 'Get a calibrated 0–100 score showing exactly how well your resume matches the job description. Brutal and honest.',
                accent: '#C8FF5E',
              },
              {
                icon: BarChart3,
                title: 'Keyword Intelligence',
                description: 'See which keywords ATS systems are scanning for, which ones you\'re missing, and which ones you\'re already nailing.',
                accent: '#C8FF5E',
              },
              {
                icon: Sparkles,
                title: 'AI Bullet Rewrites',
                description: 'Your 3 weakest bullet points get rewritten with stronger verbs, quantified impact, and language that matches the role.',
                accent: '#C8FF5E',
              },
              {
                icon: CheckCircle2,
                title: 'Prioritised Suggestions',
                description: 'Not a wall of generic advice. High, medium, and low priority improvements sorted by how much they\'ll move the needle.',
                accent: '#C8FF5E',
              },
              {
                icon: BarChart3,
                title: 'Score History & Trends',
                description: 'Track your progress across every application. Watch your scores climb as you improve your resume over time.',
                accent: '#C8FF5E',
              },
              {
                icon: Shield,
                title: 'Your data stays yours',
                description: 'Your resume is analyzed and then it\'s done. We don\'t train on your data or share it with anyone.',
                accent: '#C8FF5E',
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="card-hover bg-[#111] border border-white/[0.07] rounded-2xl p-7"
              >
                <div className="w-9 h-9 rounded-xl bg-[#C8FF5E]/10 flex items-center justify-center mb-5">
                  <Icon className="h-4.5 w-4.5 text-[#C8FF5E]" style={{ width: 18, height: 18 }} />
                </div>
                <h3 className="font-semibold text-white text-base mb-2">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <p className="text-xs font-bold text-[#C8FF5E] tracking-[0.2em] uppercase mb-4">Process</p>
          <h2 className="font-display text-4xl md:text-5xl text-white leading-tight">
            From upload to offer.<br />
            <span className="italic text-white/40">In three steps.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Connector lines */}
          <div className="hidden md:block absolute top-10 left-[33%] right-[33%] h-px bg-gradient-to-r from-white/10 via-[#C8FF5E]/30 to-white/10" />

          {[
            {
              step: '01',
              title: 'Upload your resume',
              description: 'Drop your resume PDF. We extract the text and structure it for analysis.',
            },
            {
              step: '02',
              title: 'Paste the job description',
              description: 'Copy the full job posting — requirements, responsibilities, everything.',
            },
            {
              step: '03',
              title: 'Get your full report',
              description: 'Instant AI analysis with score, keywords, bullet rewrites, and next steps.',
            },
          ].map(({ step, title, description }) => (
            <div key={step} className="relative bg-[#111] border border-white/[0.07] rounded-2xl p-8">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#C8FF5E]/30 bg-[#C8FF5E]/8 mb-5">
                <span className="text-sm font-bold text-[#C8FF5E]">{step}</span>
              </div>
              <h3 className="font-semibold text-white text-base mb-2">{title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-xs font-bold text-[#C8FF5E] tracking-[0.2em] uppercase mb-4">Pricing</p>
            <h2 className="font-display text-4xl md:text-5xl text-white leading-tight">
              Simple. Honest.<br />
              <span className="italic text-white/40">No surprises.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-8">
              <p className="text-sm font-semibold text-white/60 mb-1">Free</p>
              <p className="font-display text-5xl text-white mb-6">$0</p>
              <Link
                href="/signup"
                className="block text-center text-sm font-semibold border border-white/20 text-white/70 px-6 py-3 rounded-xl hover:border-white/40 hover:text-white transition-all mb-8"
              >
                Get started free
              </Link>
              <ul className="space-y-3">
                {[
                  '3 analyses per month',
                  'Match score',
                  'Keyword breakdown',
                  'Missing keywords',
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/50">
                    <CheckCircle2 className="h-4 w-4 text-white/20 shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro */}
            <div className="relative bg-[#111] border border-[#C8FF5E]/30 rounded-2xl p-8 overflow-hidden">
              <div className="absolute top-4 right-4 text-xs font-bold bg-[#C8FF5E] text-black px-2.5 py-1 rounded-full">
                Most popular
              </div>
              <div className="absolute inset-0 bg-[#C8FF5E]/4 pointer-events-none" />
              <div className="relative">
                <p className="text-sm font-semibold text-[#C8FF5E] mb-1">Pro</p>
                <div className="flex items-end gap-1 mb-6">
                  <p className="font-display text-5xl text-white">$9.99</p>
                  <p className="text-white/30 text-sm mb-2">/month</p>
                </div>
                <Link
                  href={user ? '/dashboard/billing' : '/signup'}
                  className="block text-center text-sm font-bold bg-[#C8FF5E] text-black px-6 py-3 rounded-xl hover:bg-[#d4ff75] transition-all mb-8"
                >
                  {user ? 'Upgrade now' : 'Start Pro free trial'}
                </Link>
                <ul className="space-y-3">
                  {[
                    'Unlimited analyses',
                    'Full keyword analysis',
                    'AI bullet rewrites',
                    'Prioritised suggestions',
                    'Score history & trends',
                    'Priority support',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                      <CheckCircle2 className="h-4 w-4 text-[#C8FF5E] shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-32 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative bg-[#C8FF5E] rounded-3xl px-8 py-16 md:py-20 text-center overflow-hidden">
          {/* Background noise texture feel */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 80%, #000 1px, transparent 1px), radial-gradient(circle at 80% 20%, #000 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-6xl text-black leading-tight mb-4">
              Your next interview<br />
              <span className="italic">starts here.</span>
            </h2>
            <p className="text-black/60 text-base mb-10 max-w-md mx-auto">
              Analyze your resume in 10 seconds and get the exact changes that will get you noticed.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 bg-black text-white font-bold text-sm px-8 py-4 rounded-xl hover:bg-black/80 transition-all hover:scale-[1.02]"
            >
              Analyze my resume now <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-black/40 text-xs mt-4">Free. No credit card. Takes 10 seconds.</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#C8FF5E] flex items-center justify-center">
              <FileSearch className="h-3.5 w-3.5 text-black" />
            </div>
            <span className="font-bold text-white text-sm">HireBoost</span>
          </div>
          <div className="flex items-center gap-8">
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
              { label: 'Sign in', href: '/signin' },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="text-xs text-white/30 hover:text-white/70 transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-white/20">© {new Date().getFullYear()} HireBoost</p>
        </div>
      </footer>
    </div>
  )
}