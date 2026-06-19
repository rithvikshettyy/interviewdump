'use client'

import React, { useState, useEffect, useRef } from 'react'
import Badge from '@/components/shared/Badge'
import PageHeader from '@/components/layout/PageHeader'

interface QuizQuestion {
  id: string
  concept: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  trick?: string
}

async function loadQuizDeck(topic: string): Promise<QuizQuestion[]> {
  if (topic === 'JavaScript') return (await import('@/content/quiz/javascript.json')).default as QuizQuestion[]
  if (topic === 'Python')     return (await import('@/content/quiz/python.json')).default as QuizQuestion[]
  if (topic === 'Java')       return (await import('@/content/quiz/java.json')).default as QuizQuestion[]
  if (topic === 'DSA')        return (await import('@/content/quiz/dsa.json')).default as QuizQuestion[]
  if (topic === 'SQL')        return (await import('@/content/quiz/sql.json')).default as QuizQuestion[]
  if (topic === 'Core CS')    return (await import('@/content/quiz/corecs.json')).default as QuizQuestion[]
  return []
}

const QUESTION_TIME_LIMIT = 30 // seconds per question

export default function QuizPage() {
  // Config States
  const [activeTopic, setActiveTopic] = useState('JavaScript')
  const [activeDifficulty, setActiveDifficulty] = useState<'All Levels' | 'Easy' | 'Medium' | 'Hard'>('All Levels')
  const [isLoading, setIsLoading] = useState(false)

  // Quiz Engine States
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [streak, setStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [answersLog, setAnswersLog] = useState<{ index: number; isCorrect: boolean }[]>([]) // track dots

  // Timing & Game State
  const [isQuizActive, setIsQuizActive] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

  // Per-question countdown timer
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Start per-question timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(QUESTION_TIME_LIMIT)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          // Time's up — auto-mark as wrong
          setSelectedOption(-1) // sentinel: -1 = timed out (no correct option shown as selected)
          setAnswersLog((log) => [...log, { index: currentIndex, isCorrect: false }])
          setStreak(0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Stop timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  // Start / Reset Quiz
  const startQuiz = (questionsSource: QuizQuestion[]) => {
    stopTimer()
    setQuizQuestions(questionsSource)
    setCurrentIndex(0)
    setSelectedOption(null)
    setCorrectCount(0)
    setStreak(0)
    setAnswersLog([])
    setStartTime(Date.now())
    setIsQuizActive(true)
    setIsFinished(false)
  }

  // Kick off timer whenever a new question is shown
  useEffect(() => {
    if (isQuizActive && !isFinished) {
      startTimer()
    }
    return () => stopTimer()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isQuizActive])

  // Filter and load questions on configuration change or start button click
  const loadAndStart = async () => {
    setIsLoading(true)
    let source = await loadQuizDeck(activeTopic)
    if (activeDifficulty !== 'All Levels') {
      source = source.filter((q) => q.difficulty === activeDifficulty)
    }
    setIsLoading(false)
    if (source.length > 0) {
      startQuiz(source)
    } else {
      setQuizQuestions([])
      setIsQuizActive(false)
    }
  }

  // Answer handler
  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return // already answered
    stopTimer()

    setSelectedOption(optionIndex)
    const currentQuestion = quizQuestions[currentIndex]
    const isCorrect = optionIndex === currentQuestion.correctIndex

    // Log answer for dots
    setAnswersLog((prev) => [...prev, { index: currentIndex, isCorrect }])

    if (isCorrect) {
      setCorrectCount((c) => c + 1)
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
    }
  }

  // Next Question
  const handleNext = () => {
    stopTimer()
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOption(null)
    } else {
      // Finish
      setEndTime(Date.now())
      setIsFinished(true)
      setIsQuizActive(false)
    }
  }

  // Reset entirely
  const handleTryAgain = () => {
    loadAndStart()
  }

  const handleNextTopic = () => {
    const topics = ['JavaScript', 'Python', 'Java', 'DSA', 'SQL', 'Core CS']
    const nextIdx = (topics.indexOf(activeTopic) + 1) % topics.length
    setActiveTopic(topics[nextIdx])
    setIsFinished(false)
    setIsQuizActive(false)
  }

  // Calculate stats
  const totalQuestions = quizQuestions.length
  const duration = Math.round((endTime - startTime) / 1000)
  const durationText = duration >= 60 ? `${Math.floor(duration / 60)}m ${duration % 60}s` : `${duration}s`
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  let scoreEmoji = '🎉'
  if (percentage < 50) {
    scoreEmoji = '👍'
  } else if (percentage < 80) {
    scoreEmoji = '💪'
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* 1. Page Header */}
      <PageHeader
        title="Concept Quiz"
        subtitle="Test your knowledge. Concept-based questions with explanations."
      />

      {/* Configuration Screen (If not currently playing) */}
      {!isQuizActive && !isFinished && (
        <div className="px-6 py-6 max-w-2xl mx-auto w-full flex flex-col gap-6">
          {/* Topic selection tabs */}
          <div>
            <div className="text-xs font-mono text-text-muted mb-2.5 uppercase tracking-wider">
              Select Topic
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide border-b border-border pb-3">
              {['JavaScript', 'Python', 'Java', 'DSA', 'SQL', 'Core CS'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setActiveTopic(topic)}
                  className={`text-sm px-4 py-2 rounded-xl transition-all duration-150 focus:outline-none ${
                    activeTopic === topic
                      ? 'bg-indigo text-white border-transparent'
                      : 'bg-surface border border-border text-text-muted hover:text-text'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty selection tabs */}
          <div>
            <div className="text-xs font-mono text-text-muted mb-2.5 uppercase tracking-wider">
              Select Difficulty
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide border-b border-border pb-3">
              {(['All Levels', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setActiveDifficulty(diff)}
                  className={`text-sm px-4 py-2 rounded-xl transition-all duration-150 focus:outline-none ${
                    activeDifficulty === diff
                      ? 'bg-indigo text-white border-transparent'
                      : 'bg-surface border border-border text-text-muted hover:text-text'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Start trigger */}
          <button
            onClick={loadAndStart}
            disabled={isLoading}
            className="w-full mt-4 bg-indigo hover:bg-indigo/90 text-white rounded-xl py-3 text-sm font-bold transition-all focus:outline-none shadow-lg shadow-indigo/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : `Start ${activeTopic} Quiz`}
          </button>
        </div>
      )}

      {/* QUIZ ENGINE ACTIVE SCREEN */}
      {isQuizActive && quizQuestions.length > 0 && (
        <div className="px-6 py-6 flex-1 flex flex-col items-center justify-start w-full max-w-2xl mx-auto">
          {/* Top Bar info */}
          <div className="flex justify-between items-center w-full mb-4">
            <span className="font-mono text-sm text-text-muted font-medium">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <div className="flex items-center gap-4">
              {/* Countdown timer */}
              <div className={`flex items-center gap-1.5 font-mono text-sm font-bold ${
                timeLeft <= 10 ? 'text-red' : timeLeft <= 20 ? 'text-amber' : 'text-text-muted'
              }`}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {timeLeft}s
              </div>
              <span className="font-mono text-sm text-amber font-bold flex items-center gap-1">
                🔥 {streak} Streak
              </span>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5 w-full mb-6 overflow-x-auto py-1 scrollbar-hide">
            {quizQuestions.map((_, idx) => {
              const logged = answersLog.find((log) => log.index === idx)
              let dotClass = 'bg-border'
              if (idx === currentIndex) {
                dotClass = 'bg-indigo ring-2 ring-indigo/40 ring-offset-2 ring-offset-bg'
              } else if (logged) {
                dotClass = logged.isCorrect ? 'bg-green' : 'bg-red'
              }
              return (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-150 flex-shrink-0 ${dotClass}`}
                />
              )
            })}
          </div>

          {/* Question Card */}
          <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 w-full">
            <div className="flex gap-2">
              <Badge label={quizQuestions[currentIndex].concept} variant="indigo" size="sm" />
              <Badge
                label={quizQuestions[currentIndex].difficulty}
                variant={quizQuestions[currentIndex].difficulty.toLowerCase() as any}
                size="sm"
              />
            </div>

            {/* Question Text */}
            <p className="text-base md:text-lg font-semibold text-text mt-4 leading-relaxed whitespace-pre-wrap">
              {quizQuestions[currentIndex].question}
            </p>

            {/* 4 Options */}
            <div className="flex flex-col gap-3 mt-6">
              {quizQuestions[currentIndex].options.map((option, oIdx) => {
                const prefixLetter = String.fromCharCode(65 + oIdx) // A, B, C, D
                const isCorrectIndex = oIdx === quizQuestions[currentIndex].correctIndex

                let optionClass = 'bg-surface-hover border-border text-text hover:border-border-hover'
                
                if (selectedOption !== null) {
                  if (isCorrectIndex) {
                    // Always highlight the correct answer (timeout or wrong answer)
                    optionClass = 'bg-green-dim border-green text-green font-semibold'
                  } else if (selectedOption === oIdx) {
                    optionClass = 'bg-red-dim border-red text-red'
                  } else {
                    optionClass = 'opacity-50 border-border text-text-muted'
                  }
                }

                return (
                  <div
                    key={oIdx}
                    onClick={() => handleOptionSelect(oIdx)}
                    className={`border rounded-xl px-5 py-4 cursor-pointer flex items-center transition-all duration-200 ${
                      selectedOption !== null ? 'pointer-events-none' : ''
                    } ${optionClass}`}
                  >
                    <span className="font-mono text-text-dim mr-3 text-sm">{prefixLetter}.</span>
                    <span className="text-sm">{option}</span>
                  </div>
                )
              })}
            </div>

            {/* Time's up banner */}
            {selectedOption === -1 && (
              <div className="mt-4 bg-red-dim border border-red/20 rounded-xl px-4 py-2.5 text-sm text-red font-semibold text-center">
                ⏱ Time&apos;s up! The correct answer is highlighted above.
              </div>
            )}

            {/* Explanation card (Slides in below options) */}
            {selectedOption !== null && (
              <div className="mt-6 border-t border-border/60 pt-5 animate-fadeIn">
                <div className="bg-surface border border-border rounded-xl p-5">
                  <div className="text-[10px] font-mono text-text-dim mb-2 uppercase tracking-widest">
                    EXPLANATION
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {quizQuestions[currentIndex].explanation}
                  </p>

                  {/* Optional Trick block */}
                  {quizQuestions[currentIndex].trick && (
                    <div className="bg-amber-dim border border-amber/10 rounded-lg p-3 mt-3">
                      <div className="text-[9px] font-mono text-amber mb-1 uppercase tracking-wider">
                        💡 Key Trick
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {quizQuestions[currentIndex].trick}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleNext}
                    className="bg-indigo hover:bg-indigo/90 text-white rounded-xl px-5 py-2.5 text-xs font-bold transition-all focus:outline-none"
                  >
                    {currentIndex < totalQuestions - 1 ? 'Next Question →' : 'View Results'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESULTS SCREEN */}
      {isFinished && (
        <div className="px-6 py-12 flex-1 flex items-center justify-center w-full">
          <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
            <span className="text-5xl block mb-3">{scoreEmoji}</span>
            <h2 className="text-xl font-bold text-text mb-1">Quiz Completed!</h2>
            <p className="text-sm text-text-muted mb-6">Topic: {activeTopic}</p>

            <div className="text-5xl font-mono font-bold text-indigo mb-2">
              {correctCount} <span className="text-text-dim text-2xl">/ {totalQuestions}</span>
            </div>
            
            <div className="text-sm text-text-muted font-mono mb-6 space-y-1">
              <div>Score: {percentage}%</div>
              <div>Time Taken: {durationText}</div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleTryAgain}
                className="w-full bg-indigo hover:bg-indigo/90 text-white rounded-xl py-2.5 text-sm font-semibold transition-all focus:outline-none"
              >
                Try Again
              </button>
              <button
                onClick={handleNextTopic}
                className="w-full border border-border text-text-muted hover:border-border-hover hover:text-text rounded-xl py-2.5 text-sm font-semibold transition-all focus:outline-none"
              >
                Next Topic →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
