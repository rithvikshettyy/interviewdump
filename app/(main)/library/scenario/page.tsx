'use client'

import React from 'react'
import scenarioQuestions from '@/content/scenario/questions.json'
import QuestionPageShell from '@/components/layout/QuestionPageShell'

export default function ScenarioQuestionsPage() {
  const displayQuestions = (scenarioQuestions as any[]).map((q) => {
    let category = 'Technical'
    if (q.topic.startsWith('Behavioral:')) category = 'Behavioral'
    else if (q.topic.startsWith('Culture Fit:')) category = 'Culture Fit'
    return { ...q, category }
  })

  return (
    <QuestionPageShell
      title="Scenario Based Questions"
      subtitle="Real interview scenarios from Indian product companies. Behavioral, technical, and culture fit questions."
      questions={displayQuestions as any}
      itemType="scenario"
      filterOptions={{
        difficulties: true,
        categories: true,
        categoryOptions: ['Technical', 'Behavioral', 'Culture Fit'],
      }}
      layoutVariant="role-wise"
    />
  )
}
