'use client'

import React, { useState } from 'react'
import dsaQuestions from '@/content/dsa/questions.json'
import QuestionPageShell from '@/components/layout/QuestionPageShell'

export default function DsaQuestionsPage() {
  const [activeTab, setActiveTab] = useState('all')

  // Load all questions of type 'dsa'
  const allQuestions = (dsaQuestions as any[]).filter(
    (q) => q.type === 'dsa'
  )

  // Hardcoded filters as requested by task requirements
  const topicOptions = [
    'Arrays',
    'Strings',
    'Linked Lists',
    'Trees',
    'Graphs',
    'Dynamic Programming',
    'Recursion',
    'Sorting',
    'Binary Search',
    'Stacks & Queues',
    'HashMaps',
    'Heaps',
  ]

  const languageOptions = ['JavaScript', 'Python', 'Java', 'C++']

  // Map the type field to activeTab to keep it compatible with the internal
  // Main Tabs filter inside QuestionPageShell (q.type === activeTab)
  const displayQuestions = allQuestions.map((q) => ({
    ...q,
    type: activeTab,
  }))

  return (
    <QuestionPageShell
      title="DSA Questions"
      subtitle="Data structures and algorithms questions asked at top companies. With approach explanations and code walkthroughs."
      questions={displayQuestions as any}
      itemType="dsa"
      filterOptions={{
        difficulties: true,
        topics: true,
        topicOptions,
        languages: true,
        languageOptions,
      }}
      showTopicColumn={true}
      tabs={[
        { label: 'All questions', value: 'all' },
        { label: 'Solved questions', value: 'solved' },
        { label: 'Revision questions', value: 'revision' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  )
}
