import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Cta = () => {
  return (
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
  )
}

export default Cta