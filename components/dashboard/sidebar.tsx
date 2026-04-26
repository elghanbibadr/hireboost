'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, FileSearch, CreditCard, User,
  LogOut, Menu, X, Sparkles, ChevronRight,
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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <FileSearch className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground text-base tracking-tight">HireBoost</span>
        </Link>
      </div>

      {/* Plan badge */}
      <div className="px-4 py-3 border-b border-border">
        {plan === 'pro' ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/8 border border-primary/20">
            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-xs font-semibold text-primary">Pro Plan · Unlimited</span>
          </div>
        ) : (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/60">
            <div>
              <p className="text-xs font-semibold text-foreground">Free Plan</p>
              <p className="text-xs text-foreground/50">{creditsLeft} credit{creditsLeft !== 1 ? 's' : ''} left</p>
            </div>
            <Link
              href="/dashboard/billing"
              className="text-xs font-semibold text-primary hover:underline shrink-0"
              onClick={() => setOpen(false)}
            >
              Upgrade
            </Link>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground/60 hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {active && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* User + sign out */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">{initials}</span>
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{userName || 'User'}</p>
            <p className="text-xs text-foreground/40 truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/50 hover:text-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-background h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile top bar ───────────────────────────────────────────────── */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <FileSearch className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground text-sm">HireBoost</span>
        </Link>
        <button onClick={() => setOpen(true)} className="p-1.5 rounded-md hover:bg-muted transition-colors">
          <Menu className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-64 bg-background h-full border-r border-border shadow-xl flex flex-col">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md hover:bg-muted"
            >
              <X className="h-4 w-4 text-foreground/60" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}