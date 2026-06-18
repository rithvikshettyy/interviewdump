'use client'

import React from 'react'
import coreCsQuestions from '@/content/corecs/questions.json'
import QuestionPageShell from '@/components/layout/QuestionPageShell'

export default function CoreCsPage() {
  const allQuestions = (coreCsQuestions as any[]).map((q) => ({ ...q, type: 'corecs' }))

  const uniqueRoles = Array.from(
    new Set(allQuestions.flatMap((q) => q.roles || []))
  )

  const topicOptions = [
    'System Design',
    'Computer Networks',
    'DBMS',
    'OOP',
    'Computer Architecture',
    'Operating Systems',
    'Compiler Design',
  ]

  return (
    <QuestionPageShell
      title="Core CS Subjects"
      subtitle="Core computer science concepts asked in technical interviews across all roles."
      questions={allQuestions as any}
      itemType="corecs"
      filterOptions={{
        difficulties: true,
        topics: true,
        topicOptions,
        roles: true,
        roleOptions: uniqueRoles,
      }}
      layoutVariant="role-wise"
    />
  )
}
