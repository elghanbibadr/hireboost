import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Pricing = ({user:{userName}}:{user: {userName: string}}) => {
  return (
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
                  href={userName ? '/dashboard/billing' : '/signup'}
                  className="block text-center text-sm font-bold bg-[#C8FF5E] text-black px-6 py-3 rounded-xl hover:bg-[#d4ff75] transition-all mb-8"
                >
                  {userName ? 'Upgrade now' : 'Start Pro free trial'}
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
  )
}

export default Pricing