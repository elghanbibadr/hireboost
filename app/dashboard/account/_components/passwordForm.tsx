// app/account/_components/passwordForm.tsx
'use client'

import React, { useState } from 'react'
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeader, Toast } from '../shared'
import { updateAccountPassword } from '../actions'
import { Input } from '@/components/ui/input'

export function PasswordForm() {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)

    if (newPw !== confirmPw) {
      setMsg({ text: 'Passwords do not match.', type: 'error' })
      return
    }

    setLoading(true)
    const res = await updateAccountPassword(currentPw, newPw)
    setMsg({ text: res.message, type: res.success ? 'success' : 'error' })
    
    if (res.success) {
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
    }
    setLoading(false)
  }

  return (
    <div className="p-8 rounded-[32px] bg-white/[0.01] border border-white/5">
      <SectionHeader icon={Lock} title="Security" description="Keep your account protected with a strong password." />
      {msg && <Toast message={msg.text} type={msg.type} />}

      <form onSubmit={handleChangePassword} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] ml-1">Current Password</label>
            <div className="relative">
              <Input
                type={showPw ? 'text' : 'password'}
                value={currentPw}
                onChange={(e:any) => setCurrentPw(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="h-12 bg-white/[0.02] border-white/10 rounded-xl pr-12 text-white"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] ml-1">New Password</label>
              <Input type={showPw ? 'text' : 'password'} value={newPw} onChange={(e:any) => setNewPw(e.target.value)} placeholder="Min 8 characters" disabled={loading} className="h-12 bg-white/[0.02] border-white/10 rounded-xl text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] ml-1">Confirm New</label>
              <Input type={showPw ? 'text' : 'password'} value={confirmPw} onChange={(e:any) => setConfirmPw(e.target.value)} placeholder="Repeat password" disabled={loading} className="h-12 bg-white/[0.02] border-white/10 rounded-xl text-white" />
            </div>
          </div>
        </div>
        <Button type="submit" disabled={loading || !currentPw || !newPw || !confirmPw} className="h-12 px-8 rounded-xl bg-white text-black font-bold hover:bg-[#C8FF5E] transition-all">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reset Password'}
        </Button>
      </form>
    </div>
  )
}