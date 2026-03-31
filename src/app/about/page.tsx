"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  User,
  Globe,
  Clock,
  BookOpen,
  Users,
  Award,
  ArrowRight,
  Mountain,
} from "lucide-react";
import { useT } from "@/hooks/useT";

// Icons stay static — not translatable
const pillarIcons = [Globe, Clock, BookOpen, Users];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function AboutPage() {
  const t = useT();

  // Function to render bio with line breaks for bullet points
  const renderBio = (bio: string) => {
    return bio.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < bio.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] overflow-hidden">
      {/* Background texture */}
      <div className="fixed inset-0 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2813&auto=format&fit=crop"
          alt="Aspen mountain village in winter"
          fill
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0f172a]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.08)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(125,211,252,0.05)_0%,_transparent_50%)]" />
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/20 px-4 py-1.5 text-sm font-medium text-sky-400 mb-8">
                <Mountain className="h-3.5 w-3.5" />
                {t.about.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              <span className="text-white">{t.about.title1}</span>
              <br />
              <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
                {t.about.title2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
            >
              {t.about.subtitle}
            </motion.p>
          </div>
        </section>

        {/* Mountain Panorama */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1515442597003-a25e0a78dae9?q=80&w=2081&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Panoramic view of Vail ski resort with snow-covered peaks"
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
                  {t.about.whereWeTeach}
                </p>
                <p
                  className="mt-1 text-lg font-bold text-white"
                  style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
                >
                  {t.about.whereWeTeachLocations}
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Team Section - Centered for desktop */}
        <section className="pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
              >
                {t.about.team.heading}
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                {t.about.team.sub}
              </p>
            </motion.div>

            {/* Centered single card on desktop, full width on mobile */}
            <div className="flex justify-center">
              <div className="w-full md:max-w-2xl">
                {t.about.team.members.map(
                  (
                    member: { name: string; title: string; bio: string },
                    index: number
                  ) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.15,
                        ease: [0.21, 0.47, 0.32, 0.98],
                      }}
                      className="relative rounded-2xl p-px"
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-slate-700/60 via-slate-800/30 to-slate-700/60" />
                      <div className="relative rounded-2xl bg-slate-900/80 backdrop-blur-xl p-8 lg:p-10">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-2xl" />
                        <div className="flex items-center gap-5 mb-6">
                          <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gradient-to-br from-sky-500/20 to-sky-400/10 border-2 border-sky-500/30 flex items-center justify-center">
                            <User className="h-8 w-8 text-sky-400" />
                          </div>
                          <div>
                            <h3
                              className="text-xl font-bold text-white"
                              style={{
                                fontFamily: "var(--font-plus-jakarta-sans)",
                              }}
                            >
                              {member.name}
                            </h3>
                            <p className="text-sm text-sky-400 font-medium">
                              {member.title}
                            </p>
                          </div>
                        </div>
                        <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                          {renderBio(member.bio)}
                        </p>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Our Approach Section */}
        <section className="pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
              >
                {t.about.approach.heading}
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                {t.about.approach.sub}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {t.about.approach.pillars.map(
                (
                  pillar: { title: string; description: string },
                  index: number
                ) => {
                  const Icon = pillarIcons[index];
                  return (
                    <motion.div
                      key={pillar.title}
                      initial={{ opacity: 0, y: 32 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: [0.21, 0.47, 0.32, 0.98],
                      }}
                      className="relative rounded-2xl p-px group"
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-slate-700/40 via-slate-800/20 to-slate-700/40 group-hover:from-sky-500/30 group-hover:via-sky-500/10 group-hover:to-sky-500/30 transition-all duration-500" />
                      <div className="relative rounded-2xl bg-slate-900/80 backdrop-blur-xl p-8 h-full">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-2xl" />
                        <div className="inline-flex items-center justify-center rounded-xl bg-sky-500/10 p-3 mb-5">
                          <Icon className="h-6 w-6 text-sky-400" />
                        </div>
                        <h3
                          className="text-xl font-bold text-white mb-3"
                          style={{
                            fontFamily: "var(--font-plus-jakarta-sans)",
                          }}
                        >
                          {pillar.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* Affiliations */}
        <section className="pb-24 px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              {t.about.affiliations.heading}
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              {t.about.affiliations.sub}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-sky-400" />
                <div className="text-left">
                  <p className="text-white font-semibold text-lg">
                    {t.about.affiliations.psia.name}
                  </p>
                  <p className="text-slate-500 text-sm">
                    {t.about.affiliations.psia.description}
                  </p>
                </div>
              </div>
              <div className="h-12 w-px bg-slate-800 hidden sm:block" />
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-sky-400" />
                <div className="text-left">
                  <p className="text-white font-semibold text-lg">
                    {t.about.affiliations.nsp.name}
                  </p>
                  <p className="text-slate-500 text-sm">
                    {t.about.affiliations.nsp.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="pb-32 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto relative rounded-2xl p-px"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/30 via-cyan-500/20 to-sky-500/30" />

            <div className="relative rounded-2xl bg-slate-900/90 backdrop-blur-xl px-8 py-12 sm:px-12 sm:py-16 text-center">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-2xl" />

              <h2
                className="text-3xl sm:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
              >
                {t.about.cta.heading}
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                {t.about.cta.sub}
              </p>

              <motion.a
                href="/signup"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 hover:shadow-sky-400/30 transition-all duration-200"
              >
                {t.about.cta.button}
                <ArrowRight className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
