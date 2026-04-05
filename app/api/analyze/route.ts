// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import pdfParse from 'pdf-parse'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    // ── 1. Parse the multipart form data ──────────────────────────────────
    const formData = await req.formData()
    const resumeFile = formData.get('resume') as File | null
    const jobDescription = formData.get('jobDescription') as string | null

    if (!resumeFile || !jobDescription) {
      return NextResponse.json(
        { message: 'Resume file and job description are required.' },
        { status: 400 }
      )
    }

    // ── 2. Extract text from the PDF ───────────────────────────────────────
    const arrayBuffer = await resumeFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let cvText = ''
    try {
      const parsed = await pdfParse(buffer)
      cvText = parsed.text?.trim()
    } catch {
      return NextResponse.json(
        { message: 'Could not read PDF. Make sure it is a text-based PDF, not a scanned image.' },
        { status: 422 }
      )
    }

    if (!cvText || cvText.length < 50) {
      return NextResponse.json(
        { message: 'Could not extract enough text from your PDF. Try a different version of your resume.' },
        { status: 422 }
      )
    }

    // ── 3. Build the AI prompt ─────────────────────────────────────────────
    const prompt = `You are an expert resume coach and ATS (Applicant Tracking System) specialist.

Analyze the following CV against the job description and respond with ONLY a valid JSON object — no explanation, no markdown, no backticks.

CV:
${cvText}

Job Description:
${jobDescription}

Return this exact JSON structure:
{
  "score": <integer 0-100 representing how well the CV matches the job>,
  "scoreExplanation": "<2 sentences explaining the score>",
  "missingKeywords": [
    { "keyword": "<skill or keyword>", "importance": "high" | "medium" | "low" }
  ],
  "improvedBullets": [
    { "original": "<original bullet from CV>", "improved": "<AI-improved version>" }
  ],
  "suggestions": [
    { "content": "<actionable suggestion>", "priority": "high" | "medium" | "low" }
  ],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"]
}

Rules:
- score: be realistic and strict. 70+ means genuinely strong match.
- missingKeywords: list 5-10 important keywords/skills from the job description not found in the CV.
- improvedBullets: pick 3-5 weak bullet points from the CV and rewrite them to be stronger (quantified, action-verb led, relevant).
- suggestions: give 4-6 specific, actionable suggestions. Be direct and concrete.
- strengths: list 3 things the candidate does well that match this job.
- Respond ONLY with the JSON. No other text.`

    // ── 4. Call Claude API ─────────────────────────────────────────────────
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawContent = message.content[0]
    if (rawContent.type !== 'text') {
      throw new Error('Unexpected response type from AI')
    }

    // ── 5. Parse and validate the JSON response ────────────────────────────
    let analysis
    try {
      // Strip any accidental markdown fences if present
      const cleaned = rawContent.text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      analysis = JSON.parse(cleaned)
    } catch {
      console.error('Failed to parse AI response:', rawContent.text)
      throw new Error('AI returned an invalid response format.')
    }

    // Basic validation
    if (
      typeof analysis.score !== 'number' ||
      !Array.isArray(analysis.missingKeywords) ||
      !Array.isArray(analysis.improvedBullets) ||
      !Array.isArray(analysis.suggestions)
    ) {
      throw new Error('AI response is missing required fields.')
    }

    // ── 6. Return the result ───────────────────────────────────────────────
    return NextResponse.json(analysis, { status: 200 })

  } catch (err: unknown) {
    console.error('[/api/analyze] Error:', err)
    const message = err instanceof Error ? err.message : 'Unexpected server error.'
    return NextResponse.json({ message }, { status: 500 })
  }
}

// Allow larger payloads for PDF uploads (default is 4MB in Next.js)
export const config = {
  api: {
    bodyParser: false,
  },
}