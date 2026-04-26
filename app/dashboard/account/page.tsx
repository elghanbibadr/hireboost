'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  User, Lock, Trash2, CheckCircle,
  AlertCircle, Loader2, Eye, EyeOff, ShieldAlert
} from 'lucide-react'

interface Profile {
  full_name: string
  email: string
  plan: 'free' | 'pro'
  created_at: string
}

function SectionHeader({ icon: Icon, title, description }: {
  icon: React.ElementType; title: string; description: string
}) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
        <Icon className="h-5 w-5 text-white/40" />
      </div>
      <div>
        <p className="font-bold text-white text-base tracking-tight">{title}</p>
        <p className="text-sm text-white/30 mt-0.5">{description}</p>
      </div>
    </div>
  )
}

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border text-sm mb-6 animate-in fade-in slide-in-from-top-2 ${
      type === 'success'
        ? 'bg-[#C8FF5E]/10 border-[#C8FF5E]/20 text-[#C8FF5E]'
        : 'bg-red-500/10 border-red-500/20 text-red-400'
    }`}>
      {type === 'success'
        ? <CheckCircle className="h-4 w-4 shrink-0" />
        : <AlertCircle className="h-4 w-4 shrink-0" />}
      <span className="font-medium">{message}</span>
    </div>
  )
}

export default function AccountPage() {
  const supabase = createClient()
  const router   = useRouter()

  const [profile, setProfile]     = useState<Profile | null>(null)
  const [loading, setLoading]     = useState(true)

  // Profile section
  const [name, setName]           = useState('')
  const [nameLoading, setNameLoading] = useState(false)
  const [nameMsg, setNameMsg]     = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Password section
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw]         = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg]         = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Delete section
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteMsg, setDeleteMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('full_name, email, plan, created_at')
        .eq('id', user.id)
        .single()
      setProfile(data)
      setName(data?.full_name ?? '')
      setLoading(false)
    }
    load()
  }, [supabase])

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameMsg(null)
    if (!name.trim()) { setNameMsg({ text: 'Name cannot be empty.', type: 'error' }); return }
    setNameLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name.trim(), updated_at: new Date().toISOString() })
      .eq('id', user.id)

    setNameMsg(error
      ? { text: error.message, type: 'error' }
      : { text: 'Name updated successfully.', type: 'success' }
    )
    setNameLoading(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwMsg(null)

    if (newPw.length < 8) { setPwMsg({ text: 'New password must be at least 8 characters.', type: 'error' }); return }
    if (newPw !== confirmPw) { setPwMsg({ text: 'Passwords do not match.', type: 'error' }); return }

    setPwLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) return

    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPw,
    })

    if (signInErr) {
      setPwMsg({ text: 'Current password is incorrect.', type: 'error' })
      setPwLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPw })

    if (error) {
      setPwMsg({ text: error.message, type: 'error' })
    } else {
      setPwMsg({ text: 'Password changed successfully.', type: 'success' })
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
    }
    setPwLoading(false)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setDeleteMsg({ text: 'Type DELETE exactly to confirm.', type: 'error' })
      return
    }
    setDeleteLoading(true)
    setDeleteMsg(null)

    const res  = await fetch('/api/account/delete', { method: 'POST' })
    const data = await res.json()

    if (!res.ok) {
      setDeleteMsg({ text: data.message ?? 'Failed to delete account.', type: 'error' })
      setDeleteLoading(false)
      return
    }

    await supabase.auth.signOut()
    router.push('/?deleted=true')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-5 w-5 animate-spin text-[#C8FF5E]" />
      </div>
    )
  }

  return (
    <div className="space-y-10 max-w-3xl pb-20 fade-up">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        .fade-up { animation: fadeUp 0.5s ease-out forwards; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Page Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Account Settings
        </h1>
        <p className="text-white/40 mt-1 text-sm">
          Manage your personal details and security.
        </p>
      </div>

      {/* Account Meta Card */}
      <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/10 flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-[#C8FF5E]/10 border border-[#C8FF5E]/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(200,255,94,0.1)]">
          <span className="text-xl font-black text-[#C8FF5E]">
            {profile?.full_name?.charAt(0)?.toUpperCase() ?? profile?.email?.charAt(0)?.toUpperCase() ?? 'U'}
          </span>
        </div>
        <div className="flex-grow min-w-0">
          <p className="font-bold text-white text-lg leading-none mb-1">{profile?.full_name || 'No name set'}</p>
          <p className="text-sm text-white/30 truncate font-medium tracking-tight">{profile?.email}</p>
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

      {/* Profile Section */}
      <div className="p-8 rounded-[32px] bg-white/[0.01] border border-white/5">
        <SectionHeader
          icon={User}
          title="Profile Information"
          description="Update your identity on the platform."
        />

        {nameMsg && <Toast message={nameMsg.text} type={nameMsg.type} />}

        <form onSubmit={handleSaveName} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] ml-1">Display Name</label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full Name"
                disabled={nameLoading}
                className="h-12 bg-white/[0.02] border-white/10 rounded-xl focus:border-[#C8FF5E]/50 focus:ring-0 transition-all text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] ml-1">Account Email</label>
              <Input value={profile?.email ?? ''} disabled className="h-12 bg-white/5 border-white/5 rounded-xl opacity-40 cursor-not-allowed text-white/50" />
            </div>
          </div>
          <Button type="submit" disabled={nameLoading} className="h-12 px-8 rounded-xl bg-white text-black font-bold hover:bg-[#C8FF5E] transition-all">
            {nameLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Profile'}
          </Button>
        </form>
      </div>

      {/* Password Section */}
      <div className="p-8 rounded-[32px] bg-white/[0.01] border border-white/5">
        <SectionHeader
          icon={Lock}
          title="Security"
          description="Keep your account protected with a strong password."
        />

        {pwMsg && <Toast message={pwMsg.text} type={pwMsg.type} />}

        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] ml-1">Current Password</label>
              <div className="relative">
                <Input
                  type={showPw ? 'text' : 'password'}
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                  disabled={pwLoading}
                  className="h-12 bg-white/[0.02] border-white/10 rounded-xl pr-12 focus:border-[#C8FF5E]/50 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] ml-1">New Password</label>
                <Input
                  type={showPw ? 'text' : 'password'}
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  placeholder="Min 8 characters"
                  disabled={pwLoading}
                  className="h-12 bg-white/[0.02] border-white/10 rounded-xl focus:border-[#C8FF5E]/50 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] ml-1">Confirm New</label>
                <Input
                  type={showPw ? 'text' : 'password'}
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  placeholder="Repeat password"
                  disabled={pwLoading}
                  className="h-12 bg-white/[0.02] border-white/10 rounded-xl focus:border-[#C8FF5E]/50 text-white"
                />
              </div>
            </div>
          </div>
          <Button type="submit" disabled={pwLoading || !currentPw || !newPw || !confirmPw} className="h-12 px-8 rounded-xl bg-white text-black font-bold hover:bg-[#C8FF5E] transition-all">
            {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reset Password'}
          </Button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="p-8 rounded-[32px] bg-red-500/[0.02] border border-red-500/10">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Trash2 className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="font-bold text-white text-base tracking-tight">Danger Zone</p>
            <p className="text-sm text-white/30 mt-0.5">Permanently remove your account and all stored data.</p>
          </div>
        </div>

        {deleteMsg && <Toast message={deleteMsg.text} type={deleteMsg.type} />}

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-bold text-white/40">
              Please type <span className="text-red-400 font-black">DELETE</span> below to confirm.
            </p>
            <Input
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE"
              disabled={deleteLoading}
              className="h-12 bg-red-500/[0.05] border-red-500/20 rounded-xl focus:border-red-500/50 text-white font-mono max-w-sm"
            />
          </div>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleteLoading || deleteConfirm !== 'DELETE'}
            className="h-12 px-8 rounded-xl font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
          >
            {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete Permanently'}
          </Button>
        </div>
      </div>
    </div>
  )
}