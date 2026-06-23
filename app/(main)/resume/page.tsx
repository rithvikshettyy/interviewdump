'use client'

import { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import {
  ChevronDown,
  ChevronRight,
  Bot,
  PenLine,
  Target,
  FileText,
  Rocket,
  Wrench,
  XCircle,
  type LucideIcon,
} from 'lucide-react'

interface Section {
  id: string
  title: string
  icon: LucideIcon
  content: React.ReactNode
}

function AccordionSection({ section }: { section: Section }) {
  const [open, setOpen] = useState(false)
  const Icon = section.icon
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 bg-surface hover:bg-surface-hover transition-colors text-left focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-text-dim flex-shrink-0" aria-hidden="true" />
          <span className="font-semibold text-text text-sm">{section.title}</span>
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 text-text-dim flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-text-dim flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-2 bg-bg border-t border-border text-sm text-text-muted leading-relaxed space-y-4">
          {section.content}
        </div>
      )}
    </div>
  )
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-indigo-dim border border-indigo/20 rounded-xl px-4 py-3 text-sm text-text-muted">
      <span className="text-indigo-light font-semibold">Tip: </span>{children}
    </div>
  )
}

function Warn({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-red-dim border border-red/20 rounded-xl px-4 py-3 text-sm text-text-muted">
      <span className="text-red font-semibold">Avoid: </span>{children}
    </div>
  )
}

function BulletTemplate({ before, after }: { before: string; after: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="bg-red-dim border border-red/20 rounded-xl p-3">
        <div className="text-[10px] font-mono text-red uppercase mb-1.5 tracking-wider">Before</div>
        <p className="text-xs text-text-muted">{before}</p>
      </div>
      <div className="bg-green-dim border border-green/20 rounded-xl p-3">
        <div className="text-[10px] font-mono text-green uppercase mb-1.5 tracking-wider">After</div>
        <p className="text-xs text-text-muted">{after}</p>
      </div>
    </div>
  )
}

const sections: Section[] = [
  {
    id: 'ats',
    title: 'ATS Optimization — Get Past the Bot',
    icon: Bot,
    content: (
      <>
        <p>
          Most companies use Applicant Tracking Systems (ATS) to screen resumes before a human sees them.
          If your resume isn't ATS-friendly, it gets rejected automatically — even if you're a perfect fit.
        </p>
        <div className="space-y-2">
          <p className="font-semibold text-text">ATS Rules:</p>
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>Use a <strong className="text-text">single-column layout</strong> — multi-column breaks ATS parsing.</li>
            <li>Save as <strong className="text-text">.pdf</strong> (or .docx for older ATS systems that can't parse PDF).</li>
            <li>Use <strong className="text-text">standard section headings</strong>: Work Experience, Education, Skills, Projects — not creative names.</li>
            <li><strong className="text-text">Mirror the job description keywords</strong> exactly. If the JD says "React.js", use "React.js" not just "React".</li>
            <li>No tables, no text boxes, no headers/footers — ATS often skips content in these.</li>
            <li>Use standard fonts: Arial, Calibri, Times New Roman.</li>
          </ul>
        </div>
        <Tip>
          Copy the job description into a word cloud tool. Identify the 10 most frequent technical terms and ensure each appears at least once in your resume — in context, not just in a skills list.
        </Tip>
        <Warn>
          Don't "keyword stuff" by hiding white text — modern ATS detects this and flags your application as manipulated.
        </Warn>
      </>
    ),
  },
  {
    id: 'bullets',
    title: 'Writing Strong Bullet Points',
    icon: PenLine,
    content: (
      <>
        <p>
          Bullet points are the most important part of your resume. Use the <strong className="text-text">XYZ formula</strong>:
          <span className="text-indigo-light"> "Accomplished [X] as measured by [Y], by doing [Z]."</span>
        </p>
        <p className="font-semibold text-text">Transformations:</p>
        <div className="space-y-3">
          <BulletTemplate
            before="Worked on the backend API for the payments service."
            after="Reduced payment API latency by 40% (P99: 800ms → 480ms) by introducing Redis caching for idempotency keys, serving 2M+ transactions/day."
          />
          <BulletTemplate
            before="Fixed bugs and improved the frontend."
            after="Improved LCP score from 4.2s to 1.8s by lazy-loading non-critical components and optimizing image delivery, increasing mobile conversion rate by 12%."
          />
          <BulletTemplate
            before="Led a team of 4 engineers."
            after="Led a 4-engineer squad to deliver a real-time notification system (WebSocket + Kafka) in 6 weeks, processing 500K events/day at launch."
          />
        </div>
        <Tip>
          Every bullet should answer: What did you build/fix? How big was the impact? How did you do it? If you can't add a metric, use scale: "across 50+ microservices", "for 200K daily active users".
        </Tip>
        <Warn>
          Avoid vague words: "helped", "assisted", "worked on", "involved in". Use active ownership verbs: Designed, Built, Reduced, Led, Shipped, Optimized, Migrated, Automated.
        </Warn>
      </>
    ),
  },
  {
    id: 'roles',
    title: 'Role-Specific Tips',
    icon: Target,
    content: (
      <>
        <div className="space-y-4">
          <div className="border border-border rounded-xl p-4">
            <p className="font-semibold text-text mb-2">Frontend Developer</p>
            <ul className="list-disc list-inside space-y-1 text-xs ml-1">
              <li>Highlight performance metrics: LCP, FID, CLS improvements, bundle size reduction.</li>
              <li>Mention specific frameworks: React/Next.js, Vue, Angular — with version awareness.</li>
              <li>Include accessibility work (WCAG 2.1) and cross-browser compatibility.</li>
              <li>Show design tool fluency: Figma, Storybook, design system contributions.</li>
            </ul>
          </div>
          <div className="border border-border rounded-xl p-4">
            <p className="font-semibold text-text mb-2">Backend Developer</p>
            <ul className="list-disc list-inside space-y-1 text-xs ml-1">
              <li>Show scale: RPS, daily active users, data volume, latency numbers.</li>
              <li>Mention specific databases with context: "PostgreSQL (100GB, 5K TPS)".</li>
              <li>Highlight distributed systems work: message queues (Kafka/RabbitMQ), caching (Redis).</li>
              <li>Include DevOps ownership: CI/CD pipelines, Docker, Kubernetes, monitoring (Datadog).</li>
            </ul>
          </div>
          <div className="border border-border rounded-xl p-4">
            <p className="font-semibold text-text mb-2">ML / AI Engineer</p>
            <ul className="list-disc list-inside space-y-1 text-xs ml-1">
              <li>Show model impact: accuracy improvements, A/B test results, production traffic served.</li>
              <li>Mention frameworks: PyTorch, TensorFlow, HuggingFace — with specific model types.</li>
              <li>Include data pipeline work: feature stores, data quality, ETL at scale.</li>
              <li>Show MLOps: model serving, monitoring, drift detection, retraining pipelines.</li>
            </ul>
          </div>
          <div className="border border-border rounded-xl p-4">
            <p className="font-semibold text-text mb-2">Full Stack Developer</p>
            <ul className="list-disc list-inside space-y-1 text-xs ml-1">
              <li>Prove full ownership: "Built end-to-end from DB schema to React UI."</li>
              <li>Show tech stack breadth without being shallow — pick 1-2 projects that used the full stack.</li>
              <li>Include deployment and infrastructure: Vercel, AWS, GCP with specific services used.</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'structure',
    title: 'Resume Structure & Order',
    icon: FileText,
    content: (
      <>
        <p>The order of sections signals priority. Put your strongest section first.</p>
        <div className="space-y-2">
          <div className="border border-border rounded-xl p-4">
            <p className="font-semibold text-text mb-2">Fresher / 0-2 years experience:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs ml-1">
              <li>Contact Info (name, email, GitHub, LinkedIn, portfolio)</li>
              <li><strong className="text-text">Projects</strong> (your strongest signal — put these first)</li>
              <li>Education (include GPA if ≥ 7.5/10 or ≥ 3.5/4.0)</li>
              <li>Work Experience / Internships</li>
              <li>Skills (languages, frameworks, tools)</li>
              <li>Achievements (hackathons, open source, competitive programming)</li>
            </ol>
          </div>
          <div className="border border-border rounded-xl p-4">
            <p className="font-semibold text-text mb-2">2+ years experience:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs ml-1">
              <li>Contact Info</li>
              <li><strong className="text-text">Work Experience</strong> (reverse chronological)</li>
              <li>Skills</li>
              <li>Projects (side projects, open source)</li>
              <li>Education</li>
            </ol>
          </div>
        </div>
        <Tip>
          Keep it to 1 page for less than 5 years of experience. 2 pages is acceptable for 5+ years. Never go to 3 pages.
        </Tip>
      </>
    ),
  },
  {
    id: 'projects',
    title: 'Showcasing Projects Effectively',
    icon: Rocket,
    content: (
      <>
        <p>
          For each project, the recruiter wants to know: What problem did it solve? What's the tech stack? How big/complex is it? Can they see the code?
        </p>
        <div className="bg-surface border border-border rounded-xl p-4 font-mono text-xs space-y-2">
          <p className="text-indigo-light font-semibold">InterviewDump — Interview Prep Platform</p>
          <p className="text-text-muted">Next.js 16, React 19, Supabase, TailwindCSS</p>
          <ul className="list-disc list-inside space-y-1 text-text-muted ml-1">
            <li>Built a free interview prep platform serving 500+ curated questions across 24 companies</li>
            <li>Implemented Google OAuth + onboarding flow with Supabase; user progress tracked per question</li>
            <li>Search across 600+ questions with Cmd+K command palette; sub-50ms client-side filtering</li>
          </ul>
          <p className="text-text-dim">github.com/yourname/interviewdump | interviewdump.dev</p>
        </div>
        <div className="space-y-2 mt-2">
          <p className="font-semibold text-text text-xs">Key elements per project:</p>
          <ul className="list-disc list-inside space-y-1 text-xs ml-1">
            <li><strong className="text-text">Name + short description</strong> — what it does in one line</li>
            <li><strong className="text-text">Tech stack</strong> — specific technologies used</li>
            <li><strong className="text-text">2-3 bullet points</strong> — specific features/decisions/metrics</li>
            <li><strong className="text-text">Links</strong> — GitHub (public) + live URL</li>
          </ul>
        </div>
        <Warn>
          Don't list "Todo App built with React" — every applicant has one. Pick projects that are unique, at scale, or solve real problems. A deployed app with real users is worth 10x more than a tutorial project.
        </Warn>
      </>
    ),
  },
  {
    id: 'skills',
    title: 'Skills Section Best Practices',
    icon: Wrench,
    content: (
      <>
        <p>The skills section is heavily screened by ATS but largely ignored by human interviewers — who will probe your claims in the interview.</p>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-text text-xs mb-2">Organize by category (not alphabetically):</p>
            <div className="bg-surface border border-border rounded-xl p-3 font-mono text-xs space-y-1 text-text-muted">
              <p><span className="text-text">Languages:</span> JavaScript, TypeScript, Python, Java</p>
              <p><span className="text-text">Frontend:</span> React, Next.js, TailwindCSS, Redux</p>
              <p><span className="text-text">Backend:</span> Node.js, Express, FastAPI, REST APIs</p>
              <p><span className="text-text">Databases:</span> PostgreSQL, MongoDB, Redis</p>
              <p><span className="text-text">Cloud/DevOps:</span> AWS (EC2, S3, Lambda), Docker, GitHub Actions</p>
            </div>
          </div>
          <Tip>Only list skills you can speak to in an interview. If you can't explain the difference between a B-Tree and a Hash index, don't list "PostgreSQL optimization" as a skill.</Tip>
          <Warn>Don't list "Microsoft Office" or basic tools like "Git" unless specifically required by the JD. Use the space for relevant technical skills.</Warn>
        </div>
      </>
    ),
  },
  {
    id: 'common-mistakes',
    title: 'Common Mistakes to Avoid',
    icon: XCircle,
    content: (
      <>
        <ul className="space-y-3">
          {[
            ['Objective statements', 'Recruiters don\'t care what you want — they care what you can do. Replace with a 2-line technical summary if needed.'],
            ['Photos and personal info', 'No photo, no DOB, no marital status. These invite bias and waste space.'],
            ['Responsibilities vs achievements', '"Responsible for maintaining the API" → "Reduced API error rate from 3.2% to 0.4%"'],
            ['Inconsistent formatting', 'Pick one date format (MM/YYYY or Month YYYY) and one bullet style and use it throughout.'],
            ['Unexplained gaps', 'A 6-month gap without explanation raises flags. One line: "Sabbatical: built personal projects and upskilled in system design."'],
            ['Buzzword overload', '"Synergized cross-functional teams to leverage bleeding-edge technologies" — meaningless. Be specific.'],
            ['GPA below cutoff without explanation', 'If GPA is below 7.0/10, omit it. Some companies have hard GPA filters.'],
          ].map(([mistake, detail]) => (
            <li key={mistake} className="border border-border rounded-xl p-3">
              <p className="font-semibold text-red text-xs mb-1">{mistake}</p>
              <p className="text-xs text-text-muted">{detail}</p>
            </li>
          ))}
        </ul>
      </>
    ),
  },
]

export default function ResumePage() {
  const [activeRole, setActiveRole] = useState('All')
  const roles = ['All', 'Frontend', 'Backend', 'Full Stack', 'ML / AI']

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <PageHeader
        title="Resume Guide"
        subtitle="Write a resume that gets past ATS bots and impresses human reviewers."
      />

      <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto w-full flex flex-col gap-4">
        {/* Quick stats bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
          {[
            ['6 sec', 'Average recruiter scan time'],
            ['75%', 'Resumes rejected by ATS'],
            ['1 page', 'Ideal length for 0-5 yrs'],
          ].map(([stat, label]) => (
            <div key={stat} className="bg-surface border border-border rounded-xl p-3 text-center">
              <div className="text-lg font-bold font-mono text-indigo-light">{stat}</div>
              <div className="text-[10px] text-text-dim mt-0.5 leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-3">
          {sections.map((section) => (
            <AccordionSection key={section.id} section={section} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="bg-indigo-dim border border-indigo/20 rounded-2xl p-5 text-center mt-2">
          <p className="text-sm font-semibold text-text mb-1">Ready to practice interview questions?</p>
          <p className="text-xs text-text-muted mb-3">Use InterviewDump to prep for the technical rounds after polishing your resume.</p>
          <a
            href="/library/interview-questions"
            className="inline-block bg-indigo hover:bg-indigo/90 text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-colors"
          >
            Start Practicing →
          </a>
        </div>
      </div>
    </div>
  )
}
