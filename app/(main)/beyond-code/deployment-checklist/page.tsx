'use client'

import { useState, useMemo } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import {
  Lock,
  BarChart2,
  Database,
  Zap,
  Cloud,
  Paintbrush,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  CheckCircle2,
} from 'lucide-react'

interface ChecklistItem {
  id: string
  title: string
  description: string
  howToCheck?: string
}

interface Category {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  items: ChecklistItem[]
}

const CATEGORIES: Category[] = [
  {
    id: 'security',
    label: 'Security',
    icon: Lock,
    items: [
      {
        id: 's-1',
        title: 'HTTPS / SSL certificate configured',
        description: 'All traffic is served over HTTPS. HTTP requests redirect to HTTPS automatically.',
        howToCheck: 'Visit your domain in a browser — look for the padlock icon. Run `curl -I http://yourdomain.com` and verify it returns a 301 redirect.',
      },
      {
        id: 's-2',
        title: 'Environment variables not hardcoded in code',
        description: 'API keys, secrets, and database URLs live in environment variables, never in source files committed to git.',
        howToCheck: 'Search your repo: `grep -r "sk_live\\|AKIA\\|password=" --include="*.ts" --include="*.js" .`',
      },
      {
        id: 's-3',
        title: '.env files in .gitignore',
        description: '.env, .env.local, .env.production and similar files are excluded from version control.',
        howToCheck: 'Run `git check-ignore -v .env.local` — it should print a match. Also run `git ls-files | grep ".env"` — should return nothing.',
      },
      {
        id: 's-4',
        title: 'CORS configured to specific origins',
        description: 'Cross-Origin Resource Sharing is restricted to known frontend domains. Wildcard `*` is never used in production.',
        howToCheck: 'Curl your API from an unlisted origin and confirm it returns a 403 or missing CORS headers.',
      },
      {
        id: 's-5',
        title: 'Rate limiting on API routes',
        description: 'Endpoints that accept user input or trigger expensive operations are rate-limited per IP or user.',
        howToCheck: 'Send 100+ rapid requests to a login endpoint and verify it starts returning 429 responses.',
      },
      {
        id: 's-6',
        title: 'Input validation & sanitization',
        description: 'All user-supplied data is validated on the server side before use, regardless of client-side checks.',
        howToCheck: 'Send a POST request with malformed or oversized payloads via Postman and verify the server rejects them with 400.',
      },
      {
        id: 's-7',
        title: 'SQL injection prevention (parameterized queries)',
        description: 'Database queries use parameterized statements or an ORM — never string-concatenated user input.',
        howToCheck: 'Search for raw `.query(` or template literal SQL strings with user variables.',
      },
      {
        id: 's-8',
        title: 'XSS prevention',
        description: 'Any user-generated content rendered as HTML is escaped or sanitized with a library like DOMPurify.',
        howToCheck: 'Try submitting `<script>alert(1)</script>` as a text input and verify it renders as escaped text, not executed JS.',
      },
      {
        id: 's-9',
        title: 'Dependency audit passed',
        description: 'No known critical or high-severity vulnerabilities in npm dependencies.',
        howToCheck: 'Run `npm audit` and resolve any critical issues. Consider `npm audit fix`.',
      },
      {
        id: 's-10',
        title: 'No sensitive data in client-side code',
        description: 'Private API keys, admin tokens, and internal URLs are never bundled into the frontend JavaScript.',
        howToCheck: 'Open DevTools → Sources and search the bundle for known secret patterns.',
      },
      {
        id: 's-11',
        title: 'Auth tokens stored securely',
        description: 'JWTs and session tokens are stored in httpOnly cookies, not localStorage — which is accessible to JavaScript and vulnerable to XSS.',
        howToCheck: 'After logging in, check DevTools → Application → Local Storage. No tokens should appear there.',
      },
      {
        id: 's-12',
        title: 'CSP headers configured',
        description: 'Content Security Policy headers restrict which scripts, styles, and resources the browser can load.',
        howToCheck: 'Use `curl -I https://yourdomain.com` and look for the `Content-Security-Policy` header. Also try securityheaders.com.',
      },
    ],
  },
  {
    id: 'logging',
    label: 'Logging & Monitoring',
    icon: BarChart2,
    items: [
      {
        id: 'l-1',
        title: 'Error logging set up (Sentry / LogRocket)',
        description: 'Unhandled exceptions and API errors are captured and sent to a logging service with stack traces and context.',
        howToCheck: 'Trigger a deliberate error in production and confirm it appears in your logging dashboard within seconds.',
      },
      {
        id: 'l-2',
        title: 'Server logs accessible',
        description: 'You can access server-side logs from your hosting platform (Vercel, Railway, Render, etc.) to debug production issues.',
        howToCheck: 'Log into your hosting dashboard and confirm logs are streaming from recent deployments.',
      },
      {
        id: 'l-3',
        title: 'Uptime monitoring configured',
        description: 'A tool like UptimeRobot, Freshping, or Checkly pings your app every few minutes and alerts you if it goes down.',
        howToCheck: 'Temporarily take your staging site down and confirm you receive an alert within 5 minutes.',
      },
      {
        id: 'l-4',
        title: 'Performance monitoring enabled',
        description: 'Real-user metrics (Vercel Analytics, Datadog RUM, or Google Analytics) are tracking page loads and Core Web Vitals in production.',
        howToCheck: 'Open your analytics dashboard and verify data is flowing from real visits.',
      },
      {
        id: 'l-5',
        title: 'Health check endpoint exists',
        description: 'A `/api/health` or `/healthz` endpoint returns 200 OK so load balancers and monitors can verify the app is alive.',
        howToCheck: 'Curl `https://yourdomain.com/api/health` and confirm it returns `{"status":"ok"}` with 200.',
      },
      {
        id: 'l-6',
        title: 'Alerting on critical errors',
        description: 'You receive a Slack message, email, or PagerDuty alert when error rates spike or critical exceptions occur.',
        howToCheck: 'Check your logging tool\'s alerting/notification settings are active and pointed at a live channel.',
      },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    icon: Database,
    items: [
      {
        id: 'd-1',
        title: 'Database backups scheduled',
        description: 'Automated backups run daily (or more frequently) and you have verified that restoring from a backup works.',
        howToCheck: 'Check your database hosting panel (Supabase, PlanetScale, RDS) for backup schedule and last successful backup time.',
      },
      {
        id: 'd-2',
        title: 'Migrations tested on staging first',
        description: 'All schema migrations are run against a staging database before being applied to production.',
        howToCheck: 'Confirm your deployment pipeline runs migrations on staging and requires a manual approval before production.',
      },
      {
        id: 'd-3',
        title: 'Connection pooling configured',
        description: 'Your app uses a connection pooler (PgBouncer, Supabase pooler) to avoid exhausting database connections under load.',
        howToCheck: 'Check your database connection string — pooled connections typically use port 6543 in Supabase vs 5432 for direct.',
      },
      {
        id: 'd-4',
        title: 'Indices on frequently queried columns',
        description: 'Columns used in WHERE clauses, JOINs, and ORDER BY are indexed so queries stay fast as data grows.',
        howToCheck: 'Use `EXPLAIN ANALYZE` on your slowest queries and check for sequential scans on large tables.',
      },
      {
        id: 'd-5',
        title: 'No raw queries with user input',
        description: 'User-supplied values are never interpolated directly into SQL strings.',
        howToCheck: 'Grep for `template literal SQL` patterns: `db.query(\`SELECT * FROM users WHERE id = ${userId}\`)`.',
      },
      {
        id: 'd-6',
        title: 'Read replicas for heavy read workloads',
        description: 'If your app is read-heavy, a read replica offloads SELECT queries so the primary handles writes only.',
        howToCheck: 'Check if your queries are balanced — if 90%+ are SELECTs on a high-traffic app, consider a replica.',
      },
    ],
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: Zap,
    items: [
      {
        id: 'p-1',
        title: 'Images optimized (WebP, lazy loading)',
        description: 'Images are served in modern formats (WebP/AVIF) and load lazily so they don\'t block initial page render.',
        howToCheck: 'Open DevTools → Network → filter by "Img". Verify large images are WebP and have `loading="lazy"` attributes.',
      },
      {
        id: 'p-2',
        title: 'Static assets cached via CDN',
        description: 'JS, CSS, fonts, and images are served through a CDN with long cache-control headers.',
        howToCheck: 'Run `curl -I https://yourdomain.com/some-static.js` and check for `Cache-Control: max-age=...` and `CF-Cache-Status: HIT`.',
      },
      {
        id: 'p-3',
        title: 'Gzip / Brotli compression enabled',
        description: 'Text responses (HTML, JS, CSS, JSON) are compressed before being sent to the browser.',
        howToCheck: 'Run `curl -H "Accept-Encoding: br,gzip" -I https://yourdomain.com` and check for `Content-Encoding: br` or `gzip`.',
      },
      {
        id: 'p-4',
        title: 'Bundle size checked',
        description: 'The JavaScript bundle doesn\'t include unused large dependencies. Run a bundle analyzer to identify bloat.',
        howToCheck: 'Run `npx next build && npx @next/bundle-analyzer` (or `npx vite-bundle-visualizer`) and review the output.',
      },
      {
        id: 'p-5',
        title: 'Core Web Vitals passing',
        description: 'LCP (Largest Contentful Paint) < 2.5s, INP < 200ms, CLS < 0.1 in real-user data.',
        howToCheck: 'Run `npx lighthouse https://yourdomain.com --view` or check Google Search Console → Core Web Vitals report.',
      },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: Cloud,
    items: [
      {
        id: 'i-1',
        title: 'Auto-scaling configured (or limits understood)',
        description: 'Your hosting scales automatically under load, or you know exactly what your current limits are and have a plan for traffic spikes.',
        howToCheck: 'Review your hosting plan\'s concurrency and instance limits. Set up a load test with k6 or Artillery.',
      },
      {
        id: 'i-2',
        title: 'Staging environment matches production',
        description: 'Staging uses the same tech stack, environment variable structure, and deploy method as production.',
        howToCheck: 'Deploy the same Docker image or build to both environments. Confirm env var keys (not values) match.',
      },
      {
        id: 'i-3',
        title: 'Rollback plan exists',
        description: 'You can revert to the previous deployment in under 5 minutes if something breaks.',
        howToCheck: 'Verify your CI/CD dashboard has a one-click "Redeploy previous build" option, or that you can `git revert` and redeploy.',
      },
      {
        id: 'i-4',
        title: 'Domain & DNS configured correctly',
        description: 'Your custom domain resolves correctly, www redirects to apex (or vice versa), and DNS TTLs are set sensibly.',
        howToCheck: 'Use `dig yourdomain.com` and `dig www.yourdomain.com` to verify A/CNAME records point to the right IPs.',
      },
      {
        id: 'i-5',
        title: 'Firewall / security groups restrict access',
        description: 'Database and internal services are not publicly accessible — only your app servers can reach them.',
        howToCheck: 'Try connecting to your database host directly from your local machine. It should time out or be refused.',
      },
      {
        id: 'i-6',
        title: 'CI/CD pipeline runs tests before deploy',
        description: 'Automated tests (unit, integration, lint) must pass before any code reaches production.',
        howToCheck: 'Intentionally break a test and push — confirm the deployment is blocked.',
      },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    icon: Paintbrush,
    items: [
      {
        id: 'f-1',
        title: 'Meta tags set (title, description, og:image)',
        description: 'Every page has a unique `<title>`, `<meta name="description">`, and Open Graph tags for social sharing previews.',
        howToCheck: 'Use `curl https://yourdomain.com | grep "<meta"` or paste your URL into https://metatags.io.',
      },
      {
        id: 'f-2',
        title: 'robots.txt and sitemap.xml present',
        description: 'Search engines know which pages to crawl (sitemap.xml) and which to skip (robots.txt).',
        howToCheck: 'Visit `https://yourdomain.com/robots.txt` and `https://yourdomain.com/sitemap.xml` directly.',
      },
      {
        id: 'f-3',
        title: '404 and error pages exist',
        description: 'Custom 404 and 500 error pages match your app\'s design and guide users back to valid content.',
        howToCheck: 'Visit `https://yourdomain.com/this-does-not-exist` and verify a branded 404 page appears.',
      },
      {
        id: 'f-4',
        title: 'Forms have proper validation',
        description: 'All user-facing forms validate input client-side for UX and server-side for security.',
        howToCheck: 'Submit each form empty and with invalid data. Confirm errors are shown clearly and the server also rejects bad data.',
      },
      {
        id: 'f-5',
        title: 'Accessibility basics covered',
        description: 'Images have alt text, buttons have labels, semantic HTML is used, and the page is keyboard-navigable.',
        howToCheck: 'Run `npx axe https://yourdomain.com` or use the Lighthouse Accessibility audit in DevTools.',
      },
    ],
  },
]

const ALL_IDS = CATEGORIES.flatMap((c) => c.items.map((i) => i.id))

export default function DeploymentChecklistPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set(CATEGORIES.map((c) => c.id))
  )
  const [showExport, setShowExport] = useState(false)

  const total = ALL_IDS.length
  const checkedCount = checked.size
  const percent = Math.round((checkedCount / total) * 100)

  const uncheckedItems = useMemo(() =>
    CATEGORIES.flatMap((cat) =>
      cat.items
        .filter((item) => !checked.has(item.id))
        .map((item) => ({ ...item, category: cat.label }))
    ), [checked])

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleCategory(id: string) {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function checkAll() {
    setChecked(new Set(ALL_IDS))
  }

  function uncheckAll() {
    setChecked(new Set())
  }

  const barColor =
    percent === 100
      ? 'bg-green'
      : percent >= 60
      ? 'bg-indigo'
      : 'bg-amber'

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <PageHeader
        title="Deployment Checklist"
        subtitle="Everything to verify before going live with a fullstack SaaS app."
      />
      <div className="px-4 sm:px-6 md:px-8 py-6 max-w-3xl w-full">

      {/* Progress */}
      <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-text">
            {checkedCount} / {total} items complete
          </span>
          <span className={`text-sm font-mono font-bold ${percent === 100 ? 'text-green' : 'text-indigo'}`}>
            {percent}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-bg rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        {percent === 100 && (
          <p className="text-xs text-green mt-2 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            All items checked — you&apos;re ready to ship!
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={checkAll}
          className="text-xs font-mono px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover text-text-muted hover:text-text transition-colors cursor-pointer"
        >
          Check all
        </button>
        <button
          type="button"
          onClick={uncheckAll}
          className="text-xs font-mono px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover text-text-muted hover:text-text transition-colors cursor-pointer"
        >
          Uncheck all
        </button>
        <button
          type="button"
          onClick={() => setShowExport((v) => !v)}
          className="text-xs font-mono px-3 py-1.5 rounded-lg border border-indigo/40 bg-indigo-dim hover:bg-indigo/20 text-indigo-light transition-colors cursor-pointer flex items-center gap-1.5 ml-auto"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          {showExport ? 'Hide' : 'Show'} remaining ({uncheckedItems.length})
        </button>
      </div>

      {/* Export panel */}
      {showExport && uncheckedItems.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
          <p className="text-xs font-mono text-text-dim uppercase tracking-widest mb-3">
            Unchecked items ({uncheckedItems.length})
          </p>
          <ul className="space-y-1">
            {uncheckedItems.map((item) => (
              <li key={item.id} className="flex items-start gap-2 text-sm text-text-muted">
                <span className="text-text-dim mt-0.5">•</span>
                <span>
                  <span className="text-text-dim text-xs font-mono">[{item.category}]</span>{' '}
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showExport && uncheckedItems.length === 0 && (
        <div className="bg-green-dim border border-green/30 rounded-2xl p-4 mb-6 text-sm text-green font-medium">
          All items are checked!
        </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isOpen = openCategories.has(cat.id)
          const catChecked = cat.items.filter((i) => checked.has(i.id)).length
          const catTotal = cat.items.length
          const allCatDone = catChecked === catTotal

          return (
            <div key={cat.id} className="bg-surface border border-border rounded-2xl overflow-hidden">
              {/* Category header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-hover transition-colors cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${allCatDone ? 'bg-green-dim' : 'bg-indigo-dim'}`}>
                    <Icon className={`w-4 h-4 ${allCatDone ? 'text-green' : 'text-indigo'}`} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-text">
                      {cat.label}
                    </div>
                    <div className="text-xs text-text-dim font-mono">
                      {catChecked}/{catTotal} complete
                    </div>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-text-dim flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-dim flex-shrink-0" />
                )}
              </button>

              {/* Items */}
              {isOpen && (
                <div className="border-t border-border divide-y divide-border">
                  {cat.items.map((item) => {
                    const isChecked = checked.has(item.id)
                    return (
                      <label
                        key={item.id}
                        className={`flex gap-4 px-5 py-4 cursor-pointer transition-colors ${isChecked ? 'bg-green-dim/30' : 'hover:bg-surface-hover'}`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggle(item.id)}
                            className="w-4 h-4 accent-indigo cursor-pointer rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold mb-0.5 ${isChecked ? 'line-through text-text-dim' : 'text-text'}`}>
                            {item.title}
                          </p>
                          <p className={`text-xs leading-relaxed ${isChecked ? 'text-text-dim' : 'text-text-muted'}`}>
                            {item.description}
                          </p>
                          {item.howToCheck && !isChecked && (
                            <p className="text-xs text-text-dim mt-2 font-mono bg-bg rounded-lg px-3 py-2 border border-border">
                              <span className="text-indigo-light font-semibold">How to check: </span>
                              {item.howToCheck}
                            </p>
                          )}
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
      </div>
    </div>
  )
}
