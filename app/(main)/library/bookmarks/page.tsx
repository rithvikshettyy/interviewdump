'use client'

import { useEffect, useState, useCallback } from 'react'
import { Bookmark, ChevronDown, ChevronUp, Code2, MessageSquare, Monitor, Database, Zap, Hash, type LucideIcon } from 'lucide-react'
import { toggleProgress, getProgressIds } from '@/lib/progress'
import QuestionDrawer from '@/components/shared/QuestionDrawer'
import Badge from '@/components/shared/Badge'
import PageHeader from '@/components/layout/PageHeader'
import { Question } from '@/types'

// Static imports of all question banks
import backendQuestions from '@/content/questions/backend.json'
import frontendQuestions from '@/content/questions/frontend.json'
import dsaQuestions from '@/content/dsa/questions.json'
import sqlQuestions from '@/content/sql/questions.json'
import scenarioQuestions from '@/content/scenario/questions.json'
import corecsQuestions from '@/content/corecs/questions.json'
import logicalQuestions from '@/content/aptitude/logical.json'
import quantitativeQuestions from '@/content/aptitude/quantitative.json'

const CATEGORY_META: Record<string, { label: string; icon: LucideIcon; href: string }> = {
  interview: { label: 'Interview Questions', icon: MessageSquare, href: '/library/interview-questions' },
  dsa:       { label: 'DSA',                icon: Code2,         href: '/library/dsa' },
  corecs:    { label: 'Core CS',            icon: Monitor,       href: '/library/core-cs' },
  sql:       { label: 'SQL',                icon: Database,      href: '/library/sql' },
  scenario:  { label: 'Scenario Based',     icon: Zap,           href: '/library/scenario' },
  aptitude:  { label: 'Aptitude',           icon: Hash,          href: '/library/aptitude' },
}

// Flatten all question banks with their type tag
const ALL_QUESTIONS: (Question & { _category: string })[] = [
  ...(backendQuestions as any[]).map(q => ({ ...q, type: 'interview', _category: 'interview' })),
  ...(frontendQuestions as any[]).map(q => ({ ...q, type: 'interview', _category: 'interview' })),
  ...(dsaQuestions as any[]).map(q => ({ ...q, _category: 'dsa' })),
  ...(sqlQuestions as any[]).map(q => ({ ...q, _category: 'sql' })),
  ...(scenarioQuestions as any[]).map(q => ({ ...q, _category: 'scenario' })),
  ...(corecsQuestions as any[]).map(q => ({ ...q, _category: 'corecs' })),
  ...(logicalQuestions as any[]).map(q => ({ ...q, type: 'aptitude', _category: 'aptitude' })),
  ...(quantitativeQuestions as any[]).map(q => ({ ...q, type: 'aptitude', _category: 'aptitude' })),
]

export default function BookmarksPage() {
  const [revisionIds, setRevisionIds] = useState<Set<string>>(new Set())
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  const TYPES = ['interview', 'dsa', 'sql', 'scenario', 'corecs', 'aptitude']

  const fetchProgress = useCallback(async () => {
    const [revArrays, solArrays] = await Promise.all([
      Promise.all(TYPES.map(t => getProgressIds(t, 'revision'))),
      Promise.all(TYPES.map(t => getProgressIds(t, 'solved'))),
    ])
    setRevisionIds(new Set(revArrays.flat()))
    setSolvedIds(new Set(solArrays.flat()))
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  const bookmarkedQuestions = ALL_QUESTIONS.filter(q => revisionIds.has(q.id))

  // Group by category
  const grouped = bookmarkedQuestions.reduce<Record<string, (Question & { _category: string })[]>>(
    (acc, q) => {
      const cat = q._category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(q)
      return acc
    },
    {}
  )

  const handleToggleRevision = async (q: Question & { _category: string }) => {
    const newVal = await toggleProgress(q.id, q._category as any, 'revision')
    setRevisionIds(prev => {
      const next = new Set(prev)
      if (newVal) next.add(q.id)
      else next.delete(q.id)
      return next
    })
    if (!newVal && selectedQuestion?.id === q.id) {
      setSelectedQuestion(null)
    }
  }

  const handleToggleSolved = async (q: Question & { _category: string }) => {
    const newVal = await toggleProgress(q.id, q._category as any, 'solved')
    setSolvedIds(prev => {
      const next = new Set(prev)
      if (newVal) next.add(q.id)
      else next.delete(q.id)
      return next
    })
  }

  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <PageHeader
        title="Revision List"
        subtitle="Questions you've saved for review — across all categories."
      />

      <div className="px-6 py-6 max-w-4xl flex flex-col gap-4">
        {loading ? (
          <div className="text-center text-text-dim text-sm py-16">Loading bookmarks...</div>
        ) : bookmarkedQuestions.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-10 text-center flex flex-col items-center gap-3">
            <Bookmark className="w-8 h-8 text-text-dim" />
            <p className="text-sm text-text-muted">No questions saved for revision yet.</p>
            <p className="text-xs text-text-dim font-mono">
              Click &quot;Add to Revision&quot; on any question drawer to save it here.
            </p>
          </div>
        ) : (
          <>
            <div className="text-xs font-mono text-text-dim">
              {bookmarkedQuestions.length} question{bookmarkedQuestions.length !== 1 ? 's' : ''} saved
            </div>

            {Object.entries(grouped).map(([cat, questions]) => {
              const meta = CATEGORY_META[cat] ?? { label: cat, icon: Bookmark, href: '#' }
              const isCollapsed = collapsedCategories.has(cat)

              return (
                <div key={cat} className="bg-surface border border-border rounded-2xl overflow-hidden">
                  {/* Category Header */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-hover transition-colors focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <meta.icon className="w-4 h-4 text-text-dim" />
                      <span className="text-sm font-semibold text-text">{meta.label}</span>
                      <span className="text-xs font-mono bg-indigo-dim text-indigo-light px-2 py-0.5 rounded-full">
                        {questions.length}
                      </span>
                    </div>
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-text-dim" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-text-dim" />
                    )}
                  </button>

                  {/* Questions */}
                  {!isCollapsed && (
                    <div className="divide-y divide-border border-t border-border">
                      {questions.map(q => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setSelectedQuestion(q)}
                          className="w-full text-left px-5 py-3.5 hover:bg-surface-hover transition-colors flex items-center gap-3 group focus:outline-none"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              solvedIds.has(q.id) ? 'bg-green' : 'bg-border'
                            }`}
                          />
                          <span className="flex-1 text-sm text-text group-hover:text-indigo-light transition-colors leading-snug">
                            {q.question}
                          </span>
                          <Badge
                            label={q.difficulty}
                            variant={q.difficulty?.toLowerCase() as any}
                            size="sm"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* Question Drawer */}
      {selectedQuestion && (
        <QuestionDrawer
          question={selectedQuestion}
          isOpen={!!selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          isSolved={solvedIds.has(selectedQuestion.id)}
          isRevision={revisionIds.has(selectedQuestion.id)}
          onToggleSolved={() =>
            handleToggleSolved(selectedQuestion as Question & { _category: string })
          }
          onToggleRevision={() =>
            handleToggleRevision(selectedQuestion as Question & { _category: string })
          }
          showCompanies={true}
        />
      )}
    </div>
  )
}
