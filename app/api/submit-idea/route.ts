import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, linkedin, idea } = await request.json()

    if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
      return NextResponse.json({ error: "First name is required" }, { status: 400 })
    }
    if (!lastName || typeof lastName !== "string" || !lastName.trim()) {
      return NextResponse.json({ error: "Last name is required" }, { status: 400 })
    }
    if (!idea || typeof idea !== "string" || !idea.trim()) {
      return NextResponse.json({ error: "Idea description is required" }, { status: 400 })
    }

    const scriptUrl = process.env.GOOGLE_IDEA_SCRIPT_URL
    if (!scriptUrl) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 })
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        linkedin: (linkedin ?? "").trim(),
        idea: idea.trim(),
      }),
    })

    if (!response.ok) {
      throw new Error(`Script responded with ${response.status}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Submit idea error:", error)
    return NextResponse.json({ error: "Failed to submit idea" }, { status: 500 })
  }
}
