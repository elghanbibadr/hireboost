'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Check, ArrowRight } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect to get started',
      features: [
        'Up to 3 resume analyses per month',
        'Basic match score',
        'Missing keywords identification',
        'Email support',
        'Basic suggestions',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      description: 'For serious job seekers',
      features: [
        'Unlimited resume analyses',
        'Advanced match scoring',
        'Detailed keyword analysis',
        'AI-powered bullet improvements',
        'Priority email support',
        'Export to PDF',
        'Resume templates',
        'Job matching tracker',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team management',
        'Candidate tracking',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'Single sign-on',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  const faqs = [
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. No contracts or cancellation fees.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and wire transfers for enterprise plans.',
    },
    {
      question: 'Is there a free trial for Pro?',
      answer: 'Yes, all Pro accounts include a 14-day free trial. No credit card required.',
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Absolutely. You can change your plan at any time, and we&apos;ll adjust your billing accordingly.',
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Choose the perfect plan for your job search. All plans come with a 14-day free trial.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`p-8 relative transition ${
                  plan.highlighted
                    ? 'border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg md:scale-105'
                    : 'border-border'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white">Most Popular</Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-sm text-foreground/60 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-foreground/60">/{plan.period}</span>}
                  </div>
                </div>

                <Button className="w-full mb-8" size="lg" variant={plan.highlighted ? 'default' : 'outline'} asChild>
                  <Link href="/signup">{plan.cta}</Link>
                </Button>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-foreground/70">What&apos;s included:</p>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-card/30 py-20 border-t border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Frequently asked questions</h2>
              <p className="text-foreground/70">
                Have questions? We&apos;ve got answers. Can&apos;t find what you&apos;re looking for? Contact our support team.
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6 border border-border">
                  <h4 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h4>
                  <p className="text-foreground/70">{faq.answer}</p>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-foreground/70 mb-4">Still have questions?</p>
              <Button variant="outline" asChild>
                <a href="mailto:support@hireboost.io" className="justify-center">
                  Contact Our Support Team
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary/5 border-t border-border py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Ready to optimize your resume?
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              Start with the free plan, no credit card required.
            </p>
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
