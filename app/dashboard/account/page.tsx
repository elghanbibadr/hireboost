'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2, Mail, User, Calendar, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
  created_at: string
}

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) {
          router.push('/signin')
          return
        }

        const userProfile: UserProfile = {
          id: data.user.id,
          email: data.user.email || '',
          user_metadata: data.user.user_metadata,
          created_at: data.user.created_at,
        }

        setUser(userProfile)
        setFullName(data.user.user_metadata?.full_name || '')
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/signin')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [supabase, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setUpdating(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setUser({ ...user, user_metadata: { full_name: fullName } })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setUpdating(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/signin')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const createdDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Account Settings</h1>
        <p className="text-foreground/70">Manage your account and profile information</p>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-destructive/10 border border-destructive/30 text-destructive'
          }`}
        >
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Profile Information Card */}
      <Card className="p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Profile Information</h2>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-foreground/50" />
              <Input
                type="email"
                value={user.email}
                disabled
                className="pl-10 bg-muted text-foreground"
              />
            </div>
            <p className="text-xs text-foreground/60 mt-1">Your email cannot be changed</p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-foreground/50" />
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="pl-10"
                disabled={updating}
              />
            </div>
          </div>

          {/* Account Created Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Account Created</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-foreground/50" />
              <Input
                type="text"
                value={createdDate}
                disabled
                className="pl-10 bg-muted text-foreground"
              />
            </div>
          </div>

          {/* Save Button */}
          <Button
            type="submit"
            disabled={updating}
            className="w-full"
          >
            {updating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 sm:p-8 border-destructive/30 bg-destructive/5">
        <h2 className="text-xl font-semibold text-foreground mb-4">Danger Zone</h2>
        <p className="text-sm text-foreground/70 mb-4">Sign out of your account</p>
        <Button
          variant="destructive"
          onClick={handleSignOut}
          className="w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </Card>
    </div>
  )
}
