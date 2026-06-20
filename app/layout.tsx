import type { Metadata } from 'next'
import { BRAND_DOCUMENT_TITLE } from '@/components/shared/Logo'
import './globals.css'

const siteUrl = 'https://interviewdump.dev'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BRAND_DOCUMENT_TITLE} - Free Tech Interview Prep`,
    template: `%s | ${BRAND_DOCUMENT_TITLE}`,
  },
  description: '500+ curated tech interview questions covering DSA, system design, SQL, core CS, aptitude and more. Free forever. No paywall. No signup wall.',
  keywords: [
    'tech interview prep', 'DSA questions', 'system design interview',
    'coding interview', 'free interview preparation', 'software engineer interview',
    'placement preparation', 'interview questions', 'data structures algorithms',
    'SQL interview questions', 'core CS subjects', 'behavioral interview', 'interview prep', 'interview preparation', 'resume review', 'resume checker',
    'python interview questions', 'javascript interview questions', 'react interview questions', 'nodejs interview questions',
    'computer graphics', 'faang interview', 'maang interview', 'top companies interview questions', 'interview questions from top companies', 'interview', 'interview question and answers', 'java interview questions', 'javascript interview questions', 'python interview questions', 'react interview questions', 'typescript interview questions', 'golang interview questions', 'cpp interview questions', 'c interview questions', 'html interview questions', 'css interview questions', 'bootstrap interview questions', 'tailwind interview questions', 'git interview questions', 'sql interview questions', 'mongodb interview questions', 'mongoose interview questions', 'expressjs interview questions', 'nextjs interview questions', 'redux interview questions', 'how to prepare for technical interviews', 'how to prepare for software engineer interviews', 'how to prepare for faang interviews', 'how to prepare for maang interviews', 'how to prepare for top companies interviews', 'how to prepare for placement preparation', 'how to prepare for interview questions', 'how to prepare for dsa questions', 'how to prepare for system design interview', 'how to prepare for coding interview', 'how to prepare for free interview preparation', 'how to prepare for software engineer interview', 'how to prepare for placement preparation', 'how to prepare for interview questions', 'how to prepare for data structures algorithms', 'how to prepare for SQL interview questions', 'how to prepare for core CS subjects', 'how to prepare for behavioral interview', 'how to prepare for interview prep', 'how to prepare for interview preparation', 'how to prepare for resume review', 'how to prepare for resume checker',
    'frontend interview questions', 'backend interview questions', 'fullstack interview questions', 'learn to code', 'learn python', 'learn javascript', 'learn java', 'learn c++', 'learn c', 'learn html', 'learn css', 'learn bootstrap', 'learn tailwind', 'learn git', 'learn sql', 'learn mongodb', 'learn mongoose', 'learn expressjs', 'learn nextjs', 'learn redux', 'learn typescript', 'learn golang',
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
  },
  twitter: {
    card: 'summary_large_image',
    site: '@RithvikShetty04',
    creator: '@RithvikShetty04',
    title: `${BRAND_DOCUMENT_TITLE}: Free Tech Interview Prep`,
    description: '500+ curated tech interview questions. Free forever. No paywall.',
  },
  verification: {
    google: 'dlBaHc6d9AT1OtAmRJHJSU2WTweIjUp8thlmWEKFYXQ',
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
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
