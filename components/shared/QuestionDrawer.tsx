'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { X, Copy, Check, StickyNote, CheckCircle2, Bookmark, Zap, Building2, GitBranch, Baby } from 'lucide-react'
import { Question } from '@/types'
import Badge from './Badge'

interface QuestionDrawerProps {
  question: Question | null
  isOpen: boolean
  onClose: () => void
  isSolved: boolean
  isRevision: boolean
  onToggleSolved: () => void
  onToggleRevision: () => void
  showCompanies?: boolean
}

export default function QuestionDrawer({
  question,
  isOpen,
  onClose,
  isSolved,
  isRevision,
  onToggleSolved,
  onToggleRevision,
  showCompanies = true,
}: QuestionDrawerProps) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedYt, setCopiedYt] = useState(false)
  const [note, setNote] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const drawerRef = useRef<HTMLElement>(null)

  // Load note from localStorage when question changes
  useEffect(() => {
    if (!question) return
    const stored = localStorage.getItem(`id_note_${question.id}`) ?? ''
    setNote(stored)
    setNoteSaved(false)
  }, [question?.id])

  const handleNoteChange = useCallback((value: string) => {
    setNote(value)
    setNoteSaved(false)
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      if (question) {
        if (value.trim()) {
          localStorage.setItem(`id_note_${question.id}`, value)
        } else {
          localStorage.removeItem(`id_note_${question.id}`)
        }
        setNoteSaved(true)
        setTimeout(() => setNoteSaved(false), 2000)
      }
    }, 600)
  }, [question])

  // ── Focus trap and Escape key listener ────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !question) return

    const previousActiveElement = document.activeElement as HTMLElement

    // Focus the drawer on open
    if (drawerRef.current) {
      drawerRef.current.focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab') {
        if (!drawerRef.current) return
        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        const focusableElements = Array.from(
          drawerRef.current.querySelectorAll(focusableSelectors)
        ) as HTMLElement[]

        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previousActiveElement) {
        previousActiveElement.focus()
      }
    }
  }, [isOpen, question, onClose])

  if (!isOpen || !question) return null

  const handleCopyCode = () => {
    if (question.codeExample) {
      navigator.clipboard.writeText(question.codeExample)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const handleCopyYt = () => {
    if (question.ytQuery) {
      navigator.clipboard.writeText(question.ytQuery)
      setCopiedYt(true)
      setTimeout(() => setCopiedYt(false), 2000)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bg/60 z-40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside 
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="question-drawer-title"
        className="fixed right-0 top-0 h-full w-full md:w-[520px] bg-surface border-l border-border z-50 animate-slideInRight overflow-y-auto flex flex-col justify-between shadow-2xl outline-none"
      >
        {/* Scrollable Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="sticky top-0 bg-surface border-b border-border p-5 z-10">
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-2 flex-wrap items-center">
                <Badge
                  label={question.difficulty}
                  variant={question.difficulty.toLowerCase() as any}
                  size="sm"
                />
                {showCompanies && question.companies && question.companies.map((company) => (
                  <span
                    key={company}
                    className="text-[10px] font-mono bg-surface-hover border border-border text-text-muted rounded-full px-2 py-0.5"
                  >
                    {company}
                  </span>
                ))}
              </div>
              <button
                onClick={onClose}
                aria-label="Close question details"
                className="text-text-muted hover:text-text p-1 hover:bg-surface-hover rounded-lg transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <h2 id="question-drawer-title" className="mt-3 text-lg font-semibold text-text leading-snug">
              {question.question}
            </h2>
          </div>

          {/* Body */}
          <div className="p-5 flex flex-col gap-6 pb-24">
            {/* 1. What they're testing */}
            <div>
              <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                What They&apos;re Testing
              </div>
              <div className="border-b border-border mb-4" />
              <div className="bg-indigo-dim border border-indigo/20 rounded-xl p-4 text-sm text-text-muted leading-relaxed">
                {question.whatTheyTest}
              </div>
            </div>

            {/* 2. Explanation */}
            <div>
              <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                Explanation
              </div>
              <div className="border-b border-border mb-4" />
              <div className="text-sm text-text leading-relaxed whitespace-pre-wrap">
                {question.explanation}
              </div>
            </div>

            {/* 3. Code Example */}
            {question.codeExample && (
              <div>
                <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                  Code Example
                </div>
                <div className="border-b border-border mb-4" />
                <div className="bg-[#0A0E13] border border-border rounded-xl overflow-hidden">
                  <div className="bg-surface px-4 py-2 flex justify-between items-center border-b border-border">
                    <span className="text-[10px] font-mono text-text-dim">
                      {question.codeLanguage || 'code'}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      aria-label="Copy code example to clipboard"
                      className="text-text-dim hover:text-text transition-colors p-1 focus:outline-none"
                    >
                      {copiedCode ? (
                        <Check aria-hidden="true" className="w-3.5 h-3.5 text-green" />
                      ) : (
                        <Copy aria-hidden="true" className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-green leading-relaxed overflow-x-auto max-h-[300px]">
                    <code>{question.codeExample}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* 4. Key points to mention */}
            {question.strongAnswerPoints && question.strongAnswerPoints.length > 0 && (
              <div>
                <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                  Key Points to Mention
                </div>
                <div className="border-b border-border mb-4" />
                <ul className="space-y-3">
                  {question.strongAnswerPoints.map((point, i) => (
                    <li key={i} className="flex gap-2.5 items-start text-sm text-text leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo flex-shrink-0 mt-2" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 5. What to avoid */}
            <div>
              <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                What to Avoid
              </div>
              <div className="border-b border-border mb-4" />
              <div className="bg-red-dim border border-red/20 rounded-xl p-4 text-sm text-red leading-relaxed">
                {question.whatToAvoid}
              </div>
            </div>

            {/* 6. 30-Second Interview Answer */}
            {question.quickAnswer && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Zap aria-hidden="true" className="w-3.5 h-3.5 text-amber" />
                  <span className="text-[11px] font-mono text-text-dim uppercase tracking-widest">
                    30s Interview Answer
                  </span>
                </div>
                <div className="border-b border-border mb-4" />
                <div className="bg-amber-dim border border-amber/20 rounded-xl p-4 text-sm text-text leading-relaxed italic">
                  &ldquo;{question.quickAnswer}&rdquo;
                </div>
              </div>
            )}

            {/* 7. Explain Like I'm 10 */}
            {question.eli10 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Baby aria-hidden="true" className="w-3.5 h-3.5 text-indigo-light" />
                  <span className="text-[11px] font-mono text-text-dim uppercase tracking-widest">
                    Explain Like I&apos;m 10
                  </span>
                </div>
                <div className="border-b border-border mb-4" />
                <div className="bg-indigo-dim border border-indigo/20 rounded-xl p-4 text-sm text-text-muted leading-relaxed">
                  {question.eli10}
                </div>
              </div>
            )}

            {/* 8. Real Company Example */}
            {question.realWorldExample && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Building2 aria-hidden="true" className="w-3.5 h-3.5 text-text-dim" />
                  <span className="text-[11px] font-mono text-text-dim uppercase tracking-widest">
                    Real Production Story
                  </span>
                </div>
                <div className="border-b border-border mb-4" />
                <div className="bg-surface-hover border border-border rounded-xl p-4 text-sm text-text-muted leading-relaxed">
                  {question.realWorldExample}
                </div>
              </div>
            )}

            {/* 9. Table Visualization (SQL) */}
            {question.tableVisualization && (
              <div>
                <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                  Table Visualization
                </div>
                <div className="border-b border-border mb-4" />
                {question.tableVisualization.description && (
                  <p className="text-xs text-text-muted mb-3">{question.tableVisualization.description}</p>
                )}
                <div className="flex flex-col gap-3">
                  {question.tableVisualization.before && (
                    <div>
                      <span className="text-[10px] font-mono text-text-dim uppercase tracking-wider mb-1 block">Before</span>
                      <div className="overflow-x-auto rounded-lg border border-border">
                        <table className="w-full text-xs font-mono">
                          <thead>
                            <tr className="bg-surface">
                              {question.tableVisualization.before.headers.map((h, i) => (
                                <th key={i} className="px-3 py-2 text-left text-text-dim border-b border-border font-semibold">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {question.tableVisualization.before.rows.map((row, i) => (
                              <tr key={i} className="border-b border-border last:border-0">
                                {row.map((cell, j) => (
                                  <td key={j} className="px-3 py-1.5 text-text-muted">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {question.tableVisualization.after && (
                    <div>
                      <span className="text-[10px] font-mono text-green uppercase tracking-wider mb-1 block">After Query</span>
                      <div className="overflow-x-auto rounded-lg border border-green/30">
                        <table className="w-full text-xs font-mono">
                          <thead>
                            <tr className="bg-green-dim">
                              {question.tableVisualization.after.headers.map((h, i) => (
                                <th key={i} className="px-3 py-2 text-left text-green font-semibold border-b border-green/20">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {question.tableVisualization.after.rows.map((row, i) => (
                              <tr key={i} className="border-b border-green/10 last:border-0">
                                {row.map((cell, j) => (
                                  <td key={j} className="px-3 py-1.5 text-text-muted">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 10. Related Topics */}
            {question.relatedTopics && question.relatedTopics.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <GitBranch aria-hidden="true" className="w-3.5 h-3.5 text-text-dim" />
                  <span className="text-[11px] font-mono text-text-dim uppercase tracking-widest">
                    Related Topics
                  </span>
                </div>
                <div className="border-b border-border mb-4" />
                <div className="flex gap-2 flex-wrap">
                  {question.relatedTopics.map((topic) => (
                    <span
                      key={topic}
                      className="text-xs font-mono bg-indigo-dim border border-indigo/20 text-indigo-light rounded-full px-3 py-1"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 11. Companies that ask this */}
            {question.companies && question.companies.length > 0 && (
              <div>
                <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                  Companies That Ask This
                </div>
                <div className="border-b border-border mb-4" />
                <div className="flex gap-2 flex-wrap">
                  {question.companies.map((company) => (
                    <span
                      key={company}
                      className="text-xs font-mono bg-surface-hover border border-border text-text-muted rounded-full px-3 py-1"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Search on Youtube */}
            {question.ytQuery && (
              <div>
                <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                  Search on YouTube
                </div>
                <div className="border-b border-border mb-4" />
                <div className="bg-red-dim border border-red/20 rounded-xl p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-text min-w-0">
                    <svg aria-hidden="true" className="w-5 h-5 text-red flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span className="truncate font-mono text-xs">{question.ytQuery}</span>
                  </div>
                  <button
                    onClick={handleCopyYt}
                    aria-label="Copy YouTube search query"
                    className="text-text-dim hover:text-text transition-colors p-1 flex-shrink-0 focus:outline-none"
                  >
                    {copiedYt ? (
                      <Check aria-hidden="true" className="w-3.5 h-3.5 text-green" />
                    ) : (
                      <Copy aria-hidden="true" className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 8. Personal Notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <StickyNote aria-hidden="true" className="w-3.5 h-3.5 text-text-dim" />
                  <span className="text-[11px] font-mono text-text-dim uppercase tracking-widest">
                    My Notes
                  </span>
                </div>
                {noteSaved && (
                  <span className="text-[10px] font-mono text-green">saved</span>
                )}
              </div>
              <div className="border-b border-border mb-4" />
              <textarea
                value={note}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Jot down your own notes, key insights, or things to remember..."
                rows={4}
                className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder-text-dim resize-none focus:border-indigo focus:outline-none transition-colors leading-relaxed"
              />
              <p className="text-[10px] font-mono text-text-dim mt-1">Saved locally on this device.</p>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-surface border-t border-border p-4 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.15)]">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onToggleSolved}
              aria-label={isSolved ? "Mark question as unsolved" : "Mark question as solved"}
              className={`rounded-xl py-2.5 text-sm font-semibold transition-all w-full focus:outline-none ${
                isSolved
                  ? 'bg-green text-white border-transparent hover:bg-green/90'
                  : 'border border-border text-text-muted hover:border-border-hover hover:text-text'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                {isSolved && <CheckCircle2 className="w-4 h-4" aria-hidden="true" />}
                {isSolved ? 'Solved' : 'Mark Solved'}
              </span>
            </button>
            <button
              onClick={onToggleRevision}
              aria-label={isRevision ? "Remove from revision list" : "Add to revision list"}
              className={`rounded-xl py-2.5 text-sm font-semibold transition-all w-full focus:outline-none ${
                isRevision
                  ? 'bg-amber text-white border-transparent hover:bg-amber/90'
                  : 'border border-border text-text-muted hover:border-border-hover hover:text-text'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                {isRevision && <Bookmark className="w-4 h-4" aria-hidden="true" />}
                {isRevision ? 'Saved' : 'Add to Revision'}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
