import React from 'react'

interface BadgeProps {
  label: string
  variant: 'easy' | 'medium' | 'hard' | 'indigo' | 'amber' | 'green' | 'red' | 'muted'
  size?: 'sm' | 'md'
}

export default function Badge({ label, variant, size = 'sm' }: BadgeProps) {
  const variantStyles = {
    easy: 'bg-green-dim text-green border border-green/20',
    medium: 'bg-amber-dim text-amber border border-amber/20',
    hard: 'bg-red-dim text-red border border-red/20',
    indigo: 'bg-indigo-dim text-indigo-light border border-indigo/20',
    amber: 'bg-amber-dim text-amber border border-amber/20',
    green: 'bg-green-dim text-green border border-green/20',
    red: 'bg-red-dim text-red border border-red/20',
    muted: 'bg-surface-hover text-text-muted border border-border',
  }

  const sizeStyles = {
    sm: 'text-[10px] font-mono px-2 py-0.5 rounded-full',
    md: 'text-xs font-mono px-2.5 py-1 rounded-full',
  }

  return (
    <span className={`inline-flex items-center justify-center font-medium ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {label}
    </span>
  )
}
