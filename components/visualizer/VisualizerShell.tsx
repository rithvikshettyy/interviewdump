'use client'

import React from 'react'
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Minus, Plus } from 'lucide-react'

interface Props {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: number
  description: string
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onNext: () => void
  onPrev: () => void
  onSpeedChange: (s: number) => void
  statsLeft?: React.ReactNode
  children: React.ReactNode
}

export default function VisualizerShell({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  description,
  onPlay,
  onPause,
  onReset,
  onNext,
  onPrev,
  onSpeedChange,
  statsLeft,
  children,
}: Props) {
  const progress = totalSteps > 0 ? Math.round((currentStep / (totalSteps - 1)) * 100) : 0

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Canvas */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-mono text-text-dim">
            Step <span className="text-indigo-light font-bold">{currentStep + 1}</span> / {totalSteps}
          </span>
          {statsLeft}
        </div>
        <div className="px-5 py-6 min-h-[220px] flex items-end justify-center">
          {children}
        </div>
      </div>

      {/* Description */}
      <div className="bg-surface border border-border rounded-xl px-4 py-3 min-h-[48px] flex items-center">
        <p className="text-sm text-text-muted leading-relaxed">{description}</p>
      </div>

      {/* Progress */}
      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Playback */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            title="Reset"
            className="p-2 rounded-lg border border-border text-text-dim hover:text-text hover:border-border-hover transition-colors focus:outline-none"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={onPrev}
            disabled={currentStep === 0}
            title="Previous"
            className="p-2 rounded-lg border border-border text-text-dim hover:text-text hover:border-border-hover transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipBack className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={isPlaying ? onPause : onPlay}
            title={isPlaying ? 'Pause' : 'Play'}
            className="p-2.5 rounded-lg bg-indigo text-bg hover:opacity-90 transition-all focus:outline-none"
          >
            {isPlaying
              ? <Pause className="w-4 h-4" aria-hidden="true" />
              : <Play className="w-4 h-4" aria-hidden="true" />
            }
          </button>
          <button
            onClick={onNext}
            disabled={currentStep >= totalSteps - 1}
            title="Next"
            className="p-2 rounded-lg border border-border text-text-dim hover:text-text hover:border-border-hover transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipForward className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Speed */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-text-dim">Speed</span>
          <button
            onClick={() => onSpeedChange(Math.min(speed + 100, 1000))}
            className="p-1 rounded border border-border text-text-dim hover:text-text focus:outline-none"
          >
            <Minus className="w-3 h-3" aria-hidden="true" />
          </button>
          <span className="text-xs font-mono text-text w-16 text-center">
            {speed >= 1000 ? 'Slow' : speed >= 600 ? 'Normal' : speed >= 300 ? 'Fast' : 'Fastest'}
          </span>
          <button
            onClick={() => onSpeedChange(Math.max(speed - 100, 100))}
            className="p-1 rounded border border-border text-text-dim hover:text-text focus:outline-none"
          >
            <Plus className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
