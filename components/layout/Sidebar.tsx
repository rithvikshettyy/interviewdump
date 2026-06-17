'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getStats } from '@/lib/progress'
import Logo from '@/components/shared/Logo'
import {
  Building2,
  MessageSquare,
  Code2,
  FileQuestion,
  Layers,
  Hash,
  Monitor,
  BookOpen,
  Boxes,
  Zap,
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const [stats, setStats] = useState({ solved: 0, revision: 0, done: 0 })

  useEffect(() => {
    getStats().then(setStats)
  }, [])

  const groups = [
    {
      label: 'Library',
      items: [
        { icon: Building2, label: 'Company Questions', href: '/library/company-questions' },
        { icon: MessageSquare, label: 'Interview Questions', href: '/library/interview-questions' },
        { icon: Code2, label: 'DSA', href: '/library/dsa' },
        { icon: FileQuestion, label: 'Scenario Based', href: '/library/scenario' },
        { icon: Layers, label: 'Role Wise Resources', href: '/library/role-wise' },
        { icon: Hash, label: 'Aptitude Questions', href: '/library/aptitude' },
        { icon: Monitor, label: 'Core CS Subjects', href: '/library/core-cs' },
      ],
    },
    {
      label: 'Fundamentals',
      items: [
        { icon: BookOpen, label: 'Languages', href: '/fundamentals/languages' },
        { icon: Boxes, label: 'OOPs Concepts', href: '/fundamentals/oops' },
        { icon: Zap, label: 'Quiz', href: '/fundamentals/quiz' },
      ],
    },
  ]

  return (
    <aside className="w-[240px] h-screen fixed left-0 top-0 bg-surface border-r border-border z-50 flex flex-col justify-between">
      {/* Scrollable upper area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Logo Section */}
        <div className="p-5 border-b border-border">
          <Logo size="md" />
          <div className="text-[10px] text-text-dim font-mono mt-1 uppercase tracking-wider">
            Free. Open Source. No Paywall.
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-3 py-3 border-b border-border">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="bg-bg border border-border rounded-lg text-sm text-text px-3 py-2 pr-10 w-full focus:border-indigo focus:outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-dim font-mono pointer-events-none">
              ⌘K
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="pb-6">
          {groups.map((group) => (
            <div key={group.label}>
              <div className="px-3 mt-5 mb-1 text-[10px] font-mono text-text-dim uppercase tracking-widest">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname.startsWith(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg transition-all duration-150 ${
                        isActive
                          ? 'bg-indigo-dim text-text font-semibold'
                          : 'bg-transparent text-text-muted hover:bg-surface-hover hover:text-text'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-indigo'
                            : 'text-text-dim group-hover:text-text-muted'
                        }`}
                      />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-border p-4 bg-surface">
        {/* Stats Row */}
        <div className="flex gap-3 mb-3">
          <span className="text-xs font-mono bg-green-dim text-green px-2.5 py-1 rounded-full">
            ✓ {stats.solved} solved
          </span>
          <span className="text-xs font-mono bg-amber-dim text-amber px-2.5 py-1 rounded-full">
            🔖 {stats.revision} saved
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* GitHub Button */}
          <a
            href="https://github.com/rithvikshettyy/interviewdump"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border border-border text-text-muted text-sm rounded-lg py-2 hover:border-border-hover hover:text-text transition flex items-center justify-center gap-2 font-medium"
          >
            <span>⭐</span> Star on GitHub
          </a>

          {/* Twitter Button */}
          <a
            href="https://x.com/RithvikShetty04"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border border-border text-text-muted text-sm rounded-lg py-2 hover:border-border-hover hover:text-text transition flex items-center justify-center gap-2 font-medium"
          >
            <span className="font-sans font-bold">𝕏</span> Follow @RithvikShetty04
          </a>
        </div>

        {/* MIT License */}
        <div className="text-center text-[10px] text-text-dim font-mono mt-3 uppercase tracking-wide">
          100% FREE • MIT LICENSE
        </div>
      </div>
    </aside>
  )
}
