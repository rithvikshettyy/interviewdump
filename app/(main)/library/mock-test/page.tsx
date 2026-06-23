'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Clock, CheckCircle2, HelpCircle, SkipForward, RotateCcw, BookmarkPlus, ChevronRight } from 'lucide-react'
import Badge from '@/components/shared/Badge'
import { toggleProgress } from '@/lib/progress'
import {
  type TestQuestion,
  type QuestionVerdict,
  DURATION_TO_COUNT,
  buildMixedTest,
  buildCompanyTest,
} from '@/lib/mocktest'
import companiesData from '@/content/companies/index.json'

type Phase = 'config' | 'active' | 'results'

interface Company { slug: string; name: string; tier: string }
const COMPANIES = companiesData as Company[]

const DURATIONS = [20, 30, 45] as const
type DurationMinutes = typeof DURATIONS[number]

const TYPE_COLORS: Record<string, string> = {
  dsa:        'text-indigo-light',
  sql:        'text-green',
  behavioral: 'text-amber',
  scenario:   'text-amber',
  corecs:     'text-text-muted',
}

export default function MockTestPage() {
  const [phase, setPhase]               = useState<Phase>('config')
  const [mode, setMode]                 = useState<'mixed' | 'company'>('mixed')
  const [companySlug, setCompanySlug]   = useState<string>(COMPANIES[0]?.slug ?? '')
  const [duration, setDuration]         = useState<DurationMinutes>(30)
  const [isLoading, setIsLoading]       = useState(false)

  const [questions, setQuestions]       = useState<TestQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [verdicts, setVerdicts]         = useState<Record<string, QuestionVerdict>>({})
  const [elapsed, setElapsed]           = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [revisionAdded, setRevisionAdded] = useState<Set<string>>(new Set())

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Timer ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase === 'active') {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => {
          if (e + 1 >= totalSeconds) {
            clearInterval(intervalRef.current!)
            setPhase('results')
            return totalSeconds
          }
          return e + 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [phase, totalSeconds])

  const timeLeft = totalSeconds - elapsed
  const timeLeftMins = Math.floor(timeLeft / 60)
  const timeLeftSecs = timeLeft % 60
  const timerColor = timeLeft < 120 ? 'text-red' : timeLeft < 300 ? 'text-amber' : 'text-text-muted'

  // ── Start ─────────────────────────────────────────────────────────────────

  const startTest = useCallback(async () => {
    setIsLoading(true)
    const qs = mode === 'company'
      ? await buildCompanyTest(companySlug, duration)
      : await buildMixedTest(duration)
    setQuestions(qs)
    setCurrentIndex(0)
    setVerdicts({})
    setElapsed(0)
    setTotalSeconds(duration * 60)
    setRevisionAdded(new Set())
    setPhase('active')
    setIsLoading(false)
  }, [mode, companySlug, duration])

  // ── Verdict ───────────────────────────────────────────────────────────────

  const submitVerdict = (verdict: QuestionVerdict) => {
    const q = questions[currentIndex]
    setVerdicts((prev) => ({ ...prev, [q.id]: verdict }))
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      clearInterval(intervalRef.current!)
      setPhase('results')
    }
  }

  const handleAddRevision = async (q: TestQuestion) => {
    if (revisionAdded.has(q.id)) return
    await toggleProgress(q.id, q.type, 'revision')
    setRevisionAdded((prev) => new Set(prev).add(q.id))
  }

  // ─── Config Phase ─────────────────────────────────────────────────────────

  if (phase === 'config') {
    return (
      <div className="flex flex-col min-h-screen bg-bg">
        <div className="border-b border-border bg-surface px-4 sm:px-6 pt-6 pb-5">
          <h1 className="text-2xl font-bold text-text">Mock Interview</h1>
          <p className="text-sm text-text-muted mt-1">
            Simulate real interview conditions. Questions are timed — rate yourself honestly.
          </p>
        </div>

        <div className="px-4 sm:px-6 py-8 flex-1 max-w-2xl mx-auto w-full flex flex-col gap-6">
          {/* Mode */}
          <div>
            <p className="text-xs font-mono text-text-dim uppercase tracking-widest mb-3">Mode</p>
            <div className="grid grid-cols-2 gap-3">
              {(['mixed', 'company'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-xl border p-4 text-left transition-all focus:outline-none ${
                    mode === m
                      ? 'border-indigo-light bg-indigo-dim'
                      : 'border-border bg-surface hover:border-border-hover hover:bg-surface-hover'
                  }`}
                >
                  <p className="text-sm font-semibold text-text capitalize">{m === 'mixed' ? 'Mixed Topics' : 'Company Focus'}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {m === 'mixed' ? 'DSA, SQL, System Design & Behavioral mix' : 'Questions weighted around a specific company'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Company selector */}
          {mode === 'company' && (
            <div>
              <p className="text-xs font-mono text-text-dim uppercase tracking-widest mb-3">Select Company</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                {COMPANIES.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setCompanySlug(c.slug)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-all focus:outline-none ${
                      companySlug === c.slug
                        ? 'border-indigo-light bg-indigo-dim text-text font-semibold'
                        : 'border-border bg-surface text-text-muted hover:border-border-hover hover:text-text'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Duration */}
          <div>
            <p className="text-xs font-mono text-text-dim uppercase tracking-widest mb-3">Duration</p>
            <div className="flex gap-3">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all focus:outline-none ${
                    duration === d
                      ? 'border-indigo-light bg-indigo-dim text-text'
                      : 'border-border bg-surface text-text-muted hover:border-border-hover hover:text-text'
                  }`}
                >
                  {d} min
                  <span className="block text-[10px] font-normal font-mono text-text-dim mt-0.5">
                    {DURATION_TO_COUNT[d]} questions
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startTest}
            disabled={isLoading}
            className="w-full bg-indigo text-bg rounded-xl py-3 text-sm font-bold transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Building test...' : 'Start Mock Interview →'}
          </button>
        </div>
      </div>
    )
  }

  // ─── Active Phase ─────────────────────────────────────────────────────────

  if (phase === 'active' && questions.length > 0) {
    const q = questions[currentIndex]
    const diff = q.difficulty as 'Easy' | 'Medium' | 'Hard'

    return (
      <div className="flex flex-col min-h-screen bg-bg">
        {/* Top bar */}
        <div className="border-b border-border bg-surface px-4 sm:px-6 py-3 flex items-center justify-between">
          <span className="text-xs font-mono text-text-muted">
            Question {currentIndex + 1} / {questions.length}
          </span>
          <div className={`flex items-center gap-1.5 font-mono text-sm font-bold ${timerColor}`}>
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            {String(timeLeftMins).padStart(2, '0')}:{String(timeLeftSecs).padStart(2, '0')}
          </div>
          <button
            onClick={() => { clearInterval(intervalRef.current!); setPhase('results') }}
            className="text-xs text-text-dim hover:text-text font-mono border border-border rounded-lg px-2.5 py-1.5 transition-colors focus:outline-none"
          >
            Finish
          </button>
        </div>

        {/* Progress */}
        <div className="w-full h-1 bg-border">
          <div
            className="h-full bg-indigo transition-all duration-300"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col px-4 sm:px-6 py-6 max-w-2xl mx-auto w-full gap-5">
          {/* Question card */}
          <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${TYPE_COLORS[q.type] ?? 'text-text-dim'}`}>
                {q.type}
              </span>
              <span className="text-text-dim text-[10px]">•</span>
              <span className="text-[10px] font-mono text-text-dim">{q.topic}</span>
              <Badge label={diff} variant={diff.toLowerCase() as any} size="sm" />
            </div>

            <p className="text-base font-semibold text-text leading-relaxed flex-1">
              {q.question}
            </p>

            <details className="group">
              <summary className="text-xs font-mono text-text-dim cursor-pointer hover:text-text transition-colors select-none list-none flex items-center gap-1">
                <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" aria-hidden="true" />
                Show hint / explanation
              </summary>
              <p className="mt-3 text-sm text-text-muted leading-relaxed border-t border-border pt-3">
                {q.explanation}
              </p>
            </details>
          </div>

          {/* Verdict buttons */}
          <div>
            <p className="text-xs font-mono text-text-dim text-center mb-3">How confident are you?</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => submitVerdict('nailed')}
                className="flex flex-col items-center gap-1.5 bg-surface border border-border rounded-xl py-4 hover:border-green hover:bg-green-dim transition-all focus:outline-none group"
              >
                <CheckCircle2 className="w-5 h-5 text-green group-hover:scale-110 transition-transform" aria-hidden="true" />
                <span className="text-xs font-semibold text-text">Nailed it</span>
              </button>
              <button
                onClick={() => submitVerdict('unsure')}
                className="flex flex-col items-center gap-1.5 bg-surface border border-border rounded-xl py-4 hover:border-amber hover:bg-amber-dim transition-all focus:outline-none group"
              >
                <HelpCircle className="w-5 h-5 text-amber group-hover:scale-110 transition-transform" aria-hidden="true" />
                <span className="text-xs font-semibold text-text">Unsure</span>
              </button>
              <button
                onClick={() => submitVerdict('skipped')}
                className="flex flex-col items-center gap-1.5 bg-surface border border-border rounded-xl py-4 hover:border-border-hover transition-all focus:outline-none group"
              >
                <SkipForward className="w-5 h-5 text-text-dim group-hover:scale-110 transition-transform" aria-hidden="true" />
                <span className="text-xs font-semibold text-text">Skip</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Results Phase ────────────────────────────────────────────────────────

  const nailed  = Object.values(verdicts).filter((v) => v === 'nailed').length
  const unsure  = Object.values(verdicts).filter((v) => v === 'unsure').length
  const skipped = Object.values(verdicts).filter((v) => v === 'skipped').length
  const total   = questions.length
  const score   = total > 0 ? Math.round((nailed / total) * 100) : 0
  const toRevise = questions.filter((q) => verdicts[q.id] === 'unsure' || verdicts[q.id] === 'skipped')

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <div className="border-b border-border bg-surface px-4 sm:px-6 pt-6 pb-5">
        <h1 className="text-2xl font-bold text-text">Results</h1>
        <p className="text-sm text-text-muted mt-1">
          {mode === 'company' ? COMPANIES.find((c) => c.slug === companySlug)?.name : 'Mixed'} · {duration} min session
        </p>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto w-full flex flex-col gap-5">
        {/* Score summary */}
        <div className="bg-surface border border-border rounded-2xl p-6 text-center">
          <div className="text-5xl font-mono font-bold text-indigo-light mb-1">{score}%</div>
          <p className="text-xs font-mono text-text-dim mb-5">Confidence Score</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-dim border border-green/20 rounded-xl py-3 flex flex-col items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green" aria-hidden="true" />
              <span className="text-lg font-bold font-mono text-text">{nailed}</span>
              <span className="text-[10px] text-text-dim font-mono">Nailed</span>
            </div>
            <div className="bg-amber-dim border border-amber/20 rounded-xl py-3 flex flex-col items-center gap-1">
              <HelpCircle className="w-4 h-4 text-amber" aria-hidden="true" />
              <span className="text-lg font-bold font-mono text-text">{unsure}</span>
              <span className="text-[10px] text-text-dim font-mono">Unsure</span>
            </div>
            <div className="bg-surface-hover border border-border rounded-xl py-3 flex flex-col items-center gap-1">
              <SkipForward className="w-4 h-4 text-text-dim" aria-hidden="true" />
              <span className="text-lg font-bold font-mono text-text">{skipped}</span>
              <span className="text-[10px] text-text-dim font-mono">Skipped</span>
            </div>
          </div>
        </div>

        {/* Needs revision */}
        {toRevise.length > 0 && (
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Needs Revision</span>
              <span className="text-xs text-text-dim">{toRevise.length} questions</span>
            </div>
            <div className="divide-y divide-border">
              {toRevise.map((q) => (
                <div key={q.id} className="flex items-start justify-between gap-3 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text leading-snug line-clamp-2">{q.question}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] font-mono ${TYPE_COLORS[q.type] ?? 'text-text-dim'}`}>{q.type}</span>
                      <span className="text-text-dim text-[10px]">•</span>
                      <span className="text-[10px] font-mono text-text-dim">{q.topic}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddRevision(q)}
                    disabled={revisionAdded.has(q.id)}
                    aria-label={revisionAdded.has(q.id) ? 'Added to revision list' : 'Add to revision list'}
                    className={`flex-shrink-0 p-1.5 rounded-lg border transition-all focus:outline-none ${
                      revisionAdded.has(q.id)
                        ? 'border-green text-green bg-green-dim cursor-default'
                        : 'border-border text-text-dim hover:border-amber hover:text-amber'
                    }`}
                  >
                    <BookmarkPlus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => { setPhase('config'); setQuestions([]) }}
            className="w-full bg-indigo text-bg rounded-xl py-2.5 text-sm font-semibold transition-all focus:outline-none flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            New Mock Test
          </button>
        </div>
      </div>
    </div>
  )
}
