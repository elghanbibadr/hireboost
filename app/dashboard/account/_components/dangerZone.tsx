// app/account/_components/dangerZone.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Toast } from '../shared'
import { Input } from '@/components/ui/input'

export function DangerZone() {
  const router = useRouter()
  const supabase = createClient()
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return
    setLoading(true)
    setMsg(null)

    const res = await fetch('/api/account/delete', { method: 'POST' })
    const data = await res.json()

    if (!res.ok) {
      setMsg({ text: data.message || 'Failed to delete account.', type: 'error' })
      setLoading(false)
      return
    }

    await supabase.auth.signOut()
    router.refresh()
    router.push('/?deleted=true')
  }

  return (
    <div className="p-8 rounded-[32px] bg-red-500/[0.02] border border-red-500/10">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <Trash2 className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h3 className="font-bold text-white text-base tracking-tight">Danger Zone</h3>
          <p className="text-sm text-white/30 mt-0.5">Permanently remove your account and all stored data.</p>
        </div>
      </div>

      {msg && <Toast message={msg.text} type={msg.type} />}

      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-bold text-white/40">
            Please type <span className="text-red-400 font-black">DELETE</span> below to confirm.
          </p>
          <Input
            value={deleteConfirm}
            onChange={(e:any) => setDeleteConfirm(e.target.value)}
            placeholder="Type DELETE"
            disabled={loading}
            className="h-12 bg-red-500/[0.05] border-red-500/20 rounded-xl text-white font-mono max-w-sm"
          />
        </div>
        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          disabled={loading || deleteConfirm !== 'DELETE'}
          className="h-12 px-8 rounded-xl font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete Permanently'}
        </Button>
      </div>
    </div>
  )
}