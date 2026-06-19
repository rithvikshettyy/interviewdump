'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Search, Building2 } from 'lucide-react'
import companiesData from '@/content/companies/index.json'
import SearchBar from '@/components/shared/SearchBar'

interface Company {
  slug: string
  name: string
  sector: string
  tier: string
  focusAreas: string[]
  interviewDifficulty: string
  questionCount: number
  description: string
}

// Tier visual config
const TIER_CONFIG: Record<string, { accent: string; bg: string; label: string }> = {
  FAANG:   { accent: '#FAFAFA', bg: 'rgba(255,255,255,0.07)', label: 'FAANG' },
  Unicorn: { accent: '#F59E0B', bg: 'rgba(245,158,11,0.07)',  label: 'Unicorn' },
  MNC:     { accent: '#22C55E', bg: 'rgba(34,197,94,0.07)',   label: 'MNC' },
  Service: { accent: '#64748B', bg: 'rgba(100,116,139,0.07)', label: 'Service' },
  Startup: { accent: '#A78BFA', bg: 'rgba(167,139,250,0.07)', label: 'Startup' },
}

// Difficulty visual config
const DIFFICULTY_CONFIG: Record<string, string> = {
  Easy:   '#22C55E',
  Medium: '#F59E0B',
  Hard:   '#EF4444',
}

export default function CompanyQuestionsPage() {
  const router = useRouter()

  const [sectorFilter, setSectorFilter] = useState<'All' | 'Product' | 'Service' | 'Startup' | 'FAANG'>('All')
  const [searchQuery, setSearchQuery]   = useState('')
  const [favourites, setFavourites]     = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<'All' | 'Favourites'>('All')
  const [mounted, setMounted]           = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('id_favourites')
    if (saved) {
      try { setFavourites(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  const toggleFavourite = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = favourites.includes(slug)
      ? favourites.filter((s) => s !== slug)
      : [...favourites, slug]
    setFavourites(next)
    localStorage.setItem('id_favourites', JSON.stringify(next))
  }

  const filteredCompanies = (companiesData as Company[]).filter((company) => {
    if (searchQuery && !company.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (activeFilter === 'Favourites' && !favourites.includes(company.slug)) return false
    if (activeFilter === 'All' && sectorFilter !== 'All' && company.sector !== sectorFilter) return false
    return true
  })

  const sectors: { label: string; value: typeof sectorFilter }[] = [
    { label: 'All',           value: 'All' },
    { label: 'Product Based', value: 'Product' },
    { label: 'Service Based', value: 'Service' },
    { label: 'Startup',       value: 'Startup' },
    { label: 'FAANG',         value: 'FAANG' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Page Header */}
      <div className="border-b border-border bg-surface px-6 pt-6 pb-5">
        <h1 className="text-2xl font-bold text-text">Company Question Sets</h1>
        <p className="text-sm text-text-muted mt-1">
          Curated interview questions from top tech companies. Click any card to begin.
        </p>
      </div>

      {/* Filter Row */}
      <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bg">
        {/* Sector Pills */}
        <div className="flex gap-2 flex-wrap items-center">
          {sectors.map((sec) => {
            const isActive = activeFilter === 'All' && sectorFilter === sec.value
            return (
              <button
                key={sec.value}
                onClick={() => { setActiveFilter('All'); setSectorFilter(sec.value) }}
                className={`text-xs px-3 py-1.5 rounded-full font-mono transition-all duration-150 focus:outline-none border ${
                  isActive
                    ? 'bg-indigo text-bg border-transparent'
                    : 'bg-surface border-border text-text-muted hover:text-text hover:border-border-hover'
                }`}
              >
                {sec.label}
              </button>
            )
          })}
          <button
            onClick={() => setActiveFilter('Favourites')}
            className={`text-xs px-3 py-1.5 rounded-full font-mono transition-all duration-150 flex items-center gap-1.5 focus:outline-none border ${
              activeFilter === 'Favourites'
                ? 'bg-amber text-bg border-transparent'
                : 'bg-surface border-border text-text-muted hover:text-text hover:border-border-hover'
            }`}
          >
            <Star className="w-3 h-3" aria-hidden="true" />
            Favourites
            {mounted && favourites.length > 0 && (
              <span className="bg-amber/20 text-amber px-1.5 py-0.5 rounded-full text-[10px] font-bold ml-0.5">
                {favourites.length}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="w-full sm:w-auto">
          <SearchBar
            placeholder="Search company..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
      </div>

      {/* Company Grid */}
      <div className="px-6 py-6 flex-1">
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCompanies.map((company) => {
              const isFav  = favourites.includes(company.slug)
              const tier   = TIER_CONFIG[company.tier] ?? TIER_CONFIG.Service
              const diffColor = DIFFICULTY_CONFIG[company.interviewDifficulty] ?? '#94A3B8'

              return (
                <div
                  key={company.slug}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/library/company-questions/${company.slug}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      router.push(`/library/company-questions/${company.slug}`)
                    }
                  }}
                  aria-label={`${company.name}. ${company.tier} tier. ${company.questionCount} questions. Difficulty: ${company.interviewDifficulty}.`}
                  style={{ borderTop: `2px solid ${tier.accent}` }}
                  className="relative bg-surface border border-border rounded-2xl p-5 cursor-pointer hover:border-border-hover hover:bg-surface-hover transition-all duration-200 flex flex-col justify-between focus:outline-none group"
                >
                  {/* Top Row: Avatar + Favourite */}
                  <div className="flex justify-between items-start">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold font-mono flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                      style={{
                        background: tier.bg,
                        color: tier.accent,
                        border: `1px solid ${tier.accent}25`,
                      }}
                    >
                      {company.name[0]}
                    </div>
                    <button
                      onClick={(e) => toggleFavourite(company.slug, e)}
                      aria-label={isFav ? `Remove ${company.name} from favourites` : `Add ${company.name} to favourites`}
                      className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors focus:outline-none cursor-pointer"
                    >
                      <Star
                        aria-hidden="true"
                        className={`w-4 h-4 transition-all duration-150 ${
                          isFav
                            ? 'fill-amber text-amber scale-110'
                            : 'text-text-dim hover:text-amber'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Company Name + Tier label */}
                  <div className="mt-3">
                    <h3 className="text-sm font-bold text-text leading-snug">{company.name}</h3>
                    <span
                      className="text-[10px] font-mono uppercase tracking-wider mt-0.5 inline-block"
                      style={{ color: tier.accent }}
                    >
                      {tier.label}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-text-muted mt-2 leading-relaxed line-clamp-2">
                    {company.description}
                  </p>

                  {/* Focus Area chips */}
                  {company.focusAreas && company.focusAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {company.focusAreas.slice(0, 3).map((area) => (
                        <span
                          key={area}
                          className="text-[10px] font-mono bg-surface-hover border border-border text-text-dim rounded-full px-2 py-0.5"
                        >
                          {area}
                        </span>
                      ))}
                      {company.focusAreas.length > 3 && (
                        <span className="text-[10px] font-mono text-text-dim px-1 py-0.5">
                          +{company.focusAreas.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bottom Row */}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
                    <span className="text-xs font-mono text-text-muted">
                      {company.questionCount} questions
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: diffColor }}
                        aria-hidden="true"
                      />
                      <span className="text-xs font-mono text-text-dim">
                        {company.interviewDifficulty}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-text-muted bg-surface border border-border rounded-2xl">
            <Building2 className="w-8 h-8 text-text-dim mb-3" aria-hidden="true" />
            <p className="text-base font-semibold text-text">No companies found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  )
}
