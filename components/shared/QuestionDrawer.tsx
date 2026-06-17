'use client'

import React, { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'
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
}

export default function QuestionDrawer({
  question,
  isOpen,
  onClose,
  isSolved,
  isRevision,
  onToggleSolved,
  onToggleRevision,
}: QuestionDrawerProps) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedYt, setCopiedYt] = useState(false)

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
      <aside className="fixed right-0 top-0 h-full w-[520px] bg-surface border-l border-border z-50 animate-slideInRight overflow-y-auto flex flex-col justify-between shadow-2xl">
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
                {question.companies && question.companies.map((company) => (
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
                className="text-text-muted hover:text-text p-1 hover:bg-surface-hover rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h2 className="mt-3 text-lg font-semibold text-text leading-snug">
              {question.question}
            </h2>
          </div>

          {/* Body */}
          <div className="p-5 flex flex-col gap-6 pb-24">
            {/* 1. What they're testing */}
            <div>
              <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                What They're Testing
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
                      className="text-text-dim hover:text-text transition-colors p-1"
                    >
                      {copiedCode ? (
                        <Check className="w-3.5 h-3.5 text-green" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
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

            {/* 6. Companies that ask this */}
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
                    <svg className="w-5 h-5 text-red flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span className="truncate font-mono text-xs">{question.ytQuery}</span>
                  </div>
                  <button
                    onClick={handleCopyYt}
                    className="text-text-dim hover:text-text transition-colors p-1 flex-shrink-0"
                  >
                    {copiedYt ? (
                      <Check className="w-3.5 h-3.5 text-green" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-surface border-t border-border p-4 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.15)]">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onToggleSolved}
              className={`rounded-xl py-2.5 text-sm font-semibold transition-all w-full focus:outline-none ${
                isSolved
                  ? 'bg-green text-white border-transparent hover:bg-green/90'
                  : 'border border-border text-text-muted hover:border-border-hover hover:text-text'
              }`}
            >
              {isSolved ? 'Solved ✓' : 'Mark Solved'}
            </button>
            <button
              onClick={onToggleRevision}
              className={`rounded-xl py-2.5 text-sm font-semibold transition-all w-full focus:outline-none ${
                isRevision
                  ? 'bg-amber text-white border-transparent hover:bg-amber/90'
                  : 'border border-border text-text-muted hover:border-border-hover hover:text-text'
              }`}
            >
              {isRevision ? 'Saved 🔖' : 'Add to Revision'}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
