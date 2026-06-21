import { Clock, FileSearch } from "lucide-react";

// ── Score card mockup ─────────────────────────────────────────────────────────
export function ScoreCard() {
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