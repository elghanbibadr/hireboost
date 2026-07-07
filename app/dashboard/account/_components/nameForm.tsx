// app/account/_components/nameForm.tsx
'use client'

import React, { useState } from 'react'
import { User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeader, Toast } from '../shared'
import { updateProfileName } from '../actions'
import { Input } from '@/components/ui/input'

export function NameForm({ defaultName }: { defaultName: string }) {
  const [name, setName] = useState(defaultName)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    setLoading(true)

    const res = await updateProfileName(name)
    setMsg({ text: res.message, type: res.success ? 'success' : 'error' })
    setLoading(false)
  }

  return (
    <div className="p-8 rounded-[32px] bg-white/[0.01] border border-white/5">
      <SectionHeader icon={User} title="Profile Information" description="Update your identity on the platform." />
      {msg && <Toast message={msg.text} type={msg.type} />}

      <form onSubmit={handleSaveName} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] ml-1">Display Name</label>
            <Input
              value={name}
              onChange={(e:any) => setName(e.target.value)}
              placeholder="Full Name"
              disabled={loading}
              className="h-12 bg-white/[0.02] border-white/10 rounded-xl focus:border-[#C8FF5E]/50 text-white"
            />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="h-12 px-8 rounded-xl bg-white text-black font-bold hover:bg-[#C8FF5E] transition-all">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Profile'}
        </Button>
      </form>
    </div>
  )
}