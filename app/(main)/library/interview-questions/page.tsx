'use client'

import React, { useState } from 'react'
import backendQuestions from '@/content/questions/backend.json'
import frontendQuestions from '@/content/questions/frontend.json'
import QuestionPageShell from '@/components/layout/QuestionPageShell'

export default function InterviewQuestionsPage() {
  const [activeTab, setActiveTab] = useState('all')

  // Load all questions of type 'interview'
  const allQuestions = [...backendQuestions, ...frontendQuestions].filter(
    (q) => q.type === 'interview'
  )

  // Extract unique roles across all questions
  const uniqueRoles = Array.from(
    new Set(allQuestions.flatMap((q) => q.roles || []))
  )

  // Map the type field to activeTab to keep it compatible with the internal
  // Main Tabs filter inside QuestionPageShell (q.type === activeTab)
  const displayQuestions = allQuestions.map((q) => ({
    ...q,
    type: activeTab,
  }))

  return (
    <QuestionPageShell
      title="Interview Questions"
      subtitle="Most asked interview questions across all engineering roles. Researched from Glassdoor, Reddit & real interview reports."
      questions={displayQuestions as any}
      itemType="interview"
      filterOptions={{
        difficulties: true,
        roles: true,
        roleOptions: uniqueRoles,
      }}
      showRoleColumn={true}
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
