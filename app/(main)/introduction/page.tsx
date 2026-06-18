'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  Brain,
  Building2,
  BookOpen,
  Zap,
  Map,
  FileText,
  ArrowRight,
  CheckCircle2,
  Target,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

interface NavSection {
  id: string
  label: string
}

interface FeatureCard {
  icon: React.ElementType
  title: string
  description: string
}

interface HowToStep {
  number: number
  icon: React.ElementType
  title: string
  description: string
}

// ── Constants ────────────────────────────────────────────────────────────────

const NAV_SECTIONS: NavSection[] = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'what-is', label: 'What is InterviewDump?' },
  { id: 'key-features', label: 'Key Features' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'nothing-lost', label: 'Nothing is lost' },
  { id: 'start', label: 'Start Prep' },
]

const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: Brain,
    title: 'Role-wise Questions',
    description: 'Curated questions for Frontend, Backend, ML, DevOps and more',
  },
  {
    icon: Building2,
    title: 'Company Question Banks',
    description: 'Real interview questions from Google, Amazon, Flipkart, Razorpay and 20+ companies',
  },
  {
    icon: BookOpen,
    title: 'Language Fundamentals',
    description: 'Deep-dive into JS, Python, Java, C++ with code examples',
  },
  {
    icon: Zap,
    title: 'Quiz Mode',
    description: 'Timed quizzes with streak tracking to test your knowledge',
  },
  {
    icon: Map,
    title: 'Study Plans',
    description: 'Structured day-by-day prep plans for placement season',
  },
  {
    icon: FileText,
    title: 'Resume Guide',
    description: 'Role-specific resume checklist with ATS tips',
  },
]

const HOW_TO_STEPS: HowToStep[] = [
  {
    number: 1,
    icon: Target,
    title: 'Complete onboarding',
    description: 'Set your target role and experience level so your feed gets personalised to what matters most.',
  },
  {
    number: 2,
    icon: Brain,
    title: 'Start with Interview Questions',
    description: 'Filter by role or difficulty and work through the question bank at your own pace.',
  },
  {
    number: 3,
    icon: CheckCircle2,
    title: 'Mark questions as Solved or Revision',
    description: 'Flag solved questions to track coverage. Add tricky ones to your Revision List for later.',
  },
  {
    number: 4,
    icon: Target,
    title: 'Track progress on the Dashboard',
    description: 'See your overall completion %, solved counts per category, and revision queue at a glance.',
  },
]

// ── useInView hook ───────────────────────────────────────────────────────────

function useInView(threshold: number = 0.15): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null!)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}

// ── AnimatedSection ──────────────────────────────────────────────────────────

function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function IntroductionPage() {
  const [activeSection, setActiveSection] = useState<string>('welcome')
  const [parallaxY, setParallaxY] = useState<number>(0)

  // Parallax on hero glow
  useEffect(() => {
    const handleScroll = () => {
      setParallaxY(window.scrollY * 0.3)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll-spy: observe each section
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-bg relative">
      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 px-6 md:px-10 lg:px-16 py-10 max-w-4xl">

        {/* ── 1. Hero / Welcome ─────────────────────────────────────────── */}
        <section id="welcome" className="relative mb-20 scroll-mt-8">
          {/* Parallax glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -left-10 w-[520px] h-[380px] rounded-full bg-indigo/10 blur-3xl"
            style={{ transform: `translateY(${parallaxY}px)` }}
          />

          <AnimatedSection>
            <div className="relative z-10">
              <span className="inline-block text-xs font-mono text-indigo-light bg-indigo-dim border border-indigo/30 rounded-full px-3 py-1 mb-6 uppercase tracking-widest">
                Getting Started
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight mb-5">
                Welcome to{' '}
                <span className="text-indigo-light">InterviewDump</span>
              </h1>
              <p className="text-lg text-text-muted leading-relaxed max-w-2xl mb-8">
                Your complete, free tech interview prep platform. No paywall. No signup wall. Just prep.
              </p>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-3">
                {[
                  { label: '500+ Questions' },
                  { label: '24+ Companies' },
                  { label: 'Completely Free' },
                ].map((pill) => (
                  <span
                    key={pill.label}
                    className="inline-flex items-center gap-1.5 bg-surface border border-border rounded-full px-4 py-2 text-sm font-semibold text-text"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo inline-block" />
                    {pill.label}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ── 2. What is InterviewDump? ──────────────────────────────────── */}
        <section id="what-is" className="mb-20 scroll-mt-8">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-text mb-4">What is InterviewDump?</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              InterviewDump is an open, structured interview preparation platform built for software developers.
              It aggregates real interview questions, company-specific question banks, language fundamentals,
              and structured study plans — all in one place.
            </p>
            <p className="text-text-muted leading-relaxed mb-6">
              Unlike other prep platforms, there are no paywalls, no locked content, and no premium tiers.
              Everything is free and accessible the moment you sign in.
            </p>

            {/* Callout */}
            <div className="border border-indigo/40 bg-indigo-dim rounded-xl px-5 py-4">
              <p className="text-sm text-indigo-light leading-relaxed font-medium">
                Built for developers preparing for SDE, Frontend, Backend, ML, DevOps roles at top Indian
                and global tech companies.
              </p>
            </div>
          </AnimatedSection>
        </section>

        {/* ── 3. Key Features ───────────────────────────────────────────── */}
        <section id="key-features" className="mb-20 scroll-mt-8">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-text mb-2">Key Features</h2>
            <p className="text-text-muted mb-8">
              Everything you need to go from zero to offer-ready.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURE_CARDS.map((card, i) => {
              const Icon = card.icon
              return (
                <AnimatedSection key={card.title} delay={i * 80}>
                  <div className="bg-surface border border-border rounded-2xl p-5 h-full flex flex-col gap-3 hover:border-indigo/40 transition-colors duration-200">
                    <div className="w-9 h-9 rounded-xl bg-indigo-dim flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-indigo" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text mb-1">{card.title}</h3>
                      <p className="text-xs text-text-muted leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </section>

        {/* ── 4. How to Use ─────────────────────────────────────────────── */}
        <section id="how-to-use" className="mb-20 scroll-mt-8">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-text mb-2">How to Use</h2>
            <p className="text-text-muted mb-8">
              Get up to speed in four simple steps.
            </p>
          </AnimatedSection>

          <div className="flex flex-col gap-5">
            {HOW_TO_STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <AnimatedSection key={step.number} delay={i * 100}>
                  <div className="flex gap-4 items-start bg-surface border border-border rounded-2xl p-5 hover:border-indigo/30 transition-colors duration-200">
                    {/* Step number */}
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-dim border border-indigo/20 flex items-center justify-center">
                      <span className="text-xs font-bold font-mono text-indigo">{step.number}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-indigo flex-shrink-0" />
                        <h3 className="text-sm font-semibold text-text">{step.title}</h3>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </section>

        {/* ── 5. Nothing is lost ────────────────────────────────────────── */}
        <section id="nothing-lost" className="mb-20 scroll-mt-8">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-text mb-4">Nothing is lost</h2>
            <p className="text-text-muted leading-relaxed mb-6">
              Everything you mark is saved to your account. Switch devices, come back months later —
              your progress is always here.
            </p>

            {/* Progress grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                {
                  label: 'Solved Questions',
                  desc: 'Marked solved across all categories',
                  icon: CheckCircle2,
                },
                {
                  label: 'Revision List',
                  desc: 'Bookmarked for second-pass review',
                  icon: BookOpen,
                },
                {
                  label: 'Progress %',
                  desc: 'Per-category completion tracked live',
                  icon: Target,
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-2"
                  >
                    <Icon className="w-4 h-4 text-indigo" />
                    <span className="text-sm font-semibold text-text">{item.label}</span>
                    <span className="text-xs text-text-muted">{item.desc}</span>
                  </div>
                )
              })}
            </div>

            <div className="border border-border bg-surface rounded-xl px-5 py-4 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-indigo mt-0.5 flex-shrink-0" />
              <p className="text-sm text-text-muted leading-relaxed">
                Progress syncs automatically via your Supabase account — no manual saves, no data loss.
              </p>
            </div>
          </AnimatedSection>
        </section>

        {/* ── 6. Start Prep ─────────────────────────────────────────────── */}
        <section id="start" className="mb-16 scroll-mt-8">
          <AnimatedSection>
            <div className="bg-surface border border-border rounded-2xl p-8 relative overflow-hidden">
              {/* Background glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-indigo/8 blur-3xl"
              />

              <h2 className="text-2xl font-bold text-text mb-3 relative z-10">
                Ready to start?
              </h2>
              <p className="text-text-muted mb-8 relative z-10 max-w-lg">
                Pick a starting point below and begin your prep journey. You can always come back here
                from the sidebar.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <Link
                  href="/library/interview-questions"
                  className="inline-flex items-center justify-center gap-2 bg-indigo text-white font-semibold text-sm rounded-xl px-5 py-3 hover:bg-indigo/90 transition-colors duration-150"
                >
                  Start with Interview Questions
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/library/company-questions"
                  className="inline-flex items-center justify-center gap-2 bg-surface border border-border text-text-muted font-semibold text-sm rounded-xl px-5 py-3 hover:border-indigo/40 hover:text-text transition-colors duration-150"
                >
                  Explore Company Questions
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </section>

      </div>

      {/* ── Right sidebar "On this page" ────────────────────────────────── */}
      <aside className="hidden xl:block fixed right-0 top-0 h-screen w-56 pt-8 pr-8 bg-bg">
        <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest mb-3 pl-5">
          On this page
        </p>

        {/* Border rail + nav items */}
        <div className="border-l border-border">
          <nav className="flex flex-col">
            {NAV_SECTIONS.map(({ id, label }) => {
              const isActive = activeSection === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className={`-ml-px text-left text-xs pl-5 pr-2 py-1.5 border-l-2 transition-colors duration-150 cursor-pointer focus:outline-none ${
                    isActive
                      ? 'border-indigo text-text'
                      : 'border-transparent text-text-dim hover:text-text-muted hover:border-border-hover'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </nav>
        </div>
      </aside>
    </div>
  )
}
