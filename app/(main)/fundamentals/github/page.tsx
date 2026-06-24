'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  Copy,
  Check,
  BookOpen,
  GitBranch,
  GitMerge,
  GitPullRequest,
  GitFork,
  GitCommit,
  Globe,
  History,
  Tag,
  ShieldCheck,
  Cherry,
  Workflow,
  Handshake,
  Package,
  PenLine,
  Swords,
  RotateCcw,
  ClipboardList,
  CheckCircle2,
  Bookmark,
  Terminal,
} from 'lucide-react'
import githubConcepts from '@/content/github/concepts.json'
import { getProgressIds, toggleProgress } from '@/lib/progress'
import Badge from '@/components/shared/Badge'
import PageHeader from '@/components/layout/PageHeader'

const iconMap: Record<string, React.ComponentType<any>> = {
  'git-1': Package,
  'git-2': PenLine,
  'git-3': GitBranch,
  'git-4': GitMerge,
  'git-5': Swords,
  'git-6': Globe,
  'git-7': GitPullRequest,
  'git-8': RotateCcw,
  'git-9': ClipboardList,
  'git-10': History,
  'git-11': Tag,
  'git-12': ShieldCheck,
  'git-13': Cherry,
  'git-14': Workflow,
  'git-15': Handshake,
}

interface Command {
  command: string
  description: string
}

interface GitConcept {
  id: string
  emoji: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  teaser: string
  readTime: string
  explanation: string
  realWorldAnalogy: string
  commands: Command[]
  interviewQuestion: string
  strongAnswerPoints: string[]
  commonMistake: string
  miniTask: string
  ytQuery: string
}

export default function GitHubConceptsPage() {
  const [activeDifficulty, setActiveDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All')
  const [selectedConcept, setSelectedConcept] = useState<GitConcept | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)
  const [copiedYt, setCopiedYt] = useState(false)

  const [doneIds, setDoneIds] = useState<string[]>([])
  const [revisionIds, setRevisionIds] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  const itemType = 'github'

  useEffect(() => {
    setMounted(true)
    async function loadProgress() {
      const [solved, revision] = await Promise.all([
        getProgressIds(itemType, 'solved'),
        getProgressIds(itemType, 'revision'),
      ])
      setDoneIds(solved)
      setRevisionIds(revision)
    }
    loadProgress()
  }, [])

  const handleToggleSolved = async (conceptId: string) => {
    const isNowSolved = !doneIds.includes(conceptId)
    if (isNowSolved) {
      setDoneIds((prev) => [...prev, conceptId])
    } else {
      setDoneIds((prev) => prev.filter((id) => id !== conceptId))
    }
    await toggleProgress(conceptId, itemType, 'solved')
  }

  const handleToggleRevision = async (conceptId: string) => {
    const isNowRevision = !revisionIds.includes(conceptId)
    if (isNowRevision) {
      setRevisionIds((prev) => [...prev, conceptId])
    } else {
      setRevisionIds((prev) => prev.filter((id) => id !== conceptId))
    }
    await toggleProgress(conceptId, itemType, 'revision')
  }

  const handleCopyCmd = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCmd(text)
    setTimeout(() => setCopiedCmd(null), 2000)
  }

  const handleCopyYt = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedYt(true)
    setTimeout(() => setCopiedYt(false), 2000)
  }

  const filteredConcepts = (githubConcepts as GitConcept[]).filter((c) => {
    if (activeDifficulty !== 'All' && c.difficulty !== activeDifficulty) return false
    return true
  })

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <PageHeader
        title="Git & GitHub"
        subtitle="Master version control — from basic commits to advanced workflows and collaboration."
      />

      <div className="px-4 sm:px-6 py-4 border-b border-border flex items-center bg-bg">
        <div className="flex gap-2 items-center">
          <span className="text-xs text-text-muted mr-2 font-mono">Difficulty:</span>
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setActiveDifficulty(diff)}
              className={`text-sm px-3 py-1.5 rounded-lg transition-all duration-150 focus:outline-none ${
                activeDifficulty === diff
                  ? 'bg-indigo text-white border-transparent'
                  : 'bg-surface border border-border text-text-muted hover:text-text'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 flex-1 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConcepts.map((concept) => {
            const isDone = doneIds.includes(concept.id)

            return (
              <div
                key={concept.id}
                onClick={() => {
                  setSelectedConcept(concept)
                  setIsDrawerOpen(true)
                }}
                className={`bg-surface border border-border rounded-2xl p-5 cursor-pointer hover:border-indigo bg-surface-hover transition-all duration-200 flex flex-col justify-between ${
                  isDone ? 'border-l-4 border-l-green' : ''
                }`}
                style={mounted && isDone ? { borderLeftWidth: '4px', borderLeftColor: '#22C55E' } : {}}
              >
                <div>
                  <div className="flex justify-between items-center">
                    {(() => {
                      const IconComponent = iconMap[concept.id] || BookOpen
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

                  <h3 className="text-base font-bold text-text mt-3 leading-snug">
                    {concept.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed">
                    {concept.teaser}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
                  <div>
                    {isDone ? (
                      <span className="flex items-center gap-1 text-xs font-mono text-green font-semibold"><CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />Done</span>
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
      </div>

      {isDrawerOpen && selectedConcept && (
        <>
          <div
            className="fixed inset-0 bg-bg/60 z-40 backdrop-blur-sm"
            onClick={() => {
              setIsDrawerOpen(false)
              setSelectedConcept(null)
            }}
          />

          <aside className="fixed right-0 top-0 h-full w-full md:w-[520px] bg-surface border-l border-border z-50 animate-slideInRight overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div className="flex-1">
              <div className="sticky top-0 bg-surface border-b border-border p-5 z-10">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-2 flex-wrap items-center">
                    <Badge
                      label={selectedConcept.difficulty}
                      variant={selectedConcept.difficulty.toLowerCase() as any}
                      size="sm"
                    />
                    <span className="text-xs text-text-dim font-mono">
                      ~{selectedConcept.readTime}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false)
                      setSelectedConcept(null)
                    }}
                    className="text-text-muted hover:text-text p-1 hover:bg-surface-hover rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-text leading-snug flex items-center gap-2">
                  {(() => {
                    const IconComponent = iconMap[selectedConcept.id] || BookOpen
                    return (
                      <div className="w-8 h-8 rounded-lg bg-surface/50 border border-border flex items-center justify-center text-text-muted flex-shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                    )
                  })()}
                  {selectedConcept.title}
                </h2>
              </div>

              <div className="p-5 flex flex-col gap-6 pb-24">
                {/* What Is It */}
                <div>
                  <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                    What Is It?
                  </div>
                  <div className="border-b border-border mb-4" />
                  <div className="bg-surface border border-border rounded-xl p-4 text-sm text-text leading-relaxed">
                    <p className="text-text-muted">{selectedConcept.explanation}</p>

                    {selectedConcept.realWorldAnalogy && (
                      <div className="bg-indigo-dim border-l-4 border-indigo rounded-r-xl p-3.5 mt-3">
                        <div className="text-[10px] font-mono text-indigo-light mb-1 uppercase tracking-wider">
                          Real-world Analogy
                        </div>
                        <p className="text-sm text-text-muted italic leading-relaxed">
                          {selectedConcept.realWorldAnalogy}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Commands */}
                <div>
                  <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                    Commands
                  </div>
                  <div className="border-b border-border mb-4" />
                  <div className="space-y-2">
                    {selectedConcept.commands.map((cmd, i) => (
                      <div
                        key={i}
                        className="bg-[#0A0E13] border border-border rounded-xl overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 py-2.5">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Terminal className="w-3.5 h-3.5 text-text-dim flex-shrink-0" />
                            <code className="text-sm font-mono text-green truncate">
                              {cmd.command}
                            </code>
                          </div>
                          <button
                            onClick={() => handleCopyCmd(cmd.command)}
                            className="text-text-dim hover:text-text transition-colors p-1 flex-shrink-0 ml-2"
                          >
                            {copiedCmd === cmd.command ? (
                              <Check className="w-3.5 h-3.5 text-green" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="px-4 py-2 border-t border-border/50 bg-surface/30">
                          <p className="text-xs text-text-muted leading-relaxed">
                            {cmd.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interview Question */}
                <div>
                  <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                    Interview Question
                  </div>
                  <div className="border-b border-border mb-4" />
                  <div className="bg-amber-dim border border-amber/20 rounded-xl p-4">
                    <div className="text-[10px] font-mono text-amber mb-1 uppercase tracking-wider">
                      Interviewers ask:
                    </div>
                    <p className="text-sm text-text font-semibold mb-3 leading-snug">
                      {selectedConcept.interviewQuestion}
                    </p>

                    <div className="text-[10px] font-mono text-amber mb-1.5 uppercase tracking-wider">
                      Strong answer covers:
                    </div>
                    <ul className="space-y-2">
                      {selectedConcept.strongAnswerPoints.map((point, i) => (
                        <li key={i} className="flex gap-2 items-start text-xs text-text leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0 mt-1.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Common Mistake */}
                <div>
                  <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                    Common Mistake
                  </div>
                  <div className="border-b border-border mb-4" />
                  <div className="bg-red-dim border border-red/20 rounded-xl p-4">
                    <div className="text-[10px] font-mono text-red mb-1 uppercase tracking-wider">
                      Common mistake:
                    </div>
                    <p className="text-sm text-red mb-3 leading-relaxed">
                      {selectedConcept.commonMistake}
                    </p>
                  </div>
                </div>

                {/* Mini Task */}
                <div>
                  <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                    Mini Task
                  </div>
                  <div className="border-b border-border mb-4" />
                  <div className="border-2 border-dashed border-amber/30 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-amber mb-1 uppercase tracking-wider">
                        MINI TASK
                      </div>
                      <p className="text-xs text-text leading-relaxed mb-3">
                        {selectedConcept.miniTask}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleSolved(selectedConcept.id)}
                      className={`self-start rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus:outline-none ${
                        doneIds.includes(selectedConcept.id)
                          ? 'bg-green text-white hover:bg-green/90'
                          : 'border border-border text-text-muted hover:border-border-hover hover:text-text'
                      }`}
                    >
                      {doneIds.includes(selectedConcept.id) ? <><CheckCircle2 className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />Completed</> : 'Mark Completed'}
                    </button>
                  </div>
                </div>

                {/* YouTube */}
                {selectedConcept.ytQuery && (
                  <div>
                    <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-2">
                      YouTube Recommendation
                    </div>
                    <div className="border-b border-border mb-4" />
                    <div className="bg-red-dim border border-red/20 rounded-xl p-3 flex items-center justify-between gap-3">
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedConcept.ytQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-text min-w-0 hover:text-red transition-colors"
                      >
                        <svg className="w-5 h-5 text-red flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span className="truncate font-mono text-xs">
                          {selectedConcept.ytQuery}
                        </span>
                      </a>
                      <button
                        onClick={() => handleCopyYt(selectedConcept.ytQuery)}
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

            {/* Footer controls */}
            <div className="sticky bottom-0 bg-surface border-t border-border p-4 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.15)]">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleToggleSolved(selectedConcept.id)}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition-all w-full focus:outline-none ${
                    doneIds.includes(selectedConcept.id)
                      ? 'bg-green text-white border-transparent hover:bg-green/90'
                      : 'border border-border text-text-muted hover:border-border-hover hover:text-text'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    {doneIds.includes(selectedConcept.id) && <CheckCircle2 className="w-4 h-4" aria-hidden="true" />}
                    {doneIds.includes(selectedConcept.id) ? 'Done' : 'Mark Done'}
                  </span>
                </button>
                <button
                  onClick={() => handleToggleRevision(selectedConcept.id)}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition-all w-full focus:outline-none ${
                    revisionIds.includes(selectedConcept.id)
                      ? 'bg-amber text-white border-transparent hover:bg-amber/90'
                      : 'border border-border text-text-muted hover:border-border-hover hover:text-text'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    {revisionIds.includes(selectedConcept.id) && <Bookmark className="w-4 h-4" aria-hidden="true" />}
                    {revisionIds.includes(selectedConcept.id) ? 'Saved' : 'Add to Revision'}
                  </span>
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
