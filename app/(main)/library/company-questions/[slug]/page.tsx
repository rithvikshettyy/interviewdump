import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import companies from '@/content/companies/index.json'
import backendQuestions from '@/content/questions/backend.json'
import frontendQuestions from '@/content/questions/frontend.json'
import dsaQuestions from '@/content/dsa/questions.json'
import Badge from '@/components/shared/Badge'
import QuestionPageShell from '@/components/layout/QuestionPageShell'

export function generateStaticParams() {
  return companies.map((c) => ({
    slug: c.slug,
  }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CompanyQuestionPage({ params }: PageProps) {
  const { slug } = await params
  const company = companies.find((c) => c.slug === slug)

  if (!company) {
    notFound()
  }

  // Load questions
  let companyQuestions = []
  const specificFilePath = path.join(process.cwd(), 'content', 'companies', `${slug}.json`)

  if (fs.existsSync(specificFilePath)) {
    try {
      const rawData = fs.readFileSync(specificFilePath, 'utf-8')
      companyQuestions = JSON.parse(rawData)
    } catch (e) {}
  } else {
    // Fallback to filtering questions
    const allQuestions = [
      ...backendQuestions,
      ...frontendQuestions,
      ...dsaQuestions,
    ]
    companyQuestions = allQuestions.filter((q) =>
      q.companies?.some(
        (c) =>
          c.toLowerCase() === company.name.toLowerCase() ||
          c.toLowerCase() === company.slug.toLowerCase()
      )
    )
  }

  let tierVariant: 'indigo' | 'amber' | 'green' | 'muted' = 'muted'
  if (company.tier === 'FAANG' || company.tier === 'Startup') {
    tierVariant = 'indigo'
  } else if (company.tier === 'Unicorn') {
    tierVariant = 'amber'
  } else if (company.tier === 'MNC') {
    tierVariant = 'green'
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Custom Company Header */}
      <div className="border-b border-border bg-surface px-6 pt-6 pb-5">
        <Link
          href="/library/company-questions"
          className="text-sm text-text-muted hover:text-text transition-colors flex items-center gap-1.5 mb-4 inline-flex font-medium"
        >
          &larr; Company Questions
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-dim flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-mono font-bold text-indigo-light">
                {company.name[0]}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-text">{company.name}</h1>
                <Badge label={company.tier} variant={tierVariant} size="sm" />
              </div>
              <p className="text-sm text-text-muted mt-1">
                {companyQuestions.length} curated questions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap md:justify-end">
            <span className="text-xs text-text-muted font-medium">Interview Difficulty:</span>
            <Badge
              label={company.interviewDifficulty}
              variant={company.interviewDifficulty.toLowerCase() as any}
              size="md"
            />
          </div>
        </div>

        {company.focusAreas && (
          <div className="flex gap-1.5 flex-wrap mt-4">
            {company.focusAreas.map((area) => (
              <span
                key={area}
                className="text-[10px] font-mono bg-surface-hover border border-border text-text-muted rounded-full px-2.5 py-1"
              >
                {area}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Question Table & Core List (Hiding the empty default PageHeader container of the child component) */}
      <div className="[&_.pb-0.bg-surface]:hidden flex-1 flex flex-col">
        <QuestionPageShell
          title=""
          subtitle=""
          questions={companyQuestions as any}
          itemType={`company-${slug}`}
          filterOptions={{ difficulties: true }}
        />
      </div>
    </div>
  )
}
