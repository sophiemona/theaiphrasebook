export const dynamic = 'force-dynamic'

import RoadmapClient, { type RoadmapItem } from './RoadmapClient'
import Footer from '@/components/Footer'
import IdeaForm from '@/components/IdeaForm'

async function fetchRoadmapData(): Promise<RoadmapItem[]> {
  const url =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSR_Z37cNFyyZ5wxoGHFef9njc-NDon1Vqx6Dn3gcHYJGMKe0nY7GI9e3z1oUx8HZYj5r6AUB4lRsEZ/pub?gid=0&single=true&output=csv'

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch roadmap data')

  const text = await res.text()
  const lines = text.trim().split('\n')

  return lines
    .slice(1)
    .map((line) => {
      const fields = parseCSVLine(line)
      return {
        status: (fields[0] ?? '').trim(),
        title: (fields[1] ?? '').trim(),
        description: (fields[2] ?? '').trim(),
        priority: '',
        inspiredBy: (fields[3] ?? '').trim(),
      }
    })
    .filter((item) => item.title)
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current)
      current = ''
    } else {
      current += char
    }
  }
  fields.push(current)
  return fields
}

export default async function RoadmapPage() {
  let items: RoadmapItem[] = []
  let fetchError = false

  try {
    items = await fetchRoadmapData()
  } catch {
    fetchError = true
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Logo Bar */}
      <header className="h-12 w-full bg-logo-bar flex items-center justify-between px-4 md:px-8">
        <a
          href="/"
          className="font-sans font-bold text-[16px] text-foreground hover:opacity-80 transition-opacity"
        >
          The AI Phrasebook
        </a>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-8 pt-16 pb-24">
        {/* Hero */}
        <section className="mb-16">
          <p className="font-sans text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
            New features we&apos;re working on
          </p>
          <h1 className="font-serif font-bold text-[32px] md:text-[40px] leading-tight mb-4 text-foreground">
            Built in public, shaped by{" "}
            <span className="italic border-b-[3px] border-accent">you</span>.
          </h1>
          <p className="font-sans text-[15px] text-muted-foreground leading-relaxed">
            Every item on this list came from a real conversation. Mostly with humans.
          </p>
        </section>

        <p className="font-sans text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
          The AI Phrasebook Roadmap
        </p>

        {/* Error state */}
        {fetchError ? (
          <div className="border-[0.5px] border-border p-6">
            <p className="font-sans text-[14px] text-muted-foreground">
              Could not load roadmap data. Please try again later.
            </p>
          </div>
        ) : (
          <RoadmapClient items={items} />
        )}

        <IdeaForm />
      </main>

      <Footer />
    </div>
  )
}
