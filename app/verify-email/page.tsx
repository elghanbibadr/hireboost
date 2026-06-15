'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail, ArrowLeft, ExternalLink } from 'lucide-react'

export default function VerifyEmailRequestPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'

  // Helper to grab the domain for a quick-launch shortcut button
  const emailDomain = email.includes('@') ? email.split('@')[1] : null

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
            <Mail className="h-3 w-3 text-yellow-400" /> Action Required
          </span>
        </div>

        {/* Main Header using custom fonts */}
        <h1 
          className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-white"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Verify Your Email
        </h1>

        {/* Main Glass Card Container with ambient glow */}
        <div className="relative mb-10 p-10 glass-card rounded-[40px] border-white/10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#C8FF5E]/5 blur-[80px] -z-10" />
          
          {/* Large Floating Mail Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center drop-shadow-[0_0_15px_rgba(255,255,255,0.02)]">
              <Mail className="h-9 w-9 text-white/60 stroke-[1.5] animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          <h2 className="text-lg font-bold uppercase tracking-[0.1em] text-white mb-2">
            Check your inbox
          </h2>
          
          {/* Dynamic targeted email line */}
          <p className="text-[#C8FF5E] text-xs font-mono mb-4 break-all bg-[#C8FF5E]/5 py-1 px-3 rounded-md border border-[#C8FF5E]/10 inline-block">
            {email}
          </p>
          
          <p className="text-white/50 text-sm leading-relaxed font-medium max-w-xs mx-auto">
            We sent a secure confirmation link to this address. Please click the link inside to fully activate your account and start optimizing.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-4 w-full">
          {emailDomain && (
            <Button 
              asChild
              size="lg" 
              className="bg-[#C8FF5E] text-black font-bold rounded-xl hover:scale-105 transition-all gap-2 w-full"
            >
              <a href={`https://${emailDomain}`} target="_blank" rel="noopener noreferrer">
                Open Email Client
                <ExternalLink className="h-4 w-4 stroke-[2.5]" />
              </a>
            </Button>
          )}

          <Button 
            asChild 
            variant="ghost" 
            className="text-white/40 hover:text-white font-medium gap-2 text-xs py-2 tracking-wide"
          >
            <Link href="/signin">
              <ArrowLeft className="h-3 w-3" />
              Back to Sign In
            </Link>
          </Button>
        </div>

      </div>
    </div>
  )
}