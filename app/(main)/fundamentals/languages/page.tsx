'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Badge from '@/components/shared/Badge'

interface Language {
  slug: string
  name: string
  description: string
  icon: string
  conceptCount: number
  available: boolean
}

export default function LanguagesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('All Languages')

  const languages: Language[] = [
    {
      slug: 'javascript',
      name: 'JavaScript',
      description: 'The language of the web. Master closures, async patterns, prototypes, and modern ES6+ features.',
      icon: 'JS',
      conceptCount: 12,
      available: true,
    },
    {
      slug: 'python',
      name: 'Python',
      description: 'Known for readability and vast ecosystem. Essential for ML, automation, and backend development.',
      icon: '🐍',
      conceptCount: 12,
      available: true,
    },
    {
      slug: 'java',
      name: 'Java',
      description: 'Class-based, object-oriented. The backbone of enterprise software and Android development.',
      icon: '☕',
      conceptCount: 12,
      available: true,
    },
    {
      slug: 'cpp',
      name: 'C/C++',
      description: 'High-performance systems language. Master pointers, memory management, and the fundamentals every CS student needs.',
      icon: '👾',
      conceptCount: 0,
      available: true,
    },
    {
      slug: 'typescript',
      name: 'TypeScript',
      description: 'Typed superset of JavaScript. Adds compiler-level type safety and improved IDE tooling.',
      icon: 'TS',
      conceptCount: 0,
      available: false,
    },
    {
      slug: 'go',
      name: 'Go',
      description: 'Google-designed concurrency powerhouse. Superb compilation speed and minimalist execution models.',
      icon: '🐹',
      conceptCount: 0,
      available: false,
    },
    {
      slug: 'rust',
      name: 'Rust',
      description: 'High memory safety systems programming language. Thread safety guarantees and zero-cost abstractions.',
      icon: '🦀',
      conceptCount: 0,
      available: false,
    },
  ]

  const tabs = [
    { label: 'All Languages', value: 'All Languages' },
    { label: 'My Modules', value: 'My Modules' },
    { label: 'My Chapters', value: 'My Chapters' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Page Header */}
      <PageHeader
        title="Language Fundamentals"
        subtitle="Master the core concepts of each language. With examples, analogies, and mini tasks."
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Language Grid */}
      <div className="px-6 py-6 flex-1 bg-bg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl">
          {languages.map((lang) => (
            <div
              key={lang.slug}
              role="button"
              tabIndex={lang.available ? 0 : -1}
              onClick={() => {
                if (lang.available) {
                  router.push(`/fundamentals/languages/${lang.slug}`)
                }
              }}
              onKeyDown={(e) => {
                if (lang.available && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  router.push(`/fundamentals/languages/${lang.slug}`)
                }
              }}
              aria-label={`Language: ${lang.name}. ${lang.available ? `${lang.conceptCount} concepts available.` : 'Coming soon.'}`}
              className={`bg-surface border border-border rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between focus:outline-none ${
                lang.available
                  ? 'cursor-pointer hover:border-border-hover hover:bg-surface-hover'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <div>
                {/* Top Row */}
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-xl bg-indigo-dim flex items-center justify-center text-2xl font-bold font-mono text-indigo-light">
                    {lang.icon}
                  </div>
                  {lang.available ? (
                    <ArrowRight className="w-5 h-5 text-text-dim hover:text-text transition-colors" />
                  ) : (
                    <Badge label="Coming Soon 🔒" variant="amber" size="sm" />
                  )}
                </div>

                {/* Name & Description */}
                <h2 className="text-2xl font-bold text-text mt-4">{lang.name}</h2>
                <p className="text-sm text-text-muted mt-2 leading-relaxed">
                  {lang.description}
                </p>
              </div>

              {/* Bottom tag */}
              {lang.available && (
                <div className="mt-4 pt-3 border-t border-border flex justify-start">
                  <span className="text-xs font-mono bg-indigo-dim text-indigo-light px-2.5 py-1 rounded-full">
                    {lang.conceptCount} concepts
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
