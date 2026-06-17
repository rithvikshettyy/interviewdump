'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const router = useRouter()
  
  // Onboarding States
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [name, setName] = useState('')
  const [roles, setRoles] = useState<string[]>([])
  const [goal, setGoal] = useState('')
  const [referral, setReferral] = useState('')
  
  // Request States
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Autofocus the input on mount/step 1
  const nameInputRef = React.useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (step === 1 && nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [step])

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as any)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as any)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('Authentication session not found. Please log in again.')
      }

      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: user.id,
        name,
        email: user.email,
        role: roles.join(', '),
        goal,
        referral,
      })

      if (upsertError) {
        throw upsertError
      }

      router.push('/library/interview-questions')
    } catch (err: any) {
      setError(err.message || 'Something went wrong while saving your profile.')
    } finally {
      setLoading(false)
    }
  }

  // Segment Progress bar component
  const renderProgressBar = () => {
    return (
      <div className="flex gap-2 mb-8 select-none">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= step ? 'bg-indigo' : 'bg-border'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 text-text">
      <div className="w-full max-w-lg bg-surface border border-border rounded-2xl p-8 relative overflow-hidden shadow-xl">
        {/* Step Progress */}
        {renderProgressBar()}

        {error && (
          <div className="mb-6 bg-red-dim border border-red/20 text-red text-xs rounded-xl p-3.5 font-mono">
            ⚠️ {error}
          </div>
        )}

        {/* STEP 1: Name */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-text mb-2">What should we call you?</h2>
            <p className="text-sm text-text-muted mb-8">We'll use this to personalize your experience.</p>
            
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name..."
              className="w-full bg-bg border border-border rounded-xl px-4 py-3.5 text-text text-base focus:border-indigo focus:outline-none transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  handleNext()
                }
              }}
            />

            <button
              onClick={handleNext}
              disabled={!name.trim()}
              className="w-full bg-indigo text-white py-3.5 rounded-xl text-base font-semibold mt-6 transition-all shadow-[0_0_16px_rgba(99,102,241,0.25)] hover:bg-indigo-light disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none"
            >
              Continue &rarr;
            </button>
          </div>
        )}

        {/* STEP 2: Role */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-text mb-2">What role are you preparing for?</h2>
            <p className="text-sm text-text-muted mb-8">We'll customize your question feed.</p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: '🖥️', name: 'Frontend Developer' },
                { emoji: '⚙️', name: 'Backend Developer' },
                { emoji: '🔥', name: 'Full Stack Developer' },
                { emoji: '🤖', name: 'ML / AI Engineer' },
                { emoji: '☁️', name: 'DevOps / Cloud' },
                { emoji: '📱', name: 'Mobile Developer' },
                { emoji: '📊', name: 'Data Analyst' },
                { emoji: '🔍', name: 'QA / SDET' },
              ].map((r) => {
                const isSelected = roles.includes(r.name)
                return (
                  <div
                    key={r.name}
                    onClick={() => {
                      setRoles((prev) =>
                        prev.includes(r.name)
                          ? prev.filter((item) => item !== r.name)
                          : [...prev, r.name]
                      )
                    }}
                    className={`bg-bg border rounded-xl p-4 cursor-pointer transition-all hover:border-border-hover select-none ${
                      isSelected ? 'border-indigo bg-indigo-dim' : 'border-border'
                    }`}
                  >
                    <span className="text-2xl block">{r.emoji}</span>
                    <span className="text-sm font-semibold text-text mt-2 block">{r.name}</span>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handleNext}
                disabled={roles.length === 0}
                className="w-full bg-indigo text-white py-3.5 rounded-xl text-base font-semibold transition-all hover:bg-indigo-light disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none"
              >
                Continue &rarr;
              </button>
              <button
                onClick={handleBack}
                className="text-xs text-text-dim hover:text-text-muted transition-colors py-1 cursor-pointer focus:outline-none"
              >
                &larr; Back
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Goal */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-text mb-2">What are you preparing for?</h2>
            <p className="text-sm text-text-muted mb-8">Help us understand your timeline and goals.</p>

            <div className="flex flex-col gap-3">
              {[
                { emoji: '🎯', title: 'Job Interview', desc: 'Actively interviewing for a new role' },
                { emoji: '📚', title: 'Learning & Upskilling', desc: 'Building knowledge for long-term growth' },
                { emoji: '🎓', title: 'College Placements', desc: 'Preparing for campus recruitment' },
                { emoji: '🔄', title: 'Career Switch', desc: 'Transitioning to a new tech role' },
              ].map((g) => {
                const isSelected = goal === g.title
                return (
                  <div
                    key={g.title}
                    onClick={() => setGoal(g.title)}
                    className={`w-full bg-bg border rounded-xl p-4 cursor-pointer transition-all hover:border-border-hover flex items-center gap-4 select-none ${
                      isSelected ? 'border-indigo bg-indigo-dim' : 'border-border'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{g.emoji}</span>
                    <div className="text-left min-w-0">
                      <span className="text-sm font-semibold text-text block">{g.title}</span>
                      <span className="text-xs text-text-muted block mt-0.5">{g.desc}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handleNext}
                disabled={!goal}
                className="w-full bg-indigo text-white py-3.5 rounded-xl text-base font-semibold transition-all hover:bg-indigo-light disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none"
              >
                Continue &rarr;
              </button>
              <button
                onClick={handleBack}
                className="text-xs text-text-dim hover:text-text-muted transition-colors py-1 cursor-pointer focus:outline-none"
              >
                &larr; Back
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Referral */}
        {step === 4 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-text mb-2">How did you hear about us?</h2>
            <p className="text-sm text-text-muted mb-8">This helps us understand how to reach more people.</p>

            <div className="grid grid-cols-2 gap-3">
              {[
                'LinkedIn',
                'Twitter/X',
                'GitHub',
                'Friend/Colleague',
                'Reddit',
                'YouTube',
                'Google Search',
                'Other',
              ].map((ref) => {
                const isSelected = referral === ref
                return (
                  <div
                    key={ref}
                    onClick={() => setReferral(ref)}
                    className={`bg-bg border rounded-xl p-4 cursor-pointer transition-all hover:border-border-hover flex items-center justify-center text-center select-none ${
                      isSelected ? 'border-indigo bg-indigo-dim' : 'border-border'
                    }`}
                  >
                    <span className="text-sm font-semibold text-text">{ref}</span>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handleComplete}
                disabled={!referral || loading}
                className="w-full bg-indigo text-white py-3.5 rounded-xl text-base font-semibold transition-all hover:bg-indigo-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving Profile...
                  </>
                ) : (
                  'Complete Onboarding'
                )}
              </button>
              <button
                onClick={handleBack}
                disabled={loading}
                className="text-xs text-text-dim hover:text-text-muted transition-colors py-1 disabled:opacity-50 cursor-pointer focus:outline-none"
              >
                &larr; Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
