'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Logo } from '@/components/shared/Logo'
import { createClient } from '@/lib/supabase/client'
import SettingsDrawer from '@/components/shared/SettingsDrawer'
import StreakBadge from '@/components/shared/StreakBadge'
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
  Settings,
  Search,
  Database,
  LayoutDashboard,
  FileText,
  Bookmark,
  Map,
  Menu,
  X,
  Activity,
  Coffee,
  ClipboardList,
  BrainCircuit,
  GitBranch,
  Rocket,
  Cloud,
  Brain,
  Globe,
  ShieldCheck,
  Server,
} from 'lucide-react'

// Import question databases statically for global client search
import backendQuestions from '@/content/questions/backend.json'
import frontendQuestions from '@/content/questions/frontend.json'
import dsaQuestions from '@/content/dsa/questions.json'
import sqlQuestions from '@/content/sql/questions.json'
import scenarioQuestions from '@/content/scenario/questions.json'
import logicalQuestions from '@/content/aptitude/logical.json'
import quantitativeQuestions from '@/content/aptitude/quantitative.json'
import companies from '@/content/companies/index.json'
import javaQuestions from '@/content/questions/java.json'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  // ── Search State ─────────────────────────────────────────────────────────
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchModalRef = useRef<HTMLDivElement>(null)

  // ── Build Search Index ───────────────────────────────────────────────────
  const searchItems = useMemo(() => {
    const items: Array<{
      id: string
      title: string
      subtitle: string
      type: 'question' | 'company'
      href: string
    }> = []

    backendQuestions.forEach((q) => {
      items.push({
        id: q.id,
        title: q.question,
        subtitle: `Backend Question • ${q.topic}`,
        type: 'question',
        href: `/library/interview-questions?questionId=${q.id}`,
      })
    })

    frontendQuestions.forEach((q) => {
      items.push({
        id: q.id,
        title: q.question,
        subtitle: `Frontend Question • ${q.topic}`,
        type: 'question',
        href: `/library/interview-questions?questionId=${q.id}`,
      })
    })

    dsaQuestions.forEach((q) => {
      items.push({
        id: q.id,
        title: q.question,
        subtitle: `DSA • ${q.topic}`,
        type: 'question',
        href: `/library/dsa?questionId=${q.id}`,
      })
    })

    sqlQuestions.forEach((q) => {
      items.push({
        id: q.id,
        title: q.question,
        subtitle: `SQL • ${q.topic}`,
        type: 'question',
        href: `/library/sql?questionId=${q.id}`,
      })
    })

    scenarioQuestions.forEach((q) => {
      items.push({
        id: q.id,
        title: q.question,
        subtitle: `Scenario • ${q.topic}`,
        type: 'question',
        href: `/library/scenario?questionId=${q.id}`,
      })
    })

    logicalQuestions.forEach((q) => {
      items.push({
        id: q.id,
        title: q.question,
        subtitle: `Aptitude (Logical) • ${q.category}`,
        type: 'question',
        href: `/library/aptitude?questionId=${q.id}`,
      })
    })

    quantitativeQuestions.forEach((q) => {
      items.push({
        id: q.id,
        title: q.question,
        subtitle: `Aptitude (Quantitative) • ${q.category}`,
        type: 'question',
        href: `/library/aptitude?questionId=${q.id}`,
      })
    })

    javaQuestions.forEach((q: any) => {
      items.push({
        id: q.id,
        title: q.question,
        subtitle: `Java • ${q.topic}`,
        type: 'question',
        href: `/library/java?questionId=${q.id}`,
      })
    })

    companies.forEach((c) => {
      items.push({
        id: c.slug,
        title: c.name,
        subtitle: `Company Question Bank • ${c.sector}`,
        type: 'company',
        href: `/library/company-questions/${c.slug}`,
      })
    })

    return items
  }, [])

  // ── Filter Search Items ──────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return searchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query)
    ).slice(0, 15)
  }, [searchQuery, searchItems])

  // ── Keyboard Shortcuts (Cmd+K / Ctrl+K) ──────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // ── Search Focus Trap & Escape Handler ───────────────────────────────────
  useEffect(() => {
    if (!isSearchOpen) return

    const previousActiveElement = document.activeElement as HTMLElement

    // Focus the input within search modal on open
    setTimeout(() => {
      const inputEl = searchModalRef.current?.querySelector('input')
      if (inputEl) {
        inputEl.focus()
      }
    }, 50)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        return
      }

      if (e.key === 'Tab') {
        if (!searchModalRef.current) return
        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        const focusableElements = Array.from(
          searchModalRef.current.querySelectorAll(focusableSelectors)
        ) as HTMLElement[]

        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previousActiveElement) {
        previousActiveElement.focus()
      }
    }
  }, [isSearchOpen])

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          if (profile) {
            setProfile(profile)
          }
        }
      } catch (err) {
        console.error('Error fetching user profile:', err)
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchUserAndProfile()
  }, [])

  const groups = [
    {
      label: 'Getting Started',
      items: [
        { icon: BookOpen, label: 'Introduction', href: '/introduction' },
        { icon: Rocket, label: 'Beginner Basics', href: '/getting-started' },
      ],
    },
    {
      label: 'Library',
      items: [
        { icon: LayoutDashboard, label: 'My Progress', href: '/dashboard' },
        { icon: ClipboardList, label: 'Mock Test', href: '/library/mock-test' },
        { icon: Building2, label: 'Company Questions', href: '/library/company-questions' },
        { icon: MessageSquare, label: 'Interview Questions', href: '/library/interview-questions' },
        { icon: Code2, label: 'DSA', href: '/library/dsa' },
        { icon: FileQuestion, label: 'Scenario Based', href: '/library/scenario' },
        { icon: Layers, label: 'Role Wise Resources', href: '/library/role-wise' },
        { icon: Hash, label: 'Aptitude Questions', href: '/library/aptitude' },
        { icon: Monitor, label: 'Core CS Subjects', href: '/library/core-cs' },
        { icon: Database, label: 'SQL Questions', href: '/library/sql' },
        { icon: Coffee, label: 'Java', href: '/library/java' },
        { icon: Bookmark, label: 'Revision List', href: '/library/bookmarks' },
      ],
    },
    {
      label: 'Fundamentals',
      items: [
        { icon: BookOpen, label: 'Languages', href: '/fundamentals/languages' },
        { icon: Boxes, label: 'OOPs Concepts', href: '/fundamentals/oops' },
        { icon: GitBranch, label: 'Git & GitHub', href: '/fundamentals/github' },
        { icon: BrainCircuit, label: 'Flashcards', href: '/fundamentals/flashcards' },
        { icon: Zap, label: 'Quiz', href: '/fundamentals/quiz' },
        { icon: Activity, label: 'Visualizer', href: '/fundamentals/visualizer' },
        { icon: Map, label: 'Study Plans', href: '/fundamentals/plans' },
        { icon: FileText, label: 'Resume Guide', href: '/resume' },
      ],
    },
    {
      label: 'Beyond Code',
      items: [
        { icon: Monitor, label: 'Frontend', href: '/beyond-code/frontend' },
        { icon: Server, label: 'Backend', href: '/beyond-code/backend' },
        { icon: Cloud, label: 'Cloud & DevOps', href: '/beyond-code/cloud-devops' },
        { icon: Globe, label: 'REST APIs', href: '/beyond-code/rest-apis' },
        { icon: Brain, label: 'ML Basics', href: '/beyond-code/ml-basics' },
        { icon: ShieldCheck, label: 'Deployment Checklist', href: '/beyond-code/deployment-checklist' },
      ],
    },
  ]

  const closeMobile = () => setIsMobileOpen(false)

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 z-40 bg-surface border-b border-border flex items-center justify-between px-4">
        <Logo size="md" />
        <button
          type="button"
          onClick={() => setIsMobileOpen((v) => !v)}
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors focus:outline-none"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

    <aside className={`fixed left-0 top-0 h-screen w-[240px] z-50 bg-surface border-r border-border flex flex-col justify-between transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Scrollable upper area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Logo Section */}
        <div className="p-5 border-b border-border">
          <Logo size="md" />
          <div className="text-[9px] text-text-dim font-mono mt-1 uppercase tracking-wide whitespace-nowrap">
            Prep for tech interviews.
          </div>
        </div>

        {/* Search Bar Button Trigger */}
        <div className="px-3 py-3 border-b border-border">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-haspopup="dialog"
            aria-label="Open search command palette"
            className="flex items-center justify-between bg-bg border border-border hover:border-border-hover rounded-lg text-sm text-text-muted hover:text-text px-3 py-2 w-full transition-colors duration-150 cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <Search aria-hidden="true" className="w-4 h-4 text-text-dim" />
              <span>Search...</span>
            </div>
            <span aria-hidden="true" className="text-xs text-text-dim font-mono">
              ⌘K
            </span>
          </button>
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
                      onClick={closeMobile}
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
      <div className="border-t border-border p-2 bg-surface">
        {/* Profile Card */}
        {user && (
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            aria-haspopup="dialog"
            aria-label="Open settings and profile"
            className="flex items-center gap-2 bg-bg/40 hover:bg-surface-hover border border-border/80 hover:border-border px-2.5 py-2 rounded-xl transition-all duration-200 cursor-pointer mb-1.5 group text-left w-full focus:outline-none"
          >
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-border flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-dim text-indigo-light flex items-center justify-center text-xs font-mono font-bold border border-indigo/20 select-none flex-shrink-0">
                {profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'US'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-text truncate">
                {profile?.name || user.user_metadata?.full_name || 'Developer'}
              </div>
              <div className="text-[10px] text-text-muted truncate mt-0.5">
                {profile?.role || 'Preferences'}
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {profile?.streak_count > 0 && (
                <StreakBadge count={profile.streak_count} size="sm" />
              )}
              <Settings className="w-4 h-4 text-text-dim group-hover:text-text-muted transition-colors" />
            </div>
          </button>
        )}
      </div>

    </aside>

      {user && isSettingsOpen && (
        <SettingsDrawer
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          user={user}
          profile={profile}
          onProfileUpdate={(updatedProfile) => {
            setProfile(updatedProfile)
          }}
        />
      )}

      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-bg/75 backdrop-blur-md z-[100] flex items-start justify-center pt-[10vh] px-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            ref={searchModalRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-border w-full max-w-2xl rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-fadeIn"
            role="dialog"
            aria-modal="true"
            aria-label="Global Search"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-surface-hover">
              <Search aria-hidden="true" className="w-5 h-5 text-text-dim flex-shrink-0" />
              <input
                type="text"
                placeholder="Search questions or companies..."
                aria-label="Search field"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-text placeholder-text-dim text-base outline-none flex-1 font-sans"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-text-muted hover:text-text px-2 py-1 text-xs border border-border rounded-lg bg-bg font-mono cursor-pointer focus:outline-none"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[350px] overflow-y-auto p-2 flex flex-col gap-1">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-8 text-text-dim text-sm font-sans">
                  Type to search questions or companies...
                </div>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <button
                    key={`${item.type}-${item.id}-${idx}`}
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false)
                      setSearchQuery('')
                      router.push(item.href)
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-surface-hover border border-transparent hover:border-border transition-all flex flex-col justify-center cursor-pointer group focus:outline-none"
                  >
                    <span className="text-sm font-semibold text-text group-hover:text-indigo-light">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono text-text-dim mt-1 uppercase tracking-wide">
                      {item.subtitle}
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-text-dim text-sm font-sans">
                  No matches found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
