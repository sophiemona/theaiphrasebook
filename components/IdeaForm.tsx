"use client"

import { useState } from "react"

interface IdeaFormMessages {
  overline: string
  headline_prefix: string
  headline_em: string
  headline_suffix: string
  description: string
  first_name: string
  last_name: string
  linkedin_optional: string
  idea_label: string
  submit: string
  sending: string
  success: string
  error: string
}

const EN: IdeaFormMessages = {
  overline: "Feature requests",
  headline_prefix: "Got an",
  headline_em: "idea",
  headline_suffix: "?",
  description: "Tell us what you'd want to see built. If it makes the roadmap, your name goes on the card.",
  first_name: "First name",
  last_name: "Last name",
  linkedin_optional: "— optional",
  idea_label: "Your idea",
  submit: "Submit",
  sending: "Sending...",
  success: "Idea received. We'll take a look.",
  error: "Something went wrong. Please try again.",
}

export default function IdeaForm({ messages }: { messages?: IdeaFormMessages }) {
  const m = messages ?? EN

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [idea, setIdea] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/submit-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, linkedin, idea }),
      })

      if (!res.ok) throw new Error("Failed")
      setSubmitted(true)
    } catch {
      setError(m.error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-20 pt-12 border-t-[0.5px] border-border">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">

        {/* Left — heading */}
        <div className="md:col-span-2">
          <p className="font-sans text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
            {m.overline}
          </p>
          <h2 className="font-serif font-bold text-[28px] md:text-[32px] leading-tight mb-3 text-foreground">
            {m.headline_prefix}{" "}
            <em style={{ textDecoration: "underline", textDecorationColor: "#FFA51F", textUnderlineOffset: "4px", textDecorationThickness: "2px" }}>
              {m.headline_em}
            </em>
            {m.headline_suffix}
          </h2>
          <p className="font-sans text-[14px] text-muted-foreground leading-relaxed">
            {m.description}
          </p>
        </div>

        {/* Right — form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="md:col-span-3 flex flex-col gap-4">
            {/* Name row */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground block mb-1.5">
                  {m.first_name}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Dario"
                  className="w-full font-serif italic text-[14px] px-4 py-3 border-[0.5px] border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="flex-1">
                <label className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground block mb-1.5">
                  {m.last_name}
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Amodei"
                  className="w-full font-serif italic text-[14px] px-4 py-3 border-[0.5px] border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground block mb-1.5">
                LinkedIn <span className="normal-case tracking-normal font-normal">{m.linkedin_optional}</span>
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://www.linkedin.com/in/dario-amodei-3934934/"
                className="w-full font-serif italic text-[14px] px-4 py-3 border-[0.5px] border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {/* Idea */}
            <div>
              <label className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground block mb-1.5">
                {m.idea_label}
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                required
                rows={5}
                placeholder="Two terms people constantly confuse — Machine Learning vs AI, Fine-tuning vs RAG — explained side by side, with the exact sentence that stops the confusion in a meeting. Literacy at this level matters more than the industry admits. Keep going."
                className="w-full font-serif italic text-[14px] px-4 py-3 border-[0.5px] border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              />
            </div>

            {error && (
              <p className="font-sans text-[12px] text-muted-foreground">{error}</p>
            )}

            <div>
              <button
                type="submit"
                className="bg-accent text-foreground font-sans font-bold text-[14px] px-[22px] py-[7px] rounded-[6px] hover:bg-[#f09800] transition-colors"
              >
                {submitting ? m.sending : m.submit}
              </button>
            </div>
          </form>
        ) : (
          <div className="md:col-span-3 flex items-start">
            <p className="font-sans text-[14px] text-foreground">
              {m.success}
            </p>
          </div>
        )}

      </div>
    </section>
  )
}
