'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Circle, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { toggleProgress, getProgressIds } from '@/lib/progress'
import Badge from '@/components/shared/Badge'

import frontendPlan from '@/content/plans/frontend-30.json'
import backendPlan from '@/content/plans/backend-30.json'
import faangPlan from '@/content/plans/faang-60.json'

const PLANS: Record<string, typeof frontendPlan> = {
  'frontend-30': frontendPlan,
  'backend-30': backendPlan,
  'faang-60': faangPlan,
}

const STEP_TYPE_COLORS: Record<string, string> = {
  concept:   'bg-indigo-dim text-indigo-light',
  practice:  'bg-green/10 text-green',
  design:    'bg-amber/10 text-amber',
  behavioral:'bg-red-dim text-red',
  research:  'bg-surface-hover text-text-muted',
  review:    'bg-indigo-dim text-indigo-light',
}

export default function PlanDetailPage({ params }: { params: Promise<{ planId: string }> }) {
  const { planId } = use(params)
  const router = useRouter()
  const plan = PLANS[planId]

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    if (!plan) return
    getProgressIds('plan-step', 'done').then(ids => {
      const planIds = new Set(ids.filter(id => id.startsWith(`${planId}-`)))
      setCompletedSteps(planIds)
      setLoading(false)
    })
  }, [planId, plan])

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg gap-4">
        <p className="text-text-muted">Plan not found.</p>
        <button
          onClick={() => router.push('/fundamentals/plans')}
          className="text-indigo-light text-sm hover:underline"
        >
          Back to plans
        </button>
      </div>
    )
  }

  const completedCount = completedSteps.size
  const totalCount = plan.steps.length
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const handleToggleStep = async (stepId: string) => {
    const fullId = `${planId}-${stepId}`
    setToggling(fullId)
    const newVal = await toggleProgress(fullId, 'plan-step', 'done')
    setCompletedSteps(prev => {
      const next = new Set(prev)
      if (newVal) next.add(fullId)
      else next.delete(fullId)
      return next
    })
    setToggling(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 bg-surface border-b border-border z-10">
        <div className="px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/fundamentals/plans')}
            aria-label="Back to study plans"
            className="text-text-dim hover:text-text transition-colors p-1 rounded-lg hover:bg-surface-hover focus:outline-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">{plan.emoji}</span>
              <h1 className="text-lg font-bold text-text truncate">{plan.title}</h1>
            </div>
            <p className="text-xs text-text-muted mt-0.5">{plan.duration} · {plan.role}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-mono font-bold text-indigo-light">{pct}%</div>
            <div className="text-[10px] font-mono text-text-dim">{completedCount}/{totalCount} done</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-border">
          <div
            className="h-full bg-indigo transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="px-6 py-6 max-w-3xl flex flex-col gap-3">
        {loading ? (
          <div className="text-center text-text-dim text-sm py-16">Loading...</div>
        ) : (
          plan.steps.map((step, index) => {
            const fullId = `${planId}-${step.id}`
            const isDone = completedSteps.has(fullId)
            const isToggling = toggling === fullId
            const typeColor = STEP_TYPE_COLORS[step.type] ?? STEP_TYPE_COLORS.research

            return (
              <div
                key={step.id}
                className={`bg-surface border rounded-2xl p-5 transition-all duration-200 ${
                  isDone ? 'border-green/30 opacity-75' : 'border-border hover:border-border-hover'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step number / check */}
                  <button
                    type="button"
                    onClick={() => handleToggleStep(step.id)}
                    disabled={isToggling}
                    aria-label={isDone ? `Mark step ${index + 1} as incomplete` : `Mark step ${index + 1} as complete`}
                    className="flex-shrink-0 mt-0.5 focus:outline-none disabled:opacity-50"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-green" />
                    ) : (
                      <Circle className="w-6 h-6 text-border hover:text-text-muted transition-colors" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-mono text-text-dim">{step.day}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${typeColor}`}>
                        {step.tag}
                      </span>
                    </div>
                    <h3 className={`text-sm font-semibold leading-snug ${isDone ? 'text-text-muted line-through' : 'text-text'}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Link */}
                  <Link
                    href={step.href}
                    aria-label={`Open resource for ${step.title}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-shrink-0 text-text-dim hover:text-indigo-light transition-colors p-1 focus:outline-none"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })
        )}

        {/* Completion banner */}
        {!loading && completedCount === totalCount && totalCount > 0 && (
          <div className="bg-green/10 border border-green/30 rounded-2xl p-6 text-center mt-2">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-sm font-semibold text-green">Plan Complete!</p>
            <p className="text-xs text-text-muted mt-1">
              You&apos;ve finished all {totalCount} steps. Time to apply!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
