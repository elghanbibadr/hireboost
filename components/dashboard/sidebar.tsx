'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, FileSearch, CreditCard, User,
  LogOut, Menu, X, Sparkles, ChevronRight, Zap
} from 'lucide-react'

const nav = [
  { href: '/dashboard',          label: 'Overview',     icon: LayoutDashboard },
  { href: '/dashboard/analyze',  label: 'New Analysis', icon: FileSearch },
  { href: '/dashboard/billing',  label: 'Billing',      icon: CreditCard },
  { href: '/dashboard/account',  label: 'Account',      icon: User },
]

interface SidebarProps {
  userEmail: string
  userName: string
  plan: 'free' | 'pro'
  creditsLeft: number | string
}

export function Sidebar({ userEmail, userName, plan, creditsLeft }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : userEmail.slice(0, 2).toUpperCase()

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#050505]">
      {/* Logo */}
      <div className="px-6 py-8">
        <Link href="/dashboard" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <div className="w-8 h-8 rounded-xl bg-[#C8FF5E] flex items-center justify-center shadow-[0_0_15px_rgba(200,255,94,0.3)] group-hover:scale-110 transition-transform">
            <Zap className="h-5 w-5 text-black" />
          </div>
          <span className="font-bold text-white text-xl tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
            HireBoost
          </span>
        </Link>
      </div>

      {/* Plan badge */}
      <div className="px-4 mb-4">
        {plan === 'pro' ? (
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#C8FF5E]/5 border border-[#C8FF5E]/20">
            <Sparkles className="h-4 w-4 text-[#C8FF5E] shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C8FF5E]">Pro Unlimited</span>
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-0.5">Free Plan</p>
              <p className="text-xs font-bold text-white/80">{creditsLeft} Left</p>
            </div>
            <Link
              href="/dashboard/billing"
              className="text-[10px] font-black uppercase tracking-widest text-[#C8FF5E] hover:brightness-125 transition-all underline underline-offset-4"
              onClick={() => setOpen(false)}
            >
              Upgrade
            </Link>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-3 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                active
                  ? 'bg-white/5 text-[#C8FF5E] border border-white/5 shadow-inner'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-[#C8FF5E]' : ''}`} />
              {label}
              {active && <div className="w-1 h-1 rounded-full bg-[#C8FF5E] ml-auto shadow-[0_0_8px_#C8FF5E]" />}
            </Link>
          )
        })}
      </nav>

      {/* User + sign out */}
      <div className="p-4 mt-auto border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/[0.02] border border-white/5 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#C8FF5E]/10 border border-[#C8FF5E]/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-black text-[#C8FF5E]">{initials}</span>
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-xs font-bold text-white truncate">{userName || 'Explorer'}</p>
            <p className="text-[10px] text-white/30 truncate uppercase tracking-tighter font-medium">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all group"
        >
          <LogOut className="h-4 w-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/5 h-screen sticky top-0 overflow-y-auto bg-[#050505]">
        <SidebarContent />
      </aside>

      {/* ── Mobile top bar ───────────────────────────────────────────────── */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#C8FF5E] flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-black" />
          </div>
          <span className="font-bold text-white text-md tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
            HireBoost
          </span>
        </Link>
        <button onClick={() => setOpen(true)} className="p-2 rounded-xl bg-white/5 border border-white/10 active:scale-95 transition-all">
          <Menu className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" 
            onClick={() => setOpen(false)} 
          />
          <div className="relative w-72 bg-[#050505] h-full border-r border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-[-50px] p-2 bg-white/10 rounded-full backdrop-blur-md border border-white/10"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}