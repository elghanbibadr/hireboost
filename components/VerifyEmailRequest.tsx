'use client'

import React from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'

export default function VerifyEmailRequestPage() {
  return (
    <>
      {/* Awaiting Status Ribbon */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/40 flex items-center gap-1.5">
          <Mail className="h-3 w-3 text-[#C8FF5E] animate-pulse" /> Awaiting Handshake
        </span>
      </div>

      {/* Main Glass Content Pane */}
      <div className="relative mb-6 p-8 glass-card rounded-[40px] border-white/10 overflow-hidden text-left">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#C8FF5E]/5 blur-[80px] -z-10" />
        
        <h1 
          className="text-6xl font-black mb-1 text-center tracking-tighter text-[#C8FF5E] drop-shadow-[0_0_15px_rgba(200,255,94,0.15)]"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Check Inbox
        </h1>
        
        <p className="text-white/50 text-xs text-center leading-relaxed font-medium max-w-xs mx-auto mb-4">
          An encrypted deployment link was dispatched to your address. Complete the authorization using that link to unlock access.
        </p>

        <div className="pt-6 border-t border-white/5 text-[10px] text-center font-bold tracking-wider uppercase text-white/20 max-w-xs mx-auto leading-relaxed">
          Missing the token? Look inside your spam filter folder or re-trigger configuration setup.
        </div>
      </div>

      {/* Navigation Return Hook */}
      <div className="flex justify-center">
        <Link 
          href="/signin" 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40 hover:text-[#C8FF5E] transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Log In
        </Link>
      </div>
    </>
  )
}