import type { Metadata } from 'next'
import { BRAND_DOCUMENT_TITLE } from '@/components/shared/Logo'
import './globals.css'

export const metadata: Metadata = {
  title: BRAND_DOCUMENT_TITLE,
  description: 'Free interview prep. No BS. No paywall.',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
  },
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
