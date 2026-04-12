"use client"

import { useState } from "react"

export interface RoadmapItem {
  status: string
  title: string
  description: string
  priority: string
  inspiredBy: string
}

const STATUS_ORDER = ['Shipped', 'In Progress', 'Coming Next']

const LINKEDIN: Record<string, string> = {
  'Samy Zerrouki': 'https://www.linkedin.com/in/samyzerrouki/',
  "Guillaume O'Lanyer": 'https://www.linkedin.com/in/guillaume-o-lanyer/',
  'Sophie Mona Pagès': 'https://www.linkedin.com/in/sophspages/',
  'DJ Harris': 'https://www.linkedin.com/in/dj-harris-mha-mba-candidate-6a462045/',
  'Nicolas Wisse': 'https://www.linkedin.com/in/nicolas-wisse/',
  'Kevin Straszburger': 'https://www.linkedin.com/in/kevinstraszburger/',
  'Ramzi Laifa': 'https://www.linkedin.com/in/ramzi-laifa-186650189/',
  'Claude': 'https://claude.ai/',
  'Dario Amodei': 'https://www.linkedin.com/in/dario-amodei-3934934/',
}

const CUSTOM_RENDERS: Record<string, { text: string; url?: string }[]> = {
  'Claude, as Dario Amodei': [
    { text: 'Claude, as ' },
    { text: 'Dario Amodei', url: 'https://www.linkedin.com/in/dario-amodei-3934934/' },
  ],
}

const STATUS_DOT: Record<string, string> = {
  'Shipped': '#FFDE59',
  'In Progress': '#FFA51F',
  'Coming Next': '#555555',
}

const COL = {
  title: 196,
  inspiredBy: 148,
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 200ms ease',
        flexShrink: 0,
        pointerEvents: 'none',
      }}
    >
      <path d="M2 4.5L6 8L10 4.5" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ColumnHeaderRow() {
  return (
    <div className="hidden md:flex items-center border-b-[0.5px] border-border" style={{ backgroundColor: '#F0EFEB' }}>
      <div className="shrink-0 border-r-[0.5px] border-border" style={{ width: COL.title, padding: '8px 12px' }} />
      <div className="flex-1 min-w-0 border-r-[0.5px] border-border" style={{ padding: '8px 12px' }} />
      <div
        className="shrink-0 flex font-sans font-bold text-[10px] uppercase tracking-wider justify-end"
        style={{ width: COL.inspiredBy, padding: '8px 12px', color: '#AAAAAA' }}
      >
        Inspired by
      </div>
    </div>
  )
}

function InspiredByContent({ name }: { name: string }) {
  if (!name) return null
  const normalized = name.trim().replace(/\s+/g, ' ')

  if (CUSTOM_RENDERS[normalized]) {
    return (
      <span>
        {CUSTOM_RENDERS[normalized].map((seg, i) =>
          seg.url ? (
            <a key={i} href={seg.url} target="_blank" rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-70 transition-opacity"
              style={{ color: '#AAAAAA' }}>
              {seg.text}
            </a>
          ) : (
            <span key={i} style={{ color: '#AAAAAA' }}>{seg.text}</span>
          )
        )}
      </span>
    )
  }

  if (LINKEDIN[normalized]) {
    return (
      <a href={LINKEDIN[normalized]} target="_blank" rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-70 transition-opacity"
        style={{ color: '#AAAAAA' }}>
        {normalized}
      </a>
    )
  }

  return <span style={{ color: '#AAAAAA' }}>{normalized}</span>
}

function Checkmark() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"
      style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', marginTop: '-1px' }}>
      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#FFDE59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FeatureRow({ item }: { item: RoadmapItem }) {
  const isShipped = item.status === 'Shipped'

  return (
    <div
      className="group border-b-[0.5px] border-border transition-colors duration-100"
      style={{ borderLeft: isShipped ? '2px solid #FFDE59' : '2px solid transparent' }}
    >
      {/* Mobile — stacked */}
      <div className="md:hidden group-hover:bg-[#F5F4F1] transition-colors duration-100" style={{ padding: '12px 12px' }}>
        <p className="font-serif font-bold italic text-[14px] text-foreground leading-snug mb-1">
          {isShipped && <Checkmark />}{item.title}
        </p>
        <p className="font-sans text-[13px] text-foreground leading-relaxed">
          {item.description}
        </p>
        {item.inspiredBy && (
          <p className="font-sans text-[11px] mt-2">
            <span style={{ color: '#AAAAAA' }}>Inspired by </span>
            <InspiredByContent name={item.inspiredBy} />
          </p>
        )}
      </div>

      {/* Desktop — table columns */}
      <div className="hidden md:flex items-baseline w-full group-hover:bg-[#F5F4F1] transition-colors duration-100">
        <div className="shrink-0 border-r-[0.5px] border-border" style={{ width: COL.title - 2, padding: '10px 12px' }}>
          <span className="font-serif font-bold italic text-[14px] text-foreground leading-snug">
            {isShipped && <Checkmark />}{item.title}
          </span>
        </div>
        <div className="flex-1 min-w-0 border-r-[0.5px] border-border" style={{ padding: '10px 12px' }}>
          <p className="font-sans text-[13px] text-foreground leading-relaxed">{item.description}</p>
        </div>
        <div className="shrink-0 flex items-start justify-end font-sans text-[12px]"
          style={{ width: COL.inspiredBy, padding: '10px 12px' }}>
          <InspiredByContent name={item.inspiredBy} />
        </div>
      </div>
    </div>
  )
}

function GroupHeader({ status, count, open, onToggle }: {
  status: string; count: number; open: boolean; onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center gap-2 border-b-[0.5px] border-border hover:bg-[#EEECEA] transition-colors duration-100 cursor-pointer touch-manipulation"
      style={{ backgroundColor: '#F0EFEB', padding: '12px 12px', minHeight: '44px' }}
      aria-expanded={open}
    >
      <span className="shrink-0 rounded-full"
        style={{ width: 7, height: 7, backgroundColor: STATUS_DOT[status] ?? '#CCCCCC', marginTop: 1 }} />
      <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-foreground">{status}</span>
      <span className="font-sans text-[10px] px-1.5 rounded-full"
        style={{ backgroundColor: '#DDDDDD', color: '#666666', paddingTop: 2, paddingBottom: 2 }}>
        {count}
      </span>
      <span className="ml-auto"><ChevronIcon open={open} /></span>
    </button>
  )
}

function AccordionSection({ status, items, defaultOpen }: {
  status: string; items: RoadmapItem[]; defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  if (items.length === 0) return null

  return (
    <div>
      <GroupHeader status={status} count={items.length} open={open} onToggle={() => setOpen(v => !v)} />
      {open && (
        <div>
          {items.map((item, i) => <FeatureRow key={`${item.title}-${i}`} item={item} />)}
        </div>
      )}
    </div>
  )
}

export default function RoadmapClient({ items }: { items: RoadmapItem[] }) {
  const grouped = STATUS_ORDER.reduce<Record<string, RoadmapItem[]>>(
    (acc, status) => { acc[status] = items.filter(item => item.status === status); return acc },
    {}
  )

  return (
    <div className="border-[0.5px] border-border overflow-hidden">
      <ColumnHeaderRow />
      {STATUS_ORDER.map(status => (
        <AccordionSection key={status} status={status} items={grouped[status] ?? []} defaultOpen={status === 'In Progress'} />
      ))}
    </div>
  )
}
