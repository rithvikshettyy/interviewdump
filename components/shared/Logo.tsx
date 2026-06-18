import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  }

  const sizeClass = sizeClasses[size] || sizeClasses.md

  return (
    <span className={`font-mono font-semibold tracking-tight select-none text-white ${sizeClass}`}>
      interview<span className="text-text-muted">.</span>dump
    </span>
  )
}
