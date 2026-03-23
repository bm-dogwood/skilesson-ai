'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Users,
  HelpCircle,
  Send,
} from 'lucide-react'

const subjects = [
  { value: '', label: 'Select a subject' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'billing', label: 'Billing & Subscriptions' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'partnership', label: 'Partnership Opportunity' },
  { value: 'press', label: 'Press & Media' },
]

export default function ContactPage() {
  const [selectedSubject, setSelectedSubject] = useState('')

  return (
    <div className="min-h-screen bg-[#0f172a] overflow-hidden">
      {/* Background texture */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.08)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(125,211,252,0.05)_0%,_transparent_50%)]" />
      </div>

      <div className="relative">
        {/* Hero */}
        <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}
            >
              <span className="text-white">Get in </span>
              <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
                Touch
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              Have a question, feedback, or partnership idea? We&apos;d love to
              hear from you.
            </motion.p>
          </div>
        </section>

        {/* Two-column layout */}
        <section className="pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Form — left side */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="relative rounded-2xl p-px">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-slate-700/60 via-slate-800/30 to-slate-700/60" />
                <div className="relative rounded-2xl bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-2xl" />

                  <h2
                    className="text-xl font-bold text-white mb-6"
                    style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}
                  >
                    Send Us a Message
                  </h2>

                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="space-y-5"
                    noValidate
                  >
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-sm font-medium text-slate-300 mb-1.5"
                      >
                        Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        aria-required="true"
                        placeholder="Your full name"
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-medium text-slate-300 mb-1.5"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        aria-required="true"
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-sm font-medium text-slate-300 mb-1.5"
                      >
                        Subject
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        required
                        aria-required="true"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 appearance-none cursor-pointer"
                      >
                        {subjects.map((s) => (
                          <option
                            key={s.value}
                            value={s.value}
                            disabled={s.value === ''}
                            className="bg-slate-900 text-white"
                          >
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-medium text-slate-300 mb-1.5"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        required
                        aria-required="true"
                        placeholder="Tell us how we can help..."
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full sm:w-auto rounded-xl bg-sky-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 hover:shadow-sky-400/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                      Send Message
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Info Panel — right side */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Contact Info */}
              <div className="relative rounded-2xl p-px">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-slate-700/60 via-slate-800/30 to-slate-700/60" />
                <div className="relative rounded-2xl bg-slate-900/80 backdrop-blur-xl p-8">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-2xl" />

                  <h3
                    className="text-lg font-bold text-white mb-6"
                    style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}
                  >
                    Contact Information
                  </h3>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 rounded-lg bg-sky-500/10 p-2.5">
                        <Mail className="h-5 w-5 text-sky-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-300">
                          Email
                        </p>
                        <a
                          href="mailto:hello@skilesson.ai"
                          className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                        >
                          hello@skilesson.ai
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 rounded-lg bg-sky-500/10 p-2.5">
                        <MapPin className="h-5 w-5 text-sky-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-300">
                          Headquarters
                        </p>
                        <p className="text-sm text-slate-400">Houston, TX</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 rounded-lg bg-sky-500/10 p-2.5">
                        <Clock className="h-5 w-5 text-sky-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-300">
                          Hours
                        </p>
                        <p className="text-sm text-slate-400">
                          Mon &ndash; Fri, 9am &ndash; 6pm CT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Callout */}
              <div className="relative rounded-2xl p-px">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-slate-700/40 via-slate-800/20 to-slate-700/40" />
                <div className="relative rounded-2xl bg-slate-900/80 backdrop-blur-xl p-8">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-2xl" />

                  <div className="flex items-center gap-3 mb-3">
                    <HelpCircle className="h-5 w-5 text-sky-400" />
                    <h3
                      className="text-lg font-bold text-white"
                      style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}
                    >
                      Have Questions?
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">
                    Check our frequently asked questions for quick answers on
                    pricing, lessons, and more.
                  </p>
                  <a
                    href="/pricing#faq"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    View FAQ
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Enterprise / Group Licensing */}
              <div className="relative rounded-2xl p-px">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-500/30 via-amber-500/10 to-amber-500/30" />
                <div className="relative rounded-2xl bg-slate-900/90 backdrop-blur-xl p-8">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent rounded-t-2xl" />

                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-5 w-5 text-amber-400" />
                    <h3
                      className="text-lg font-bold text-white"
                      style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}
                    >
                      Enterprise
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">
                    Interested in group licensing for your ski school or corporate
                    team? We offer volume pricing, admin dashboards, and dedicated
                    onboarding.
                  </p>
                  <a
                    href="mailto:hello@skilesson.ai?subject=Enterprise%20Inquiry"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Contact Enterprise Sales
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}
