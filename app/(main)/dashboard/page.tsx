'use client'

import { useEffect, useState } from 'react'
import { getStatsByType } from '@/lib/progress'
import PageHeader from '@/components/layout/PageHeader'
import Link from 'next/link'
import { Code2, MessageSquare, Monitor, Database, Hash, Zap, type LucideIcon } from 'lucide-react'

// Total question counts per category (static)
const TOTALS: Record<string, { label: string; total: number; href: string; icon: LucideIcon }> = {
  dsa:       { label: 'DSA',                href: '/library/dsa',                icon: Code2,         total: 50 },
  interview: { label: 'Interview Questions', href: '/library/interview-questions', icon: MessageSquare, total: 40 },
  corecs:    { label: 'Core CS Subjects',   href: '/library/core-cs',             icon: Monitor,       total: 25 },
  sql:       { label: 'SQL Questions',      href: '/library/sql',                 icon: Database,      total: 20 },
  aptitude:  { label: 'Aptitude',           href: '/library/aptitude',            icon: Hash,          total: 60 },
  scenario:  { label: 'Scenario Based',     href: '/library/scenario',            icon: Zap,           total: 15 },
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
      <div
        className="h-full bg-indigo rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Record<string, { solved: number; revision: number }>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStatsByType()
      .then((data) => {
        setStats(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalSolved = Object.values(stats).reduce((sum, s) => sum + s.solved, 0)
  const totalRevision = Object.values(stats).reduce((sum, s) => sum + s.revision, 0)
  const totalAvailable = Object.values(TOTALS).reduce((sum, t) => sum + t.total, 0)
  const overallPct = totalAvailable > 0 ? Math.round((totalSolved / totalAvailable) * 100) : 0

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <PageHeader
        title="Your Progress"
        subtitle="Track how much you've covered across every section."
      />

      <div className="px-6 py-6 max-w-3xl mx-auto w-full flex flex-col gap-6">
        {/* Overall summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Solved</span>
            <span className="text-3xl font-bold font-mono text-indigo-light">{loading ? '—' : totalSolved}</span>
            <span className="text-xs text-text-muted">of {totalAvailable} questions</span>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Revision</span>
            <span className="text-3xl font-bold font-mono text-amber">{loading ? '—' : totalRevision}</span>
            <span className="text-xs text-text-muted">marked to review</span>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Completion</span>
            <span className="text-3xl font-bold font-mono text-green">{loading ? '—' : `${overallPct}%`}</span>
            <span className="text-xs text-text-muted">overall coverage</span>
          </div>
        </div>

        {/* Overall progress bar */}
        {!loading && (
          <div className="bg-surface border border-border rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-text">Overall Progress</span>
              <span className="text-xs font-mono text-text-muted">{totalSolved} / {totalAvailable}</span>
            </div>
            <ProgressBar value={totalSolved} max={totalAvailable} />
          </div>
        )}

        {/* Per-category breakdown */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">By Category</span>
          </div>
          {loading ? (
            <div className="px-5 py-8 text-center text-text-dim text-sm">Loading...</div>
          ) : (
            <div className="divide-y divide-border">
              {Object.entries(TOTALS).map(([type, info]) => {
                const s = stats[type] ?? { solved: 0, revision: 0 }
                const pct = info.total > 0 ? Math.round((s.solved / info.total) * 100) : 0
                return (
                  <Link
                    key={type}
                    href={info.href}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-surface-hover transition-colors group"
                  >
                    <info.icon className="w-5 h-5 text-text-dim flex-shrink-0 group-hover:text-indigo transition-colors" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-text group-hover:text-indigo-light transition-colors">
                          {info.label}
                        </span>
                        <span className="text-xs font-mono text-text-muted ml-2 flex-shrink-0">
                          {s.solved} / {info.total}
                          {s.revision > 0 && (
                            <span className="ml-2 text-amber">{s.revision} rev</span>
                          )}
                        </span>
                      </div>
                      <ProgressBar value={s.solved} max={info.total} />
                    </div>
                    <span className="text-xs font-mono text-text-dim w-8 text-right flex-shrink-0">
                      {pct}%
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        {!loading && totalSolved === 0 && (
          <div className="bg-indigo-dim border border-indigo/20 rounded-2xl p-5 text-center">
            <p className="text-sm text-text-muted mb-3">No questions solved yet. Start practicing!</p>
            <Link
              href="/library/interview-questions"
              className="inline-block bg-indigo hover:bg-indigo/90 text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-colors"
            >
              Start with Interview Questions →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
