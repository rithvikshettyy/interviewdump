'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  Loader,
  LogOut,
  Trash2,
  User,
  Target,
  Code2,
  BarChart2,
  Briefcase,
  Layers,
  Building2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
  user: any
  profile: any
  onProfileUpdate: (updatedProfile: any) => void
}

// ─── Section Header component ────────────────────────────────────────────────
function SectionHeader({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={12} className="text-text-dim" />
        <span className="text-[11px] font-mono text-text-dim uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="border-b border-border mb-4" />
    </div>
  )
}

// ─── Chip select component ────────────────────────────────────────────────────
function ChipGroup({
  options,
  selected,
  onToggle,
  multi = false,
}: {
  options: string[]
  selected: string | string[]
  onToggle: (val: string) => void
  multi?: boolean
}) {
  const isSelected = (val: string) =>
    multi ? (selected as string[]).includes(val) : selected === val

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer select-none focus:outline-none ${
            isSelected(opt)
              ? 'border-indigo bg-indigo-dim text-indigo-light'
              : 'border-border bg-bg/25 text-text-muted hover:border-border-hover hover:text-text'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

// ─── Inline select wrapper ────────────────────────────────────────────────────
function SettingsSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-text text-sm focus:border-indigo focus:outline-none cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function SettingsDrawer({
  isOpen,
  onClose,
  user,
  profile,
  onProfileUpdate,
}: SettingsDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null)

  // ── Focus trap and Escape key listener ────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return

    const previousActiveElement = document.activeElement as HTMLElement

    // Focus the drawer on open
    if (drawerRef.current) {
      drawerRef.current.focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab') {
        if (!drawerRef.current) return
        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        const focusableElements = Array.from(
          drawerRef.current.querySelectorAll(focusableSelectors)
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
  }, [isOpen, onClose])

  // ── DB-backed fields ─────────────────────────────────────────────────────
  const [name, setName] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [goal, setGoal] = useState('')

  // ── localStorage fields ──────────────────────────────────────────────────
  const [defaultLanguage, setDefaultLanguage] = useState('JavaScript')
  const [experienceLevel, setExperienceLevel] = useState('Intermediate')
  const [targetCompanyType, setTargetCompanyType] = useState('Any')
  const [dailyGoal, setDailyGoal] = useState('10')
  const [focusAreas, setFocusAreas] = useState<string[]>([])
  const [interviewTimeline, setInterviewTimeline] = useState('1-3 Months')

  // ── Status ───────────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // ── Load settings on open ────────────────────────────────────────────────
  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setGoal(profile.goal || '')
      const rolesArray = profile.role
        ? profile.role.split(',').map((r: string) => r.trim()).filter(Boolean)
        : []
      setSelectedRoles(rolesArray)
    }

    // localStorage
    setDefaultLanguage(localStorage.getItem('id_default_language') || 'JavaScript')
    setExperienceLevel(localStorage.getItem('id_experience_level') || 'Intermediate')
    setTargetCompanyType(localStorage.getItem('id_target_company_type') || 'Any')
    setDailyGoal(localStorage.getItem('id_daily_goal') || '10')
    setInterviewTimeline(localStorage.getItem('id_interview_timeline') || '1-3 Months')

    const savedFocus = localStorage.getItem('id_focus_areas')
    setFocusAreas(savedFocus ? JSON.parse(savedFocus) : [])
  }, [profile, isOpen])

  if (!isOpen) return null

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleToggleRole = (roleName: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName]
    )
  }

  const handleToggleFocus = (area: string) => {
    setFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const supabase = createClient()

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        name,
        email: user.email,
        role: selectedRoles.join(', '),
        goal,
      })

      if (error) throw error

      // Persist localStorage settings
      localStorage.setItem('id_default_language', defaultLanguage)
      localStorage.setItem('id_experience_level', experienceLevel)
      localStorage.setItem('id_target_company_type', targetCompanyType)
      localStorage.setItem('id_daily_goal', dailyGoal)
      localStorage.setItem('id_interview_timeline', interviewTimeline)
      localStorage.setItem('id_focus_areas', JSON.stringify(focusAreas))

      onProfileUpdate({
        ...profile,
        name,
        role: selectedRoles.join(', '),
        goal,
      })

      setMessage({ type: 'success', text: 'Preferences saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save settings.' })
    } finally {
      setSaving(false)
    }
  }

  const handleResetProgress = async () => {
    if (
      !window.confirm(
        'Are you absolutely sure you want to reset all your progress? This will delete all solved status and revision records.'
      )
    ) return

    setResetting(true)
    setMessage(null)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      localStorage.removeItem('id_favourites')
      setMessage({ type: 'success', text: 'All progress reset. Please refresh.' })
      setTimeout(() => { window.location.reload() }, 1500)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to reset progress.' })
    } finally {
      setResetting(false)
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = '/login'
    } catch (err) {
      console.error('Logout error', err)
    }
  }

  // ── Data ─────────────────────────────────────────────────────────────────
  const roleOptions = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'ML / AI Engineer',
    'DevOps / Cloud',
    'Mobile Developer',
    'Data Analyst',
    'QA / SDET',
  ]

  const focusAreaOptions = [
    'Interview Questions',
    'DSA',
    'Core CS Subjects',
    'Scenario Based',
    'Aptitude',
    'SQL',
    'OOPs Concepts',
    'Company Questions',
  ]

  const experienceLevels = ['Beginner', 'Intermediate', 'Expert']
  const companyTypes = ['Any', 'FAANG', 'Unicorn / Product', 'MNC', 'Startup', 'Service / IT']
  const dailyGoalOptions = ['5', '10', '20', '30']
  const timelineOptions = ['ASAP', '< 1 Month', '1-3 Months', '3-6 Months', 'Just Exploring']

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bg/60 z-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside 
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Account and Settings Preferences"
        className="fixed inset-0 h-full w-full bg-surface z-55 animate-slideInRight overflow-y-auto flex flex-col justify-between shadow-2xl text-text outline-none"
      >
        {/* Upper Scrollable Container */}
        <div className="flex-1">

          {/* Header */}
          <div className="sticky top-0 bg-surface border-b border-border p-5 z-10">
            <div className="max-w-2xl mx-auto w-full flex justify-between items-center">
              <h2 className="text-lg font-bold text-text">Account &amp; Settings</h2>
              <button
                onClick={onClose}
                aria-label="Close settings"
                className="text-text-muted hover:text-text p-1 hover:bg-surface-hover rounded-lg transition-colors cursor-pointer focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="max-w-2xl mx-auto w-full p-5 flex flex-col gap-8">

            {/* Status message */}
            {message && (
              <div
                className={`border text-xs rounded-xl p-3.5 font-mono ${
                  message.type === 'success'
                    ? 'bg-green-dim border-green/20 text-green'
                    : 'bg-red-dim border-red/20 text-red'
                }`}
              >
                {message.type === 'success' ? '✓' : '⚠️'} {message.text}
              </div>
            )}

            {/* ── 1. Account Profile ───────────────────────────────────────── */}
            <div>
              <SectionHeader icon={User} label="Account Profile" />
              <div className="flex items-center gap-4 bg-bg/40 border border-border p-4 rounded-2xl">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full border border-border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-dim text-indigo-light flex items-center justify-center text-sm font-mono font-bold border border-indigo/20 select-none">
                    {profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'US'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-text truncate">
                    {profile?.name || user?.user_metadata?.full_name || 'Developer'}
                  </div>
                  <div className="text-xs text-text-muted truncate mt-0.5">{user?.email}</div>
                </div>
              </div>
            </div>

            {/* ── 2. Display Name ──────────────────────────────────────────── */}
            <div>
              <label className="text-[11px] font-mono text-text-dim uppercase tracking-widest block mb-2">
                Display Name
              </label>
              <div className="border-b border-border mb-4" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name..."
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text text-sm focus:border-indigo focus:outline-none transition-colors"
              />
            </div>

            {/* ── 3. Target Roles ──────────────────────────────────────────── */}
            <div>
              <SectionHeader icon={Target} label="Target Roles" />
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map((roleName) => {
                  const isSelected = selectedRoles.includes(roleName)
                  return (
                    <button
                      key={roleName}
                      type="button"
                      onClick={() => handleToggleRole(roleName)}
                      aria-pressed={isSelected}
                      className={`border rounded-lg p-2.5 cursor-pointer text-xs font-semibold text-center select-none transition-all focus:outline-none ${
                        isSelected
                          ? 'border-indigo bg-indigo-dim text-indigo-light'
                          : 'border-border bg-bg/25 text-text-muted hover:border-border-hover hover:text-text'
                      }`}
                    >
                      {roleName}
                    </button>
                  )
                })}
              </div>
              <p className="text-[10px] text-text-dim mt-2 font-mono">Select all that apply</p>
            </div>

            {/* ── 4. Experience & Timeline ─────────────────────────────────── */}
            <div>
              <SectionHeader icon={BarChart2} label="Experience &amp; Timeline" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-text-dim block mb-2">Experience Level</label>
                  <ChipGroup
                    options={experienceLevels}
                    selected={experienceLevel}
                    onToggle={setExperienceLevel}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-text-dim block mb-2">Interview Timeline</label>
                  <SettingsSelect
                    value={interviewTimeline}
                    onChange={setInterviewTimeline}
                    options={timelineOptions.map((t) => ({ value: t, label: t }))}
                  />
                </div>
              </div>
            </div>

            {/* ── 5. Prep Goal & Company Target ───────────────────────────── */}
            <div>
              <SectionHeader icon={Briefcase} label="Prep Goal &amp; Company Target" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-text-dim block mb-2">Prep Goal</label>
                  <SettingsSelect
                    value={goal}
                    onChange={setGoal}
                    options={[
                      { value: 'Job Interview', label: 'Job Interview' },
                      { value: 'Learning & Upskilling', label: 'Learning & Upskilling' },
                      { value: 'College Placements', label: 'College Placements' },
                      { value: 'Career Switch', label: 'Career Switch' },
                    ]}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-text-dim block mb-2">Target Company Type</label>
                  <SettingsSelect
                    value={targetCompanyType}
                    onChange={setTargetCompanyType}
                    options={companyTypes.map((c) => ({ value: c, label: c }))}
                  />
                </div>
              </div>
            </div>

            {/* ── 6. Focus Areas ───────────────────────────────────────────── */}
            <div>
              <SectionHeader icon={Layers} label="Focus Areas" />
              <div className="grid grid-cols-2 gap-2">
                {focusAreaOptions.map((area) => {
                  const isSelected = focusAreas.includes(area)
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => handleToggleFocus(area)}
                      aria-pressed={isSelected}
                      className={`border rounded-lg p-2.5 cursor-pointer text-xs font-semibold text-center select-none transition-all focus:outline-none ${
                        isSelected
                          ? 'border-indigo bg-indigo-dim text-indigo-light'
                          : 'border-border bg-bg/25 text-text-muted hover:border-border-hover hover:text-text'
                      }`}
                    >
                      {area}
                    </button>
                  )
                })}
              </div>
              <p className="text-[10px] text-text-dim mt-2 font-mono">Choose which sections to prioritize</p>
            </div>

            {/* ── 7. Coding Preferences ────────────────────────────────────── */}
            <div>
              <SectionHeader icon={Code2} label="Coding Preferences" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-text-dim block mb-2">Default Language</label>
                  <SettingsSelect
                    value={defaultLanguage}
                    onChange={setDefaultLanguage}
                    options={[
                      { value: 'JavaScript', label: 'JavaScript' },
                      { value: 'Python', label: 'Python' },
                      { value: 'Java', label: 'Java' },
                      { value: 'C++', label: 'C++' },
                    ]}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-text-dim block mb-2">Daily Question Goal</label>
                  <div className="flex gap-2">
                    {dailyGoalOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setDailyGoal(opt)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer focus:outline-none ${
                          dailyGoal === opt
                            ? 'border-indigo bg-indigo-dim text-indigo-light'
                            : 'border-border bg-bg/25 text-text-muted hover:border-border-hover'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── 8. Target Company Type (display) ─────────────────────────── */}
            <div>
              <SectionHeader icon={Building2} label="Target Company Focus" />
              <ChipGroup
                options={companyTypes}
                selected={targetCompanyType}
                onToggle={setTargetCompanyType}
              />
              <p className="text-[10px] text-text-dim mt-2 font-mono">
                Filter company questions by company tier in Company Questions
              </p>
            </div>

            {/* ── 9. Danger Zone ───────────────────────────────────────────── */}
            <div>
              <div className="text-[11px] font-mono text-red uppercase tracking-widest mb-2">
                Danger Zone
              </div>
              <div className="border-b border-red/20 mb-4" />
              <button
                onClick={handleResetProgress}
                disabled={resetting}
                className="w-full border border-red/40 text-red hover:bg-red/10 rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors focus:outline-none"
              >
                {resetting ? (
                  <>
                    <Loader size={14} className="animate-spin" /> Resetting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} /> Reset All Prep Progress
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="sticky bottom-0 bg-surface border-t border-border p-4 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.15)]">
          <div className="max-w-2xl mx-auto w-full flex gap-3">
            <button
              onClick={handleSaveSettings}
              disabled={saving || resetting}
              className="flex-1 bg-indigo hover:bg-indigo-light text-white rounded-xl py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 focus:outline-none"
            >
              {saving ? (
                <>
                  <Loader size={16} className="animate-spin" /> Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </button>

            <button
              onClick={handleLogout}
              disabled={saving}
              className="border border-border text-text-muted hover:border-red hover:text-red rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 focus:outline-none"
              title="Log Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
