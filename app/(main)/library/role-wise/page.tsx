'use client'

import React, { useState } from 'react'
import backendQuestions from '@/content/questions/backend.json'
import frontendQuestions from '@/content/questions/frontend.json'
import dsaQuestions from '@/content/dsa/questions.json'
import quantQuestions from '@/content/aptitude/quantitative.json'
import logicalQuestions from '@/content/aptitude/logical.json'
import QuestionPageShell from '@/components/layout/QuestionPageShell'

export default function RoleWisePage() {
  const [selectedRole, setSelectedRole] = useState('Backend Developer')
  const [activeQuestionType, setActiveQuestionType] = useState('interview')

  const roles = [
    'Backend Developer',
    'QA/SDET',
    'AI Engineer',
    'Frontend Developer',
    'Data Science & ML',
    'System Design & Architecture',
  ]

  const questionTypes = [
    { label: 'Interview Questions', value: 'interview' },
    { label: 'DSA Questions', value: 'dsa' },
    { label: 'Aptitude Questions', value: 'aptitude' },
    { label: 'SQL Questions', value: 'sql' },
    { label: 'Core CS Questions', value: 'corecs' },
  ]

  const defaultSqlQuestions = [
    {
      id: 'sql-1',
      number: 1,
      question: 'Find the 2nd Highest Salary from an Employee table.',
      summary: 'Write a SQL query to retrieve the second highest salary, handling cases where there are duplicates or less than 2 distinct salaries.',
      difficulty: 'Medium',
      companies: ['Amazon', 'Flipkart', 'Paytm'],
      roles: ['Backend', 'Software Engineer'],
      type: 'sql',
      topic: 'SQL',
      whatTheyTest: 'Use of subqueries, LIMIT/OFFSET, and handling null results.',
      explanation: 'To find the second highest salary, we can query the maximum salary that is strictly less than the highest salary, OR we can sort salaries in descending order, use DISTINCT to skip duplicates, and fetch the second row using LIMIT 1 OFFSET 1. Wrapping the query in a SELECT wrapper ensures it returns NULL if no such row exists.',
      codeExample: 'SELECT (\n  SELECT DISTINCT Salary \n  FROM Employee \n  ORDER BY Salary DESC \n  LIMIT 1 OFFSET 1\n) AS SecondHighestSalary;',
      codeLanguage: 'sql',
      strongAnswerPoints: [
        'Explain DISTINCT to avoid returning duplicates of the highest salary.',
        'Discuss using OFFSET 1 to skip the highest salary.',
        'Explain why wrapping in a subquery returns NULL instead of an empty set if no second salary exists.',
      ],
      whatToAvoid: 'Do not write queries without DISTINCT or subquery wrappers, as they fail on test boundaries.',
      ytQuery: 'Second Highest Salary SQL LeetCode',
    },
    {
      id: 'sql-2',
      number: 2,
      question: 'Explain the difference between INNER JOIN, LEFT JOIN, and outer joins.',
      summary: 'Details table merging operations, row matching, and handling missing data.',
      difficulty: 'Easy',
      companies: ['TCS Digital', 'Infosys SP', 'CRED'],
      roles: ['Backend', 'Software Engineer'],
      type: 'sql',
      topic: 'SQL',
      whatTheyTest: 'Relational algebra database connections and null value allocations.',
      explanation: 'INNER JOIN returns only the rows that have matching values in both tables. LEFT JOIN (or LEFT OUTER JOIN) returns all rows from the left table, plus matching rows from the right table; if no match exists, NULL values are filled in for the right table columns. FULL OUTER JOIN returns all rows from both tables, filling in NULL where matches do not exist.',
      codeExample: 'SELECT u.name, o.order_id\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;\n-- Returns all users, even if they have no orders (order_id will be NULL)',
      codeLanguage: 'sql',
      strongAnswerPoints: [
        'INNER JOIN: exclusive overlap.',
        'LEFT JOIN: keeps left table intact, fills NULLs on the right.',
        'Discuss performance impacts of joining large tables.',
      ],
      whatToAvoid: 'Do not confuse LEFT JOIN with INNER JOIN, as LEFT JOIN preserves all left-side records even if unmatched.',
      ytQuery: 'SQL Joins Explained INNER LEFT RIGHT',
    },
  ]

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

  // Role matching logic
  const matchesRole = (q: any, targetRole: string) => {
    if (!q.roles || q.roles.length === 0) return true
    const qRoles = q.roles.map((r: string) => r.toLowerCase())
    const target = targetRole.toLowerCase()
    
    if (target.includes('backend') && (qRoles.includes('backend') || qRoles.includes('software engineer') || qRoles.includes('fullstack'))) return true
    if (target.includes('frontend') && (qRoles.includes('frontend') || qRoles.includes('software engineer') || qRoles.includes('fullstack'))) return true
    if (target.includes('qa') || target.includes('sdet')) {
      if (qRoles.includes('qa') || qRoles.includes('sdet') || qRoles.includes('software engineer')) return true
    }
    if (target.includes('ai') || target.includes('ml') || target.includes('data science')) {
      if (qRoles.includes('ai') || qRoles.includes('ml') || qRoles.includes('data science') || qRoles.includes('software engineer')) return true
    }
    if (target.includes('system design') || target.includes('architecture')) {
      if (qRoles.includes('software engineer') || qRoles.includes('backend') || qRoles.includes('system architect') || qRoles.includes('architect')) return true
    }
    return qRoles.some((r: string) => target.includes(r) || r.includes(target))
  }

  // Get matching questions based on role and type selection
  const getFilteredQuestions = () => {
    let source: any[] = []

    if (activeQuestionType === 'interview') {
      source = [...backendQuestions, ...frontendQuestions].filter((q) => q.type === 'interview')
    } else if (activeQuestionType === 'dsa') {
      source = dsaQuestions
    } else if (activeQuestionType === 'aptitude') {
      const rawApt = [...quantQuestions, ...logicalQuestions]
      source = rawApt.map((q, idx) => ({
        id: q.id,
        number: idx + 1,
        question: q.question,
        summary: `Solve the problem and select the correct option: ${q.options.join(', ')}`,
        difficulty: q.difficulty,
        companies: [],
        roles: ['Backend', 'Frontend', 'Software Engineer'],
        type: 'aptitude',
        topic: q.category,
        category: q.category,
        whatTheyTest: `Evaluates logical ability and numerical pattern recognition under time constraints.`,
        explanation: `Correct Answer: Option ${String.fromCharCode(65 + q.correctIndex)} (${q.options[q.correctIndex]})\n\n${q.explanation}`,
        strongAnswerPoints: q.options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt} ${i === q.correctIndex ? '✓ (Correct)' : ''}`),
        whatToAvoid: q.trick ? `Shortcut / Trick:\n${q.trick}` : 'Solve carefully using standard mathematical formulas.',
        ytQuery: `${q.category} placement questions`,
      }))
    } else if (activeQuestionType === 'sql') {
      const foundSql = [...backendQuestions, ...frontendQuestions].filter((q) => q.topic === 'SQL' || q.type === 'sql')
      source = foundSql.length > 0 ? foundSql : defaultSqlQuestions
    } else if (activeQuestionType === 'corecs') {
      const foundCS = [...backendQuestions, ...frontendQuestions].filter((q) => q.type === 'corecs')
      source = foundCS.length > 0 ? foundCS : defaultCoreCsQuestions
    }

    // Filter by role match
    const roleFiltered = source.filter((q) => matchesRole(q, selectedRole))

    // Map type field to activeQuestionType for compatibility with internal tabs
    return roleFiltered.map((q) => ({
      ...q,
      type: activeQuestionType,
    }))
  }

  const filteredQuestions = getFilteredQuestions()

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Page Header */}
      <div className="border-b border-border bg-surface">
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-text font-sans">Role Wise Resources</h1>
          <p className="text-sm text-text-muted mt-1">
            Position-specific interview prep. Select your role and question type.
          </p>
        </div>

        {/* 1. Role Tabs */}
        <div className="flex gap-0 overflow-x-auto scrollbar-hide px-6 border-t border-border/40">
          {roles.map((role) => {
            const isActive = selectedRole === role
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-5 py-3.5 text-sm cursor-pointer transition-colors duration-150 whitespace-nowrap border-b-2 focus:outline-none ${
                  isActive
                    ? 'border-indigo text-text font-semibold'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                {role}
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Sub-Tabs Section */}
      <div className="px-6 pt-2 bg-bg border-b border-border flex overflow-x-auto scrollbar-hide gap-2">
        {questionTypes.map((type) => {
          const isActive = activeQuestionType === type.value
          return (
            <button
              key={type.value}
              onClick={() => setActiveQuestionType(type.value)}
              className={`text-xs font-mono px-4 py-2.5 mb-2 cursor-pointer focus:outline-none transition-colors duration-150 whitespace-nowrap border-b-2 ${
                isActive
                  ? 'border-indigo text-text font-semibold'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              {type.label}
            </button>
          )
        })}
      </div>

      {/* 3. Section Header info */}
      <div className="mt-4 mb-2 px-6">
        <h2 className="text-sm font-semibold text-text-muted">
          {selectedRole} — {questionTypes.find((t) => t.value === activeQuestionType)?.label}
        </h2>
        <p className="text-xs text-text-dim mt-0.5">Most asked questions for this role</p>
      </div>

      {/* 4. Question Page Shell (Hiding empty PageHeader inside it) */}
      <div className="[&_.pb-0.bg-surface]:hidden flex-1 flex flex-col">
        <QuestionPageShell
          title=""
          subtitle=""
          questions={filteredQuestions}
          itemType={`role-${selectedRole}-${activeQuestionType}`}
          filterOptions={{ difficulties: true }}
        />
      </div>
    </div>
  )
}
