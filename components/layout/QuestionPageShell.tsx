'use client'

import React, { useState, useEffect } from 'react'
import { Question } from '@/types'
import { toggleProgress, getProgressIds } from '@/lib/progress'
import PageHeader from './PageHeader'
import ProgressCard from '@/components/shared/ProgressCard'
import SearchBar from '@/components/shared/SearchBar'
import FilterDropdown from '@/components/shared/FilterDropdown'
import QuestionTable from '@/components/shared/QuestionTable'
import QuestionDrawer from '@/components/shared/QuestionDrawer'
import { TrendingUp } from 'lucide-react'

interface QuestionPageShellProps {
  title: string
  subtitle: string
  questions: Question[]
  itemType: string
  filterOptions?: {
    difficulties?: boolean
    roles?: boolean
    topics?: boolean
    categories?: boolean
    languages?: boolean
    roleOptions?: string[]
    topicOptions?: string[]
    categoryOptions?: string[]
    languageOptions?: string[]
  }
  showRoleColumn?: boolean
  showTopicColumn?: boolean
  showCompanies?: boolean
  tabs?: { label: string; value: string }[]
  activeTab?: string
  onTabChange?: (val: string) => void
  layoutVariant?: 'default' | 'role-wise'
}

export default function QuestionPageShell({
  title,
  subtitle,
  questions,
  itemType,
  filterOptions = {},
  showRoleColumn = false,
  showTopicColumn = false,
  showCompanies = true,
  tabs,
  activeTab,
  onTabChange,
  layoutVariant = 'default',
}: QuestionPageShellProps) {
  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [topicFilter, setTopicFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [languageFilter, setLanguageFilter] = useState('')
  const [secondaryFilter, setSecondaryFilter] = useState<'all' | 'solved' | 'revision'>('all')
  const [showProgress, setShowProgress] = useState(false)

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [solvedIds, setSolvedIds] = useState<string[]>([])
  const [revisionIds, setRevisionIds] = useState<string[]>([])

  // On mount: Fetch user progress
  useEffect(() => {
    async function loadProgress() {
      const [solved, revision] = await Promise.all([
        getProgressIds(itemType, 'solved'),
        getProgressIds(itemType, 'revision'),
      ])
      setSolvedIds(solved)
      setRevisionIds(revision)
    }
    loadProgress()
  }, [itemType])

  // Automatically open question if ID is in URL query params
  useEffect(() => {
    const checkQuery = () => {
      const params = new URLSearchParams(window.location.search)
      const qId = params.get('questionId')
      if (qId && questions.length > 0) {
        const found = questions.find((q) => q.id === qId)
        if (found) {
          setSelectedQuestion(found)
          setIsDrawerOpen(true)
        }
      }
    }

    checkQuery()

    // Listen to query changes by polling window.location.search periodically
    const interval = setInterval(checkQuery, 500)
    return () => clearInterval(interval)
  }, [questions])

  // Count totals by difficulty
  const easyQuestions = questions.filter((q) => q.difficulty === 'Easy')
  const mediumQuestions = questions.filter((q) => q.difficulty === 'Medium')
  const hardQuestions = questions.filter((q) => q.difficulty === 'Hard')

  const progressData = {
    total: questions.length,
    solved: questions.filter((q) => solvedIds.includes(q.id)).length,
    easy: {
      total: easyQuestions.length,
      solved: easyQuestions.filter((q) => solvedIds.includes(q.id)).length,
    },
    medium: {
      total: mediumQuestions.length,
      solved: mediumQuestions.filter((q) => solvedIds.includes(q.id)).length,
    },
    hard: {
      total: hardQuestions.length,
      solved: hardQuestions.filter((q) => solvedIds.includes(q.id)).length,
    },
  }

  // Toggling handlers
  const handleToggleSolved = async (id: string) => {
    const isNowSolved = !solvedIds.includes(id)
    if (isNowSolved) {
      setSolvedIds((prev) => [...prev, id])
    } else {
      setSolvedIds((prev) => prev.filter((x) => x !== id))
    }
    await toggleProgress(id, itemType, 'solved')
  }

  const handleToggleRevision = async (id: string) => {
    const isNowRevision = !revisionIds.includes(id)
    if (isNowRevision) {
      setRevisionIds((prev) => [...prev, id])
    } else {
      setRevisionIds((prev) => prev.filter((x) => x !== id))
    }
    await toggleProgress(id, itemType, 'revision')
  }

  // Click handler for table rows
  const handleQuestionClick = (q: Question) => {
    setSelectedQuestion(q)
    setIsDrawerOpen(true)
  }

  // Filtering Logic
  const filteredQuestions = questions.filter((q) => {
    // 1. Search Query (matches question text + summary)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesText = q.question?.toLowerCase().includes(query)
      const matchesSummary = q.summary?.toLowerCase().includes(query)
      if (!matchesText && !matchesSummary) return false
    }

    // 2. Difficulty
    if (difficultyFilter && q.difficulty !== difficultyFilter) {
      return false
    }

    // 3. Role
    if (roleFilter && !q.roles?.includes(roleFilter)) {
      return false
    }

    // 4. Topic
    if (topicFilter && q.topic !== topicFilter) {
      return false
    }

    // 5. Category
    if (categoryFilter && (q as any).category !== categoryFilter) {
      return false
    }

    // 6. Language
    if (languageFilter && q.language !== languageFilter) {
      return false
    }

    // 7. Main Tabs (activeTab matches question.type)
    if (activeTab && q.type !== activeTab) {
      return false
    }

    // 8. Secondary filter tabs (All, Solved, Revision)
    const isSolved = solvedIds.includes(q.id)
    const isRevision = revisionIds.includes(q.id)
    if (secondaryFilter === 'solved' && !isSolved) return false
    if (secondaryFilter === 'revision' && !isRevision) return false

    return true
  })

  if (layoutVariant === 'role-wise') {
    return (
      <div className="flex flex-col min-h-screen bg-bg">
        <div className="p-6">
          <div className="bg-surface/30 border border-border/80 rounded-2xl p-6 shadow-xl flex flex-col gap-5 backdrop-blur-md">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-text font-sans tracking-tight">
                  {title}
                </h1>
                <p className="text-sm text-text-muted mt-1">
                  {subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProgress(!showProgress)}
                className={`flex items-center gap-2 border text-sm rounded-xl px-4 py-2 hover:bg-surface-hover/80 transition-all duration-200 font-medium focus:outline-none cursor-pointer flex-shrink-0 ${
                  showProgress
                    ? 'border-indigo bg-indigo-dim/20 text-indigo-light'
                    : 'border-border text-text-muted hover:border-border-hover hover:text-text'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>My progress</span>
              </button>
            </div>

            {/* Collapsible Progress Cards */}
            {showProgress && (
              <div className="border border-border/60 bg-bg/40 rounded-xl p-4 animate-fadeIn">
                <ProgressCard {...progressData} />
              </div>
            )}

            {/* Filters Row */}
            <div className="flex items-center gap-3 flex-wrap pt-2">
              <SearchBar
                placeholder="Search questions..."
                value={searchQuery}
                onChange={setSearchQuery}
              />

              {filterOptions.difficulties !== false && (
                <FilterDropdown
                  label="All Difficulties"
                  options={['Easy', 'Medium', 'Hard']}
                  value={difficultyFilter}
                  onChange={setDifficultyFilter}
                />
              )}
            </div>

            {/* Table wrapper */}
            <div className="border border-border/60 rounded-xl overflow-hidden bg-bg/20">
              {filteredQuestions.length > 0 ? (
                <QuestionTable
                  questions={filteredQuestions}
                  onQuestionClick={handleQuestionClick}
                  solvedIds={solvedIds}
                  revisionIds={revisionIds}
                  onToggleSolved={handleToggleSolved}
                  onToggleRevision={handleToggleRevision}
                  showRoleColumn={showRoleColumn}
                  showTopicColumn={showTopicColumn}
                  showCompanies={showCompanies}
                  layoutVariant="role-wise"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-text-muted">
                  <p className="text-base font-semibold">No questions found</p>
                  <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Drawer */}
        <QuestionDrawer
          question={selectedQuestion}
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false)
            setSelectedQuestion(null)
          }}
          isSolved={selectedQuestion ? solvedIds.includes(selectedQuestion.id) : false}
          isRevision={selectedQuestion ? revisionIds.includes(selectedQuestion.id) : false}
          onToggleSolved={() => selectedQuestion && handleToggleSolved(selectedQuestion.id)}
          onToggleRevision={() => selectedQuestion && handleToggleRevision(selectedQuestion.id)}
          showCompanies={showCompanies}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* 1. Page Header */}
      <PageHeader
        title={title}
        subtitle={subtitle}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      {/* 2. Progress Cards */}
      <div className={`px-6 ${title ? 'pt-6' : 'pt-2'}`}>
        <ProgressCard {...progressData} />
      </div>

      {/* 3. Filters Row */}
      <div className="px-6 py-4 border-b border-border flex items-center gap-3 flex-wrap bg-bg">
        <SearchBar
          placeholder="Search questions..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {/* Difficulty Dropdown */}
        {filterOptions.difficulties !== false && (
          <FilterDropdown
            label="All Difficulties"
            options={['Easy', 'Medium', 'Hard']}
            value={difficultyFilter}
            onChange={setDifficultyFilter}
          />
        )}

        {/* Role Dropdown */}
        {filterOptions.roles && filterOptions.roleOptions && (
          <FilterDropdown
            label="All Roles"
            options={filterOptions.roleOptions}
            value={roleFilter}
            onChange={setRoleFilter}
          />
        )}

        {/* Topic Dropdown */}
        {filterOptions.topics && filterOptions.topicOptions && (
          <FilterDropdown
            label="All Topics"
            options={filterOptions.topicOptions}
            value={topicFilter}
            onChange={setTopicFilter}
          />
        )}

        {/* Category Dropdown */}
        {filterOptions.categories && filterOptions.categoryOptions && (
          <FilterDropdown
            label="All Categories"
            options={filterOptions.categoryOptions}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
        )}

        {/* Language Dropdown */}
        {filterOptions.languages && filterOptions.languageOptions && (
          <FilterDropdown
            label="All Languages"
            options={filterOptions.languageOptions}
            value={languageFilter}
            onChange={setLanguageFilter}
          />
        )}
      </div>

      {/* 4. Secondary Filter Tabs */}
      <div 
        role="tablist"
        aria-label="Filter questions by progress"
        className="flex gap-4 px-6 border-b border-border text-sm bg-bg"
      >
        <button
          onClick={() => setSecondaryFilter('all')}
          role="tab"
          aria-selected={secondaryFilter === 'all'}
          className={`py-3 font-medium border-b-2 transition-colors focus:outline-none cursor-pointer ${
            secondaryFilter === 'all'
              ? 'border-indigo text-indigo'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          All questions ({questions.length})
        </button>
        <button
          onClick={() => setSecondaryFilter('solved')}
          role="tab"
          aria-selected={secondaryFilter === 'solved'}
          className={`py-3 font-medium border-b-2 transition-colors focus:outline-none cursor-pointer ${
            secondaryFilter === 'solved'
              ? 'border-indigo text-indigo'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          Solved questions ({questions.filter((q) => solvedIds.includes(q.id)).length})
        </button>
        <button
          onClick={() => setSecondaryFilter('revision')}
          role="tab"
          aria-selected={secondaryFilter === 'revision'}
          className={`py-3 font-medium border-b-2 transition-colors focus:outline-none cursor-pointer ${
            secondaryFilter === 'revision'
              ? 'border-indigo text-indigo'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          Revision questions ({questions.filter((q) => revisionIds.includes(q.id)).length})
        </button>
      </div>

      {/* 5. Question Table */}
      <div className="px-0 flex-1 bg-bg">
        {filteredQuestions.length > 0 ? (
          <QuestionTable
            questions={filteredQuestions}
            onQuestionClick={handleQuestionClick}
            solvedIds={solvedIds}
            revisionIds={revisionIds}
            onToggleSolved={handleToggleSolved}
            onToggleRevision={handleToggleRevision}
            showRoleColumn={showRoleColumn}
            showTopicColumn={showTopicColumn}
            showCompanies={showCompanies}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center text-text-muted">
            <p className="text-base font-semibold">No questions found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      {/* 6. Question Drawer */}
      <QuestionDrawer
        question={selectedQuestion}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedQuestion(null)
        }}
        isSolved={selectedQuestion ? solvedIds.includes(selectedQuestion.id) : false}
        isRevision={selectedQuestion ? revisionIds.includes(selectedQuestion.id) : false}
        onToggleSolved={() => selectedQuestion && handleToggleSolved(selectedQuestion.id)}
        onToggleRevision={() => selectedQuestion && handleToggleRevision(selectedQuestion.id)}
        showCompanies={showCompanies}
      />
    </div>
  )
}
