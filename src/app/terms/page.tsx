import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — SkiLesson.ai',
  description:
    'Terms of Service for SkiLesson.ai, the online ski and snowboard instruction platform.',
}

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-slate-500 text-sm mb-12">Last updated: March 2026</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-10">
          {/* 1. Agreement */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. Agreement to Terms
            </h2>
            <p className="text-slate-400 leading-relaxed">
              By accessing or using SkiLesson.ai (the &quot;Platform&quot;), operated by
              Dogwood Brands Company (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you
              agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do
              not agree to these Terms, you may not access or use the Platform.
              These Terms apply to all visitors, users, and subscribers.
            </p>
            <p className="text-slate-400 leading-relaxed mt-3">
              We reserve the right to update these Terms at any time. Material
              changes will be communicated via email or a prominent notice on the
              Platform. Your continued use after such changes constitutes
              acceptance of the revised Terms.
            </p>
          </section>

          {/* 2. Subscription Terms */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. Subscription Terms
            </h2>
            <p className="text-slate-400 leading-relaxed">
              SkiLesson.ai offers subscription-based access to ski and snowboard
              instructional content. By subscribing, you agree to the following:
            </p>
            <ul className="text-slate-400 leading-relaxed mt-3 space-y-2 list-disc list-inside">
              <li>
                Subscriptions are billed on a recurring monthly or annual basis
                depending on the plan selected.
              </li>
              <li>
                A 7-day free trial is available for new subscribers. You will not
                be charged during the trial period. If you do not cancel before
                the trial ends, your selected plan will begin and billing will
                commence automatically.
              </li>
              <li>
                Prices are listed in U.S. dollars and are subject to change with
                30 days&apos; notice.
              </li>
              <li>
                Family plans (Apex tier) allow up to 4 user profiles under a
                single subscription. Each profile is for personal, non-commercial
                use only.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials.
              </li>
            </ul>
          </section>

          {/* 3. Cancellation & Refunds */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. Cancellation &amp; Refunds
            </h2>
            <p className="text-slate-400 leading-relaxed">
              You may cancel your subscription at any time through your account
              settings. Upon cancellation:
            </p>
            <ul className="text-slate-400 leading-relaxed mt-3 space-y-2 list-disc list-inside">
              <li>
                You will retain access to your plan through the end of the
                current billing period.
              </li>
              <li>
                No partial refunds are provided for unused time within a billing
                cycle.
              </li>
              <li>
                We offer a 30-day money-back guarantee for first-time
                subscribers. If you are dissatisfied within the first 30 days of
                your paid subscription, contact us for a full refund.
              </li>
              <li>
                Refund requests after the 30-day period are handled on a
                case-by-case basis at our discretion.
              </li>
            </ul>
          </section>

          {/* 4. Content Ownership */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. Content Ownership &amp; Intellectual Property
            </h2>
            <p className="text-slate-400 leading-relaxed">
              All content on the Platform, including but not limited to video
              lessons, course materials, graphics, text, trademarks, logos, and
              software, is the property of Dogwood Brands Company or its
              licensors and is protected by applicable intellectual property
              laws.
            </p>
            <p className="text-slate-400 leading-relaxed mt-3">
              Your subscription grants you a limited, non-exclusive,
              non-transferable, revocable license to access and view the content
              for personal, non-commercial purposes. You may not reproduce,
              distribute, modify, create derivative works from, publicly display,
              or commercially exploit any content without prior written consent.
            </p>
          </section>

          {/* 5. User Conduct */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. User Conduct
            </h2>
            <p className="text-slate-400 leading-relaxed">
              You agree to use the Platform in a lawful and responsible manner.
              You may not:
            </p>
            <ul className="text-slate-400 leading-relaxed mt-3 space-y-2 list-disc list-inside">
              <li>
                Share, resell, or redistribute your account credentials or
                access.
              </li>
              <li>
                Record, download, or capture lesson content through any means
                not expressly provided by the Platform.
              </li>
              <li>
                Use the Platform for any illegal purpose or in violation of any
                applicable law or regulation.
              </li>
              <li>
                Interfere with or disrupt the Platform&apos;s servers, networks, or
                security features.
              </li>
              <li>
                Post or transmit harmful, abusive, or objectionable content
                through community features.
              </li>
              <li>
                Attempt to reverse engineer, decompile, or extract source code
                from the Platform.
              </li>
            </ul>
            <p className="text-slate-400 leading-relaxed mt-3">
              We reserve the right to suspend or terminate accounts that violate
              these rules, without refund.
            </p>
          </section>

          {/* 6. Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Limitation of Liability
            </h2>
            <p className="text-slate-400 leading-relaxed">
              SkiLesson.ai provides instructional content for educational
              purposes only. Skiing and snowboarding are inherently dangerous
              activities. The Platform is not a substitute for in-person
              instruction, and we make no guarantees about your on-mountain
              performance or safety.
            </p>
            <p className="text-slate-400 leading-relaxed mt-3">
              To the fullest extent permitted by law, Dogwood Brands Company,
              its affiliates, officers, directors, employees, and agents shall
              not be liable for any indirect, incidental, special, consequential,
              or punitive damages arising out of or related to your use of the
              Platform, including but not limited to personal injury, property
              damage, or data loss.
            </p>
            <p className="text-slate-400 leading-relaxed mt-3">
              Our total liability to you for any claims arising under these Terms
              shall not exceed the amount you have paid us in the twelve (12)
              months preceding the claim.
            </p>
          </section>

          {/* 7. Privacy */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Privacy
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Your use of the Platform is also governed by our{' '}
              <a
                href="/privacy"
                className="text-sky-400 hover:text-sky-300 underline transition-colors"
              >
                Privacy Policy
              </a>
              , which describes how we collect, use, and protect your personal
              information. By using the Platform, you consent to the practices
              described in the Privacy Policy.
            </p>
          </section>

          {/* 8. Governing Law */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              8. Governing Law
            </h2>
            <p className="text-slate-400 leading-relaxed">
              These Terms are governed by and construed in accordance with the
              laws of the State of Texas, without regard to its conflict of law
              principles. Any disputes arising from these Terms shall be resolved
              exclusively in the state or federal courts located in Harris
              County, Texas.
            </p>
          </section>

          {/* 9. Contact */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              9. Contact Us
            </h2>
            <p className="text-slate-400 leading-relaxed">
              If you have questions about these Terms, contact us at{' '}
              <a
                href="mailto:hello@skilesson.ai"
                className="text-sky-400 hover:text-sky-300 underline transition-colors"
              >
                hello@skilesson.ai
              </a>{' '}
              or visit our{' '}
              <a
                href="/contact"
                className="text-sky-400 hover:text-sky-300 underline transition-colors"
              >
                Contact page
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
