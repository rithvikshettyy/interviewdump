'use client'

import React, { useState } from 'react'
import coreCsQuestions from '@/content/corecs/questions.json'
import QuestionPageShell from '@/components/layout/QuestionPageShell'

export default function CoreCsPage() {
  const [activeTab, setActiveTab] = useState('All')

  const allQuestions = coreCsQuestions as any[]

  // Extract unique roles across all corecs questions
  const uniqueRoles = Array.from(
    new Set(allQuestions.flatMap((q) => q.roles || []))
  )

  // Filter based on selected topic tab
  const filteredByTopic = allQuestions.filter((q) => {
    if (activeTab === 'All') return true
    return q.topic === activeTab
  })

  // Map the type field to activeTab to keep it compatible with the internal
  // Main Tabs filter inside QuestionPageShell (q.type === activeTab)
  const displayQuestions = filteredByTopic.map((q) => ({
    ...q,
    type: activeTab,
  }))

  const tabs = [
    { label: 'All', value: 'All' },
    { label: 'System Design', value: 'System Design' },
    { label: 'Computer Networks', value: 'Computer Networks' },
    { label: 'DBMS', value: 'DBMS' },
    { label: 'OOP', value: 'OOP' },
    { label: 'Computer Architecture', value: 'Computer Architecture' },
    { label: 'Operating Systems', value: 'Operating Systems' },
    { label: 'Compiler Design', value: 'Compiler Design' },
  ]

  return (
    <QuestionPageShell
      title="Core CS Subjects"
      subtitle="Core computer science concepts asked in technical interviews across all roles."
      questions={displayQuestions as any}
      itemType="corecs"
      filterOptions={{
        difficulties: true,
        roles: true,
        roleOptions: uniqueRoles,
      }}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  )
}
