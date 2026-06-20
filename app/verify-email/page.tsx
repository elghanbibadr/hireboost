'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import EmailVerifiedPage from '@/components/EmailVerified'
import VerifyEmailRequestPage from '@/components/VerifyEmailRequest'
import { Loader2 } from 'lucide-react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const isVerified = searchParams.get('success') === 'true'

  return isVerified ? <EmailVerifiedPage /> : <VerifyEmailRequestPage />
}

export default function VerifyEmailRoute() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 selection:bg-[#C8FF5E] selection:text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        .glass-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>

      <div className="text-center max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center gap-3 text-white/40 font-bold uppercase tracking-wider text-xs">
            <Loader2 className="h-5 w-5 animate-spin text-[#C8FF5E] stroke-[2.5]" />
            Reading Access State...
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  )
}