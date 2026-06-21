import React from 'react'

const HowItWorks = () => {
  return (
    
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
  )
}

export default HowItWorks