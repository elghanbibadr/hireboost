import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
import { createClient } from '@/lib/supabase/server'



export async function POST(req: NextRequest) {
    const supabase = await createClient()

  const body = await req.text() // Stripe requires r
  // aw text body for verification
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed.', err)
    return NextResponse.json({ message: 'Webhook Error' }, { status: 400 })
  }

  // Handle the specific event type
  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription
    
    console.log("subscription",subscription)
    // Grab the user ID we attached to the metadata in your checkout route!
    const supabaseUserId = subscription.metadata.supabase_user_id

    console.log("subase user id",supabaseUserId)

    if (supabaseUserId) {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan: 'pro', // or whatever your column name/value is
          stripe_subscription_id: subscription.id ,
          credits:300
        })
        .eq('id', supabaseUserId)

      if (error) {
        console.error('Error updating user plan in Supabase:', error)
        return NextResponse.json({ message: 'Database update failed' }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}