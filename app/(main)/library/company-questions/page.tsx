'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'
import companiesData from '@/content/companies/index.json'
import Badge from '@/components/shared/Badge'
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

export default function CompanyQuestionsPage() {
  const router = useRouter()
  
  // State
  const [sectorFilter, setSectorFilter] = useState<'All' | 'Product' | 'Service' | 'Startup' | 'FAANG'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [favourites, setFavourites] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<'All' | 'Favourites'>('All')
  const [mounted, setMounted] = useState(false)

  // Load favourites on mount
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('id_favourites')
    if (saved) {
      try {
        setFavourites(JSON.parse(saved))
      } catch (e) {}
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

  // Filter logic
  const filteredCompanies = (companiesData as Company[]).filter((company) => {
    // 1. Search Query
    if (searchQuery && !company.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // 2. Favourites Active Filter
    if (activeFilter === 'Favourites' && !favourites.includes(company.slug)) {
      return false
    }

    // 3. Sector Filter (only if Favourites is not active)
    if (activeFilter === 'All' && sectorFilter !== 'All') {
      if (company.sector !== sectorFilter) {
        return false
      }
    }

    return true
  })

  const sectors: { label: string; value: typeof sectorFilter }[] = [
    { label: 'All', value: 'All' },
    { label: 'Product Based', value: 'Product' },
    { label: 'Service Based', value: 'Service' },
    { label: 'Startup', value: 'Startup' },
    { label: 'FAANG', value: 'FAANG' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Page Header */}
      <div className="border-b border-border pb-0 bg-surface">
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-text font-sans">Company Question Sets</h1>
          <p className="text-sm text-text-muted mt-1">
            Click a company to view their most asked interview questions.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="px-6 py-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg">
        {/* Sector Pill Tabs */}
        <div className="flex gap-2 flex-wrap items-center">
          {sectors.map((sec) => (
            <button
              key={sec.value}
              onClick={() => {
                setActiveFilter('All')
                setSectorFilter(sec.value)
              }}
              className={`text-sm px-3 py-1.5 rounded-lg transition-all duration-150 focus:outline-none ${
                activeFilter === 'All' && sectorFilter === sec.value
                  ? 'bg-indigo text-white border-transparent'
                  : 'bg-surface border border-border text-text-muted hover:text-text'
              }`}
            >
              {sec.label}
            </button>
          ))}
          <button
            onClick={() => setActiveFilter('Favourites')}
            className={`text-sm px-3 py-1.5 rounded-lg transition-all duration-150 flex items-center gap-1.5 focus:outline-none ${
              activeFilter === 'Favourites'
                ? 'bg-indigo text-white border-transparent'
                : 'bg-surface border border-border text-text-muted hover:text-text'
            }`}
          >
            ⭐ Favourites {mounted && favourites.length > 0 && `(${favourites.length})`}
          </button>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCompanies.map((company) => {
              const isFav = favourites.includes(company.slug)
              
              // Map tier to Badge variant
              let tierVariant: 'indigo' | 'amber' | 'green' | 'muted' = 'muted'
              if (company.tier === 'FAANG' || company.tier === 'Startup') {
                tierVariant = 'indigo'
              } else if (company.tier === 'Unicorn') {
                tierVariant = 'amber'
              } else if (company.tier === 'MNC') {
                tierVariant = 'green'
              }

              return (
                <div
                  key={company.slug}
                  onClick={() => router.push(`/library/company-questions/${company.slug}`)}
                  className="bg-surface border border-border rounded-2xl p-5 cursor-pointer hover:border-border-hover hover:bg-surface-hover transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Avatar + Favourite */}
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xl bg-indigo-dim flex items-center justify-center">
                        <span className="text-xl font-mono font-bold text-indigo-light">
                          {company.name[0]}
                        </span>
                      </div>
                      <button
                        onClick={(e) => toggleFavourite(company.slug, e)}
                        className="focus:outline-none p-1 hover:bg-surface-hover rounded-lg transition-colors"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            isFav ? 'text-amber fill-amber' : 'text-text-dim hover:text-amber'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Company Info */}
                    <h3 className="text-base font-bold text-text mt-3">{company.name}</h3>
                    <div className="mt-1">
                      <Badge label={company.tier} variant={tierVariant} size="sm" />
                    </div>

                    {/* Focus Areas */}
                    {company.focusAreas && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {company.focusAreas.slice(0, 3).map((area) => (
                          <span
                            key={area}
                            className="text-[10px] font-mono bg-surface-hover border border-border text-text-muted rounded-full px-2 py-0.5"
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
                  </div>

                  {/* Bottom Row */}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
                    <span className="text-xs text-text-dim font-mono">
                      {company.questionCount} questions
                    </span>
                    <Badge
                      label={company.interviewDifficulty}
                      variant={company.interviewDifficulty.toLowerCase() as any}
                      size="sm"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center text-text-muted">
            <span className="text-4xl mb-2">🔍</span>
            <p className="text-base font-semibold">No companies found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  )
}
