import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server' 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the user from the current session request
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ message: 'Unauthorized access.' }, { status: 401 })
    }

    // 2. Retrieve the user's stripe_customer_id from your Supabase profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.stripe_customer_id) {
      console.error('Database retrieval error or missing customer ID:', profileError)
      return NextResponse.json(
        { message: 'Billing profile not found. You must subscribe to a plan first.' }, 
        { status: 404 }
      )
    }

    // 3. Create the secure Stripe Billing Portal configuration session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      // The return URL where Stripe will redirect the user when they click "Exit" or "Back"
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    })

    // 4. Send the secure URL back to your frontend handler
    return NextResponse.json({ url: portalSession.url }, { status: 200 })

  } catch (error) {
    console.error('Stripe Portal Route Exception:', error)
    const fallbackMessage = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ message: fallbackMessage }, { status: 500 })
  }
}