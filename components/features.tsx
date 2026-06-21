import React from 'react'
import {
 Zap, BarChart3, CheckCircle2,
  Sparkles, Shield, 
} from 'lucide-react'

export const Features = () => {
  return (
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
  )
}

export default Features