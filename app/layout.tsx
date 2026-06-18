import type { Metadata } from 'next'
import { BRAND_DOCUMENT_TITLE } from '@/components/shared/Logo'
import './globals.css'

const siteUrl = 'https://interviewdump.dev'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BRAND_DOCUMENT_TITLE} — Free Tech Interview Prep`,
    template: `%s | ${BRAND_DOCUMENT_TITLE}`,
  },
  description: '500+ curated tech interview questions covering DSA, system design, SQL, core CS, aptitude and more. Free forever. No paywall. No signup wall.',
  keywords: [
    'tech interview prep', 'DSA questions', 'system design interview',
    'coding interview', 'free interview preparation', 'software engineer interview',
    'placement preparation', 'interview questions', 'data structures algorithms',
    'SQL interview questions', 'core CS subjects', 'behavioral interview',
  ],
  authors: [{ name: 'InterviewDump', url: siteUrl }],
  creator: 'InterviewDump',
  publisher: 'InterviewDump',
  category: 'Education',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: BRAND_DOCUMENT_TITLE,
    title: `${BRAND_DOCUMENT_TITLE} — Free Tech Interview Prep`,
    description: '500+ curated tech interview questions covering DSA, system design, SQL, core CS, aptitude and more. Free forever. No paywall.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'InterviewDump — Free Tech Interview Prep',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@RithvikShetty04',
    creator: '@RithvikShetty04',
    title: `${BRAND_DOCUMENT_TITLE} — Free Tech Interview Prep`,
    description: '500+ curated tech interview questions. Free forever. No paywall.',
    images: ['/opengraph-image.png'],
  },
  verification: {
    google: 'dlBaHc6d9AT1OtAmRJHJSU2WTweIjUp8thlmWEKFYXQ',
  },
  alternates: {
    canonical: siteUrl,
  },
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'InterviewDump',
  url: siteUrl,
  description: '500+ curated tech interview questions. Free forever.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/library/interview-questions?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: 'InterviewDump',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/favicon.png`,
    },
    sameAs: [
      'https://github.com/rithvikshettyy/interviewdump',
      'https://x.com/RithvikShetty04',
    ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
