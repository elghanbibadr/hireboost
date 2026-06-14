// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const VALID_PRICE_IDS = new Set([
  process.env.STRIPE_PRO_PRICE_ID!,
  // add more price IDs here as you add plans
])

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // 2. Validate price ID
    console.log("req",req)
    const { priceId } = await req.json()
    console.log("price id",priceId)

    if (!priceId || !VALID_PRICE_IDS.has(priceId)) {
      return NextResponse.json({ message: 'Invalid price ID' }, { status: 400 })
    }

    // 3. Fetch profile to get or create Stripe customer
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, full_name')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({ message: 'Failed to load profile' }, { status: 500 })
    }

    let customerId = profile?.stripe_customer_id

    // 4. Create Stripe customer if one doesn't exist yet
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name ?? undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      })

      customerId = customer.id

      // Persist immediately so the webhook can match later
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)

      if (updateError) {
        console.error('Failed to save stripe_customer_id:', updateError)
        // non-fatal — checkout can still proceed
      }
    }

    // 5. Check if user already has an active subscription
    //    Prevents creating duplicate subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length > 0) {
      return NextResponse.json(
        { message: 'You already have an active subscription. Manage it from the billing page.' },
        { status: 409 }
      )
    }

    // 6. Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?cancelled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          supabase_user_id: user.id, // webhook uses this to update the profile
        },
      },
      metadata: {
        supabase_user_id: user.id,
      },
    })

    return NextResponse.json({ url: session.url })

  } catch (err) {
    console.error('Checkout error:', err)
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ message }, { status: 500 })
  }
}