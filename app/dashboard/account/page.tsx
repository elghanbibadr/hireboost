'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  User, Lock, Trash2, CheckCircle,
  AlertCircle, Loader2, Eye, EyeOff,
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
    <div className="flex items-start gap-3 mb-5">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-foreground/50" />
      </div>
      <div>
        <p className="font-semibold text-foreground text-sm">{title}</p>
        <p className="text-xs text-foreground/50 mt-0.5">{description}</p>
      </div>
    </div>
  )
}

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div className={`flex items-start gap-2.5 p-3.5 rounded-lg border text-sm mb-5 ${
      type === 'success'
        ? 'bg-green-50 border-green-200 text-green-800'
        : 'bg-destructive/10 border-destructive/20 text-destructive'
    }`}>
      {type === 'success'
        ? <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
        : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
      {message}
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

  // ── Update name ───────────────────────────────────────────────────────────
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

  // ── Change password ───────────────────────────────────────────────────────
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwMsg(null)

    if (newPw.length < 8) { setPwMsg({ text: 'New password must be at least 8 characters.', type: 'error' }); return }
    if (newPw !== confirmPw) { setPwMsg({ text: 'Passwords do not match.', type: 'error' }); return }

    setPwLoading(true)

    // Re-authenticate with current password first
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

  // ── Delete account ────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setDeleteMsg({ text: 'Type DELETE exactly to confirm.', type: 'error' })
      return
    }
    setDeleteLoading(true)
    setDeleteMsg(null)

    // Call a server action / API route that uses service role to delete
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
        <Loader2 className="h-5 w-5 animate-spin text-foreground/30" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Account</h1>
        <p className="text-sm text-foreground/50 mt-0.5">Manage your profile and account settings.</p>
      </div>

      {/* Account meta */}
      <Card className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <span className="text-base font-bold text-primary">
            {profile?.full_name?.charAt(0)?.toUpperCase() ?? profile?.email?.charAt(0)?.toUpperCase() ?? 'U'}
          </span>
        </div>
        <div className="flex-grow min-w-0">
          <p className="font-medium text-foreground text-sm">{profile?.full_name || 'No name set'}</p>
          <p className="text-xs text-foreground/50 truncate">{profile?.email}</p>
        </div>
        <div className="shrink-0 text-right">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            profile?.plan === 'pro'
              ? 'bg-primary/15 text-primary'
              : 'bg-muted text-foreground/50'
          }`}>
            {profile?.plan === 'pro' ? 'Pro' : 'Free'}
          </span>
          {profile?.created_at && (
            <p className="text-xs text-foreground/30 mt-1">
              Joined {new Date(profile.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}
            </p>
          )}
        </div>
      </Card>

      {/* ── Profile section ───────────────────────────────────────────────── */}
      <Card className="p-6">
        <SectionHeader
          icon={User}
          title="Profile information"
          description="Update your display name."
        />

        {nameMsg && <Toast message={nameMsg.text} type={nameMsg.type} />}

        <form onSubmit={handleSaveName} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Full Name</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              disabled={nameLoading}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Email Address</label>
            <Input value={profile?.email ?? ''} disabled className="opacity-60 cursor-not-allowed" />
            <p className="text-xs text-foreground/40 mt-1.5">Email cannot be changed.</p>
          </div>
          <Button type="submit" disabled={nameLoading} size="sm">
            {nameLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Save changes'}
          </Button>
        </form>
      </Card>

      {/* ── Password section ──────────────────────────────────────────────── */}
      <Card className="p-6">
        <SectionHeader
          icon={Lock}
          title="Change password"
          description="Use a strong password with at least 8 characters."
        />

        {pwMsg && <Toast message={pwMsg.text} type={pwMsg.type} />}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Current Password</label>
            <div className="relative">
              <Input
                type={showPw ? 'text' : 'password'}
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                placeholder="••••••••"
                disabled={pwLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">New Password</label>
            <Input
              type={showPw ? 'text' : 'password'}
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              placeholder="At least 8 characters"
              disabled={pwLoading}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Confirm New Password</label>
            <Input
              type={showPw ? 'text' : 'password'}
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              placeholder="Repeat new password"
              disabled={pwLoading}
            />
          </div>
          <Button type="submit" disabled={pwLoading || !currentPw || !newPw || !confirmPw} size="sm">
            {pwLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Change password'}
          </Button>
        </form>
      </Card>

      {/* ── Danger zone ───────────────────────────────────────────────────── */}
      <Card className="p-6 border-destructive/20">
        <SectionHeader
          icon={Trash2}
          title="Delete account"
          description="Permanently delete your account and all your data. This cannot be undone."
        />

        {deleteMsg && <Toast message={deleteMsg.text} type={deleteMsg.type} />}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Type <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-destructive">DELETE</span> to confirm
            </label>
            <Input
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              disabled={deleteLoading}
              className="font-mono border-destructive/30 focus:ring-destructive/30 max-w-xs"
            />
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteAccount}
            disabled={deleteLoading || deleteConfirm !== 'DELETE'}
          >
            {deleteLoading
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <><Trash2 className="h-3.5 w-3.5 mr-1.5" />Delete my account</>}
          </Button>
        </div>
      </Card>
    </div>
  )
}