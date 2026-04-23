"use client"

import { useRouter } from "next/navigation"
import type { Locale } from "@/lib/i18n"

interface Props {
  locale: Locale
  enUrl: string
  frUrl: string
}

export default function LanguageToggle({ locale, enUrl, frUrl }: Props) {
  const router = useRouter()

  return (
    <div
      className="flex items-center rounded-full p-[3px]"
      style={{
        background: "#F0EFEB",
        border: "0.5px solid #DDDDDD",
      }}
    >
      <button
        onClick={() => router.push(enUrl)}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
        className="flex items-center justify-center rounded-full font-sans text-[15px] transition-colors cursor-pointer border-0"
        style={{
          background: locale === "en" ? "#1A1A1A" : "transparent",
          width: "38px",
          height: "34px",
        }}
      >
        🇬🇧
      </button>
      <button
        onClick={() => router.push(frUrl)}
        aria-label="Passer en français"
        aria-pressed={locale === "fr"}
        className="flex items-center justify-center rounded-full font-sans text-[15px] transition-colors cursor-pointer border-0"
        style={{
          background: locale === "fr" ? "#1A1A1A" : "transparent",
          width: "38px",
          height: "34px",
        }}
      >
        🇫🇷
      </button>
    </div>
  )
}
