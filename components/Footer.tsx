"use client"

import { useState, useEffect } from "react"

const FOOTER_LINES = [
  "written with Claude because nobody wanted to do this job",
  "written with Claude because humans were taking too long",
  "written with Claude because it never tells me to \"circle back\"",
  "written with Claude because humans charge by the hour",
  "written with Claude because consensus produces nothing",
  "written with Claude because it doesn't have opinions about the font",
  "written with Claude because a committee would still be talking",
  "written with Claude because consultants would have called it a journey",
  "written with Claude because explaining AI with AI felt honest",
  "written with Claude because someone had to finish this",
]

export default function Footer() {
  const [footerLine, setFooterLine] = useState("")

  useEffect(() => {
    setFooterLine(FOOTER_LINES[Math.floor(Math.random() * FOOTER_LINES.length)])
  }, [])

  const handleEmail = () => {
    const subject = encodeURIComponent("Next time someone says RAG in a meeting")
    const body = encodeURIComponent(
      "Have you seen this?\n\nIt's a free tool that explains AI terms in plain English.\n\nhttps://www.theaiphrasebook.com"
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <footer className="border-t-[0.5px] border-border">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left — share */}
        <div className="flex flex-col items-start gap-2">
          <p className="font-sans text-[12px] text-muted-foreground">Know someone who&apos;d want that?</p>
          <button
            onClick={handleEmail}
            className="bg-foreground text-background font-sans font-bold text-[13px] px-5 py-2.5 hover:bg-accent hover:text-foreground transition-colors"
          >
            Help a colleague in need
          </button>
        </div>

        {/* Right — credits */}
        <div className="flex flex-col items-start md:items-end gap-1">
          <p className="font-serif italic text-[13px] text-foreground">by Sophie Mona Pagès</p>
          <p className="font-sans text-[11px] text-muted-foreground">{footerLine}</p>
          <p className="font-sans text-[11px] text-muted-foreground">© 2026 The AI Phrasebook</p>
        </div>
      </div>
    </footer>
  )
}
