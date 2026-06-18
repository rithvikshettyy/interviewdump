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
  showCompanies?: boolean
  layoutVariant?: 'default' | 'role-wise'
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
  showCompanies = true,
  layoutVariant,
}: QuestionTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className={`${layoutVariant === 'role-wise' ? 'border-b border-border bg-transparent' : 'bg-surface border-b border-border'} sticky top-0 z-10`}>
            <th className={`text-[11px] font-mono text-text-dim uppercase tracking-wider px-4 py-3 ${layoutVariant === 'role-wise' ? 'w-12 text-center' : 'w-16'}`}>#</th>
            <th className="text-[11px] font-mono text-text-dim uppercase tracking-wider px-4 py-3">Question</th>
            {layoutVariant !== 'role-wise' && showRoleColumn && (
              <th className="text-[11px] font-mono text-text-dim uppercase tracking-wider px-4 py-3 w-32">Role</th>
            )}
            {layoutVariant !== 'role-wise' && showTopicColumn && (
              <th className="text-[11px] font-mono text-text-dim uppercase tracking-wider px-4 py-3 w-28">Topic</th>
            )}
            <th className={`text-[11px] font-mono text-text-dim uppercase tracking-wider px-4 py-3 ${layoutVariant === 'role-wise' ? 'w-28 text-center' : 'w-24'}`}>Difficulty</th>
            <th className={`text-[11px] font-mono text-text-dim uppercase tracking-wider px-4 py-3 text-center ${layoutVariant === 'role-wise' ? 'w-20' : 'w-16'}`}>Solved</th>
            <th className={`text-[11px] font-mono text-text-dim uppercase tracking-wider px-4 py-3 text-center ${layoutVariant === 'role-wise' ? 'w-20' : 'w-16'}`}>Revision</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, idx) => {
            const isSolved = solvedIds.includes(q.id)
            const isRevision = revisionIds.includes(q.id)

            if (layoutVariant === 'role-wise') {
              return (
                <tr
                  key={q.id}
                  onClick={() => onQuestionClick(q)}
                  tabIndex={0}
                  role="button"
                  aria-haspopup="dialog"
                  aria-label={`Question ${idx + 1}: ${q.question}. ${q.difficulty} difficulty.`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onQuestionClick(q)
                    }
                  }}
                  className="border-b border-border/40 last:border-none cursor-pointer hover:bg-surface-hover/60 transition-colors duration-150 focus:outline-none"
                >
                  {/* Number cell (Centered, no indicator bar) */}
                  <td className="px-4 py-3.5 text-center font-mono text-xs text-text-dim w-12">
                    {idx + 1}
                  </td>

                  {/* Question Title (Single line, text-text, font-medium) */}
                  <td className="px-4 py-3.5">
                    <div className="text-sm text-text font-medium leading-relaxed hover:text-indigo-light transition-colors">
                      {q.question}
                    </div>
                  </td>

                  {/* Difficulty (Centered) */}
                  <td className="px-4 py-3.5 text-center w-28">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${
                      q.difficulty === 'Easy'
                        ? 'bg-green-dim/30 border-green/20 text-green-light'
                        : q.difficulty === 'Medium'
                        ? 'bg-amber-dim/30 border-amber/20 text-amber-light'
                        : 'bg-red-dim/30 border-red/20 text-red-light'
                    }`}>
                      {q.difficulty}
                    </span>
                  </td>

                  {/* Solved (Check icon, clickable or row action) */}
                  <td className="px-4 py-3.5 text-center w-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleSolved(q.id)
                      }}
                      className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-colors focus:outline-none ${
                        isSolved
                          ? 'text-green hover:bg-green-dim/10'
                          : 'text-text-dim hover:text-text hover:bg-surface-hover'
                      }`}
                    >
                      <CheckCircle
                        className="w-5 h-5 stroke-[1.5]"
                        fill={isSolved ? 'currentColor' : 'transparent'}
                        stroke={isSolved ? 'var(--bg)' : 'currentColor'}
                      />
                    </button>
                  </td>

                  {/* Revision (Bookmark icon, clickable or row action) */}
                  <td className="px-4 py-3.5 text-center w-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleRevision(q.id)
                      }}
                      className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-colors focus:outline-none ${
                        isRevision
                          ? 'text-amber hover:bg-amber-dim/10'
                          : 'text-text-dim hover:text-text hover:bg-surface-hover'
                      }`}
                    >
                      <Bookmark
                        className="w-5 h-5 stroke-[1.5]"
                        fill={isRevision ? 'currentColor' : 'transparent'}
                      />
                    </button>
                  </td>
                </tr>
              )
            }

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
                  {showCompanies && q.companies && q.companies.length > 0 && (
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
