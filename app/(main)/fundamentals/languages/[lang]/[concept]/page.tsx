'use client'

import React, { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Copy, Check, ArrowRight, ArrowLeft } from 'lucide-react'
import jsConcepts from '@/content/languages/javascript/concepts.json'
import { getProgressIds, toggleProgress } from '@/lib/progress'
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

interface PageProps {
  params: Promise<{
    lang: string
    concept: string
  }>
}

export default function ConceptDetailPage({ params }: PageProps) {
  const { lang, concept: conceptId } = use(params)
  const router = useRouter()

  // States
  const [isDone, setIsDone] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [doneIds, setDoneIds] = useState<string[]>([])
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedYt, setCopiedYt] = useState(false)
  const [mounted, setMounted] = useState(false)

  const itemType = `lang-${lang}`

  // Get language details
  const getLanguageName = (slug: string) => {
    if (slug === 'javascript') return 'JavaScript'
    if (slug === 'python') return 'Python'
    if (slug === 'java') return 'Java'
    if (slug === 'cpp') return 'C/C++'
    return slug.toUpperCase()
  }

  const langName = getLanguageName(lang)

  // Get concepts list
  const getConceptsList = () => {
    if (lang === 'javascript') return jsConcepts as any[]
    return []
  }

  const concepts = getConceptsList()
  const concept = concepts.find((c) => c.id === conceptId)

  // Load progress states on mount/update
  useEffect(() => {
    setMounted(true)
    async function loadProgress() {
      const [solved, revision] = await Promise.all([
        getProgressIds(itemType, 'solved'),
        getProgressIds(itemType, 'revision'),
      ])
      setDoneIds(solved)
      setIsDone(solved.includes(conceptId))
      setIsSaved(revision.includes(conceptId))
    }
    if (concept) {
      loadProgress()
    }
  }, [lang, conceptId, concept])

  if (!concept) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-text-muted min-h-screen bg-bg">
        <p className="text-base font-semibold">Concept not found</p>
        <Link href={`/fundamentals/languages/${lang}`} className="text-indigo mt-4 hover:underline">
          &larr; Back to {langName}
        </Link>
      </div>
    )
  }

  // Toggling handlers
  const handleToggleDone = async () => {
    const nextState = !isDone
    setIsDone(nextState)
    // Update local list reactively
    if (nextState) {
      setDoneIds((prev) => [...prev, conceptId])
    } else {
      setDoneIds((prev) => prev.filter((id) => id !== conceptId))
    }
    await toggleProgress(conceptId, itemType, 'solved')
  }

  const handleToggleSaved = async () => {
    setIsSaved(!isSaved)
    await toggleProgress(conceptId, itemType, 'revision')
  }

  // Copy helpers
  const handleCopyCode = () => {
    if (concept.codeExample) {
      navigator.clipboard.writeText(concept.codeExample)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const handleCopyYt = () => {
    if (concept.ytQuery) {
      navigator.clipboard.writeText(concept.ytQuery)
      setCopiedYt(true)
      setTimeout(() => setCopiedYt(false), 2000)
    }
  }

  // Navigation: Next / Prev
  const currentIndex = concepts.findIndex((c) => c.id === conceptId)
  const prevConcept = currentIndex > 0 ? concepts[currentIndex - 1] : null
  const nextConcept = currentIndex < concepts.length - 1 ? concepts[currentIndex + 1] : null

  // Progress metrics for sidebar
  const solvedCount = concepts.filter((c) => doneIds.includes(c.id)).length
  const totalCount = concepts.length
  const progressPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0

  // Sidebar link helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const sectionsNav = [
    { label: 'What is it?', id: 'what-is-it' },
    { label: 'Code Example', id: 'code-example' },
    { label: 'Under the Hood', id: 'under-the-hood' },
    { label: 'Interview Question', id: 'interview-question' },
    { label: 'Common Mistake', id: 'common-mistake' },
    { label: 'Mini Task', id: 'mini-task' },
    { label: 'YouTube recommendation', id: 'youtube' },
  ]

  return (
    <div className="bg-bg min-h-screen text-text">
      <div className="px-6 py-6 max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Main Learning Content */}
        <article className="flex-1 max-w-2xl min-w-0">
          {/* Breadcrumb */}
          <div className="text-xs text-text-muted font-mono mb-3">
            <Link href="/fundamentals/languages" className="hover:text-text transition-colors">
              Languages
            </Link>{' '}
            /{' '}
            <Link href={`/fundamentals/languages/${lang}`} className="hover:text-text transition-colors">
              {langName}
            </Link>{' '}
            / <span className="text-indigo-light">{concept.title}</span>
          </div>

          {/* Concept Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3">
              {(() => {
                const IconComponent = conceptIconMap[concept.id] || BookOpen
                return (
                  <div className="w-12 h-12 rounded-xl bg-surface/50 border border-border flex items-center justify-center text-text-muted flex-shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>
                )
              })()}
              <h1 className="text-3xl font-bold text-text leading-tight">{concept.title}</h1>
            </div>

            <div className="flex gap-2 flex-wrap items-center mt-3 text-xs text-text-muted font-mono">
              <Badge label={concept.tag} variant="indigo" size="sm" />
              <Badge label={concept.difficulty} variant={concept.difficulty.toLowerCase() as any} size="sm" />
              <span>&bull;</span>
              <span>~{concept.readTime} read</span>
            </div>

            {/* Progress Actions */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleToggleDone}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all focus:outline-none ${
                  isDone
                    ? 'bg-green text-white hover:bg-green/90'
                    : 'bg-surface border border-border text-text-muted hover:border-border-hover hover:text-text'
                }`}
              >
                {isDone ? 'Done ✓' : 'Mark as Done'}
              </button>
              <button
                onClick={handleToggleSaved}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all focus:outline-none ${
                  isSaved
                    ? 'bg-amber text-white hover:bg-amber/90'
                    : 'bg-surface border border-border text-text-muted hover:border-border-hover hover:text-text'
                }`}
              >
                {isSaved ? 'Saved 🔖' : 'Add to Revision'}
              </button>
            </div>
          </header>

          {/* SECTIONS */}
          <div className="flex flex-col gap-8">
            {/* 1. WHAT IS IT? */}
            <section id="what-is-it" className="scroll-mt-6">
              <h2 className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-3">
                What Is It?
              </h2>
              <div className="bg-surface border border-border rounded-2xl p-6 text-sm text-text leading-relaxed">
                {concept.whatIsIt}

                {/* Analogy Box */}
                {concept.analogy && (
                  <div className="bg-indigo-dim border-l-4 border-indigo rounded-r-xl p-4 mt-4">
                    <div className="text-[10px] font-mono text-indigo-light mb-1 uppercase tracking-wider">
                      💡 Think of it like...
                    </div>
                    <p className="text-sm text-text-muted italic leading-relaxed">
                      {concept.analogy}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* 2. CODE EXAMPLE */}
            <section id="code-example" className="scroll-mt-6">
              <h2 className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-3">
                Code Example
              </h2>
              <div className="bg-[#0A0E13] border border-border rounded-2xl overflow-hidden">
                <div className="bg-surface px-4 py-2.5 flex justify-between items-center border-b border-border">
                  <span className="font-mono text-xs text-text-dim uppercase">
                    {concept.codeLanguage}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="text-text-dim hover:text-text transition-colors p-1"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-green" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <pre className="px-5 py-4 text-xs font-mono text-green leading-relaxed overflow-x-auto">
                  <code>{concept.codeExample}</code>
                </pre>
              </div>
            </section>

            {/* 3. UNDER THE HOOD */}
            <section id="under-the-hood" className="scroll-mt-6">
              <h2 className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-3">
                How It Works Under the Hood
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                {concept.underTheHood}
              </p>
            </section>

            {/* 4. INTERVIEW QUESTION */}
            <section id="interview-question" className="scroll-mt-6">
              <h2 className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-3">
                Interview Question
              </h2>
              <div className="bg-amber-dim border border-amber/20 rounded-2xl p-5">
                <div className="text-[10px] font-mono text-amber mb-2 uppercase tracking-widest">
                  🎯 Interviewers ask:
                </div>
                <p className="text-sm text-text font-semibold mb-4 leading-snug">
                  {concept.interviewQuestion}
                </p>

                <div className="text-[10px] font-mono text-amber mb-2 uppercase tracking-widest">
                  Strong answer covers:
                </div>
                <ul className="space-y-3">
                  {concept.strongAnswerPoints &&
                    concept.strongAnswerPoints.map((point: string, i: number) => (
                      <li key={i} className="flex gap-2.5 items-start text-sm text-text leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0 mt-2" />
                        <span>{point}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </section>

            {/* 5. COMMON MISTAKE */}
            <section id="common-mistake" className="scroll-mt-6">
              <h2 className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-3">
                Common Mistake
              </h2>
              <div className="bg-red-dim border border-red/20 rounded-2xl p-5">
                <div className="text-[10px] font-mono text-red mb-2 uppercase tracking-widest">
                  ❌ Common mistake:
                </div>
                <p className="text-sm text-red mb-4 leading-relaxed">
                  {concept.commonMistake}
                </p>

                <div className="text-[10px] font-mono text-green mb-2 uppercase tracking-widest">
                  ✓ Correct mental model:
                </div>
                <p className="text-sm text-green leading-relaxed">
                  {concept.correctMentalModel}
                </p>
              </div>
            </section>

            {/* 6. MINI TASK */}
            <section id="mini-task" className="scroll-mt-6">
              <h2 className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-3">
                Mini Task ✏️
              </h2>
              <div className="border-2 border-dashed border-amber/30 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono text-amber mb-2 uppercase tracking-widest">
                    ✏️ MINI TASK
                  </div>
                  <p className="text-sm text-text leading-relaxed mb-4">
                    {concept.miniTask}
                  </p>
                </div>
                <button
                  onClick={handleToggleDone}
                  className={`self-start rounded-xl px-4 py-2 text-sm font-semibold transition-all focus:outline-none ${
                    isDone
                      ? 'bg-green text-white hover:bg-green/90'
                      : 'border border-border text-text-muted hover:border-border-hover hover:text-text'
                  }`}
                >
                  {isDone ? 'Completed ✓' : 'Mark Completed'}
                </button>
              </div>
            </section>

            {/* 7. YOUTUBE RECOMMENDATION */}
            <section id="youtube" className="scroll-mt-6">
              <h2 className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-3">
                YouTube Recommendation 📺
              </h2>
              <div className="bg-red-dim border border-red/20 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <svg className="w-6 h-6 text-red flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span className="text-sm text-text truncate">
                    Search: <span className="font-mono text-xs bg-surface/40 px-1.5 py-0.5 rounded border border-border/20">"{concept.ytQuery}"</span>
                  </span>
                </div>
                <button
                  onClick={handleCopyYt}
                  className="text-text-dim hover:text-text transition-colors p-1 flex-shrink-0"
                >
                  {copiedYt ? (
                    <Check className="w-4 h-4 text-green" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </section>
          </div>
        </article>

        {/* RIGHT SIDEBAR: Navigation and progress details */}
        <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-6 self-start bg-bg h-auto">
          <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-5">
            {/* Section Links */}
            <div>
              <div className="text-xs font-mono text-text-dim mb-3 uppercase tracking-wider">
                In this concept
              </div>
              <ul className="space-y-2">
                {sectionsNav.map((sec) => (
                  <li key={sec.id}>
                    <button
                      onClick={() => scrollToSection(sec.id)}
                      className="text-xs text-text-muted hover:text-text font-medium text-left transition-colors focus:outline-none"
                    >
                      {sec.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress Card */}
            <div className="border-t border-border pt-4">
              <div className="text-xs font-mono text-text-muted flex justify-between mb-1.5">
                <span>{langName} Progress</span>
                <span>
                  {solvedCount}/{totalCount}
                </span>
              </div>
              <div className="w-full h-1.5 bg-bg border border-border rounded-full overflow-hidden">
                <div
                  className="bg-indigo h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Navigation links (Next/Prev) */}
            <div className="border-t border-border pt-4 flex flex-col gap-3">
              {nextConcept ? (
                <button
                  onClick={() => router.push(`/fundamentals/languages/${lang}/${nextConcept.id}`)}
                  className="w-full bg-indigo hover:bg-indigo/90 text-white rounded-xl py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 focus:outline-none"
                >
                  Next Concept <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="w-full bg-surface-hover text-text-dim rounded-xl py-2.5 text-xs font-semibold text-center border border-border select-none">
                  Last Concept 🎉
                </div>
              )}

              {prevConcept && (
                <button
                  onClick={() => router.push(`/fundamentals/languages/${lang}/${prevConcept.id}`)}
                  className="w-full border border-border text-text-muted hover:border-border-hover hover:text-text rounded-xl py-2.5 text-xs font-semibold transition flex items-center justify-center gap-1.5 focus:outline-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous Concept
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
