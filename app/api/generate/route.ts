import { NextResponse } from "next/server"

const SYSTEM_PROMPT = `You are writing entries for a business professional's pocket guide to AI called "The AI Phrasebook." The reader is intelligent and experienced but has no technical background. Voice: sharp, clear, occasionally funny, never condescending. Write like the smartest most useful colleague in the room. No em dashes anywhere. No filler phrases. Short sentences. Active voice.

Return only valid JSON with exactly these keys:

term: the term as provided
definition: two sentences maximum, plain English, no jargon explaining jargon
need_to_know: one paragraph, four to six sentences, building to a sharp final insight
say_this: one natural meeting-ready sentence that includes the term
not_this: one sentence where the speaker misapplies the term to their own human behavior with a deadpan parenthetical punchline -- the term must appear in the sentence

No markdown, no backticks, no preamble. JSON only.`

const FRENCH_PROMPT_SUFFIX = `

Write this entry entirely in French. The reader is a French business professional -- intelligent, experienced, no technical background. Match the voice of the book exactly: sharp, direct, occasionally dry, never condescending. Write as if the book was originally written in French, not translated. Natural French phrasing throughout. The "say_this" and "not_this" examples should be sentences a French professional would actually say in a meeting -- fluent, grounded, not awkward. No em dashes. Sentence case.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { term, locale } = body

    if (!term || typeof term !== "string") {
      return NextResponse.json({ error: "Term is required" }, { status: 400 })
    }

    const isFrench = locale === "fr"
    const systemPrompt = isFrench ? SYSTEM_PROMPT + FRENCH_PROMPT_SUFFIX : SYSTEM_PROMPT

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: `Now write the entry for: ${term}` }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("Anthropic error:", err)
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.content.find((b: any) => b.type === "text")?.text
    if (!text) throw new Error("No text in response")

    const clean = text.replace(/```json|```/g, "").trim()
    const entry = JSON.parse(clean)

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK
    if (webhookUrl) {
      try {
        const webhookBody = JSON.stringify({ term, locale: locale ?? "en" })
        const webhookHeaders = { "Content-Type": "application/json" }
        const redirect = await fetch(webhookUrl, {
          method: "POST",
          headers: webhookHeaders,
          body: webhookBody,
          redirect: "manual",
        })
        const target = redirect.headers.get("location") ?? webhookUrl
        await fetch(target, {
          method: "POST",
          headers: webhookHeaders,
          body: webhookBody,
        })
      } catch (err) {
        console.error("Webhook error:", err)
      }
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error("Error generating entry:", error)
    return NextResponse.json({ error: "Failed to generate entry" }, { status: 500 })
  }
}
