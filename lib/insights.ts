export interface WeakTopic {
  topic: string
  type: string
  href: string
  solved: number
  total: number
  pct: number
}

interface QuestionItem {
  id: string
  topic?: string
  type?: string
}

const TYPE_HREF: Record<string, string> = {
  dsa:       '/library/dsa',
  sql:       '/library/sql',
  corecs:    '/library/core-cs',
  interview: '/library/interview-questions',
  scenario:  '/library/scenario',
}

export function computeWeakTopics(
  solvedIds: string[],
  questions: QuestionItem[]
): WeakTopic[] {
  const solvedSet = new Set(solvedIds)
  const map = new Map<string, { total: number; solved: number; type: string }>()

  for (const q of questions) {
    if (!q.topic || !q.type) continue
    const key = `${q.topic}|||${q.type}`
    const entry = map.get(key) ?? { total: 0, solved: 0, type: q.type }
    entry.total++
    if (solvedSet.has(q.id)) entry.solved++
    map.set(key, entry)
  }

  const results: WeakTopic[] = []
  for (const [key, entry] of map.entries()) {
    if (entry.total < 3) continue // too few to be meaningful
    const [topic] = key.split('|||')
    const pct = Math.round((entry.solved / entry.total) * 100)
    results.push({
      topic,
      type: entry.type,
      href: TYPE_HREF[entry.type] ?? '/library/dsa',
      solved: entry.solved,
      total: entry.total,
      pct,
    })
  }

  // Sort by lowest completion percentage first
  results.sort((a, b) => a.pct - b.pct)
  return results.slice(0, 5)
}
