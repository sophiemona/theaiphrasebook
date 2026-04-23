"use client"

import { useState, useEffect } from "react"
import RoadmapClient, { type RoadmapItem } from "./RoadmapClient"
import IdeaForm from "@/components/IdeaForm"
import NavBar from "@/components/NavBar"
import type { Messages, Locale } from "@/lib/i18n"

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
  locale,
  messages: t,
}: {
  items: RoadmapItem[]
  fetchError: boolean
  locale: Locale
  messages: Messages
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
          title: t.share.native_title,
          text: t.share.native_text,
        })
      } catch {
        // user cancelled
      }
    } else {
      const subject = encodeURIComponent(t.share.email_subject)
      const body = encodeURIComponent(t.share.email_body)
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

  const a = t.about

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── 1. TOP BAR ───────────────────────────────────────────────────── */}
      <NavBar
        locale={locale}
        enUrl="/about"
        frUrl="/fr/about"
        leftHref={a.home_url}
        leftLabel={a.back}
        onShare={handleEmail}
        shareLabel={a.help}
        headerClassName="md:px-10"
      />

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
              {a.section_label}
            </p>
            <h1
              className="font-serif font-bold text-foreground mb-6"
              style={{ fontSize: "40px", lineHeight: "1.15" }}
            >
              {a.hero_line1}<br />
              {a.hero_line2}<br />
              {a.hero_line3_prefix}{" "}
              <em
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "#FFA51F",
                  textUnderlineOffset: "5px",
                  textDecorationThickness: "3px",
                  fontStyle: "italic",
                }}
              >
                {a.hero_line3_em}
              </em>
            </h1>
            <p className="font-serif italic text-[18px]" style={{ color: "#888888" }}>
              {a.hero_sub}
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
              {a.origin_label}
            </p>
            <p
              className="font-sans text-[16px] text-foreground mb-6"
              style={{ lineHeight: "1.75" }}
            >
              {a.origin_p1}
            </p>
            <p
              className="font-sans text-[16px] text-foreground mb-8"
              style={{ lineHeight: "1.75" }}
            >
              {a.origin_p2}
            </p>
            <p
              className="font-sans text-[16px] text-foreground"
              style={{ lineHeight: "1.75" }}
            >
              {a.origin_p3}
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
              {a.roadmap_label}
            </p>
            <h2
              className="font-serif font-bold text-foreground mb-4"
              style={{ fontSize: "32px", lineHeight: "1.2" }}
            >
              {a.roadmap_headline}{" "}
              <span className="italic border-b-[3px] border-accent">{a.roadmap_headline_em}</span>.
            </h2>
            <p className="font-sans text-[15px] text-muted-foreground leading-relaxed mb-8">
              {a.roadmap_sub}
            </p>
            <p className="font-sans text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
              {a.roadmap_title}
            </p>

            {fetchError ? (
              <div className="border-[0.5px] border-border p-6">
                <p className="font-sans text-[14px] text-muted-foreground">
                  {a.roadmap_error}
                </p>
              </div>
            ) : (
              <RoadmapClient items={items} />
            )}

            <IdeaForm messages={t.idea_form} />
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
            {a.cta_headline1}<br />
            {a.cta_headline2}{" "}
            <em style={{ textDecoration: "underline", textDecorationColor: "#FFA51F", textUnderlineOffset: "4px", textDecorationThickness: "2px" }}>
              {a.cta_headline2_em}
            </em>
          </h2>
          <p
            className="font-sans text-[14px] mb-8"
            style={{ color: "#888888" }}
          >
            {a.cta_sub}
          </p>
          <a
            href={a.home_url}
            className="inline-block font-sans font-bold text-[14px] text-foreground bg-transparent border border-border rounded-[6px] px-[18px] py-[7px] hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-colors"
          >
            {a.cta_button}
          </a>
        </section>

      </main>

      {/* ── 7. NEWSLETTER BAND (always English) ─────────────────────────────── */}
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
