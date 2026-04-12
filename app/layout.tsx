import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The AI Phrasebook',
  description: 'Stop nodding, start speaking. Essential terms to join the AI conversation.',
  openGraph: {
    title: 'The AI Phrasebook — Essential terms to join the AI conversation.',
    description: 'Stop nodding, start speaking.',
    url: 'https://theaiphrasebook.vercel.app',
    siteName: 'The AI Phrasebook',
    images: [
      {
        url: 'https://theaiphrasebook.vercel.app/og-image.png',
        width: 1200,
        height: 627,
        alt: 'The AI Phrasebook — Essential terms to join the AI conversation.',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The AI Phrasebook',
    description: '30 essential AI terms for people who are done nodding.',
    images: ['https://theaiphrasebook.vercel.app/og-image.png'],
  },
  icons: {
    icon: '/favicon-32x32.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
