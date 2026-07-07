// app/account/_components/profileCard.tsx
import React from 'react'

interface ProfileProps {
  profile: { full_name: string | null; plan: 'free' | 'pro'; created_at: string } | null
  defaultEmail: string
}

export function ProfileCard({ profile, defaultEmail }: ProfileProps) {
  const initial = (profile?.full_name?.charAt(0) || defaultEmail.charAt(0) || 'U').toUpperCase()

  return (
    <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/10 flex items-center gap-6">
      <div className="w-16 h-16 rounded-full bg-[#C8FF5E]/10 border border-[#C8FF5E]/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(200,255,94,0.1)]">
        <span className="text-xl font-black text-[#C8FF5E]">{initial}</span>
      </div>
      <div className="flex-grow min-w-0">
        <p className="font-bold text-white text-lg leading-none mb-1">{profile?.full_name || 'No name set'}</p>
        <p className="text-sm text-white/30 truncate font-medium tracking-tight">{defaultEmail}</p>
      </div>
      <div className="shrink-0 text-right hidden sm:block">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
          profile?.plan === 'pro'
            ? 'bg-[#C8FF5E]/10 border-[#C8FF5E]/30 text-[#C8FF5E]'
            : 'bg-white/5 border-white/10 text-white/40'
        }`}>
          {profile?.plan === 'pro' ? 'Pro Member' : 'Free Tier'}
        </span>
        {profile?.created_at && (
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-tighter mt-2">
            Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  )
}