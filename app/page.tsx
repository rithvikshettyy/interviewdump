'use client'

import React from 'react'
import Link from 'next/link'
import {
  Brain,
  Building2,
  BookOpen,
  Award,
  ShieldQuestion,
  FileText,
  ArrowRight,
} from 'lucide-react'
import Logo from '@/components/shared/Logo'

export default function LandingPage() {
  const stats = [
    { number: '500+', label: 'Questions' },
    { number: '24+', label: 'Companies' },
    { number: '10', label: 'Languages' },
    { number: '₹0', label: 'Always Free' },
  ]

  const features = [
    {
      icon: Brain,
      title: '🧠 Role-wise Questions',
      description: 'Position-specific questions for Backend, Frontend, ML, QA and more.',
      link: '/login',
    },
    {
      icon: Building2,
      title: '🏢 Company Question Banks',
      description: 'What Google, Amazon, Flipkart, Razorpay actually ask. Researched from real interviews.',
      link: '/login',
    },
    {
      icon: BookOpen,
      title: '📖 Language Fundamentals',
      description: 'JS, Python, Java, C++ concepts taught with analogies, code examples, and mini tasks.',
      link: '/login',
    },
    {
      icon: Award,
      title: '🧮 Aptitude & Quizzes',
      description: 'Placement-style questions with shortcuts and tricks. Timed quiz mode included.',
      link: '/login',
    },
    {
      icon: ShieldQuestion,
      title: '🎭 Scenario Based',
      description: 'Real behavioral and technical scenarios from top Indian startups.',
      link: '/login',
    },
    {
      icon: FileText,
      title: '📄 Resume Guide',
      description: 'Exact resume checklist by role, job type, and experience level. No fluff.',
      link: '/login',
    },
  ]

  const steps = [
    {
      num: '01',
      title: 'Pick your role',
      desc: 'Select your target role and experience level',
    },
    {
      num: '02',
      title: 'Practice daily',
      desc: 'Work through questions, mark progress, add to revision',
    },
    {
      num: '03',
      title: 'Get the offer',
      desc: 'Walk in confident. The prep is done.',
    },
  ]

  return (
    <div className="min-h-screen bg-bg text-text relative overflow-x-hidden">
      {/* HERO SECTION BACKGROUND GRADIENT */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] pointer-events-none select-none z-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
        }}
      />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-bg/80 backdrop-blur-md border-b border-border/50 z-50">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo Wordmark using Logo Component */}
          <Link href="/" className="flex items-center gap-0.5 select-none">
            <Logo size="md" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo ml-1.5 animate-pulse" />
          </Link>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/rithvikshettyy/interviewdump"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-muted hover:text-text transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href="https://x.com/RithvikShetty04"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-muted hover:text-text transition-colors"
            >
              Twitter ↗
            </a>
            <Link
              href="/login"
              className="bg-indigo text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-light transition-colors"
            >
              Get Started &rarr;
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-24 text-center relative z-10 px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="border border-indigo/30 bg-indigo-dim text-indigo-light text-xs font-mono rounded-full px-4 py-1.5 inline-block mb-8 select-none">
          Free Forever • Open Source • No Paywall
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-text tracking-[-0.02em] leading-tight font-sans">
          Interview prep that
          <br />
          actually prepares you.
        </h1>

        {/* Subheadline */}
        <p className="mt-6 max-w-xl mx-auto text-lg text-text-muted leading-relaxed">
          500+ curated questions. Company-wise banks. Language fundamentals. DSA with explanations. All free. All yours.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-row gap-4 justify-center items-center">
          <Link
            href="/login"
            className="bg-indigo text-white px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-indigo-light transition-all shadow-[0_0_24px_rgba(99,102,241,0.3)] flex items-center gap-2"
          >
            Get Started Free <ArrowRight size={18} className="flex-shrink-0" />
          </Link>
          <Link
            href="/login"
            className="border border-border bg-surface text-text px-6 py-3.5 rounded-xl text-base font-medium hover:border-border-hover hover:bg-surface-hover flex items-center gap-2.5 transition-colors"
          >
            {/* Google "G" logo SVG */}
            <svg className="w-5 h-5 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-3 mt-12 justify-center">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border border-bg bg-indigo-dim text-indigo-light text-[10px] font-mono font-bold flex items-center justify-center shadow-sm">JD</div>
            <div className="w-8 h-8 rounded-full border border-bg bg-green-dim text-green text-[10px] font-mono font-bold flex items-center justify-center shadow-sm">AS</div>
            <div className="w-8 h-8 rounded-full border border-bg bg-amber-dim text-amber text-[10px] font-mono font-bold flex items-center justify-center shadow-sm">RK</div>
            <div className="w-8 h-8 rounded-full border border-bg bg-red-dim text-red text-[10px] font-mono font-bold flex items-center justify-center shadow-sm">NM</div>
            <div className="w-8 h-8 rounded-full border border-bg bg-surface text-text-muted text-[10px] font-mono font-bold flex items-center justify-center shadow-sm">KL</div>
          </div>
          <span className="text-xs text-text-dim font-mono">
            Trusted by 1000+ developers
          </span>
        </div>
      </section>

      {/* STATS ROW */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-b border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="border-t-2 border-indigo w-8 mx-auto mb-4" />
              <div className="text-4xl font-mono font-bold text-text">
                {stat.number}
              </div>
              <div className="text-sm text-text-muted mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest text-center mb-4">
          WHAT YOU GET
        </div>
        <h2 className="text-4xl font-bold text-text text-center mb-16">
          Everything to crack your next interview.
        </h2>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <div
                key={idx}
                className="bg-surface border border-border rounded-2xl p-6 hover:border-border-hover transform hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-dim flex items-center justify-center mb-4">
                    <Icon size={20} className="text-indigo-light flex-shrink-0" />
                  </div>
                  <h3 className="text-base font-bold text-text mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {feat.description}
                  </p>
                </div>
                <Link
                  href={feat.link}
                  className="text-indigo hover:text-indigo-light text-sm mt-4 inline-flex items-center gap-1 transition-colors w-fit"
                >
                  Explore &rarr;
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="text-[11px] font-mono text-text-dim uppercase tracking-widest mb-4">
          HOW IT WORKS
        </div>
        <h2 className="text-4xl font-bold mb-16 text-text">
          Three steps to interview-ready.
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-16">
          {steps.map((step, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <span className="text-6xl font-mono text-indigo/20 font-bold select-none">
                {step.num}
              </span>
              <h3 className="text-lg font-semibold text-text mt-2">
                {step.title}
              </h3>
              <p className="text-sm text-text-muted mt-1 max-w-[200px] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-center py-20 border-t border-border px-6">
        <h2 className="text-4xl font-bold text-text">
          Ready to start?
        </h2>
        <p className="text-text-muted mt-3">
          Free forever. No credit card. No catch.
        </p>
        <Link
          href="/login"
          className="bg-indigo text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-indigo-light transition-all shadow-[0_0_24px_rgba(99,102,241,0.3)] mt-8 inline-block"
        >
          Start Preparing &rarr;
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto px-6 gap-4">
          {/* Left Side */}
          <div className="text-center md:text-left">
            <Link href="/" className="flex items-center gap-0.5 select-none">
              <Logo size="sm" />
            </Link>
            <div className="text-xs text-text-dim mt-1">
              &copy; 2025
            </div>
          </div>

          <div className="flex gap-6 text-xs text-text-muted">
            <a
              href="https://github.com/rithvikshettyy/interviewdump"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href="https://x.com/RithvikShetty04"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text transition-colors"
            >
              Twitter ↗
            </a>
            <span>Open Source</span>
            <span>Free Forever</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
