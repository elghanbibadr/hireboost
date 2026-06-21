import { Star } from "lucide-react"

export const SocialProofTicker = () => {
  return (
        <div className="border-y border-white/[0.06] bg-[#0d0d0d] py-4 overflow-hidden">
        <div className="flex ticker-track whitespace-nowrap">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex items-center gap-12 px-6">
              {[
                'Landed a role at Google',
                'Score improved from 42 to 91',
                'Got 3 interviews in one week',
                'Finally passed ATS screening',
                'Offer from Stripe in 2 weeks',
                'Rewrote 6 bullet points · hired',
                'From 0 callbacks to 4 in a month',
                '10,000+ resumes analyzed',
              ].map(t => (
                <div key={t} className="flex items-center gap-3 shrink-0">
                  <Star className="h-3 w-3 text-[#C8FF5E] fill-[#C8FF5E]" />
                  <span className="text-sm text-white/40">{t}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div> 
  )
}

export default SocialProofTicker