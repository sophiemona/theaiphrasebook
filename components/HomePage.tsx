"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Messages, Locale } from "@/lib/i18n"

// ─── data ────────────────────────────────────────────────────────────────────

const CHAPTER_MAPPING: Record<string, string> = {
  "artificial intelligence": "The Landscape - Chapter 1",
  "ai": "The Landscape - Chapter 1",
  "machine learning": "The Landscape - Chapter 1",
  "ml": "The Landscape - Chapter 1",
  "generative ai": "The Landscape - Chapter 1",
  "large language model": "The Landscape - Chapter 1",
  "llm": "The Landscape - Chapter 1",
  "foundation model": "The Landscape - Chapter 1",
  "prompt": "How It Thinks - Chapter 2",
  "prompt engineering": "How It Thinks - Chapter 2",
  "token": "How It Thinks - Chapter 2",
  "context window": "How It Thinks - Chapter 2",
  "hallucination": "How It Thinks - Chapter 2",
  "training data": "How It\u2019s Built & Shaped - Chapter 3",
  "fine-tuning": "How It\u2019s Built & Shaped - Chapter 3",
  "finetuning": "How It\u2019s Built & Shaped - Chapter 3",
  "rag": "How It\u2019s Built & Shaped - Chapter 3",
  "retrieval-augmented generation": "How It\u2019s Built & Shaped - Chapter 3",
  "multimodal": "How It\u2019s Built & Shaped - Chapter 3",
  "api": "How It\u2019s Built & Shaped - Chapter 3",
  "ai agent": "How It Gets Deployed - Chapter 4",
  "agentic workflow": "How It Gets Deployed - Chapter 4",
  "copilot": "How It Gets Deployed - Chapter 4",
  "automation vs. augmentation": "How It Gets Deployed - Chapter 4",
  "use case": "How It Gets Deployed - Chapter 4",
  "ai bias": "The Risks & Guardrails - Chapter 5",
  "shadow ai": "The Risks & Guardrails - Chapter 5",
  "guardrails": "The Risks & Guardrails - Chapter 5",
  "human-in-the-loop": "The Risks & Guardrails - Chapter 5",
  "responsible ai": "The Risks & Guardrails - Chapter 5",
  "ai governance": "The Business Layer - Chapter 6",
  "ai literacy": "The Business Layer - Chapter 6",
  "benchmark": "The Business Layer - Chapter 6",
  "pilot": "The Business Layer - Chapter 6",
  "roi of ai": "The Business Layer - Chapter 6",
}

const SURPRISE_TERMS = [
  "Hallucination", "Prompt Engineering", "AI Agent", "Agentic Workflow",
  "RAG", "Copilot", "AI Governance", "AI Bias", "Shadow AI", "Guardrails",
  "Human-in-the-Loop", "Responsible AI", "AI Literacy", "Benchmark", "Pilot",
  "Large Language Model", "Foundation Model", "Generative AI", "Machine Learning",
  "Fine-Tuning", "Multimodal", "API", "Token", "Context Window", "Training Data",
  "Use Case", "Artificial Intelligence",
]

// ─── types ───────────────────────────────────────────────────────────────────

interface EntryData {
  term: string
  definition: string
  need_to_know: string
  say_this: string
  not_this: string
  chapter: string
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function getRawChapter(term: string): string {
  const normalized = term.toLowerCase().trim()
  return CHAPTER_MAPPING[normalized] || "The AI Phrasebook"
}

// ─── LanguageToggle ──────────────────────────────────────────────────────────

function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter()

  return (
    <div
      className="flex items-center rounded-full"
      style={{
        background: "#F0EFEB",
        border: "0.5px solid #DDDDDD",
      }}
    >
      <button
        onClick={() => router.push("/")}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
        className="flex items-center justify-center w-8 h-8 rounded-full font-sans text-[13px] transition-colors cursor-pointer border-0"
        style={{
          background: locale === "en" ? "#1A1A1A" : "transparent",
        }}
      >
        🇬🇧
      </button>
      <button
        onClick={() => router.push("/fr")}
        aria-label="Passer en français"
        aria-pressed={locale === "fr"}
        className="flex items-center justify-center w-8 h-8 rounded-full font-sans text-[13px] transition-colors cursor-pointer border-0"
        style={{
          background: locale === "fr" ? "#1A1A1A" : "transparent",
        }}
      >
        🇫🇷
      </button>
    </div>
  )
}

// ─── LoadingSequence ─────────────────────────────────────────────────────────

function LoadingSequence({ messages }: { messages: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1
        if (next >= messages.length) return 0
        return next
      })
    }, 900)
    return () => clearInterval(interval)
  }, [messages])

  const start = Math.max(0, currentIndex - 4)
  const visible = messages.slice(start, currentIndex + 1)

  return (
    <div className="py-16 px-2 w-full">
      <div className="flex flex-col gap-2 items-center text-center">
        {visible.map((msg, i) => {
          const isLatest = i === visible.length - 1
          return (
            <p
              key={start + i}
              className="font-sans text-[14px] leading-relaxed transition-opacity duration-500"
              style={{
                color: isLatest ? "#1A1A1A" : "#888888",
                opacity: isLatest ? 1 : 0.5 + (i / visible.length) * 0.4,
              }}
            >
              {msg}
            </p>
          )
        })}
      </div>
    </div>
  )
}

// ─── HomePage ────────────────────────────────────────────────────────────────

interface HomePageProps {
  locale: Locale
  messages: Messages
}

export default function HomePage({ locale, messages: t }: HomePageProps) {
  const [term, setTerm] = useState("")
  const [entry, setEntry] = useState<EntryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailInput, setEmailInput] = useState("")
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [claudeIndex, setClaudeIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const entryRef = useRef<HTMLElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (entry && entryRef.current) {
      entryRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [entry])

  const translateChapter = (raw: string): string => {
    return t.chapters[raw] ?? raw
  }

  const generateEntry = async (termToGenerate: string) => {
    if (!termToGenerate.trim()) return
    setLoading(true)
    setError(null)
    setEntry(null)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: termToGenerate.trim(), locale }),
      })
      if (!response.ok) throw new Error("Failed to generate entry")
      const data = await response.json()
      setEntry({ ...data, chapter: translateChapter(getRawChapter(termToGenerate)) })
    } catch {
      setError(t.errors.generate_failed)
    } finally {
      setLoading(false)
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
      setEmailError(t.newsletter.error)
    } finally {
      setEmailSubmitting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    generateEntry(term)
  }

  const handleSurprise = () => {
    const randomTerm = SURPRISE_TERMS[Math.floor(Math.random() * SURPRISE_TERMS.length)]
    setTerm(randomTerm)
    generateEntry(randomTerm)
  }

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

  const hasResults = loading || !!entry || !!error

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* Screen-reader live region — client-only to avoid hydration mismatch */}
      {mounted && (
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {loading && t.sr.loading}
          {entry && !loading && t.sr.ready.replace("{term}", entry.term)}
        </div>
      )}

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header className="grid grid-cols-3 items-center px-6 py-4">
        <a
          href="/about"
          className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline py-3 -my-3 px-1"
        >
          {t.nav.about}
        </a>

        <div className="flex justify-center">
          <LanguageToggle locale={locale} />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleEmail}
            className="bg-transparent border border-border rounded-[6px] font-sans font-bold text-[14px] text-foreground px-[18px] py-[7px] hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-colors cursor-pointer"
          >
            {t.nav.help}
          </button>
        </div>
      </header>

      {/* ── Center ───────────────────────────────────────────────────────── */}
      <main
        aria-label={t.sr.page_aria}
        className="flex-1 flex flex-col items-center px-4 pb-12"
      >
        {/* Top spacer: grows when no results, collapses when results appear */}
        <div className={hasResults ? "h-12 shrink-0" : "flex-1"} />

        <div className="w-full" style={{ maxWidth: "480px" }}>

          {/* Logo */}
          <div className="flex justify-center mb-2">
            <span className="font-sans font-bold text-[26px] text-foreground bg-logo-bar px-[14px] py-[6px]">
              The AI Phrasebook
            </span>
          </div>

          {/* Tagline */}
          <p
            className="font-sans text-[19px] text-center mb-8"
            style={{ color: "#888888" }}
          >
            {t.hero.tagline_prefix}{" "}
            <span
              className="underline decoration-2 underline-offset-2"
              style={{ textDecorationColor: "#FFA51F" }}
            >
              {t.hero.tagline_suffix}
            </span>
          </p>

          {/* Search + buttons */}
          <form
            onSubmit={handleSubmit}
            role="search"
            aria-label={t.search.form_aria}
          >
            <label htmlFor="term-search" className="sr-only">
              {t.search.label}
            </label>

            <div className="relative mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
                className="absolute pointer-events-none text-muted-foreground"
                style={{
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "16px",
                  height: "16px",
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                ref={searchRef}
                id="term-search"
                type="text"
                name="term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder=""
                autoComplete="off"
                className="w-full font-sans rounded-[24px] border border-border bg-white text-[16px] outline-none hover:border-[#AAAAAA] focus:border-[#AAAAAA] focus:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-colors"
                style={{ padding: "14px 20px 14px 44px" }}
              />
            </div>

            <div className="flex justify-center gap-[10px]">
              <button
                type="submit"
                className="font-sans font-bold text-[14px] text-foreground bg-accent rounded-[6px] border-0 px-[22px] py-[7px] hover:bg-[#f09800] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-colors cursor-pointer"
              >
                {t.search.look_it_up}
              </button>
              <button
                type="button"
                onClick={handleSurprise}
                aria-label={t.search.surprise_aria}
                className="font-sans font-bold text-[14px] text-foreground bg-transparent border border-border rounded-[6px] px-[18px] py-[7px] hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-colors cursor-pointer"
              >
                {t.search.surprise_me}
              </button>
            </div>
          </form>

          {/* Loading */}
          {loading && (
            <div role="status">
              <LoadingSequence messages={t.loading} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-8 border border-border rounded-[6px] p-6"
            >
              <p className="font-sans text-[14px] text-foreground">{error}</p>
            </div>
          )}

          {/* Entry card */}
          {entry && !loading && (
            <section
              ref={entryRef}
              aria-label={`Definition: ${entry.term}`}
              className="mt-8 bg-card border-[0.5px] border-border p-6 md:p-8"
            >
              <div className="mb-4">
                <span className="inline-block bg-foreground text-background font-sans font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full">
                  {entry.chapter}
                </span>
              </div>

              <h2 className="font-serif font-bold italic text-[32px] md:text-[36px] text-foreground mb-4">
                {entry.term}
              </h2>

              <hr className="border-t-[0.5px] border-border mb-6" />

              <div className="mb-8">
                <p className="font-sans font-bold text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
                  {t.entry.nutshell}
                </p>
                <p className="font-serif italic text-[14px] text-foreground leading-relaxed">
                  {entry.definition}
                </p>
              </div>

              <div className="mb-8">
                <p className="font-sans font-bold text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
                  {t.entry.need_to_know}
                </p>
                <p className="font-sans text-[15px] text-foreground leading-relaxed">
                  {entry.need_to_know}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <span className="inline-block bg-logo-bar text-foreground font-sans font-bold text-[11px] px-2.5 py-1 whitespace-nowrap">
                    {t.entry.say_this}
                  </span>
                  <p className="font-sans text-[14px] text-foreground leading-relaxed">
                    {entry.say_this}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-block bg-surface text-muted-foreground font-sans font-bold text-[11px] px-2.5 py-1 whitespace-nowrap">
                    {t.entry.not_this}
                  </span>
                  <p className="font-sans text-[14px] text-muted-foreground leading-relaxed">
                    {entry.not_this}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Bottom spacer: mirrors top to keep block centered when no results */}
        {!hasResults && <div className="flex-1" />}
      </main>

      {/* ── Newsletter band ──────────────────────────────────────────────── */}
      <section
        aria-label={t.nav.newsletter_aria}
        className="text-center px-6 py-12 bg-surface"
        style={{ borderTop: "0.5px solid #DDDDDD" }}
      >
        <p className="font-sans font-bold text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
          {t.newsletter.series}
        </p>
        <h2 className="font-serif font-bold text-[20px] text-foreground mb-4">
          {t.newsletter.headline_prefix} <em>{t.newsletter.headline_em}</em>{t.newsletter.headline_suffix}
        </h2>
        <p
          className="font-sans text-[14px] text-muted-foreground mx-auto mb-6"
          style={{ maxWidth: "400px" }}
        >
          {t.newsletter.description}
        </p>

        {emailSubmitted ? (
          <p className="font-sans text-[14px] text-foreground">
            {t.newsletter.success}
          </p>
        ) : (
          <form
            onSubmit={handleEmailSubmit}
            aria-label={t.nav.newsletter_aria}
            className="flex gap-2 mx-auto"
            style={{ maxWidth: "360px" }}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              {t.newsletter.email_placeholder}
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder={t.newsletter.email_placeholder}
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
              {emailSubmitting ? t.newsletter.sending : t.newsletter.subscribe}
            </button>
          </form>
        )}
        {emailError && (
          <p
            role="alert"
            className="font-sans text-[12px] text-muted-foreground mt-2"
          >
            {emailError}
          </p>
        )}
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
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
        <button
          onClick={() => setClaudeIndex((prev) => (prev + 1) % t.credits.length)}
          aria-label={t.footer.credits_aria}
          className="font-sans text-[11px] bg-transparent border-0 p-0 cursor-pointer underline-offset-2 hover:underline"
          style={{ color: "#CCCCCC" }}
        >
          {t.credits[claudeIndex]}
        </button>
      </footer>
    </div>
  )
}
