import { NextResponse } from "next/server"

const SYSTEM_PROMPT = `You are writing entries for a business professional's pocket guide to AI called "The AI Phrasebook." The reader is intelligent and experienced but has no technical background. Voice: sharp, clear, occasionally funny, never condescending. Write like the smartest most useful colleague in the room. No em dashes anywhere. No filler phrases. Short sentences. Active voice.

Return only valid JSON with exactly these keys:

term: the term as provided
definition: two sentences maximum, plain English, no jargon explaining jargon
need_to_know: one paragraph, four to six sentences, building to a sharp final insight
say_this: one natural meeting-ready sentence that includes the term
not_this: one sentence where the speaker misapplies the term to their own human behavior with a deadpan parenthetical punchline — the term must appear in the sentence

No markdown, no backticks, no preamble. JSON only.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { term } = body

    if (!term || typeof term !== "string") {
      return NextResponse.json({ error: "Term is required" }, { status: 400 })
    }

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
        system: SYSTEM_PROMPT,
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
        const webhookBody = JSON.stringify({ term })
        const webhookHeaders = { "Content-Type": "application/json" }
        // Google Apps Script /exec always returns a 302, and standard fetch converts
        // POST→GET when following a 302. We follow the redirect manually to preserve POST.
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
