import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'

export const metadata = {
  title: 'Privacy Policy — InterviewDump',
  description: 'Privacy Policy for InterviewDump.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Nav */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-0.5 select-none">
          <Logo size="sm" />
        </Link>
        <Link href="/terms" className="text-xs text-text-muted hover:text-text transition-colors">
          Terms of Service →
        </Link>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-text mb-2">Privacy Policy</h1>
        <p className="text-sm text-text-dim mb-10">Last updated: June 2025</p>

        <div className="flex flex-col gap-8 text-sm text-text-muted leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-text mb-2">1. Overview</h2>
            <p>
              InterviewDump ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information. We collect only what is necessary to provide the Service and never sell your data.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">2. Information We Collect</h2>

            <h3 className="text-sm font-semibold text-text mt-4 mb-1">2a. Information you provide</h3>
            <p className="mb-3">When you sign up and complete onboarding, we collect:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1 mb-3">
              <li><strong className="text-text">Name</strong> — your display name</li>
              <li><strong className="text-text">Email address</strong> — from your OAuth provider (Google or GitHub)</li>
              <li><strong className="text-text">Target role(s)</strong> — e.g. Frontend Developer, Backend Developer</li>
              <li><strong className="text-text">Prep goal</strong> — e.g. Job Interview, College Placements</li>
              <li><strong className="text-text">Referral source</strong> — how you heard about us (optional)</li>
            </ul>

            <h3 className="text-sm font-semibold text-text mt-4 mb-1">2b. Usage data we store</h3>
            <ul className="list-disc pl-5 flex flex-col gap-1 mb-3">
              <li><strong className="text-text">Question progress</strong> — which questions you mark as solved or saved for revision</li>
              <li><strong className="text-text">Study plan progress</strong> — which steps you complete in a study plan</li>
            </ul>

            <h3 className="text-sm font-semibold text-text mt-4 mb-1">2c. Data stored locally in your browser</h3>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong className="text-text">Preferences</strong> — experience level, daily goal, target company type (localStorage)</li>
              <li><strong className="text-text">Notes</strong> — any notes you write on questions are stored in localStorage and never sent to our servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">3. How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Create and maintain your account</li>
              <li>Personalize your question feed and recommendations based on your role and goal</li>
              <li>Track and display your progress across question categories</li>
              <li>Improve the platform based on aggregate, anonymized usage patterns</li>
            </ul>
            <p className="mt-3">
              We do <strong className="text-text">not</strong> use your data for advertising, profiling, or any commercial purpose beyond operating the Service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">4. Authentication & Third-Party Providers</h2>
            <p className="mb-2">
              We use <strong className="text-text">Supabase</strong> to handle authentication via Google and GitHub OAuth. When you sign in, we receive your name and email from the OAuth provider. We do not receive or store your OAuth passwords.
            </p>
            <p>
              Authentication data is handled by Supabase. You can review Supabase's privacy practices at{' '}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-light hover:underline"
              >
                supabase.com/privacy
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">5. Data Storage & Security</h2>
            <p className="mb-2">
              Your data is stored in a Supabase (PostgreSQL) database hosted on secure cloud infrastructure. We use Row Level Security (RLS) policies so that each user can only access their own data. Data is transmitted over HTTPS at all times.
            </p>
            <p>
              While we take reasonable precautions to protect your information, no internet transmission or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">6. Data Sharing</h2>
            <p>
              We do <strong className="text-text">not</strong> sell, trade, or share your personal information with third parties for marketing purposes. Your data may be processed by our infrastructure providers (Supabase, Vercel) solely to operate the Service, under their respective data processing agreements.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">7. Cookies</h2>
            <p>
              We use session cookies set by Supabase to keep you signed in. These are essential for authentication and cannot be disabled without affecting sign-in functionality. We do not use any tracking, analytics, or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">8. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong className="text-text">Access</strong> — view the profile data we hold about you (visible in Settings)</li>
              <li><strong className="text-text">Update</strong> — edit your name, role, and goal at any time in Settings</li>
              <li><strong className="text-text">Reset progress</strong> — clear all your question progress from the Settings panel</li>
              <li><strong className="text-text">Delete your account</strong> — contact us to permanently delete your account and all associated data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">9. Children's Privacy</h2>
            <p>
              The Service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be reflected by updating the "Last updated" date at the top. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">11. Contact</h2>
            <p>
              For any privacy-related questions or data deletion requests, reach us via{' '}
              <a
                href="https://x.com/RithvikShetty04"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-light hover:underline"
              >
                Twitter/X
              </a>{' '}
              or open an issue on our{' '}
              <a
                href="https://github.com/rithvikshettyy/interviewdump"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-light hover:underline"
              >
                GitHub repository
              </a>.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-dim">
          <span>&copy; 2025 InterviewDump. Free forever.</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-text transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-text transition-colors font-medium text-text-muted">Privacy</Link>
            <Link href="/" className="hover:text-text transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
