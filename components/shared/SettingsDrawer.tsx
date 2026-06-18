'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import {
  BarChart2,
  Briefcase,
  Building2,
  Check,
  Code2,
  Layers,
  Loader,
  Target,
  Trash2,
  User,
  X,
  type LucideIcon,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import FilterDropdown from '@/components/shared/FilterDropdown'

type SettingsUser = {
  id: string
  email?: string | null
  user_metadata?: {
    avatar_url?: string | null
    full_name?: string | null
  } | null
}

type SettingsProfile = {
  name?: string | null
  role?: string | null
  goal?: string | null
} | null

interface SettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
  user: SettingsUser
  profile: SettingsProfile
  onProfileUpdate: (updatedProfile: {
    name?: string | null
    role?: string | null
    goal?: string | null
  }) => void
}

interface SettingsSnapshot {
  name: string
  selectedRoles: string[]
  goal: string
  defaultLanguage: string
  experienceLevel: string
  targetCompanyType: string
  dailyGoal: string
  focusAreas: string[]
  interviewTimeline: string
}

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
const prepGoalOptions = [
  'Job Interview',
  'Learning & Upskilling',
  'College Placements',
  'Career Switch',
]
const languageOptions = ['JavaScript', 'Python', 'Java', 'C++']

const modalTheme = {
  '--bg': '#0D1117',
  '--surface': '#161B22',
  '--surface-hover': '#1C2333',
  '--border': '#30363D',
  '--border-hover': '#3A4554',
  '--indigo': '#6366F1',
  '--indigo-light': '#A5B4FC',
  '--indigo-dim': 'rgba(99, 102, 241, 0.16)',
  '--text': '#E6EDF3',
  '--text-muted': '#8B9CB1',
  '--text-dim': '#9FB0C4',
  '--red': '#F87171',
  '--red-dim': 'rgba(248, 113, 113, 0.14)',
} as CSSProperties

function SectionHeader({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={16} className="text-indigo-light" />
      <span className="text-[11px] font-mono text-text-dim uppercase tracking-widest">
        {label}
      </span>
    </div>
  )
}

function SettingsSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <FilterDropdown
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      includeResetOption={false}
      className="min-w-0 w-full"
      triggerClassName="!bg-bg"
      panelClassName="bg-surface"
    />
  )
}

function SelectionPill({
  label,
  isSelected,
  onClick,
  showCheck = false,
  className = '',
}: {
  label: string
  isSelected: boolean
  onClick: () => void
  showCheck?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium text-center transition-all duration-150 cursor-pointer focus:outline-none ${
        isSelected
          ? 'bg-indigo-dim border-indigo text-text font-semibold'
          : 'bg-bg border-border text-text-muted hover:border-border-hover hover:bg-surface-hover hover:text-text'
      } ${className}`}
    >
      {showCheck && isSelected && <Check size={14} className="text-indigo-light flex-shrink-0" />}
      <span>{label}</span>
    </button>
  )
}

function readStoredValue(key: string, fallback: string) {
  if (typeof window === 'undefined') return fallback
  return localStorage.getItem(key) || fallback
}

function readStoredList(key: string) {
  if (typeof window === 'undefined') return [] as string[]

  try {
    const value = localStorage.getItem(key)
    if (!value) return []
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function parseRoles(role: string | null | undefined) {
  return role
    ? role
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : []
}

function buildInitialSettings(profile: SettingsProfile): SettingsSnapshot {
  return {
    name: profile?.name || '',
    selectedRoles: parseRoles(profile?.role),
    goal: profile?.goal || prepGoalOptions[0],
    defaultLanguage: readStoredValue('id_default_language', 'JavaScript'),
    experienceLevel: readStoredValue('id_experience_level', 'Intermediate'),
    targetCompanyType: readStoredValue('id_target_company_type', 'Any'),
    dailyGoal: readStoredValue('id_daily_goal', '10'),
    focusAreas: readStoredList('id_focus_areas'),
    interviewTimeline: readStoredValue('id_interview_timeline', '1-3 Months'),
  }
}

function normalizeList(items: string[]) {
  return [...items].sort().join('|')
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export default function SettingsDrawer({
  isOpen,
  onClose,
  user,
  profile,
  onProfileUpdate,
}: SettingsDrawerProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [initialSettings, setInitialSettings] = useState<SettingsSnapshot>(() => buildInitialSettings(profile))

  const [name, setName] = useState(initialSettings.name)
  const [selectedRoles, setSelectedRoles] = useState(initialSettings.selectedRoles)
  const [goal, setGoal] = useState(initialSettings.goal)
  const [defaultLanguage, setDefaultLanguage] = useState(initialSettings.defaultLanguage)
  const [experienceLevel, setExperienceLevel] = useState(initialSettings.experienceLevel)
  const [targetCompanyType, setTargetCompanyType] = useState(initialSettings.targetCompanyType)
  const [dailyGoal, setDailyGoal] = useState(initialSettings.dailyGoal)
  const [focusAreas, setFocusAreas] = useState(initialSettings.focusAreas)
  const [interviewTimeline, setInterviewTimeline] = useState(initialSettings.interviewTimeline)
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const previousActiveElement = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    modalRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !modalRef.current) return

      const focusableSelectors = 'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'
      const focusableElements = Array.from(
        modalRef.current.querySelectorAll(focusableSelectors)
      ) as HTMLElement[]

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        lastElement.focus()
        event.preventDefault()
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        firstElement.focus()
        event.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousActiveElement?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const currentSettings: SettingsSnapshot = {
    name,
    selectedRoles,
    goal,
    defaultLanguage,
    experienceLevel,
    targetCompanyType,
    dailyGoal,
    focusAreas,
    interviewTimeline,
  }

  const hasChanges =
    name !== initialSettings.name ||
    goal !== initialSettings.goal ||
    defaultLanguage !== initialSettings.defaultLanguage ||
    experienceLevel !== initialSettings.experienceLevel ||
    targetCompanyType !== initialSettings.targetCompanyType ||
    dailyGoal !== initialSettings.dailyGoal ||
    interviewTimeline !== initialSettings.interviewTimeline ||
    normalizeList(selectedRoles) !== normalizeList(initialSettings.selectedRoles) ||
    normalizeList(focusAreas) !== normalizeList(initialSettings.focusAreas)

  const handleToggleRole = (roleName: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName) ? prev.filter((role) => role !== roleName) : [...prev, roleName]
    )
  }

  const handleToggleFocus = (area: string) => {
    setFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((item) => item !== area) : [...prev, area]
    )
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const updatedRole = selectedRoles.join(', ')

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        name,
        email: user.email,
        role: updatedRole,
        goal,
      })

      if (error) throw error

      localStorage.setItem('id_default_language', defaultLanguage)
      localStorage.setItem('id_experience_level', experienceLevel)
      localStorage.setItem('id_target_company_type', targetCompanyType)
      localStorage.setItem('id_daily_goal', dailyGoal)
      localStorage.setItem('id_interview_timeline', interviewTimeline)
      localStorage.setItem('id_focus_areas', JSON.stringify(focusAreas))

      const nextInitialSettings = { ...currentSettings }
      setInitialSettings(nextInitialSettings)

      onProfileUpdate({
        ...profile,
        name,
        role: updatedRole,
        goal,
      })

      setMessage({ type: 'success', text: 'Changes saved.' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to save settings.') })
    } finally {
      setSaving(false)
    }
  }

  const handleResetProgress = async () => {
    if (
      !window.confirm(
        'Are you absolutely sure you want to reset all your progress? This will delete all solved status and revision records.'
      )
    ) {
      return
    }

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
      setMessage({ type: 'success', text: 'Progress reset. Refreshing now.' })
      setTimeout(() => {
        window.location.reload()
      }, 1200)
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to reset progress.') })
    } finally {
      setResetting(false)
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = '/login'
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to sign out.') })
    }
  }

  const profileName = profile?.name || user.user_metadata?.full_name || 'Developer'
  const initials = (profile?.name || user.user_metadata?.full_name || 'User')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6" style={modalTheme}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Account and Settings"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl shadow-black/60 text-text outline-none"
      >
        <div className="flex max-h-[85vh] flex-col overflow-hidden rounded-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-5">
            <h2 className="text-xl font-bold text-text">Account &amp; Settings</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close settings"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors duration-150 hover:bg-surface-hover hover:text-text focus:outline-none"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-8 overflow-y-auto px-6 py-6">
            {message && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  message.type === 'success'
                    ? 'border-indigo/40 bg-indigo-dim text-text'
                    : 'border-red/40 bg-red-dim text-red'
                }`}
              >
                {message.text}
              </div>
            )}

            <section>
              <SectionHeader icon={User} label="Account Profile" />
              <div className="flex items-center gap-3 rounded-xl border border-border bg-bg p-4">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="h-12 w-12 rounded-full border-2 border-border object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-indigo-dim text-sm font-semibold text-indigo-light">
                    {initials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-base font-semibold text-text">{profileName}</div>
                  <div className="mt-0.5 truncate text-sm text-text-muted">{user.email}</div>
                </div>
              </div>
            </section>

            <section>
              <label className="mb-2 block text-xs font-medium text-text-muted">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name"
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text transition-all duration-150 focus:border-indigo focus:ring-2 focus:ring-indigo/10 focus:outline-none"
              />
            </section>

            <section>
              <SectionHeader icon={Target} label="Target Roles" />
              <div className="grid grid-cols-2 gap-2.5">
                {roleOptions.map((roleName) => (
                  <SelectionPill
                    key={roleName}
                    label={roleName}
                    isSelected={selectedRoles.includes(roleName)}
                    onClick={() => handleToggleRole(roleName)}
                    showCheck
                  />
                ))}
              </div>
            </section>

            <section>
              <SectionHeader icon={BarChart2} label="Experience & Timeline" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-text-muted">Experience Level</label>
                  <SettingsSelect
                    label="Experience Level"
                    value={experienceLevel}
                    onChange={setExperienceLevel}
                    options={experienceLevels}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-text-muted">Interview Timeline</label>
                  <SettingsSelect
                    label="Interview Timeline"
                    value={interviewTimeline}
                    onChange={setInterviewTimeline}
                    options={timelineOptions}
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionHeader icon={Briefcase} label="Prep Goal & Company Target" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-text-muted">Prep Goal</label>
                  <SettingsSelect
                    label="Prep Goal"
                    value={goal}
                    onChange={setGoal}
                    options={prepGoalOptions}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-text-muted">Target Company Type</label>
                  <SettingsSelect
                    label="Target Company Type"
                    value={targetCompanyType}
                    onChange={setTargetCompanyType}
                    options={companyTypes}
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionHeader icon={Layers} label="Focus Areas" />
              <div className="grid grid-cols-2 gap-2.5">
                {focusAreaOptions.map((area) => (
                  <SelectionPill
                    key={area}
                    label={area}
                    isSelected={focusAreas.includes(area)}
                    onClick={() => handleToggleFocus(area)}
                  />
                ))}
              </div>
            </section>

            <section>
              <SectionHeader icon={Code2} label="Coding Preferences" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-text-muted">Default Language</label>
                  <SettingsSelect
                    label="Default Language"
                    value={defaultLanguage}
                    onChange={setDefaultLanguage}
                    options={languageOptions}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-text-muted">Daily Question Goal</label>
                  <div className="grid grid-cols-4 gap-2">
                    {dailyGoalOptions.map((option) => (
                      <SelectionPill
                        key={option}
                        label={option}
                        isSelected={dailyGoal === option}
                        onClick={() => setDailyGoal(option)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <SectionHeader icon={Building2} label="Target Company Focus" />
              <div className="grid grid-cols-2 gap-2.5">
                {companyTypes.map((companyType) => (
                  <SelectionPill
                    key={companyType}
                    label={companyType}
                    isSelected={targetCompanyType === companyType}
                    onClick={() => setTargetCompanyType(companyType)}
                  />
                ))}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2">
                <Trash2 size={16} className="text-red" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-red">
                  Danger Zone
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetProgress}
                disabled={resetting}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red/40 bg-bg px-4 py-3 text-sm font-semibold text-red transition-colors duration-150 hover:bg-red/10 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none"
              >
                {resetting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset All Prep Progress'
                )}
              </button>
            </section>
          </div>

          <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t border-border bg-surface px-6 py-4">
            <button
              type="button"
              onClick={handleLogout}
              disabled={saving}
              className="px-3 py-2 text-sm text-text-muted transition-colors hover:text-red disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none"
            >
              Sign out
            </button>

            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={!hasChanges || saving || resetting}
              className="rounded-xl bg-[var(--indigo)] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[var(--indigo-light)] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none"
            >
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
