'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export default function NotFound() {
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
            <AlertCircle className="h-3 w-3 text-red-400" /> Error Code
          </span>
        </div>

        {/* 404 Typography using your custom fonts */}
        <div className="relative mb-8 p-10 glass-card rounded-[40px] border-white/10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#C8FF5E]/5 blur-[80px] -z-10" />
          
          <h1 
            className="text-8xl font-black mb-2 tracking-tighter text-[#C8FF5E] drop-shadow-[0_0_15px_rgba(200,255,94,0.15)]"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            404
          </h1>
          <h2 className="text-lg font-bold uppercase tracking-[0.1em] text-white mb-3">
            Page Not Found
          </h2>
          <p className="text-white/50 text-sm leading-relaxed font-medium max-w-xs mx-auto">
            Sorry, we couldn&apos;t find the path or analysis layout you are looking for.
          </p>
        </div>

        {/* Action Button using your brand colors */}
        <Button 
          asChild 
          size="lg" 
          className="bg-[#C8FF5E] text-black font-bold rounded-xl hover:scale-105 transition-all gap-2 px-8"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
            Return to HireBoost
          </Link>
        </Button>

      </div>
    </div>
  )
}