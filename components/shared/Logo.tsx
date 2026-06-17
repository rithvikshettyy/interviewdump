import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  }

  const sizeClass = sizeClasses[size] || sizeClasses.md

  return (
    <span className={`font-mono font-bold tracking-tight select-none ${sizeClass}`}>
      <span className="text-white">Interview</span>
      <span className="text-indigo">Dump</span>
    </span>
  )
}
