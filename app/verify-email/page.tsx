'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import EmailVerifiedPage from '@/components/EmailVerified'
import VerifyEmailRequestPage from '@/components/VerifyEmailRequest'

// 1. Move your params-checking logic into a child component
function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const isVerified = searchParams.get('success') === 'true'

  return isVerified ? <EmailVerifiedPage /> : <VerifyEmailRequestPage />
}

// 2. Wrap that child in Suspense inside the main route export
export default function VerifyEmailRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={
        <div className="animate-pulse text-zinc-400">Loading verification details...</div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}