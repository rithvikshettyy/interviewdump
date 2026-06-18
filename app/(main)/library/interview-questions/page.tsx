'use client'

import React from 'react'
import backendQuestions from '@/content/questions/backend.json'
import frontendQuestions from '@/content/questions/frontend.json'
import QuestionPageShell from '@/components/layout/QuestionPageShell'

export default function InterviewQuestionsPage() {
  const allQuestions = [...backendQuestions, ...frontendQuestions].filter(
    (q) => q.type === 'interview'
  )

  const uniqueRoles = Array.from(
    new Set(allQuestions.flatMap((q) => q.roles || []))
  )

  return (
    <QuestionPageShell
      title="Interview Questions"
      subtitle="Most asked interview questions across all engineering roles. Researched from Glassdoor, Reddit & real interview reports."
      questions={allQuestions as any}
      itemType="interview"
      filterOptions={{
        difficulties: true,
        roles: true,
        roleOptions: uniqueRoles,
      }}
      showRoleColumn={true}
      layoutVariant="role-wise"
    />
  )
}
