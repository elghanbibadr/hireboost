'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Upload, FileText, Loader2 } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setResumeFile(file)
    } else {
      alert('Please upload a PDF file')
    }
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resumeFile || !jobDescription.trim()) {
      alert('Please upload a resume and paste a job description')
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      router.push('/results')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Analyze Your Resume
          </h1>
          <p className="text-foreground/70">
            Upload your resume and paste a job description to get instant AI analysis
          </p>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-8">
          {/* Resume Upload */}
          <Card className="p-8 border-2 border-dashed border-border hover:border-primary/50 transition">
            <label className="cursor-pointer">
              <div className="flex flex-col items-center justify-center py-12">
                {resumeFile ? (
                  <>
                    <FileText className="h-12 w-12 text-primary mb-4" />
                    <p className="text-lg font-semibold text-foreground mb-1">
                      {resumeFile.name}
                    </p>
                    <p className="text-sm text-foreground/60 mb-4">
                      {(resumeFile.size / 1024).toFixed(2)} KB
                    </p>
                    <Button type="button" variant="outline" size="sm" asChild>
                      <label className="cursor-pointer">
                        Change File
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </Button>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-primary mb-4" />
                    <p className="text-lg font-semibold text-foreground mb-2">
                      Drag and drop your resume
                    </p>
                    <p className="text-sm text-foreground/60 mb-4">
                      or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" asChild>
                      <label className="cursor-pointer">
                        Upload PDF
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </Button>
                  </>
                )}
              </div>
            </label>
          </Card>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent resize-none"
              rows={10}
            />
            <p className="text-xs text-foreground/60 mt-2">
              Copy and paste the complete job description you&apos;re targeting
            </p>
          </div>

          {/* Tips */}
          <Card className="p-4 bg-primary/5 border border-border">
            <h4 className="font-semibold text-foreground mb-2">Tips for best results:</h4>
            <ul className="space-y-1 text-sm text-foreground/70">
              <li>• Use a PDF version of your resume</li>
              <li>• Include the complete job description</li>
              <li>• Make sure your resume is properly formatted</li>
            </ul>
          </Card>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading || !resumeFile || !jobDescription.trim()}
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Resume'
            )}
          </Button>

          <p className="text-center text-sm text-foreground/60">
            or{' '}
            <Link href="/" className="text-primary hover:underline">
              go back home
            </Link>
          </p>
        </form>
      </main>

      <Footer />
    </div>
  )
}
