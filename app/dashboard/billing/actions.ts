// app/billing/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'

export type ActionResponse = { success: boolean; url?: string; message?: string }

export async function createCheckoutSession(): Promise<ActionResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/stripe/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: 'pro' }),
    })
    
    const data = await response.json()
    if (data.url) return { success: true, url: data.url }
    return { success: false, message: data.message || 'Something went wrong.' }
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to initialize checkout.' }
  }
}

export async function createBillingPortalSession(): Promise<ActionResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/stripe/portal`, { 
      method: 'POST' 
    })
    
    const data = await response.json()
    if (data.url) return { success: true, url: data.url }
    return { success: false, message: data.message || 'Something went wrong.' }
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to initialize portal.' }
  }
}