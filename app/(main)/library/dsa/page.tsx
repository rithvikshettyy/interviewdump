'use client'

import React from 'react'
import dsaQuestions from '@/content/dsa/questions.json'
import QuestionPageShell from '@/components/layout/QuestionPageShell'

export default function DsaQuestionsPage() {
  const allQuestions = (dsaQuestions as any[]).filter((q) => q.type === 'dsa')

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

  return (
    <QuestionPageShell
      title="DSA Questions"
      subtitle="Data structures and algorithms questions asked at top companies. With approach explanations and code walkthroughs."
      questions={allQuestions as any}
      itemType="dsa"
      filterOptions={{
        difficulties: true,
        topics: true,
        topicOptions,
        languages: true,
        languageOptions,
      }}
      showTopicColumn={true}
      layoutVariant="role-wise"
    />
  )
}
