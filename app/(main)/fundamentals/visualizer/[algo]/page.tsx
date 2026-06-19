'use client'

import React, { useState, useEffect, useRef, use, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import VisualizerShell from '@/components/visualizer/VisualizerShell'
import SortBars from '@/components/visualizer/algorithms/SortBars'
import TreeViz from '@/components/visualizer/algorithms/TreeViz'
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateBinarySearchSteps,
  generateStackSteps,
  generateQueueSteps,
  generateBFSSteps,
  generateDFSSteps,
  type SortStep,
  type SearchStep,
  type StackStep,
  type QueueStep,
  type TreeStep,
  type StackItemState,
  type QueueItemState,
} from '@/lib/visualizer/stepGenerators'

const PRESET_ARRAY = [64, 25, 12, 22, 11, 45, 33]
const SORTED_ARRAY = [11, 12, 22, 25, 33, 45, 64]
const SEARCH_TARGET = 25

const ALGO_META: Record<string, { name: string; category: string }> = {
  'bubble-sort':    { name: 'Bubble Sort', category: 'Sorting' },
  'selection-sort': { name: 'Selection Sort', category: 'Sorting' },
  'binary-search':  { name: 'Binary Search', category: 'Searching' },
  'bfs':            { name: 'BFS Traversal', category: 'Trees / Graphs' },
  'dfs':            { name: 'DFS Traversal', category: 'Trees / Graphs' },
  'stack':          { name: 'Stack Operations', category: 'Data Structures' },
  'queue':          { name: 'Queue Operations', category: 'Data Structures' },
}

// ─── Stack / Queue Colors ────────────────────────────────────────────────────

const STACK_ITEM_COLORS: Record<StackItemState, string> = {
  default:  'bg-surface border-border text-text-muted',
  entering: 'bg-green-dim border-green text-green',
  leaving:  'bg-red-dim border-red text-red',
}

const QUEUE_ITEM_COLORS: Record<QueueItemState, string> = {
  default:   'bg-surface border-border text-text-muted',
  enqueuing: 'bg-green-dim border-green text-green',
  dequeuing: 'bg-red-dim border-red text-red',
}

// ─── Search Render ────────────────────────────────────────────────────────────

function SearchViz({ step }: { step: SearchStep }) {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-center items-end gap-1.5 flex-wrap">
        {step.array.map((val, i) => {
          const isElim = step.eliminated.includes(i)
          const isMid  = i === step.mid && !step.found
          const isFound = step.found && i === step.mid
          const isLow  = i === step.low && !isElim
          const isHigh = i === step.high && !isElim

          let cls = 'border-border bg-surface text-text-muted'
          if (isFound) cls = 'border-green bg-green-dim text-green'
          else if (isMid) cls = 'border-indigo bg-indigo-dim text-indigo-light'
          else if (isElim) cls = 'border-border/30 bg-surface/30 text-text-dim/30 line-through'

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-mono text-text-dim/60 h-3">
                {isLow && !isElim ? 'L' : ''}{isMid && !isFound ? 'M' : ''}{isHigh && !isElim ? 'H' : ''}{isFound ? '✓' : ''}
              </span>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 border rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${cls}`}>
                {val}
              </div>
              <span className="text-[8px] font-mono text-text-dim/60">{i}</span>
            </div>
          )
        })}
      </div>
      <div className="text-center text-xs font-mono text-text-muted">
        Target: <span className="text-amber font-bold">{step.target}</span>
      </div>
    </div>
  )
}

// ─── Stack Render ─────────────────────────────────────────────────────────────

function StackViz({ step }: { step: StackStep }) {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <span className="text-[10px] font-mono text-text-dim mb-1">↑ TOP</span>
      <div className="flex flex-col-reverse gap-1.5 min-h-[120px] justify-end w-40">
        {step.items.length === 0 ? (
          <div className="text-xs font-mono text-text-dim text-center py-4">Empty</div>
        ) : (
          step.items.map((item, i) => (
            <div
              key={i}
              className={`border rounded-lg px-4 py-2 text-center text-sm font-mono font-bold transition-all duration-300 ${STACK_ITEM_COLORS[item.state]}`}
            >
              {item.value}
            </div>
          ))
        )}
      </div>
      <span className="text-[10px] font-mono text-text-dim mt-1">↓ BOTTOM</span>
    </div>
  )
}

// ─── Queue Render ─────────────────────────────────────────────────────────────

function QueueViz({ step }: { step: QueueStep }) {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex items-center gap-1.5 flex-wrap justify-center min-h-[48px]">
        {step.items.length === 0 ? (
          <div className="text-xs font-mono text-text-dim text-center py-4">Empty</div>
        ) : (
          step.items.map((item, i) => (
            <div
              key={i}
              className={`border rounded-lg px-3 py-2 text-center text-sm font-mono font-bold transition-all duration-300 ${QUEUE_ITEM_COLORS[item.state]}`}
            >
              {item.value}
            </div>
          ))
        )}
      </div>
      <div className="flex justify-between w-full max-w-xs text-[10px] font-mono text-text-dim px-2">
        <span>← DEQUEUE (Front)</span>
        <span>ENQUEUE (Rear) →</span>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AlgoPage({ params }: { params: Promise<{ algo: string }> }) {
  const { algo } = use(params)
  const meta = ALGO_META[algo] ?? { name: algo, category: 'Algorithm' }

  const [steps, setSteps] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(600)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Generate steps on mount
  useEffect(() => {
    let generated: any[] = []
    if (algo === 'bubble-sort')    generated = generateBubbleSortSteps(PRESET_ARRAY)
    if (algo === 'selection-sort') generated = generateSelectionSortSteps(PRESET_ARRAY)
    if (algo === 'binary-search')  generated = generateBinarySearchSteps(SORTED_ARRAY, SEARCH_TARGET)
    if (algo === 'stack')          generated = generateStackSteps()
    if (algo === 'queue')          generated = generateQueueSteps()
    if (algo === 'bfs')            generated = generateBFSSteps()
    if (algo === 'dfs')            generated = generateDFSSteps()
    setSteps(generated)
    setCurrentStep(0)
    setIsPlaying(false)
  }, [algo])

  // Auto-play
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            clearInterval(intervalRef.current!)
            return prev
          }
          return prev + 1
        })
      }, speed)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, speed, steps.length])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    clearInterval(intervalRef.current!)
    setCurrentStep(0)
  }, [])

  const handlePlay  = () => setIsPlaying(true)
  const handlePause = () => { setIsPlaying(false); clearInterval(intervalRef.current!) }
  const handleNext  = () => { handlePause(); setCurrentStep((p) => Math.min(p + 1, steps.length - 1)) }
  const handlePrev  = () => { handlePause(); setCurrentStep((p) => Math.max(p - 1, 0)) }

  if (steps.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-bg items-center justify-center">
        <p className="text-text-muted text-sm">Algorithm not found.</p>
        <Link href="/fundamentals/visualizer" className="text-xs text-indigo-light mt-2 hover:underline">
          ← Back to Visualizer
        </Link>
      </div>
    )
  }

  const step = steps[currentStep]

  const isSortStep    = algo === 'bubble-sort' || algo === 'selection-sort'
  const isSearchStep  = algo === 'binary-search'
  const isStackStep   = algo === 'stack'
  const isQueueStep   = algo === 'queue'
  const isTreeStep    = algo === 'bfs' || algo === 'dfs'

  const sortStats = isSortStep
    ? <div className="flex gap-4 text-[10px] font-mono text-text-dim">
        <span>Comparisons: <b className="text-amber">{(step as SortStep).comparisons}</b></span>
        <span>Swaps: <b className="text-red">{(step as SortStep).swaps}</b></span>
      </div>
    : undefined

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Header */}
      <div className="border-b border-border bg-surface px-6 pt-5 pb-4">
        <Link
          href="/fundamentals/visualizer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> All algorithms
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-text-dim uppercase tracking-wider">{meta.category}</span>
          <span className="text-text-dim text-[10px]">•</span>
          <h1 className="text-xl font-bold text-text">{meta.name}</h1>
        </div>
        {isSearchStep && (
          <p className="text-xs text-text-muted mt-1 font-mono">
            Target: <span className="text-amber font-semibold">{SEARCH_TARGET}</span> · Array: [{SORTED_ARRAY.join(', ')}]
          </p>
        )}
        {isSortStep && (
          <p className="text-xs text-text-muted mt-1 font-mono">
            Input: [{PRESET_ARRAY.join(', ')}]
          </p>
        )}
      </div>

      <div className="px-6 py-6 max-w-3xl mx-auto w-full">
        <VisualizerShell
          currentStep={currentStep}
          totalSteps={steps.length}
          isPlaying={isPlaying}
          speed={speed}
          description={step.description}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
          onNext={handleNext}
          onPrev={handlePrev}
          onSpeedChange={setSpeed}
          statsLeft={sortStats}
        >
          {isSortStep   && <SortBars bars={(step as SortStep).bars} />}
          {isSearchStep && <SearchViz step={step as SearchStep} />}
          {isStackStep  && <StackViz  step={step as StackStep} />}
          {isQueueStep  && <QueueViz  step={step as QueueStep} />}
          {isTreeStep   && <TreeViz nodes={(step as TreeStep).nodes} edges={(step as TreeStep).edges} />}
        </VisualizerShell>
      </div>
    </div>
  )
}
