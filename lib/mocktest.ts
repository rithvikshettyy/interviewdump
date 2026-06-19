export interface TestQuestion {
  id: string
  question: string
  topic: string
  type: 'dsa' | 'behavioral' | 'sql' | 'scenario' | 'corecs'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  explanation: string
}

export type QuestionVerdict = 'nailed' | 'unsure' | 'skipped'

export const DURATION_TO_COUNT: Record<number, number> = {
  20: 12,
  30: 20,
  45: 30,
}

export function shuffleAndPick<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(n, shuffled.length))
}

function adaptQuestion(q: any, type: TestQuestion['type']): TestQuestion {
  return {
    id: q.id,
    question: q.question ?? q.title ?? '',
    topic: q.topic ?? q.type ?? 'General',
    type,
    difficulty: q.difficulty ?? 'Medium',
    explanation: q.explanation ?? q.summary ?? '',
  }
}

export async function buildMixedTest(durationMinutes: number): Promise<TestQuestion[]> {
  const total = DURATION_TO_COUNT[durationMinutes] ?? 20
  const [dsaMod, sqlMod, scenarioMod, corecsMod, beMod] = await Promise.all([
    import('@/content/dsa/questions.json'),
    import('@/content/sql/questions.json'),
    import('@/content/scenario/questions.json'),
    import('@/content/corecs/questions.json'),
    import('@/content/questions/backend.json'),
  ])

  const dsa      = (dsaMod.default as any[]).map((q) => adaptQuestion(q, 'dsa'))
  const sql      = (sqlMod.default as any[]).map((q) => adaptQuestion(q, 'sql'))
  const scenario = (scenarioMod.default as any[]).map((q) => adaptQuestion(q, 'scenario'))
  const corecs   = (corecsMod.default as any[]).map((q) => adaptQuestion(q, 'corecs'))
  const be       = (beMod.default as any[]).map((q) => adaptQuestion(q, 'behavioral'))

  // Proportional mix
  const picks = [
    ...shuffleAndPick(dsa, Math.round(total * 0.35)),
    ...shuffleAndPick(sql, Math.round(total * 0.15)),
    ...shuffleAndPick(scenario, Math.round(total * 0.20)),
    ...shuffleAndPick(corecs, Math.round(total * 0.15)),
    ...shuffleAndPick(be, Math.round(total * 0.15)),
  ]

  return shuffleAndPick(picks, total)
}

export async function buildCompanyTest(slug: string, durationMinutes: number): Promise<TestQuestion[]> {
  const total = DURATION_TO_COUNT[durationMinutes] ?? 20

  const [companyMod, dsaMod, beMod, scenarioMod] = await Promise.all([
    import(`@/content/companies/${slug}.json`),
    import('@/content/dsa/questions.json'),
    import('@/content/questions/backend.json'),
    import('@/content/scenario/questions.json'),
  ])

  const company  = (companyMod.default as any[]).map((q) => adaptQuestion(q, 'behavioral'))
  const dsa      = (dsaMod.default as any[]).map((q) => adaptQuestion(q, 'dsa'))
  const be       = (beMod.default as any[]).map((q) => adaptQuestion(q, 'behavioral'))
  const scenario = (scenarioMod.default as any[]).map((q) => adaptQuestion(q, 'scenario'))

  const picks = [
    ...shuffleAndPick(company, Math.round(total * 0.40)),
    ...shuffleAndPick(dsa, Math.round(total * 0.35)),
    ...shuffleAndPick([...be, ...scenario], Math.round(total * 0.25)),
  ]

  return shuffleAndPick(picks, total)
}
