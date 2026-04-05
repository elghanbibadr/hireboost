'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ArrowRight, Copy, RotateCcw } from 'lucide-react'

export default function Results() {
  const matchScore = 78
  const missingKeywords = [
    'Machine Learning',
    'Python',
    'AWS',
    'Data Pipeline',
    'TensorFlow',
    'ETL',
  ]

  const suggestions = [
    {
      original: 'Developed web applications',
      improved: 'Built scalable web applications using React and Node.js, resulting in 40% faster load times',
      category: 'Impact'
    },
    {
      original: 'Managed team of developers',
      improved: 'Led cross-functional team of 8 engineers, delivering 5 major features on-time and 20% under budget',
      category: 'Leadership'
    },
    {
      original: 'Improved system performance',
      improved: 'Optimized database queries and implemented caching strategy, reducing API response time by 60%',
      category: 'Achievement'
    },
    {
      original: 'Worked with cloud services',
      improved: 'Architected and deployed microservices on AWS, managing 99.99% uptime for production infrastructure',
      category: 'Technical'
    },
  ]

  const improvementBullets = [
    'Leverage the missing keywords naturally throughout your experience section',
    'Quantify achievements with specific metrics and percentages',
    'Use action verbs to start each bullet point',
    'Highlight technical skills that match the job description',
    'Keep bullets to 1-2 lines for better readability',
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Analysis Results
          </h1>
          <p className="text-foreground/70">
            Review your resume match and AI suggestions below
          </p>
        </div>

        {/* Match Score Card */}
        <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-2">Match Score</h2>
              <p className="text-foreground/70 mb-4">
                Your resume matches {matchScore}% of the key requirements for this position
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                  Strong Match
                </Badge>
                <Badge variant="outline">
                  Ready to Apply
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 rounded-full border-8 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary border-r-primary flex items-center justify-center" style={{
                  transform: `rotate(${(matchScore / 100) * 360 - 90}deg)`,
                  transformOrigin: 'center',
                  background: 'conic-gradient(#486db8 0deg, #486db8 ' + ((matchScore / 100) * 360) + 'deg, transparent ' + ((matchScore / 100) * 360) + 'deg)'
                }}>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background rounded-full">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{matchScore}%</div>
                    <p className="text-xs text-foreground/60">Match Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Missing Keywords */}
          <Card className="p-6 border border-border lg:col-span-1">
            <h3 className="text-xl font-bold text-foreground mb-4">Missing Keywords</h3>
            <p className="text-sm text-foreground/60 mb-4">
              Add these skills to improve your match score
            </p>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30">
                  + {keyword}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6 border border-border lg:col-span-2">
            <h3 className="text-xl font-bold text-foreground mb-6">Quick Analysis</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-foreground/70 mb-1">Experience Match</p>
                <p className="text-2xl font-bold text-primary">92%</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-foreground/70 mb-1">Skills Match</p>
                <p className="text-2xl font-bold text-primary">64%</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-foreground/70 mb-1">Keywords Found</p>
                <p className="text-2xl font-bold text-primary">18/24</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-foreground/70 mb-1">Impact Score</p>
                <p className="text-2xl font-bold text-primary">85%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bullet Point Improvements */}
        <Card className="p-8 mb-8 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground">Improved Bullet Points</h3>
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
          </div>
          <p className="text-foreground/70 mb-6">
            Replace your bullet points with these AI-improved versions to better match the job description
          </p>

          <div className="space-y-6">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="border border-border rounded-lg p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    {suggestion.category}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground/60 mb-1">ORIGINAL</p>
                    <p className="text-foreground/70 line-through">
                      {suggestion.original}
                    </p>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-semibold text-primary mb-1">IMPROVED</p>
                    <p className="text-foreground font-medium">
                      {suggestion.improved}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* General Suggestions */}
        <Card className="p-8 mb-8 border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-6">General Suggestions</h3>
          <ul className="space-y-4">
            {improvementBullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs text-primary font-bold">{index + 1}</span>
                </div>
                <p className="text-foreground/80 pt-1">{bullet}</p>
              </li>
            ))}
          </ul>
        </Card>

        {/* CTA Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-8 border border-border flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-bold text-foreground mb-2">Try Another Job</h4>
              <p className="text-foreground/70 mb-4">
                Test your resume against different job descriptions
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard" className="justify-center">
                <RotateCcw className="h-4 w-4 mr-2" />
                Run New Analysis
              </Link>
            </Button>
          </Card>

          <Card className="p-8 border border-primary/30 bg-primary/5 flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-bold text-foreground mb-2">Get Premium Features</h4>
              <p className="text-foreground/70 mb-4">
                Unlock unlimited analyses and advanced suggestions
              </p>
            </div>
            <Button asChild>
              <Link href="/pricing" className="justify-center">
                Upgrade to Pro <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
