"use client"

import { useState, useEffect } from "react"
import Footer from "@/components/Footer"

const SAMPLE_TERMS = [
  "Hallucination",
  "Prompt Engineering",
  "AI Agent",
  "Agentic Workflow",
  "RAG",
  "Copilot",
  "AI Governance",
  "AI Bias",
]

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
  "training data": "How It's Built & Shaped - Chapter 3",
  "fine-tuning": "How It's Built & Shaped - Chapter 3",
  "finetuning": "How It's Built & Shaped - Chapter 3",
  "rag": "How It's Built & Shaped - Chapter 3",
  "retrieval-augmented generation": "How It's Built & Shaped - Chapter 3",
  "multimodal": "How It's Built & Shaped - Chapter 3",
  "api": "How It's Built & Shaped - Chapter 3",
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

function getChapter(term: string): string {
  const normalized = term.toLowerCase().trim()
  return CHAPTER_MAPPING[normalized] || "The AI Phrasebook"
}

interface EntryData {
  term: string
  definition: string
  need_to_know: string
  say_this: string
  not_this: string
  chapter: string
}

const LOADING_MESSAGES = [
  "Consulting Claude.",
  "Claude is consulted.",
  "Removing hallucinations. Most of them.",
  "Writing the definition.",
  "Rewriting the definition.",
  "Verifying a real person could read this out loud.",
  "They couldn't. Rewriting.",
  "Adding personality.",
  "Removing excess personality.",
  "Asking a friend.",
  "Asking another friend.",
  "Almost done. Probably.",
]

function LoadingSequence() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1
        if (next >= LOADING_MESSAGES.length) {
          return 0
        }
        return next
      })
    }, 900)
    return () => clearInterval(interval)
  }, [])

  const start = Math.max(0, currentIndex - 4)
  const visible = LOADING_MESSAGES.slice(start, currentIndex + 1)

  return (
    <div className="py-16 px-2">
      <div className="flex flex-col gap-2">
        {visible.map((msg, i) => {
          const isLatest = i === visible.length - 1
          return (
            <p
              key={start + i}
              className="font-sans text-[13px] leading-relaxed transition-opacity duration-500"
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


export default function Home() {
  const [term, setTerm] = useState("")
  const [entry, setEntry] = useState<EntryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailInput, setEmailInput] = useState("")
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const generateEntry = async (termToGenerate: string) => {
    if (!termToGenerate.trim()) return

    setLoading(true)
    setError(null)
    setEntry(null)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: termToGenerate.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate entry")
      }

      const data = await response.json()
      setEntry({
        ...data,
        chapter: getChapter(termToGenerate),
      })
    } catch {
      setError("Failed to generate entry. Please try again.")
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
      setEmailError("Something went wrong. Please try again.")
    } finally {
      setEmailSubmitting(false)
    }
  }


  const handleSampleClick = (sampleTerm: string) => {
    setTerm(sampleTerm)
    generateEntry(sampleTerm)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    generateEntry(term)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Logo Bar */}
      <header className="h-12 w-full bg-logo-bar flex items-center justify-between px-4 md:px-8">
        <span className="font-sans font-bold text-[16px] text-foreground">
          The AI Phrasebook
        </span>
        <a
          href="/roadmap"
          className="font-sans text-[13px] text-foreground hover:opacity-60 transition-opacity"
        >
          What&apos;s coming →
        </a>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-8 pt-16 pb-0">
        {/* Hero Section */}
        <section className="mb-16">
          <p className="font-sans text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
            A POCKET GUIDE TO AI FOR THE REST OF US
          </p>
          <h1 className="font-serif font-bold text-[32px] md:text-[40px] leading-tight mb-4 text-foreground">
            Stop nodding, start{" "}
            <span className="italic border-b-[3px] border-accent">speaking</span>.
          </h1>
          <p className="font-sans text-[15px] text-muted-foreground leading-relaxed">
            Type an AI term you're not sure about. Get the page from the book.
          </p>
        </section>

        {/* Term Generator */}
        <section className="mb-8">
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-4">
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Type a word or try one below..."
              className="flex-1 font-serif italic text-[15px] px-4 py-3 border-[0.5px] border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              className="bg-accent text-foreground font-sans font-bold text-[14px] px-5 py-3 hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Look it up
            </button>
          </form>
          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_TERMS.map((sampleTerm) => (
              <button
                key={sampleTerm}
                onClick={() => handleSampleClick(sampleTerm)}
                className="font-serif italic text-[13px] px-3 py-1.5 border-[0.5px] border-border bg-transparent text-foreground hover:bg-surface transition-colors"
              >
                {sampleTerm}
              </button>
            ))}
          </div>
        </section>

        {/* Loading State */}
        {loading && <LoadingSequence />}

        {/* Error State */}
        {error && (
          <div className="bg-surface border-[0.5px] border-border p-6 mb-8">
            <p className="font-sans text-[14px] text-foreground">{error}</p>
          </div>
        )}

        {/* Entry Card */}
        {entry && !loading && (
          <section className="bg-card border-[0.5px] border-border p-6 md:p-8 mb-8">
            {/* Chapter Pill */}
            <div className="mb-4">
              <span className="inline-block bg-foreground text-card font-sans font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full">
                {entry.chapter}
              </span>
            </div>

            {/* Term Name */}
            <h2 className="font-serif font-bold italic text-[32px] md:text-[36px] text-foreground mb-4">
              {entry.term}
            </h2>

            {/* Divider */}
            <hr className="border-t-[0.5px] border-border mb-6" />

            {/* Definition */}
            <div className="mb-8">
              <p className="font-sans font-bold text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
                IN A NUTSHELL
              </p>
              <p className="font-serif italic text-[14px] text-foreground leading-relaxed">
                {entry.definition}
              </p>
            </div>

            {/* What You Need to Know */}
            <div className="mb-8">
              <p className="font-sans font-bold text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
                WHAT YOU ABSOLUTELY NEED TO KNOW
              </p>
              <p className="font-sans text-[15px] text-foreground leading-relaxed">
                {entry.need_to_know}
              </p>
            </div>

            {/* Usage Examples */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="inline-block bg-logo-bar text-foreground font-sans font-bold text-[11px] px-2.5 py-1 whitespace-nowrap">
                  Say this
                </span>
                <p className="font-sans text-[13px] text-foreground leading-relaxed">
                  {entry.say_this}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-block bg-surface text-muted-foreground font-sans font-bold text-[11px] px-2.5 py-1 whitespace-nowrap">
                  Not this
                </span>
                <p className="font-sans text-[13px] text-muted-foreground leading-relaxed">
                  {entry.not_this}
                </p>
              </div>
            </div>

          </section>
        )}

        {/* Divider */}
        <hr className="border-t-[0.5px] border-border my-8" />

        {/* Newsletter Section */}
        <section className="mb-16">
          <p className="font-sans text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
            THE MONDAY SERIES
          </p>
          <h2 className="font-serif font-bold text-[28px] md:text-[32px] leading-tight mb-4 text-foreground">
            One page, every <span className="italic">Monday</span>.
          </h2>
          <p className="font-sans text-[15px] text-muted-foreground leading-relaxed mb-6">
            The AI Phrasebook is a pocket guide to essential AI terms for people who want to follow the conversation, not just nod along. Every week: one term, edited by humans, ready to use. The site generates entries on demand. The newsletter is the version that made the cut.
          </p>
          {emailSubmitted ? (
            <p className="font-sans text-[14px] text-foreground">
              You're in. See you Monday.
            </p>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex flex-wrap gap-3 max-w-md">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 font-serif italic text-[15px] px-4 py-3 border-[0.5px] border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button
                type="submit"
                className="bg-accent text-foreground font-sans font-bold text-[14px] px-5 py-3 hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                {emailSubmitting ? "Sending..." : "Subscribe"}
              </button>
            </form>
          )}
          {emailError && (
            <p className="font-sans text-[12px] text-muted-foreground mt-2">{emailError}</p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
