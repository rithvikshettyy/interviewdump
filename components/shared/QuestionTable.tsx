import React from 'react'
import { CheckCircle, Bookmark } from 'lucide-react'
import { Question } from '@/types'
import Badge from './Badge'

interface QuestionTableProps {
  questions: Question[]
  onQuestionClick: (q: Question) => void
  solvedIds: string[]
  revisionIds: string[]
  onToggleSolved: (id: string) => void
  onToggleRevision: (id: string) => void
  showRoleColumn?: boolean
  showTopicColumn?: boolean
}

export default function QuestionTable({
  questions,
  onQuestionClick,
  solvedIds,
  revisionIds,
  onToggleSolved,
  onToggleRevision,
  showRoleColumn = false,
  showTopicColumn = false,
}: QuestionTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-surface border-b border-border sticky top-0 z-10">
            <th className="text-[11px] font-mono text-text-dim uppercase tracking-wider px-4 py-3 w-16">#</th>
            <th className="text-[11px] font-mono text-text-dim uppercase tracking-wider px-4 py-3">Question</th>
            {showRoleColumn && (
              <th className="text-[11px] font-mono text-text-dim uppercase tracking-wider px-4 py-3 w-32">Role</th>
            )}
            {showTopicColumn && (
              <th className="text-[11px] font-mono text-text-dim uppercase tracking-wider px-4 py-3 w-28">Topic</th>
            )}
            <th className="text-[11px] font-mono text-text-dim uppercase tracking-wider px-4 py-3 w-24">Difficulty</th>
            <th className="text-[11px] font-mono text-text-dim uppercase tracking-wider px-4 py-3 w-16 text-center">Solved</th>
            <th className="text-[11px] font-mono text-text-dim uppercase tracking-wider px-4 py-3 w-16 text-center">Revision</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => {
            const isSolved = solvedIds.includes(q.id)
            const isRevision = revisionIds.includes(q.id)

            let indicatorColor = 'bg-transparent'
            if (isSolved && isRevision) {
              indicatorColor = 'bg-indigo'
            } else if (isSolved) {
              indicatorColor = 'bg-green'
            } else if (isRevision) {
              indicatorColor = 'bg-amber'
            }

            return (
              <tr
                key={q.id}
                onClick={() => onQuestionClick(q)}
                tabIndex={0}
                role="button"
                aria-haspopup="dialog"
                aria-label={`Question ${q.number !== undefined ? `#${q.number}` : ''}: ${q.question}. ${q.difficulty} difficulty. Click or press enter to view details.`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onQuestionClick(q)
                  }
                }}
                className="border-b border-border last:border-none cursor-pointer hover:bg-surface-hover transition-colors duration-150 focus:outline-none"
              >
                {/* Number cell with Left Indicator */}
                <td className="px-4 py-[15px] relative font-mono text-[11px] text-text-dim w-16">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${indicatorColor}`} />
                  {q.number !== undefined ? `#${q.number}` : '-'}
                </td>

                {/* Question Info Cell */}
                <td className="px-4 py-[15px]">
                  <div className="text-sm text-text font-medium leading-snug">{q.question}</div>
                  <div className="text-xs text-text-muted mt-0.5 line-clamp-1">{q.summary}</div>
                  {q.companies && q.companies.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-2">
                      {q.companies.map((company) => (
                        <span
                          key={company}
                          className="text-[10px] font-mono bg-surface-hover border border-border text-text-muted rounded-full px-2 py-0.5"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  )}
                </td>

                {/* Optional Role Column */}
                {showRoleColumn && (
                  <td className="px-4 py-[15px] text-xs text-text-muted w-32">
                    {q.roles && q.roles.length > 0 ? q.roles.join(', ') : '-'}
                  </td>
                )}

                {/* Optional Topic Column */}
                {showTopicColumn && (
                  <td className="px-4 py-[15px] text-xs text-text-muted w-28">
                    {q.topic || '-'}
                  </td>
                )}

                {/* Difficulty Column */}
                <td className="px-4 py-[15px] w-24">
                  <Badge
                    label={q.difficulty}
                    variant={q.difficulty.toLowerCase() as any}
                  />
                </td>

                {/* Solved Action Column */}
                <td className="px-4 py-[15px] w-16 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleSolved(q.id)
                    }}
                    aria-label={isSolved ? "Mark as unsolved" : "Mark as solved"}
                    className="focus:outline-none hover:scale-110 transition transform active:scale-95 inline-block cursor-pointer"
                  >
                    <CheckCircle
                      aria-hidden="true"
                      className={`w-5 h-5 ${isSolved ? 'text-green' : 'text-text-dim'}`}
                    />
                  </button>
                </td>

                {/* Revision Action Column */}
                <td className="px-4 py-[15px] w-16 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleRevision(q.id)
                    }}
                    aria-label={isRevision ? "Remove from revision list" : "Add to revision list"}
                    className="focus:outline-none hover:scale-110 transition transform active:scale-95 inline-block cursor-pointer"
                  >
                    <Bookmark
                      aria-hidden="true"
                      className={`w-5 h-5 ${isRevision ? 'text-amber' : 'text-text-dim'}`}
                    />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
