'use client'

import React, { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import jsConcepts from '@/content/languages/javascript/concepts.json'
import { getProgressIds } from '@/lib/progress'
import Badge from '@/components/shared/Badge'
import {
  Lock,
  Hourglass,
  RefreshCw,
  Target,
  ArrowUpCircle,
  GitFork,
  Eye,
  Wrench,
  Gauge,
  Sparkles,
  MousePointerClick,
  Box,
  BookOpen,
} from 'lucide-react'

const conceptIconMap: Record<string, React.ComponentType<any>> = {
  'js-closures': Lock,
  'js-promises': Hourglass,
  'js-event-loop': RefreshCw,
  'js-this': Target,
  'js-hoisting': ArrowUpCircle,
  'js-prototypes': GitFork,
  'js-scope': Eye,
  'js-hof': Wrench,
  'js-debounce-throttle': Gauge,
  'js-es6': Sparkles,
  'js-event-delegation': MousePointerClick,
  'js-modules': Box,
}

interface Concept {
  id: string
  emoji: string
  title: string
  language: string
  tag: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  teaser: string
  readTime: string
}

interface PageProps {
  params: Promise<{ lang: string }>
}

export default function LanguageConceptsPage({ params }: PageProps) {
  const { lang } = use(params)
  const router = useRouter()
  const [doneIds, setDoneIds] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  // Load progress on mount
  useEffect(() => {
    setMounted(true)
    const itemType = `lang-${lang}`
    getProgressIds(itemType, 'solved').then(setDoneIds)
  }, [lang])

  // Get concepts based on language slug
  const getConceptsList = (): Concept[] => {
    if (lang === 'javascript') return jsConcepts as any[]
    return [] // Fallback for other languages
  }

  const concepts = getConceptsList()

  const getLanguageName = (slug: string) => {
    if (slug === 'javascript') return 'JavaScript'
    if (slug === 'python') return 'Python'
    if (slug === 'java') return 'Java'
    if (slug === 'cpp') return 'C/C++'
    return slug.toUpperCase()
  }

  const getLanguageIcon = (slug: string) => {
    if (slug === 'javascript') return 'JS'
    if (slug === 'python') return '🐍'
    if (slug === 'java') return '☕'
    if (slug === 'cpp') return '👾'
    return '📝'
  }

  const langName = getLanguageName(lang)
  const langIcon = getLanguageIcon(lang)

  // Calculate progress percent
  const solvedCount = concepts.filter(c => doneIds.includes(c.id)).length
  const totalCount = concepts.length
  const progressPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Breadcrumb & Header */}
      <div className="border-b border-border bg-surface px-6 pt-6 pb-5">
        <div className="text-xs text-text-muted font-mono mb-3">
          <Link href="/fundamentals/languages" className="hover:text-text transition-colors">
            Languages
          </Link>{' '}
          / <span className="text-indigo-light">{langName}</span>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <div className="w-16 h-16 rounded-2xl bg-indigo-dim flex items-center justify-center text-2xl font-bold font-mono text-indigo-light flex-shrink-0">
            {langIcon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">{langName} Fundamentals</h1>
            <p className="text-sm text-text-muted mt-1">
              {totalCount} concepts &bull; Pick one to start
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      {totalCount > 0 && (
        <div className="px-6 pt-6 pb-2 max-w-5xl">
          <div className="flex justify-between items-center text-xs text-text-muted mb-2 font-mono">
            <span>Your Progress</span>
            <span className="text-indigo-light">
              {solvedCount} / {totalCount} concepts done ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-surface border border-border rounded-full overflow-hidden">
            <div
              className="bg-indigo h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Concepts Grid */}
      <div className="px-6 py-6 flex-1 bg-bg max-w-5xl">
        {concepts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {concepts.map((concept) => {
              const isDone = doneIds.includes(concept.id)

              return (
                <div
                  key={concept.id}
                  onClick={() => router.push(`/fundamentals/languages/${lang}/${concept.id}`)}
                  className={`bg-surface border border-border rounded-2xl p-5 cursor-pointer hover:border-indigo bg-surface-hover transition-all duration-200 flex flex-col justify-between ${
                    isDone ? 'border-l-4 border-l-green' : ''
                  }`}
                  style={mounted && isDone ? { borderLeftWidth: '4px', borderLeftColor: '#22C55E' } : {}}
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex justify-between items-center">
                      {(() => {
                        const IconComponent = conceptIconMap[concept.id] || BookOpen
                        return (
                          <div className="w-8 h-8 rounded-lg bg-surface/50 border border-border flex items-center justify-center text-text-muted">
                            <IconComponent className="w-4 h-4" />
                          </div>
                        )
                      })()}
                      <Badge
                        label={concept.difficulty}
                        variant={concept.difficulty.toLowerCase() as any}
                        size="sm"
                      />
                    </div>

                    {/* Title & Tag */}
                    <h3 className="text-base font-bold text-text mt-3 leading-snug">
                      {concept.title}
                    </h3>
                    <div className="mt-1">
                      <Badge label={concept.tag} variant="indigo" size="sm" />
                    </div>

                    {/* Teaser */}
                    <p className="text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed">
                      {concept.teaser}
                    </p>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
                    <div>
                      {isDone ? (
                        <span className="text-xs font-mono text-green font-semibold">✓ Done</span>
                      ) : (
                        <span className="text-xs font-mono text-text-dim">Not started</span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-text-dim">
                      ~{concept.readTime}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center text-text-muted bg-surface border border-border rounded-2xl">
            <BookOpen className="w-8 h-8 text-text-dim mb-3" />
            <p className="text-base font-semibold">No concepts available yet</p>
            <p className="text-sm mt-1">We are actively preparing curated concepts for {langName}. Stay tuned!</p>
          </div>
        )}
      </div>
    </div>
  )
}
