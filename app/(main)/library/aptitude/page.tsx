'use client'

import React from 'react'
import quantQuestions from '@/content/aptitude/quantitative.json'
import logicalQuestions from '@/content/aptitude/logical.json'
import QuestionPageShell from '@/components/layout/QuestionPageShell'

export default function AptitudeQuestionsPage() {
  const allRaw = [...quantQuestions, ...logicalQuestions]

  const displayQuestions = allRaw.map((q, idx) => {
    const correctLetter = String.fromCharCode(65 + q.correctIndex)
    const correctAnswerText = q.options[q.correctIndex]

    return {
      id: q.id,
      number: idx + 1,
      question: q.question,
      summary: `Solve the problem and select the correct option: ${q.options.join(', ')}`,
      difficulty: q.difficulty,
      companies: [],
      roles: [],
      type: 'aptitude',
      topic: q.category,
      category: q.category,
      whatTheyTest: `Evaluates logical ability, quick calculations, and numerical pattern recognition under time constraints.`,
      explanation: `Correct Answer: Option ${correctLetter} (${correctAnswerText})\n\n${q.explanation}`,
      strongAnswerPoints: q.options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt} ${i === q.correctIndex ? '✓ (Correct Option)' : ''}`),
      whatToAvoid: q.trick
        ? `Shortcut / Trick:\n${q.trick}`
        : 'Ensure you read all constraints carefully to avoid basic calculation pitfalls.',
      ytQuery: `${q.category} placement questions explanation`,
    }
  })

  return (
    <QuestionPageShell
      title="Aptitude Questions"
      subtitle="Placement-style aptitude questions with shortcuts and tricks. Covers quantitative, logical, and verbal reasoning."
      questions={displayQuestions as any}
      itemType="aptitude"
      filterOptions={{
        difficulties: true,
        categories: true,
        categoryOptions: ['Quantitative', 'Logical Reasoning', 'Verbal', 'Technical MCQ'],
      }}
      layoutVariant="role-wise"
    />
  )
}
