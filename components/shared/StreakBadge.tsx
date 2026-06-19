import { Flame } from 'lucide-react'

interface StreakBadgeProps {
  count: number
  size?: 'sm' | 'md'
}

export default function StreakBadge({ count, size = 'md' }: StreakBadgeProps) {
  if (!count) return null

  if (size === 'sm') {
    return (
      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber">
        <Flame className="w-3 h-3 text-amber" aria-hidden="true" />
        {count}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2 bg-amber-dim border border-amber/20 rounded-xl px-4 py-3">
      <Flame className="w-5 h-5 text-amber flex-shrink-0" aria-hidden="true" />
      <div>
        <div className="text-2xl font-mono font-bold text-amber leading-none">{count}</div>
        <div className="text-[10px] font-mono text-text-dim mt-0.5">day streak</div>
      </div>
    </div>
  )
}
