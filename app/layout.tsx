import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { SessionProvider } from 'next-auth/react'
import '../styles/colors_and_type.css'
import '../styles/components.css'
import '../styles/signs.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Signs',
  description: 'look life through a spiritual lens',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="has-grain">
        <SessionProvider>
          {children}
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
