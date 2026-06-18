import React from 'react'

interface BadgeProps {
  label: string
  variant: 'easy' | 'medium' | 'hard' | 'indigo' | 'amber' | 'green' | 'red' | 'muted'
  size?: 'sm' | 'md'
}

export default function Badge({ label, variant, size = 'sm' }: BadgeProps) {
  const dotColors = {
    easy: 'bg-green',
    medium: 'bg-amber',
    hard: 'bg-red',
    indigo: 'bg-text-muted',
    amber: 'bg-amber',
    green: 'bg-green',
    red: 'bg-red',
    muted: 'bg-text-dim',
  }

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md gap-1.5',
    md: 'text-[11px] px-2.5 py-1 rounded-md gap-2',
  }

  const dotColor = dotColors[variant] || 'bg-text-dim'

  return (
    <span className={`inline-flex items-center justify-center font-sans font-medium border border-border bg-surface-hover text-text-muted select-none ${sizeStyles[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} flex-shrink-0`} />
      {label}
    </span>
  )
}
