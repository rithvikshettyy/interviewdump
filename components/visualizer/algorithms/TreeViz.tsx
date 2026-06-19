'use client'

import React from 'react'
import type { TreeNode, TreeEdge } from '@/lib/visualizer/stepGenerators'

const NODE_COLORS: Record<string, { fill: string; text: string; stroke: string }> = {
  default:  { fill: '#0A0A0A', text: '#A1A1AA', stroke: '#1E1E1E' },
  visiting: { fill: '#F59E0B22', text: '#F59E0B', stroke: '#F59E0B' },
  visited:  { fill: '#22C55E22', text: '#22C55E', stroke: '#22C55E' },
  current:  { fill: '#FAFAFA22', text: '#FAFAFA', stroke: '#FAFAFA' },
  found:    { fill: '#22C55E44', text: '#22C55E', stroke: '#22C55E' },
}

export default function TreeViz({ nodes, edges }: { nodes: TreeNode[]; edges: TreeEdge[] }) {
  return (
    <svg
      viewBox="0 0 100 90"
      className="w-full"
      style={{ maxHeight: 220 }}
      aria-label="Tree traversal visualization"
    >
      {/* Edges */}
      {edges.map((edge, i) => {
        const from = nodes.find((n) => n.id === edge.from)
        const to   = nodes.find((n) => n.id === edge.to)
        if (!from || !to) return null
        return (
          <line
            key={i}
            x1={from.x} y1={from.y + 3}
            x2={to.x}   y2={to.y - 3}
            stroke="#1E1E1E"
            strokeWidth="0.8"
          />
        )
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const colors = NODE_COLORS[node.state] ?? NODE_COLORS.default
        return (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={4.5}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth="0.8"
              style={{ transition: 'all 0.4s ease' }}
            />
            <text
              x={node.x}
              y={node.y + 1.2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="3.5"
              fill={colors.text}
              fontFamily="JetBrains Mono, monospace"
              fontWeight="600"
            >
              {node.value}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
