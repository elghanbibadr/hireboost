'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PlanFeature {
  name: string
  included: boolean
}

interface Plan {
  id: string
  name: string
  price: number
  description: string
  features: PlanFeature[]
  popular?: boolean
}

interface Subscription {
  plan: string
  status: string
  nextBillingDate: string
}

export default function BillingPage() {
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [upgrading, setUpgrading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) {
          router.push('/signin')
          return
        }

        // Simulate fetching subscription data from Supabase
        // In a real app, you would query your subscriptions table
        setSubscription({
          plan: 'Pro',
          status: 'active',
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        })
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/signin')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [supabase, router])

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 0,
      description: 'Perfect for getting started',
      features: [
        { name: 'Up to 5 resume analyses per month', included: true },
        { name: 'Basic resume feedback', included: true },
        { name: 'Job description matching', included: true },
        { name: 'Priority support', included: false },
        { name: 'Unlimited analyses', included: false },
        { name: 'Advanced analytics', included: false },
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      description: 'For serious job seekers',
      features: [
        { name: 'Up to 5 resume analyses per month', included: true },
        { name: 'Basic resume feedback', included: true },
        { name: 'Job description matching', included: true },
        { name: 'Priority support', included: true },
        { name: 'Unlimited analyses', included: true },
        { name: 'Advanced analytics', included: false },
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      description: 'For teams and organizations',
      features: [
        { name: 'Up to 5 resume analyses per month', included: true },
        { name: 'Basic resume feedback', included: true },
        { name: 'Job description matching', included: true },
        { name: 'Priority support', included: true },
        { name: 'Unlimited analyses', included: true },
        { name: 'Advanced analytics', included: true },
      ],
    },
  ]

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Billing & Plans</h1>
        <p className="text-foreground/70">Manage your subscription and upgrade your plan</p>
      </div>

      {/* Current Subscription */}
      {subscription && (
        <Card className="p-6 sm:p-8 mb-12 border-primary/30 bg-primary/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Current Plan: {subscription.plan}</h2>
              <p className="text-sm text-foreground/70">
                Your next billing date is {subscription.nextBillingDate}
              </p>
            </div>
            <Badge
              variant={subscription.status === 'active' ? 'default' : 'secondary'}
              className="w-fit"
            >
              {subscription.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {subscription.status === 'active' && (
            <div className="mt-4 flex items-start gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
              <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
              <p>Your subscription is active and in good standing.</p>
            </div>
          )}
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`p-6 sm:p-8 flex flex-col transition ${
              plan.popular ? 'border-2 border-primary ring-2 ring-primary/20 relative' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}

            <div className="mb-6 pt-2">
              <h3 className="text-2xl font-bold text-foreground mb-1">{plan.name}</h3>
              <p className="text-sm text-foreground/70">{plan.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                <span className="text-sm text-foreground/70">/month</span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8 flex-grow">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`shrink-0 h-5 w-5 rounded-full flex items-center justify-center mt-0.5 ${
                    feature.included
                      ? 'bg-green-100 text-green-600'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {feature.included ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span className="text-xs">✕</span>
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      feature.included ? 'text-foreground' : 'text-foreground/50 line-through'
                    }`}
                  >
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              variant={plan.popular ? 'default' : 'outline'}
              disabled={subscription?.plan.toLowerCase() === plan.id || upgrading}
              onClick={() => setUpgrading(true)}
              className="w-full"
            >
              {subscription?.plan.toLowerCase() === plan.id ? (
                'Current Plan'
              ) : plan.price === 0 ? (
                'Downgrade'
              ) : (
                `Upgrade to ${plan.name}`
              )}
            </Button>
          </Card>
        ))}
      </div>

      {/* Payment Methods */}
      <Card className="p-6 sm:p-8 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Payment Methods</h2>
        
        <div className="space-y-4">
          {/* Sample Payment Method */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <CreditCard className="h-5 w-5 text-foreground/60" />
              </div>
              <div>
                <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                <p className="text-sm text-foreground/70">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">Edit</Button>
          </div>

          <Button variant="outline" className="w-full">
            Add Payment Method
          </Button>
        </div>
      </Card>

      {/* Billing History */}
      <Card className="p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Billing History</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-semibold text-foreground">Date</th>
                <th className="text-left py-3 px-2 font-semibold text-foreground">Description</th>
                <th className="text-right py-3 px-2 font-semibold text-foreground">Amount</th>
                <th className="text-right py-3 px-2 font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-2 text-foreground">Mar 25, 2025</td>
                <td className="py-3 px-2 text-foreground">Pro Plan - Monthly</td>
                <td className="py-3 px-2 text-right text-foreground">$29.00</td>
                <td className="py-3 px-2 text-right">
                  <Badge variant="default">Paid</Badge>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-2 text-foreground">Feb 25, 2025</td>
                <td className="py-3 px-2 text-foreground">Pro Plan - Monthly</td>
                <td className="py-3 px-2 text-right text-foreground">$29.00</td>
                <td className="py-3 px-2 text-right">
                  <Badge variant="default">Paid</Badge>
                </td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-2 text-foreground">Jan 25, 2025</td>
                <td className="py-3 px-2 text-foreground">Pro Plan - Monthly</td>
                <td className="py-3 px-2 text-right text-foreground">$29.00</td>
                <td className="py-3 px-2 text-right">
                  <Badge variant="default">Paid</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
