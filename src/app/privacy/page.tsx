import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — SkiLesson.ai',
  description:
    'Privacy Policy for SkiLesson.ai, the online ski and snowboard instruction platform.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.05)_0%,_transparent_60%)]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        <h1
          className="text-3xl sm:text-4xl font-bold text-white mb-2"
          style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}
        >
          Privacy Policy
        </h1>
        <p className="text-slate-500 text-sm mb-12">Last updated: March 2026</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-10">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. Introduction
            </h2>
            <p className="text-slate-400 leading-relaxed">
              SkiLesson.ai (&quot;Platform&quot;), operated by Dogwood Brands Company
              (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our Platform.
              Please read this policy carefully. If you do not agree with the
              terms of this policy, please do not access the Platform.
            </p>
          </section>

          {/* 2. Data Collection */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. Information We Collect
            </h2>
            <p className="text-slate-400 leading-relaxed mb-3">
              We collect information in several ways:
            </p>

            <h3 className="text-lg font-medium text-slate-200 mt-4 mb-2">
              Information You Provide
            </h3>
            <ul className="text-slate-400 leading-relaxed space-y-2 list-disc list-inside">
              <li>
                Account registration data: name, email address, password, skill
                level, sport preference.
              </li>
              <li>
                Child account data: child&apos;s name and age (when a parent or
                guardian registers a minor).
              </li>
              <li>
                Payment information: processed securely through Stripe. We do
                not store credit card numbers on our servers.
              </li>
              <li>
                Communications: messages sent via our contact form, support
                emails, or community features.
              </li>
            </ul>

            <h3 className="text-lg font-medium text-slate-200 mt-4 mb-2">
              Information Collected Automatically
            </h3>
            <ul className="text-slate-400 leading-relaxed space-y-2 list-disc list-inside">
              <li>
                Usage data: lessons viewed, progress metrics, completion rates,
                time spent on the Platform.
              </li>
              <li>
                Device and browser information: IP address, browser type,
                operating system, device identifiers.
              </li>
              <li>
                Log data: access times, pages viewed, referring URLs, and other
                diagnostic data.
              </li>
            </ul>
          </section>

          {/* 3. How We Use Your Information */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. How We Use Your Information
            </h2>
            <p className="text-slate-400 leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="text-slate-400 leading-relaxed space-y-2 list-disc list-inside">
              <li>Provide, maintain, and improve the Platform and its features.</li>
              <li>
                Personalize your learning experience, including AI Coach
                responses and lesson recommendations.
              </li>
              <li>Process transactions and manage your subscription.</li>
              <li>
                Send transactional emails (account confirmations, billing
                receipts, subscription updates).
              </li>
              <li>
                Send promotional communications (with your consent; you may
                opt out at any time).
              </li>
              <li>
                Monitor and analyze usage trends to improve our content and
                services.
              </li>
              <li>Detect, prevent, and address technical issues and fraud.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          {/* 4. Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. Cookies &amp; Tracking Technologies
            </h2>
            <p className="text-slate-400 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your
              experience on the Platform. These include:
            </p>
            <ul className="text-slate-400 leading-relaxed mt-3 space-y-2 list-disc list-inside">
              <li>
                <strong className="text-slate-300">Essential cookies:</strong>{' '}
                Required for the Platform to function (authentication, session
                management).
              </li>
              <li>
                <strong className="text-slate-300">Analytics cookies:</strong>{' '}
                Help us understand how visitors interact with the Platform
                (e.g., Google Analytics).
              </li>
              <li>
                <strong className="text-slate-300">Preference cookies:</strong>{' '}
                Remember your settings such as language, skill level, and
                display preferences.
              </li>
            </ul>
            <p className="text-slate-400 leading-relaxed mt-3">
              You can control cookies through your browser settings. Disabling
              certain cookies may limit your ability to use some features of the
              Platform.
            </p>
          </section>

          {/* 5. Third-Party Services */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. Third-Party Services
            </h2>
            <p className="text-slate-400 leading-relaxed">
              We may share information with trusted third-party service providers
              who assist in operating the Platform:
            </p>
            <ul className="text-slate-400 leading-relaxed mt-3 space-y-2 list-disc list-inside">
              <li>
                <strong className="text-slate-300">Stripe:</strong> Payment
                processing. Subject to{' '}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 underline transition-colors"
                >
                  Stripe&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong className="text-slate-300">Anthropic (Claude):</strong>{' '}
                AI coaching features. Conversation data is processed per
                Anthropic&apos;s usage policies. We do not use your data to train
                third-party AI models.
              </li>
              <li>
                <strong className="text-slate-300">Google (OAuth):</strong>{' '}
                Optional social sign-in. We receive only your email and name
                from Google.
              </li>
              <li>
                <strong className="text-slate-300">Analytics providers:</strong>{' '}
                Aggregated, anonymized usage data for product improvement.
              </li>
            </ul>
            <p className="text-slate-400 leading-relaxed mt-3">
              We do not sell your personal information to third parties.
            </p>
          </section>

          {/* 6. Children's Privacy (COPPA) */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Children&apos;s Privacy (COPPA Compliance)
            </h2>
            <p className="text-slate-400 leading-relaxed">
              SkiLesson.ai is designed for families, including children under 13.
              We comply with the Children&apos;s Online Privacy Protection Act
              (COPPA):
            </p>
            <ul className="text-slate-400 leading-relaxed mt-3 space-y-2 list-disc list-inside">
              <li>
                Child accounts can only be created by a parent or legal guardian
                through the family plan.
              </li>
              <li>
                We collect only the minimum information necessary for child
                accounts: the child&apos;s first name and age, for the purpose of
                age-appropriate content delivery.
              </li>
              <li>
                We do not serve targeted advertising to children.
              </li>
              <li>
                Parents can review, update, or delete their child&apos;s information
                at any time through their account settings or by contacting us.
              </li>
              <li>
                AI Coach interactions for child accounts are filtered for
                age-appropriate content and do not collect personal identifiers
                beyond the session context.
              </li>
            </ul>
          </section>

          {/* 7. User Rights */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Your Rights
            </h2>
            <p className="text-slate-400 leading-relaxed mb-3">
              Depending on your jurisdiction, you may have the following rights
              regarding your personal data:
            </p>
            <ul className="text-slate-400 leading-relaxed space-y-2 list-disc list-inside">
              <li>
                <strong className="text-slate-300">Access:</strong> Request a
                copy of the personal data we hold about you.
              </li>
              <li>
                <strong className="text-slate-300">Correction:</strong> Request
                correction of inaccurate or incomplete data.
              </li>
              <li>
                <strong className="text-slate-300">Deletion:</strong> Request
                deletion of your personal data, subject to legal retention
                requirements.
              </li>
              <li>
                <strong className="text-slate-300">Portability:</strong> Request
                your data in a structured, machine-readable format.
              </li>
              <li>
                <strong className="text-slate-300">Opt-out:</strong> Unsubscribe
                from marketing communications at any time via the link in any
                email or through account settings.
              </li>
            </ul>
            <p className="text-slate-400 leading-relaxed mt-3">
              To exercise any of these rights, contact us at{' '}
              <a
                href="mailto:hello@skilesson.ai"
                className="text-sky-400 hover:text-sky-300 underline transition-colors"
              >
                hello@skilesson.ai
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          {/* 8. Data Security */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              8. Data Security
            </h2>
            <p className="text-slate-400 leading-relaxed">
              We implement industry-standard security measures to protect your
              information, including encryption in transit (TLS/SSL), encrypted
              storage for sensitive data, and regular security audits. However,
              no method of electronic transmission or storage is 100% secure.
              While we strive to protect your personal information, we cannot
              guarantee its absolute security.
            </p>
          </section>

          {/* 9. Data Retention */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              9. Data Retention
            </h2>
            <p className="text-slate-400 leading-relaxed">
              We retain your personal information for as long as your account is
              active or as needed to provide you with services. If you delete
              your account, we will delete or anonymize your personal data within
              90 days, except where retention is required by law (e.g., billing
              records, tax compliance). AI Coach conversation histories are
              retained for 12 months after the last interaction, then
              automatically purged.
            </p>
          </section>

          {/* 10. Contact */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              10. Contact Us
            </h2>
            <p className="text-slate-400 leading-relaxed">
              If you have questions or concerns about this Privacy Policy or our
              data practices, contact us at:
            </p>
            <div className="mt-4 text-slate-400 leading-relaxed">
              <p>
                <strong className="text-slate-300">Email:</strong>{' '}
                <a
                  href="mailto:hello@skilesson.ai"
                  className="text-sky-400 hover:text-sky-300 underline transition-colors"
                >
                  hello@skilesson.ai
                </a>
              </p>
              <p className="mt-1">
                <strong className="text-slate-300">Mail:</strong> Dogwood Brands
                Company, Houston, TX
              </p>
              <p className="mt-1">
                You may also visit our{' '}
                <a
                  href="/contact"
                  className="text-sky-400 hover:text-sky-300 underline transition-colors"
                >
                  Contact page
                </a>{' '}
                to reach us directly.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
