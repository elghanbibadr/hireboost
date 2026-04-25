'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CheckCircle2, Zap, BarChart3, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="outline" className="mb-4">Powered by AI</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Optimize your resume with AI and land more interviews
            </h1>
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
              Get instant analysis, discover missing keywords, and receive AI-powered suggestions to make your resume stand out to recruiters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-base">
                <Link href="/analyse">
                  Analyze My Resume <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
            <p className="text-sm text-foreground/60 mt-6">No credit card required • Free tier available</p>
          </div>
          
          <div className="hidden md:flex items-center justify-center">
            <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-border flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">85%</div>
                <p className="text-foreground/70">Average Match Score Improvement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to optimize your resume
            </h2>
            <p className="text-lg text-foreground/70">Powerful AI-driven tools to help you stand out</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border border-border bg-background hover:shadow-lg transition">
              <Zap className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Instant Analysis</h3>
              <p className="text-foreground/70">
                Get a comprehensive match score against any job description in seconds.
              </p>
            </Card>
            
            <Card className="p-8 border border-border bg-background hover:shadow-lg transition">
              <BarChart3 className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Missing Keywords</h3>
              <p className="text-foreground/70">
                Identify critical keywords and phrases you're missing to pass ATS screening.
              </p>
            </Card>
            
            <Card className="p-8 border border-border bg-background hover:shadow-lg transition">
              <CheckCircle2 className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Smart Suggestions</h3>
              <p className="text-foreground/70">
                Get AI-powered suggestions to improve your bullet points and descriptions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Process</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How it works
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Upload Your Resume', description: 'Share your resume in PDF format' },
            { step: '02', title: 'Paste Job Description', description: 'Copy and paste the job description you&apos;re targeting' },
            { step: '03', title: 'Get Results', description: 'Receive instant AI analysis and actionable improvements' },
          ].map((item) => (
            <div key={item.step} className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">{item.step}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-foreground/70">{item.description}</p>
              {/* Arrow divider for desktop */}
              {item.step !== '03' && (
                <div className="hidden md:block absolute -right-4 top-6 w-8 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 border-t border-b border-border py-16 my-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to land your dream job?
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Start optimizing your resume with AI today. It takes just 2 minutes.
          </p>
          <Button size="lg" asChild>
            <Link href="/dashboard">Get Started Free</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
