import type { Metadata } from 'next'
import { BRAND_DOCUMENT_TITLE } from '@/components/shared/Logo'
import './globals.css'

export const metadata: Metadata = {
  title: BRAND_DOCUMENT_TITLE,
  description: 'Free interview prep. No BS. No paywall.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-text font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
