import { ArrowRight, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { ScoreCard } from './scoreCard'

export const Hero = ({user:{ userName}}:{user: { userName: string }}) => {
  return (
   
    <>
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
                 {!userName && (
                   <Link
                     href="/signup"
                     className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/70 font-medium text-sm px-6 py-3.5 rounded-xl hover:border-white/30 hover:text-white transition-all"
                   >
                     Create free account
                   </Link>
                 )}
                 {userName && (
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
    </>
       
  )
}
