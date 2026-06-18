import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'

export const metadata = {
  title: 'Terms of Service',
  description: 'Read the Terms of Service for InterviewDump — the free tech interview prep platform.',
  alternates: { canonical: 'https://interviewdump.dev/terms' },
  openGraph: {
    title: 'Terms of Service | InterviewDump',
    description: 'Read the Terms of Service for InterviewDump — the free tech interview prep platform.',
    url: 'https://interviewdump.dev/terms',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Nav */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-0.5 select-none">
          <Logo size="sm" />
        </Link>
        <Link href="/privacy" className="text-xs text-text-muted hover:text-text transition-colors">
          Privacy Policy →
        </Link>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-text mb-2">Terms of Service</h1>
        <p className="text-sm text-text-dim mb-10">Last updated: June 2025</p>

        <div className="flex flex-col gap-8 text-sm text-text-muted leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-text mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using InterviewDump ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service. These terms apply to all visitors, users, and others who access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">2. Description of Service</h2>
            <p>
              InterviewDump is a free, open-source interview preparation platform that provides curated technical questions, study resources, progress tracking, and learning tools for software engineering interviews. The Service is provided at no cost and is intended for personal, non-commercial educational use.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">3. User Accounts</h2>
            <p className="mb-2">
              To access certain features, you must sign in using a third-party OAuth provider (Google or GitHub). By doing so, you authorize us to collect basic profile information (name and email address) from that provider.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your account. You agree to notify us immediately of any unauthorized use. We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">4. Acceptable Use</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Use the Service for any unlawful purpose or in violation of any regulations</li>
              <li>Attempt to gain unauthorized access to any part of the Service or its infrastructure</li>
              <li>Scrape, crawl, or systematically extract content from the Service</li>
              <li>Reproduce or redistribute the Service's content for commercial purposes without permission</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">5. Intellectual Property</h2>
            <p>
              The question content, explanations, and original materials on InterviewDump are the property of InterviewDump and its contributors. The source code of the platform is open source and available under its respective license on GitHub. You may not copy or redistribute the question content for commercial use without explicit written permission.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">6. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or that the content is accurate, complete, or up to date. Use of the Service is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, InterviewDump and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Service — including but not limited to loss of data or missed job opportunities.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">8. Third-Party Services</h2>
            <p>
              The Service uses third-party providers including Supabase (database and authentication) and Vercel (hosting). Your use of these services is also subject to their respective terms and privacy policies. We are not responsible for the practices of any third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">9. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be reflected by updating the "Last updated" date above. Continued use of the Service after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time, for any reason, without notice. You may also delete your account at any time through the Settings panel.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text mb-2">11. Contact</h2>
            <p>
              If you have any questions about these Terms, you can reach us via{' '}
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
            <Link href="/terms" className="hover:text-text transition-colors font-medium text-text-muted">Terms</Link>
            <Link href="/privacy" className="hover:text-text transition-colors">Privacy</Link>
            <Link href="/" className="hover:text-text transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
