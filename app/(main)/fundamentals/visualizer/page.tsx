'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Badge from '@/components/shared/Badge'

const ALGORITHMS = [
  {
    slug: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Sorting',
    difficulty: 'Easy',
    description: 'Compare adjacent pairs and bubble the largest element to the end each pass.',
  },
  {
    slug: 'selection-sort',
    name: 'Selection Sort',
    category: 'Sorting',
    difficulty: 'Easy',
    description: 'Find the minimum element each pass and place it in its correct sorted position.',
  },
  {
    slug: 'binary-search',
    name: 'Binary Search',
    category: 'Searching',
    difficulty: 'Easy',
    description: 'Halve the search space on every step by comparing with the middle element.',
  },
  {
    slug: 'bfs',
    name: 'BFS Traversal',
    category: 'Trees / Graphs',
    difficulty: 'Medium',
    description: 'Explore a tree level-by-level using a queue. Finds the shortest path.',
  },
  {
    slug: 'dfs',
    name: 'DFS Traversal',
    category: 'Trees / Graphs',
    difficulty: 'Medium',
    description: 'Explore as deep as possible before backtracking. Uses a stack (or recursion).',
  },
  {
    slug: 'stack',
    name: 'Stack Operations',
    category: 'Data Structures',
    difficulty: 'Easy',
    description: 'LIFO structure — see push and pop operations visualized step by step.',
  },
  {
    slug: 'queue',
    name: 'Queue Operations',
    category: 'Data Structures',
    difficulty: 'Easy',
    description: 'FIFO structure — see enqueue and dequeue operations visualized step by step.',
  },
]

export default function VisualizerIndexPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <div className="border-b border-border bg-surface px-6 pt-6 pb-5">
        <h1 className="text-2xl font-bold text-text">Algorithm Visualizer</h1>
        <p className="text-sm text-text-muted mt-1">
          See algorithms in action — step by step with controls. Click any card to start.
        </p>
      </div>

      <div className="px-6 py-6 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
          {ALGORITHMS.map((algo) => (
            <Link
              key={algo.slug}
              href={`/fundamentals/visualizer/${algo.slug}`}
              className="bg-surface border border-border rounded-2xl p-5 hover:border-border-hover hover:bg-surface-hover transition-all duration-200 flex flex-col justify-between group focus:outline-none"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <Badge label={algo.category} variant="indigo" size="sm" />
                  <ArrowRight className="w-4 h-4 text-text-dim group-hover:text-text transition-colors" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-text group-hover:text-indigo-light transition-colors">
                  {algo.name}
                </h3>
                <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                  {algo.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
                <Badge label={algo.difficulty} variant={algo.difficulty.toLowerCase() as any} size="sm" />
                <span className="text-[10px] font-mono text-text-dim">Interactive</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
