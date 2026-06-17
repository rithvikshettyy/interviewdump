'use client'

import React, { useState } from 'react'
import scenarioQuestions from '@/content/scenario/questions.json'
import QuestionPageShell from '@/components/layout/QuestionPageShell'

export default function ScenarioQuestionsPage() {
  const [activeTab, setActiveTab] = useState('all')

  // Map category dynamically based on the topic prefix, and align 'type' to activeTab
  const displayQuestions = (scenarioQuestions as any[]).map((q) => {
    let category = 'Technical'
    if (q.topic.startsWith('Behavioral:')) {
      category = 'Behavioral'
    } else if (q.topic.startsWith('Culture Fit:')) {
      category = 'Culture Fit'
    }

    return {
      ...q,
      category,
      type: activeTab, // compatibility helper for shell main tab filter
    }
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
      tabs={[
        { label: 'All questions', value: 'all' },
        { label: 'Solved', value: 'solved' },
        { label: 'Revision', value: 'revision' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  )
}
