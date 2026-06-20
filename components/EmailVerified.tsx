'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function EmailVerifiedPage() {
  const router = useRouter()

  return (
    <>
      {/* Security Status Ribbon */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/40 flex items-center gap-1.5">
          <CheckCircle2 className="h-3 w-3 text-[#C8FF5E]" /> Authorization Passed
        </span>
      </div>

      {/* Main Glass Content Pane */}
      <div className="relative mb-6 p-8 glass-card rounded-[40px] border-white/10 overflow-hidden text-left">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#C8FF5E]/5 blur-[80px] -z-10" />
        
        <h1 
          className="text-6xl font-black mb-1 text-center tracking-tighter text-[#C8FF5E] drop-shadow-[0_0_15px_rgba(200,255,94,0.15)]"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Email Verified
        </h1>
        
        <p className="text-white/50 text-xs text-center leading-relaxed font-medium max-w-xs mx-auto mb-8">
          Your credentials have been verified. Your premium engine workspace is now fully initialized and active.
        </p>

        <Button 
          onClick={() => router.push('/dashboard')}
          size="lg" 
          className="w-full bg-[#C8FF5E] text-black font-bold rounded-xl hover:scale-[1.02] transition-all gap-2"
        >
          Go to Dashboard
          <ArrowRight className="h-4 w-4 stroke-[2.5]" />
        </Button>
      </div>
    </>
  )
}