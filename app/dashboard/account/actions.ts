// app/account/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ActionResponse = { success: boolean; message: string }

export async function updateProfileName(name: string): Promise<ActionResponse> {
  if (!name.trim()) return { success: false, message: 'Name cannot be empty.' }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: 'Unauthorized session.' }

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name.trim(), updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (error) return { success: false, message: error.message }

    revalidatePath('/account')
    return { success: true, message: 'Name updated successfully.' }
  } catch (err: any) {
    return { success: false, message: err.message || 'An error occurred.' }
  }
}

export async function updateAccountPassword(currentPw: string, newPw: string): Promise<ActionResponse> {
  if (newPw.length < 8) return { success: false, message: 'New password must be at least 8 characters.' }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) return { success: false, message: 'Unauthorized session.' }

    // Verify current security parameters
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPw,
    })

    if (signInErr) return { success: false, message: 'Current password is incorrect.' }

    const { error } = await supabase.auth.updateUser({ password: newPw })
    if (error) return { success: false, message: error.message }

    return { success: true, message: 'Password changed successfully.' }
  } catch (err: any) {
    return { success: false, message: err.message || 'An error occurred.' }
  }
}