"use client"

import { useState, useEffect } from "react"
import RoadmapClient, { type RoadmapItem } from "./RoadmapClient"
import IdeaForm from "@/components/IdeaForm"

// ─── data ────────────────────────────────────────────────────────────────────

const CLAUDE_CREDITS = [
  "written with Claude because it doesn't have opinions about the font.",
  "built with Claude, who suggested gradients. twice.",
  "Claude did the typing. Sophie did the deleting.",
  "made with Claude (he's trying his best).",
  "powered by an AI that doesn't know what it doesn't know.",
  "Claude helped. Ygor supervised.",
  "no AIs were hallucinated in the making of this site.",
  "50% human. 50% Claude. 100% edited.",
  "AI-assisted. Human-approved. Dog-adjacent.",
  "Claude wrote this. I reviewed it. We don't talk about the first draft.",
]

// ─── component ───────────────────────────────────────────────────────────────

export default function AboutClient({
  items,
  fetchError,
}: {
  items: RoadmapItem[]
  fetchError: boolean
}) {
  const [emailInput, setEmailInput] = useState("")
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [claudeIndex, setClaudeIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleEmail = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "The AI Phrasebook",
          text: "Have you seen this?\n\nIt's a free tool that explains AI terms in plain English.\n\nhttps://www.theaiphrasebook.com",
        })
      } catch {
        // user cancelled
      }
    } else {
      const subject = encodeURIComponent("Next time someone says RAG in a meeting")
      const body = encodeURIComponent(
        "Have you seen this?\n\nIt's a free tool that explains AI terms in plain English.\n\nhttps://www.theaiphrasebook.com"
      )
      window.location.href = `mailto:?subject=${subject}&body=${body}`
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput.trim()) return
    setEmailSubmitting(true)
    setEmailError(null)
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      })
      if (!response.ok) throw new Error("Failed")
      setEmailSubmitted(true)
    } catch {
      setEmailError("Something went wrong. Please try again.")
    } finally {
      setEmailSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── 1. TOP BAR ───────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 md:px-10 py-4">
        <a
          href="/"
          className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline py-3 -my-3 px-1"
        >
          ← Back to the AI Phrasebook
        </a>
        <button
          onClick={handleEmail}
          className="bg-transparent border border-border rounded-[6px] font-sans font-bold text-[14px] text-foreground px-[18px] py-[7px] hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-colors cursor-pointer"
        >
          Help a colleague in need
        </button>
      </header>

      <main className="flex-1">

        {/* ── 2. HERO ──────────────────────────────────────────────────────── */}
        <section
          className="border-b-[0.5px] border-border"
          style={{ paddingTop: "56px", paddingBottom: "48px" }}
        >
          <div className="mx-auto px-5 md:px-[40px]" style={{ maxWidth: "768px" }}>
            <p
              className="font-sans font-bold text-[11px] uppercase tracking-widest mb-5"
              style={{ color: "#888888" }}
            >
              ABOUT
            </p>
            <h1
              className="font-serif font-bold text-foreground mb-6"
              style={{ fontSize: "40px", lineHeight: "1.15" }}
            >
              One meeting.<br />
              Full impostor syndrome.<br />
              I went home and built{" "}
              <em
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "#FFA51F",
                  textUnderlineOffset: "5px",
                  textDecorationThickness: "3px",
                  fontStyle: "italic",
                }}
              >
                this.
              </em>
            </h1>
            <p className="font-serif italic text-[18px]" style={{ color: "#888888" }}>
              Keep reading. The project is open. You can be part of it.
            </p>
          </div>
        </section>

        {/* ── 3. ORIGIN STORY ──────────────────────────────────────────────── */}
        <section style={{ padding: "40px 0" }}>
          <div className="mx-auto px-5 md:px-[40px]" style={{ maxWidth: "768px" }}>
            <p
              className="font-sans font-bold text-[11px] uppercase tracking-widest mb-8"
              style={{ color: "#DDDDDD" }}
            >
              THE ORIGIN STORY
            </p>
            <p
              className="font-sans text-[16px] text-foreground mb-6"
              style={{ lineHeight: "1.75" }}
            >
              I work in AI transformation for a CAC40 company. A lot of meetings. A lot of AI words. For a while, I nodded along with everyone else.
            </p>
            <p
              className="font-sans text-[16px] text-foreground mb-8"
              style={{ lineHeight: "1.75" }}
            >
              One day I asked Claude: what are the 10 terms I actually need? Then: give me one sentence for each, natural enough to say in a meeting.
            </p>


            <p
              className="font-sans text-[16px] text-foreground"
              style={{ lineHeight: "1.75" }}
            >
              The result became a personal cheat sheet, then -- because I was looking for the perfect excuse to try Claude Code -- this.
            </p>
          </div>
        </section>

        {/* ── 4. ROADMAP SECTION ───────────────────────────────────────────── */}
        <section
          className="border-t-[0.5px] border-border"
          style={{ padding: "40px 0" }}
        >
          <div className="mx-auto px-5 md:px-[40px]" style={{ maxWidth: "768px" }}>
            <p className="font-sans text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
              New features we&apos;re working on
            </p>
            <h2
              className="font-serif font-bold text-foreground mb-4"
              style={{ fontSize: "32px", lineHeight: "1.2" }}
            >
              Built in public, shaped by{" "}
              <span className="italic border-b-[3px] border-accent">you</span>.
            </h2>
            <p className="font-sans text-[15px] text-muted-foreground leading-relaxed mb-8">
              Every item on this list came from a real conversation. Mostly with humans.
            </p>
            <p className="font-sans text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
              The AI Phrasebook Roadmap
            </p>

            {fetchError ? (
              <div className="border-[0.5px] border-border p-6">
                <p className="font-sans text-[14px] text-muted-foreground">
                  Could not load roadmap data. Please try again later.
                </p>
              </div>
            ) : (
              <RoadmapClient items={items} />
            )}

            {/* ── 5. FEATURE REQUEST FORM (component owns its own section wrapper) */}
            <IdeaForm />
          </div>
        </section>

        {/* ── 6. CTA SECTION ───────────────────────────────────────────────── */}
        <section
          className="text-center"
          style={{
            borderTop: "0.5px solid #DDDDDD",
            borderBottom: "0.5px solid #DDDDDD",
            padding: "48px 40px",
          }}
        >
          <h2
            className="font-serif font-bold text-foreground mb-4"
            style={{ fontSize: "26px", lineHeight: "1.3" }}
          >
            Enough backstage.<br />
            Go look something <em>up.</em>
          </h2>
          <p
            className="font-sans text-[14px] mb-8"
            style={{ color: "#888888" }}
          >
            Your IT department called. It&apos;s the only shadow AI they tolerate.
          </p>
          <a
            href="/"
            className="inline-block font-sans font-bold text-[14px] text-foreground bg-transparent border border-border rounded-[6px] px-[18px] py-[7px] hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-colors"
          >
            Back to the AI Phrasebook
          </a>
        </section>

      </main>

      {/* ── 7. NEWSLETTER BAND ───────────────────────────────────────────────── */}
      <section
        aria-label="The Monday Series newsletter"
        className="text-center px-6 py-12 bg-surface"
        style={{ borderTop: "0.5px solid #DDDDDD" }}
      >
        <p className="font-sans font-bold text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
          THE MONDAY SERIES
        </p>
        <h2 className="font-serif font-bold text-[20px] text-foreground mb-4">
          One term. Every <em>Monday</em>.
        </h2>
        <p
          className="font-sans text-[14px] text-muted-foreground mx-auto mb-6"
          style={{ maxWidth: "400px" }}
        >
          Edited by humans, ready to use. The version we&apos;d print, if printing things about AI weren&apos;t a little bit tragic.
        </p>

        {emailSubmitted ? (
          <p className="font-sans text-[14px] text-foreground">
            You&apos;re in. See you Monday.
          </p>
        ) : (
          <form
            onSubmit={handleEmailSubmit}
            aria-label="Subscribe to the Monday Series newsletter"
            className="flex gap-2 mx-auto"
            style={{ maxWidth: "360px" }}
          >
            <label htmlFor="about-newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="about-newsletter-email"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
              className="flex-1 font-sans bg-background outline-none focus:border-[#AAAAAA] transition-colors"
              style={{
                border: "0.5px solid #DDDDDD",
                borderRadius: "6px",
                fontSize: "15px",
                padding: "7px 14px",
              }}
            />
            <button
              type="submit"
              disabled={emailSubmitting}
              className="font-sans font-bold text-[14px] text-white bg-foreground border-0 rounded-[6px] px-[18px] py-[7px] hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {emailSubmitting ? "Sending..." : "Subscribe"}
            </button>
          </form>
        )}
        {emailError && (
          <p role="alert" className="font-sans text-[12px] text-muted-foreground mt-2">
            {emailError}
          </p>
        )}
      </section>

      {/* ── 8. FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="text-center py-6 bg-background">
        <p className="font-sans text-[11px] mb-1" style={{ color: "#CCCCCC" }}>
          © 2026 The AI Phrasebook · by{" "}
          <a
            href="https://www.linkedin.com/in/sophspages/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-2"
            style={{ color: "#CCCCCC" }}
          >
            Sophie Mona Pag&egrave;s
          </a>
        </p>
        {mounted && (
          <button
            onClick={() => setClaudeIndex((prev) => (prev + 1) % CLAUDE_CREDITS.length)}
            aria-label="Cycle through Claude credits"
            className="font-sans text-[11px] bg-transparent border-0 p-0 cursor-pointer hover:underline underline-offset-2"
            style={{ color: "#CCCCCC" }}
          >
            {CLAUDE_CREDITS[claudeIndex]}
          </button>
        )}
      </footer>

    </div>
  )
}
