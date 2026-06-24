'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type FormState = {
  error: string | null
}

// ⚠️ FIX: Accept prevState as the first argument, followed by formData
export async function signInAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect on successful authentication
  redirect('/dashboard')
}


// SIGN UP ACTION

// @ts-ignore
export async function signUpAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string 

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      data: { name },
    },
  })

  console.log("error",error)
  console.log("data",data)
  // 🌟 THE CRITICAL CHECK
  if (data?.user && !data.session) {
    // This means the user account was created, but email confirmation is REQUIRED.
    // Show a clean success state telling them to check their inbox.
    redirect('/verify-email?email=' + encodeURIComponent(formData.get('email') as string))
  }

    if (error) {
    return { error: error.message }
  }
  // Fallback: If a session does exist (e.g., email confirmation is off), log them in
  if (data?.session) {
    redirect('/dashboard')
  }

}