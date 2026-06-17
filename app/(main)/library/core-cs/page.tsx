'use client'

import React, { useState } from 'react'
import backendQuestions from '@/content/questions/backend.json'
import frontendQuestions from '@/content/questions/frontend.json'
import QuestionPageShell from '@/components/layout/QuestionPageShell'

export default function CoreCsPage() {
  const [activeTab, setActiveTab] = useState('All')

  // Default fallback Core CS questions
  const defaultCoreCsQuestions = [
    {
      id: 'corecs-1',
      number: 1,
      question: 'What is the difference between a Process and a Thread?',
      summary: 'Explains execution contexts, memory sharing, and context switching overhead in OS.',
      difficulty: 'Easy',
      companies: ['Google', 'Microsoft', 'TCS Digital'],
      roles: ['Software Engineer'],
      type: 'corecs',
      topic: 'Operating Systems',
      whatTheyTest: 'Basic OS concepts, memory isolation, and thread safety.',
      explanation: 'A process is an independent program in execution with its own address space (memory, file handles, etc.). A thread is a lightweight unit of execution within a process, sharing the parent process\'s memory and resources. Processes are isolated from each other and context-switching is heavy, while threads share memory and context-switching is fast but requires synchronization to avoid race conditions.',
      strongAnswerPoints: [
        'Process: isolated memory, heavy creation/switching.',
        'Thread: shared memory inside a process, fast switching, needs lock synchronization.',
        'Discuss stack vs heap sharing.',
      ],
      whatToAvoid: 'Do not say threads are completely independent; they cannot exist without a parent process.',
      ytQuery: 'Process vs Thread Operating System',
    },
    {
      id: 'corecs-2',
      number: 2,
      question: 'Explain the Database Normalization rules (1NF, 2NF, 3NF).',
      summary: 'Covers schema design, eliminating data redundancy, and database anomalies.',
      difficulty: 'Medium',
      companies: ['Amazon', 'Paytm', 'Zoho'],
      roles: ['Backend', 'Software Engineer'],
      type: 'corecs',
      topic: 'DBMS',
      whatTheyTest: 'Database design patterns, foreign keys, and minimizing data duplication.',
      explanation: 'Normalization is the process of organizing data in a database to avoid redundancy and anomalies (insert/update/delete). 1NF requires atomic values (no repeating groups). 2NF requires 1NF and that all non-key attributes must be fully functionally dependent on the entire primary key (no partial dependency). 3NF requires 2NF and that no non-key attribute is transitively dependent on the primary key.',
      strongAnswerPoints: [
        'Explain the goals of normalization (reduce redundancy, prevent anomalies).',
        'Define 1NF (atomic values), 2NF (no partial dependencies), and 3NF (no transitive dependencies).',
        'Mention trade-offs: over-normalization requires too many JOINs, slowing down reads.',
      ],
      whatToAvoid: 'Do not imply that 3NF is always the optimal choice for read-heavy analytics (where denormalization is preferred).',
      ytQuery: 'Database Normalization 1NF 2NF 3NF',
    },
    {
      id: 'corecs-3',
      number: 3,
      question: 'What is the difference between TCP and UDP protocols?',
      summary: 'Compares connection-oriented reliable streams with connectionless fast datagrams.',
      difficulty: 'Easy',
      companies: ['Cisco', 'Zomato', 'Swiggy'],
      roles: ['Backend', 'Software Engineer'],
      type: 'corecs',
      topic: 'Computer Networks',
      whatTheyTest: 'Networking model layers, data reliability, and transport layer protocols.',
      explanation: 'TCP (Transmission Control Protocol) is connection-oriented and reliable: it performs a 3-way handshake to establish a connection, guarantees packet delivery order, and retransmits lost packets. UDP (User Datagram Protocol) is connectionless and lightweight: it sends packets directly without checking if they arrive, making it much faster but unreliable. Use TCP for web browsing (HTTP), email, and file transfers; use UDP for live video streaming, online gaming, and DNS lookups.',
      strongAnswerPoints: [
        'TCP: connection-oriented, reliable, ordered, slow, uses handshakes and flow control.',
        'UDP: connectionless, fast, unordered, unreliable.',
        'Give standard use-cases for each.',
      ],
      whatToAvoid: 'Do not say UDP is \'bad\'—it is simply designed for speed over reliability.',
      ytQuery: 'TCP vs UDP Computer Networks',
    },
  ]

  // Gather all potential corecs questions
  const loadedQuestions = [...backendQuestions, ...frontendQuestions].filter(
    (q) => q.type === 'corecs'
  )

  const allQuestions = loadedQuestions.length > 0 ? loadedQuestions : defaultCoreCsQuestions

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
