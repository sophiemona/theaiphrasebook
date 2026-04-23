"use client"

import { useState } from "react"

const CLAUDE_CREDITS = [
  "written with Claude because it doesn't have opinions about the font",
  "built with Claude, who suggested gradients. twice.",
  "Claude did the typing. Sophie did the deleting.",
  "made with Claude (he's trying his best)",
  "powered by an AI that doesn't know what it doesn't know",
  "Claude helped. Ygor supervised.",
  "no AIs were hallucinated in the making of this site",
  "50% human. 50% Claude. 100% edited.",
  "AI-assisted. Human-approved. Dog-adjacent.",
  "Claude wrote this. I reviewed it. We don't talk about the first draft.",
]

export default function Footer() {
  const [claudeIndex, setClaudeIndex] = useState(0)

  return (
    <footer className="text-center py-6 bg-background">
      <p className="font-sans text-[11px] mb-1" style={{ color: "#CCCCCC" }}>
        © 2026 The AI Phrasebook · by Sophie Mona Pag&egrave;s
      </p>
      <button
        onClick={() => setClaudeIndex((prev) => (prev + 1) % CLAUDE_CREDITS.length)}
        aria-label="Cycle through Claude credits"
        className="font-sans text-[11px] bg-transparent border-0 p-0 cursor-pointer hover:underline underline-offset-2"
        style={{ color: "#CCCCCC" }}
      >
        {CLAUDE_CREDITS[claudeIndex]}
      </button>
    </footer>
  )
}
