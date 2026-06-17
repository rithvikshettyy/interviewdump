import React from 'react'

interface ProgressCardProps {
  total: number
  solved: number
  easy: { total: number; solved: number }
  medium: { total: number; solved: number }
  hard: { total: number; solved: number }
}

function ProgressRing({ solved, total, strokeClass }: { solved: number; total: number; strokeClass: string }) {
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0">
      <svg className="w-12 h-12 transform -rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="#30363D"
          strokeWidth="3.5"
          fill="transparent"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          className={`${strokeClass} transition-all duration-300`}
          strokeWidth="3.5"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[9px] font-mono font-bold text-text-muted">
        {percentage}%
      </span>
    </div>
  )
}

export default function ProgressCard({ total, solved, easy, medium, hard }: ProgressCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* Total Card */}
      <div className="bg-surface border border-border rounded-xl p-5 flex items-center justify-between">
        <div>
          <div className="text-sm text-text-muted font-medium">Total Progress</div>
          <div className="text-3xl font-mono font-bold text-text mt-1">
            {solved} <span className="text-text-dim text-xl">/ {total}</span>
          </div>
        </div>
        <ProgressRing solved={solved} total={total} strokeClass="stroke-indigo" />
      </div>

      {/* Easy Card */}
      <div className="bg-surface border border-border rounded-xl p-5 flex items-center justify-between">
        <div>
          <div className="text-sm text-text-muted font-medium">Easy Questions</div>
          <div className="text-3xl font-mono font-bold text-green mt-1">
            {easy.solved} <span className="text-text-dim text-xl">/ {easy.total}</span>
          </div>
        </div>
        <ProgressRing solved={easy.solved} total={easy.total} strokeClass="stroke-green" />
      </div>

      {/* Medium Card */}
      <div className="bg-surface border border-border rounded-xl p-5 flex items-center justify-between">
        <div>
          <div className="text-sm text-text-muted font-medium">Medium Questions</div>
          <div className="text-3xl font-mono font-bold text-amber mt-1">
            {medium.solved} <span className="text-text-dim text-xl">/ {medium.total}</span>
          </div>
        </div>
        <ProgressRing solved={medium.solved} total={medium.total} strokeClass="stroke-amber" />
      </div>

      {/* Hard Card */}
      <div className="bg-surface border border-border rounded-xl p-5 flex items-center justify-between">
        <div>
          <div className="text-sm text-text-muted font-medium">Hard Questions</div>
          <div className="text-3xl font-mono font-bold text-red mt-1">
            {hard.solved} <span className="text-text-dim text-xl">/ {hard.total}</span>
          </div>
        </div>
        <ProgressRing solved={hard.solved} total={hard.total} strokeClass="stroke-red" />
      </div>
    </div>
  )
}
