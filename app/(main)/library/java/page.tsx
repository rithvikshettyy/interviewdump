'use client'

import javaQuestions from '@/content/questions/java.json'
import QuestionPageShell from '@/components/layout/QuestionPageShell'

export default function JavaQuestionsPage() {
  const allQuestions = javaQuestions as any[]

  const topicOptions = [
    'OOP',
    'Collections',
    'Java 8+ Features',
    'Multithreading',
    'JVM & Memory',
    'Exception Handling',
    'Strings',
    'Generics',
  ]

  return (
    <QuestionPageShell
      title="Java Interview Questions"
      subtitle="Java questions from OOP fundamentals to JVM internals — asked at top product and service companies."
      questions={allQuestions as any}
      itemType="java"
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
