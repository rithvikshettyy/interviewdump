'use client'

import React, { useState, useCallback } from 'react'
import { RotateCcw, ChevronRight, CheckCircle2, AlertCircle, XCircle, BookOpen, Code2, Coffee, Cpu, Trees, type LucideIcon } from 'lucide-react'
import Badge from '@/components/shared/Badge'

// ─── Types ──────────────────────────────────────────────────────────────────

interface FlashCard {
  id: string
  front: { title: string; tag: string; difficulty: string; language?: string }
  back: { explanation: string; keyPoints: string[]; analogy?: string }
}

type CardRating = 'got_it' | 'shaky' | 'missed'
type Phase = 'selecting' | 'studying' | 'complete'

// ─── Deck Config ────────────────────────────────────────────────────────────

const DECKS: { id: string; label: string; icon: LucideIcon; source: string; lang?: string }[] = [
  { id: 'js',     label: 'JavaScript', icon: Code2,  source: 'lang', lang: 'javascript' },
  { id: 'python', label: 'Python',     icon: Code2,  source: 'lang', lang: 'python' },
  { id: 'java',   label: 'Java',       icon: Coffee, source: 'lang', lang: 'java' },
  { id: 'cpp',    label: 'C++',        icon: Cpu,    source: 'lang', lang: 'cpp' },
  { id: 'dsa',    label: 'DSA',        icon: Trees,  source: 'dsa' },
]

type DeckId = 'js' | 'python' | 'java' | 'cpp' | 'dsa'

// ─── Content Loaders ────────────────────────────────────────────────────────

async function loadDeck(deckId: DeckId): Promise<FlashCard[]> {
  if (deckId === 'dsa') {
    const data = (await import('@/content/dsa/questions.json')).default as any[]
    return data.map((q) => ({
      id: q.id,
      front: { title: q.question, tag: q.topic, difficulty: q.difficulty },
      back: {
        explanation: q.explanation,
        keyPoints: q.strongAnswerPoints?.slice(0, 4) ?? [],
      },
    }))
  }

  const langMap: Record<string, () => Promise<any>> = {
    javascript: () => import('@/content/languages/javascript/concepts.json'),
    python:     () => import('@/content/languages/python/concepts.json'),
    java:       () => import('@/content/languages/java/concepts.json'),
    cpp:        () => import('@/content/languages/cpp/concepts.json'),
  }

  const deck = DECKS.find((d) => d.id === deckId)
  if (!deck || deck.source !== 'lang') return []
  const lang = deck.lang as string
  const data = ((await langMap[lang]()).default) as any[]
  return data.map((c) => ({
    id: c.id,
    front: { title: c.title, tag: c.tag, difficulty: c.difficulty, language: lang },
    back: {
      explanation: c.explanation ?? c.teaser,
      keyPoints: c.strongAnswerPoints?.slice(0, 4) ?? [],
      analogy: c.realWorldAnalogy,
    },
  }))
}

// ─── Subcomponents ──────────────────────────────────────────────────────────

function FlipCard({
  card,
  isFlipped,
  onFlip,
}: {
  card: FlashCard
  isFlipped: boolean
  onFlip: () => void
}) {
  const diffVariant = card.front.difficulty?.toLowerCase() as any

  return (
    <div
      className="card-flip-container w-full cursor-pointer select-none"
      style={{ height: 320 }}
      onClick={onFlip}
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? 'Click to see front' : 'Click to reveal answer'}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onFlip() } }}
    >
      <div className={`card-flip-inner w-full h-full${isFlipped ? ' flipped' : ''}`} style={{ height: 320 }}>
        {/* Front */}
        <div className="card-face absolute inset-0 bg-surface border border-border rounded-2xl p-7 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <Badge label={card.front.tag} variant="indigo" size="sm" />
            {card.front.difficulty && (
              <Badge label={card.front.difficulty} variant={diffVariant} size="sm" />
            )}
          </div>
          <div className="flex-1 flex items-center justify-center px-2 py-4">
            <h2 className="text-xl font-bold text-text text-center leading-snug">
              {card.front.title}
            </h2>
          </div>
          <p className="text-xs text-text-dim text-center font-mono">Tap to reveal answer</p>
        </div>

        {/* Back */}
        <div className="card-back card-face absolute inset-0 bg-surface border border-border rounded-2xl p-6 flex flex-col gap-3 overflow-y-auto">
          <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest mb-1">Answer</div>
          <p className="text-sm text-text-muted leading-relaxed line-clamp-4">
            {card.back.explanation}
          </p>
          {card.back.analogy && (
            <div className="bg-indigo-dim border border-border rounded-xl px-3 py-2">
              <p className="text-xs text-text-muted italic leading-relaxed line-clamp-2">
                {card.back.analogy}
              </p>
            </div>
          )}
          {card.back.keyPoints.length > 0 && (
            <ul className="mt-1 space-y-1">
              {card.back.keyPoints.map((pt, i) => (
                <li key={i} className="text-xs text-text-muted flex gap-2 leading-snug">
                  <span className="text-indigo-light mt-0.5 flex-shrink-0">•</span>
                  <span className="line-clamp-2">{pt}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function FlashcardsPage() {
  const [phase, setPhase] = useState<Phase>('selecting')
  const [activeDeckId, setActiveDeckId] = useState<DeckId | null>(null)
  const [deck, setDeck] = useState<FlashCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [ratings, setRatings] = useState<Record<string, CardRating>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [retryMode, setRetryMode] = useState(false)

  const startDeck = useCallback(async (deckId: DeckId) => {
    setIsLoading(true)
    setActiveDeckId(deckId)
    const cards = await loadDeck(deckId)
    setDeck(cards)
    setCurrentIndex(0)
    setIsFlipped(false)
    setRatings({})
    setRetryMode(false)
    setPhase('studying')
    setIsLoading(false)
  }, [])

  const handleRate = (rating: CardRating) => {
    const card = deck[currentIndex]
    const newRatings = { ...ratings, [card.id]: rating }
    setRatings(newRatings)

    if (currentIndex < deck.length - 1) {
      setCurrentIndex((i) => i + 1)
      setIsFlipped(false)
    } else {
      setPhase('complete')
    }
  }

  const handleRetryMissed = () => {
    const missed = deck.filter((c) => ratings[c.id] === 'missed')
    if (missed.length === 0) return
    setDeck(missed)
    setCurrentIndex(0)
    setIsFlipped(false)
    setRatings({})
    setRetryMode(true)
    setPhase('studying')
  }

  // ── Selecting Phase ──────────────────────────────────────────────────────

  if (phase === 'selecting') {
    return (
      <div className="flex flex-col min-h-screen bg-bg">
        <div className="border-b border-border bg-surface px-6 pt-6 pb-5">
          <h1 className="text-2xl font-bold text-text">Flashcards</h1>
          <p className="text-sm text-text-muted mt-1">
            Active recall — test yourself without looking at the answer first.
          </p>
        </div>

        <div className="px-6 py-8 flex-1 flex flex-col items-center">
          <p className="text-xs font-mono text-text-dim uppercase tracking-widest mb-6">Choose a deck</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-2xl">
            {DECKS.map((d) => (
              <button
                key={d.id}
                onClick={() => startDeck(d.id as DeckId)}
                disabled={isLoading}
                className="bg-surface border border-border rounded-2xl p-6 text-left hover:border-border-hover hover:bg-surface-hover transition-all duration-200 focus:outline-none group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <d.icon className="w-6 h-6 text-text-dim mb-3" aria-hidden="true" />
                <h3 className="text-base font-bold text-text group-hover:text-indigo-light transition-colors">
                  {d.label}
                </h3>
                <p className="text-xs text-text-dim mt-1 font-mono">
                  {d.id === 'js' ? '24' : d.id === 'python' ? '22' : d.id === 'java' ? '21' : d.id === 'cpp' ? '12' : '30+'} cards
                </p>
              </button>
            ))}
          </div>

          {isLoading && (
            <p className="mt-8 text-sm text-text-muted font-mono animate-pulse">Loading deck...</p>
          )}

          <div className="mt-10 bg-surface border border-border rounded-2xl p-5 max-w-2xl w-full">
            <div className="flex items-start gap-3">
              <BookOpen className="w-4 h-4 text-text-dim mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-text mb-1">How it works</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Each card shows a concept title. Tap to flip and read the explanation. Then rate yourself honestly — cards you mark <span className="text-red font-mono">Missed</span> can be retried at the end.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Studying Phase ───────────────────────────────────────────────────────

  if (phase === 'studying' && deck.length > 0) {
    const card = deck[currentIndex]
    const progress = Math.round(((currentIndex) / deck.length) * 100)

    return (
      <div className="flex flex-col min-h-screen bg-bg">
        {/* Header */}
        <div className="border-b border-border bg-surface px-6 pt-5 pb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-text-dim">
              {retryMode ? 'Retry: Missed Cards' : (DECKS.find((d) => d.id === activeDeckId)?.label ?? '')} Flashcards
            </p>
            <p className="text-sm font-semibold text-text mt-0.5">
              Card {currentIndex + 1} of {deck.length}
            </p>
          </div>
          <button
            onClick={() => { setPhase('selecting'); setDeck([]) }}
            className="text-xs text-text-dim hover:text-text font-mono border border-border rounded-lg px-3 py-1.5 hover:border-border-hover transition-colors focus:outline-none"
          >
            Exit
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-border">
          <div
            className="h-full bg-indigo transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-start px-6 py-8 max-w-2xl mx-auto w-full">
          {/* Flip Card */}
          <FlipCard card={card} isFlipped={isFlipped} onFlip={() => setIsFlipped((f) => !f)} />

          {/* Rating buttons — only after flip */}
          {isFlipped && (
            <div className="mt-6 w-full animate-fadeIn">
              <p className="text-xs font-mono text-text-dim text-center mb-3">How did you do?</p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleRate('got_it')}
                  className="flex flex-col items-center gap-1.5 bg-surface border border-border rounded-xl py-3 hover:border-green hover:bg-green-dim transition-all duration-150 focus:outline-none group"
                >
                  <CheckCircle2 className="w-5 h-5 text-green group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="text-xs font-semibold text-text">Got it</span>
                </button>
                <button
                  onClick={() => handleRate('shaky')}
                  className="flex flex-col items-center gap-1.5 bg-surface border border-border rounded-xl py-3 hover:border-amber hover:bg-amber-dim transition-all duration-150 focus:outline-none group"
                >
                  <AlertCircle className="w-5 h-5 text-amber group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="text-xs font-semibold text-text">Shaky</span>
                </button>
                <button
                  onClick={() => handleRate('missed')}
                  className="flex flex-col items-center gap-1.5 bg-surface border border-border rounded-xl py-3 hover:border-red hover:bg-red-dim transition-all duration-150 focus:outline-none group"
                >
                  <XCircle className="w-5 h-5 text-red group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="text-xs font-semibold text-text">Missed</span>
                </button>
              </div>
            </div>
          )}

          {/* Skip button before flip */}
          {!isFlipped && (
            <button
              onClick={() => setIsFlipped(true)}
              className="mt-6 flex items-center gap-1.5 text-xs text-text-dim hover:text-text font-mono transition-colors focus:outline-none"
            >
              Reveal answer <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── Complete Phase ───────────────────────────────────────────────────────

  const gotIt  = Object.values(ratings).filter((r) => r === 'got_it').length
  const shaky  = Object.values(ratings).filter((r) => r === 'shaky').length
  const missed = Object.values(ratings).filter((r) => r === 'missed').length
  const total  = gotIt + shaky + missed
  const score  = total > 0 ? Math.round((gotIt / total) * 100) : 0

  return (
    <div className="flex flex-col min-h-screen bg-bg items-center justify-center px-6 py-12">
      <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-text mb-1">Session Complete!</h2>
        <p className="text-sm text-text-muted mb-6">
          {DECKS.find((d) => d.id === activeDeckId)?.label} Flashcards
        </p>

        <div className="text-5xl font-mono font-bold text-indigo-light mb-2">
          {score}<span className="text-text-dim text-2xl font-normal">%</span>
        </div>
        <p className="text-xs font-mono text-text-dim mb-6">Confident</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-green-dim border border-green/20 rounded-xl py-3 flex flex-col items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green" aria-hidden="true" />
            <span className="text-lg font-bold font-mono text-text">{gotIt}</span>
            <span className="text-[10px] text-text-dim font-mono">Got it</span>
          </div>
          <div className="bg-amber-dim border border-amber/20 rounded-xl py-3 flex flex-col items-center gap-1">
            <AlertCircle className="w-4 h-4 text-amber" aria-hidden="true" />
            <span className="text-lg font-bold font-mono text-text">{shaky}</span>
            <span className="text-[10px] text-text-dim font-mono">Shaky</span>
          </div>
          <div className="bg-red-dim border border-red/20 rounded-xl py-3 flex flex-col items-center gap-1">
            <XCircle className="w-4 h-4 text-red" aria-hidden="true" />
            <span className="text-lg font-bold font-mono text-text">{missed}</span>
            <span className="text-[10px] text-text-dim font-mono">Missed</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {missed > 0 && (
            <button
              onClick={handleRetryMissed}
              className="w-full bg-indigo text-bg rounded-xl py-2.5 text-sm font-semibold transition-all focus:outline-none flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Retry {missed} Missed Card{missed !== 1 ? 's' : ''}
            </button>
          )}
          <button
            onClick={() => { setPhase('selecting'); setDeck([]) }}
            className="w-full border border-border text-text-muted hover:border-border-hover hover:text-text rounded-xl py-2.5 text-sm font-semibold transition-all focus:outline-none"
          >
            Choose New Deck
          </button>
        </div>
      </div>
    </div>
  )
}
