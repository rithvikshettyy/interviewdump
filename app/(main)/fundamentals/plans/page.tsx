'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Zap, Wrench, Rocket, type LucideIcon } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Badge from '@/components/shared/Badge'
import { getProgressIds } from '@/lib/progress'
import plans from '@/content/plans/index.json'

const PLAN_ICONS: Record<string, LucideIcon> = {
  'frontend-30': Zap,
  'backend-30': Wrench,
  'faang-60': Rocket,
}

export default function PlansPage() {
  const router = useRouter()
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  useEffect(() => {
    getProgressIds('plan-step', 'done').then(ids => {
      setCompletedSteps(new Set(ids))
    })
  }, [])

  // Count completed steps per plan based on prefix matching
  function countCompleted(planId: string, total: number) {
    let count = 0
    for (const id of completedSteps) {
      if (id.startsWith(`${planId}-`)) count++
    }
    return Math.min(count, total)
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <PageHeader
        title="Study Plans"
        subtitle="Structured learning paths to guide your interview prep from start to finish."
      />

      <div className="px-4 sm:px-6 py-6 flex-1 bg-bg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl">
          {plans.map((plan) => {
            const completed = countCompleted(plan.id, plan.stepCount)
            const pct = plan.stepCount > 0 ? Math.round((completed / plan.stepCount) * 100) : 0

            return (
              <div
                key={plan.id}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/fundamentals/plans/${plan.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    router.push(`/fundamentals/plans/${plan.id}`)
                  }
                }}
                aria-label={`${plan.title}: ${plan.duration}, ${completed} of ${plan.stepCount} steps completed`}
                className="bg-surface border border-border rounded-2xl p-6 cursor-pointer hover:border-border-hover hover:bg-surface-hover transition-all duration-200 flex flex-col justify-between focus:outline-none"
              >
                <div>
                  {/* Top row */}
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 rounded-xl bg-indigo-dim flex items-center justify-center">
                      {(() => { const Icon = PLAN_ICONS[plan.id]; return Icon ? <Icon className="w-6 h-6 text-indigo-light" /> : null })()}
                    </div>
                    <div className="flex items-center gap-2">
                      {completed === plan.stepCount && completed > 0 && (
                        <CheckCircle2 className="w-5 h-5 text-green" />
                      )}
                      <Badge
                        label={plan.difficulty}
                        variant={plan.difficulty.toLowerCase() as any}
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Title & meta */}
                  <h2 className="text-xl font-bold text-text mt-4">{plan.title}</h2>
                  <p className="text-sm text-text-muted mt-2 leading-relaxed">{plan.description}</p>

                  {/* Tags */}
                  <div className="flex gap-1.5 flex-wrap mt-3">
                    {plan.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono bg-surface-hover border border-border text-text-muted rounded-full px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-text-dim">
                      {completed} / {plan.stepCount} steps
                    </span>
                    <span className="text-xs font-mono text-text-dim">{plan.duration}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-indigo rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-indigo-light">{plan.role}</span>
                    <ArrowRight className="w-4 h-4 text-text-dim" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
