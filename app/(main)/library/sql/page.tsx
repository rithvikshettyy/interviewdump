'use client'

import React from 'react'
import sqlQuestions from '@/content/sql/questions.json'
import QuestionPageShell from '@/components/layout/QuestionPageShell'

export default function SqlQuestionsPage() {
  const allQuestions = sqlQuestions as any[]

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

  return (
    <QuestionPageShell
      title="SQL Questions"
      subtitle="SQL and database questions asked at top companies — from query basics to advanced optimization."
      questions={allQuestions as any}
      itemType="sql"
      filterOptions={{
        difficulties: true,
        topics: true,
        topicOptions,
      }}
      showTopicColumn={true}
      layoutVariant="role-wise"
    />
  )
}
