import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import pdfParse from 'pdf-parse'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const resumeFile = formData.get('resume') as File
    const jobDescription = formData.get('jobDescription') as string

    if (!resumeFile || !jobDescription) {
      return NextResponse.json({ message: 'Missing resume or job description' }, { status: 400 })
    }

    // Extract text from PDF
    const resumeBytes = await resumeFile.arrayBuffer()
    const pdfData = await pdfParse(Buffer.from(resumeBytes))
    const resumeText = pdfData.text

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
          content: `You are an expert resume analyzer. Always respond with valid JSON only. 
No markdown, no explanation, no code fences. Just raw JSON.`,
        },
        {
          role: 'user',
          content: `Analyze this resume against the job description and return a JSON object with this EXACT structure:
{
  "score": <number 0-100>,
  "scoreExplanation": "<2-3 sentence overall assessment of the match>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "keywords": {
    "matched": ["<keyword found in both resume and job description>", "..."],
    "missing": ["<important keyword from job description missing in resume>", "..."]
  },
  "improvedBullets": [
    {
      "original": "<an existing bullet point from the resume, copied verbatim>",
      "improved": "<a stronger, more impactful rewrite of that bullet using metrics and action verbs>"
    }
  ],
  "suggestions": [
    {
      "content": "<specific, actionable suggestion to improve the resume>",
      "priority": "<'high' | 'medium' | 'low'>"
    }
  ]
}

Rules:
- improvedBullets: pick the 3 weakest bullet points from the resume and rewrite them
- suggestions: provide at least 4 suggestions, assign priority based on impact
- keywords.missing: only include keywords that are genuinely important for the role
- score: be honest and calibrated; 75+ means strong match, 50-74 moderate, below 50 weak

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    })

    const text = completion.choices[0]?.message?.content ?? ''
    const clean = text.replace(/```json|```/g, '').trim()
    const analysis = JSON.parse(clean)

    // Attach metadata the Results page needs (not from LLM)
    analysis.resumeName = resumeFile.name
    analysis.analyzedAt = new Date().toISOString()

    return NextResponse.json(analysis)

  } catch (err: unknown) {
    console.error('Analyze error:', err)
    const message = err instanceof Error ? err.message : 'Analysis failed'
    return NextResponse.json({ message }, { status: 500 })
  }
}