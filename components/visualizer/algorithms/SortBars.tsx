'use client'

import React from 'react'
import type { Bar } from '@/lib/visualizer/stepGenerators'

const BAR_COLORS: Record<string, string> = {
  default:   'bg-border',
  comparing: 'bg-amber',
  swapping:  'bg-red',
  sorted:    'bg-green',
  pivot:     'bg-indigo',
}

const BAR_LABELS: Record<string, string> = {
  comparing: 'Comparing',
  swapping:  'Swapping',
  sorted:    'Sorted',
  pivot:     'Pivot / Min',
  default:   '',
}

export default function SortBars({ bars }: { bars: Bar[] }) {
  const maxVal = Math.max(...bars.map((b) => b.value), 1)

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex gap-3 flex-wrap justify-center mb-4">
        {Object.entries(BAR_LABELS).filter(([, v]) => v).map(([state, label]) => (
          <div key={state} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-sm ${BAR_COLORS[state]}`} />
            <span className="text-[10px] font-mono text-text-dim">{label}</span>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div className="flex items-end justify-center gap-1.5 w-full" style={{ height: 160 }}>
        {bars.map((bar, i) => {
          const heightPct = (bar.value / maxVal) * 100
          const colorClass = BAR_COLORS[bar.state] ?? BAR_COLORS.default
          return (
            <div
              key={i}
              className="flex flex-col items-center justify-end gap-1 flex-1 min-w-0"
              style={{ height: '100%' }}
            >
              <span className="text-[9px] font-mono text-text-dim flex-shrink-0">{bar.value}</span>
              <div
                className={`w-full rounded-t-md transition-all duration-300 ${colorClass}`}
                style={{ height: `${heightPct}%`, minHeight: 4 }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
