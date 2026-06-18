'use client'

import React, { useState } from 'react'
import sqlQuestions from '@/content/sql/questions.json'
import QuestionPageShell from '@/components/layout/QuestionPageShell'

export default function SqlQuestionsPage() {
  const [activeTab, setActiveTab] = useState('all')

  const allQuestions = (sqlQuestions as any[])

  const topicOptions = [
    'Filtering',
    'Joins',
    'Subqueries',
    'Window Functions',
    'CTEs',
    'Indexes',
    'Transactions',
    'Set Operations',
    'NULL Handling',
    'Views',
    'Stored Procedures',
    'Query Optimization',
    'Aggregations',
    'Scalability',
    'Advanced Queries',
    'Interview Problems',
  ]

  const displayQuestions = allQuestions.map((q) => ({
    ...q,
    type: activeTab,
  }))

  return (
    <QuestionPageShell
      title="SQL Questions"
      subtitle="SQL and database questions asked at top companies — from query basics to advanced optimization."
      questions={displayQuestions as any}
      itemType="sql"
      filterOptions={{
        difficulties: true,
        topics: true,
        topicOptions,
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
