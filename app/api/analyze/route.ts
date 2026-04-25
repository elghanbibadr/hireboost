import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import pdfParse from 'pdf-parse'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    // Auth check — guests allowed but get blurred results
    const { data: { user } } = await supabase.auth.getUser()

    // Credit gate for authenticated free users
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits, plan')
        .eq('id', user.id)
        .single()

      if (profile && profile.credits === 0) {
        return NextResponse.json(
          { message: 'No credits remaining. Upgrade to Pro for unlimited analyses.' },
          { status: 402 }
        )
      }
    }

    const formData       = await req.formData()
    const resumeFile     = formData.get('resume') as File
    const jobDescription = formData.get('jobDescription') as string

    if (!resumeFile || !jobDescription) {
      return NextResponse.json({ message: 'Missing resume or job description' }, { status: 400 })
    }

    const resumeBytes = await resumeFile.arrayBuffer()
    const pdfData     = await pdfParse(Buffer.from(resumeBytes))
    const resumeText  = pdfData.text

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { message: 'Could not extract text from PDF. Make sure it is not a scanned image.' },
        { status: 400 }
      )
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume analyzer. Always respond with valid JSON only. No markdown, no explanation, no code fences. Just raw JSON.',
        },
        {
          role: 'user',
          content: `Analyze this resume against the job description and return a JSON object with this EXACT structure:
{
  "score": <number 0-100>,
  "scoreExplanation": "<2-3 sentence overall assessment of the match>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "keywords": {
    "matched": ["<keyword found in both resume and job description>"],
    "missing": ["<important keyword from job description missing in resume>"]
  },
  "improvedBullets": [
    {
      "original": "<existing bullet point from resume verbatim>",
      "improved": "<stronger rewrite with metrics and action verbs>"
    }
  ],
  "suggestions": [
    { "content": "<specific actionable suggestion>", "priority": "<'high' | 'medium' | 'low'>" }
  ]
}
Rules: improvedBullets = 3 weakest bullets | suggestions = 4+ with priority | score: 75+ strong, 50-74 moderate, below 50 weak

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    })

    const raw      = completion.choices[0]?.message?.content ?? ''
    const clean    = raw.replace(/```json|```/g, '').trim()
    const analysis = JSON.parse(clean)

    analysis.resumeName    = resumeFile.name
    analysis.analyzedAt    = new Date().toISOString()
    analysis.authenticated = !!user

    if (user) {
      await Promise.all([
        supabase.from('analyses').insert({
          user_id:     user.id,
          resume_name: resumeFile.name,
          score:       analysis.score,
          result:      analysis,
        }),
        supabase.rpc('deduct_credit', { p_user_id: user.id }),
      ])
    }

    return NextResponse.json(analysis)

  } catch (err: unknown) {
    console.error('Analyze error:', err)
    const message = err instanceof Error ? err.message : 'Analysis failed'
    return NextResponse.json({ message }, { status: 500 })
  }
}