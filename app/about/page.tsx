export const dynamic = 'force-dynamic'

import AboutClient from './AboutClient'
import { type RoadmapItem } from './RoadmapClient'

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

  return <AboutClient items={items} fetchError={fetchError} />
}
