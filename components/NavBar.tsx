"use client"

import { useRouter } from "next/navigation"
import type { Locale } from "@/lib/i18n"

// ─── Inline toggle (responsive) ──────────────────────────────────────────────
// Keeps sizing co-located with NavBar so both can be tuned together.
// Mobile:  pill h-7 (28px), flags 14px, each button 34×24px, outer padding 2px → total ≤72px wide
// Desktop: pill h-10 (40px), flags 15px, each button 38×34px, outer padding 3px

function Toggle({ locale, enUrl, frUrl }: { locale: Locale; enUrl: string; frUrl: string }) {
  const router = useRouter()

  // Sizing via Tailwind only (no inline width/height/font — they'd override md: variants)
  // Mobile: 34×24px, 14px emoji, leading-none
  // Desktop (md+): 38×34px, 15px emoji
  const btnBase = "flex items-center justify-center rounded-full transition-colors cursor-pointer border-0 leading-none w-[34px] h-6 text-[14px] md:w-[38px] md:h-[34px] md:text-[15px]"

  return (
    <div
      className="flex items-center rounded-full p-[2px] md:p-[3px]"
      style={{ background: "#F0EFEB", border: "0.5px solid #DDDDDD" }}
    >
      <button
        onClick={() => router.push(enUrl)}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
        className={btnBase}
        style={{ background: locale === "en" ? "#1A1A1A" : "transparent" }}
      >
        🇬🇧
      </button>
      <button
        onClick={() => router.push(frUrl)}
        aria-label="Passer en français"
        aria-pressed={locale === "fr"}
        className={btnBase}
        style={{ background: locale === "fr" ? "#1A1A1A" : "transparent" }}
      >
        🇫🇷
      </button>
    </div>
  )
}

// ─── NavBar ───────────────────────────────────────────────────────────────────

interface NavBarProps {
  locale: Locale
  enUrl: string
  frUrl: string
  leftHref: string
  leftLabel: string
  onShare: () => void
  shareLabel: string          // Full label shown on desktop
  headerClassName?: string    // Extra classes (e.g. md:px-10 for about page)
}

export default function NavBar({
  locale,
  enUrl,
  frUrl,
  leftHref,
  leftLabel,
  onShare,
  shareLabel,
  headerClassName = "",
}: NavBarProps) {
  // Short CTA label for mobile — not worth a JSON key
  const mobileLabel = locale === "fr" ? "Partager" : "Share"

  return (
    <header className={`relative flex items-center justify-between px-6 py-4 ${headerClassName}`}>
      {/* Left */}
      <a
        href={leftHref}
        className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline py-3 -my-3 px-1 relative z-10 whitespace-nowrap"
      >
        {leftLabel}
      </a>

      {/* Center — absolutely pinned so it never shifts regardless of side widths */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <Toggle locale={locale} enUrl={enUrl} frUrl={frUrl} />
      </div>

      {/* Right */}
      <button
        onClick={onShare}
        className="bg-transparent border border-border rounded-[6px] font-sans font-bold text-[14px] text-foreground px-[18px] py-[7px] hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-colors cursor-pointer whitespace-nowrap relative z-10"
      >
        {/* Short label on mobile, full label on md+ */}
        <span className="md:hidden">{mobileLabel}</span>
        <span className="hidden md:inline">{shareLabel}</span>
      </button>
    </header>
  )
}
