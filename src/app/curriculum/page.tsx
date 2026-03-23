'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Lock,
  Unlock,
  ChevronRight,
  Snowflake,
  Mountain,
  Trophy,
  Play,
} from 'lucide-react';
import {
  getModulesByLevelAndSport,
  getTotalDurationMinutes,
  getLessonCount,
  levelMeta,
  type Module,
} from '@/lib/curriculum-data';

type Sport = 'skiing' | 'snowboarding';
type Level = 'beginner' | 'intermediate' | 'advanced';

const levelIcons = {
  beginner: Snowflake,
  intermediate: Mountain,
  advanced: Trophy,
};

const levelOrder: Level[] = ['beginner', 'intermediate', 'advanced'];

function ModuleCard({
  module,
  index,
  level,
}: {
  module: Module;
  index: number;
  level: Level;
}) {
  const meta = levelMeta[level];
  const hasFreeLesson = module.lessons.some((l) => l.isFree);
  const allFree = module.lessons.every((l) => l.isFree);
  const totalMinutes = module.lessons.reduce(
    (sum, l) => sum + parseInt(l.duration, 10),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link
        href={`/curriculum/${level}`}
        className="group block rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-lg hover:shadow-black/20"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Module number */}
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${meta.color}, ${meta.color}88)`,
              }}
            >
              {module.number}
            </div>

            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white group-hover:text-sky-300 transition-colors">
                {module.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {module.description}
              </p>

              {/* Meta row */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {module.lessons.length} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {totalMinutes} min
                </span>
                {allFree && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400 font-medium">
                    <Unlock className="h-3 w-3" />
                    FREE
                  </span>
                )}
                {hasFreeLesson && !allFree && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400 font-medium">
                    <Play className="h-3 w-3" />
                    Free preview
                  </span>
                )}
                {!hasFreeLesson && (
                  <span className="flex items-center gap-1 text-slate-600">
                    <Lock className="h-3 w-3" />
                    Pro
                  </span>
                )}
              </div>
            </div>
          </div>

          <ChevronRight className="mt-1 h-5 w-5 flex-shrink-0 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-slate-400" />
        </div>
      </Link>
    </motion.div>
  );
}

function LevelSection({
  level,
  sport,
  index,
}: {
  level: Level;
  sport: Sport;
  index: number;
}) {
  const meta = levelMeta[level];
  const Icon = levelIcons[level];
  const modules = getModulesByLevelAndSport(level, sport);
  const totalMinutes = getTotalDurationMinutes(modules);
  const totalLessons = getLessonCount(modules);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      {/* Connecting line between levels */}
      {index < 2 && (
        <div className="absolute left-[1.375rem] top-full hidden h-16 w-px bg-gradient-to-b from-white/10 to-transparent lg:block" />
      )}

      {/* Level header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${meta.color}22, ${meta.color}44)`,
            }}
          >
            <Icon className="h-5 w-5" style={{ color: meta.color }} />
          </div>
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: meta.color }}
            >
              {meta.label}
            </h2>
            <p className="text-sm text-slate-400">{meta.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span>{modules.length} modules</span>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span>{totalLessons} lessons</span>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span>
            {hours > 0 ? `${hours}h ` : ''}
            {mins}m
          </span>
        </div>
      </div>

      {/* Module grid */}
      <div className="grid gap-3">
        {modules.map((mod, i) => (
          <ModuleCard key={mod.id} module={mod} index={i} level={level} />
        ))}
      </div>

      {/* Level CTA */}
      <div className="mt-6 flex justify-center">
        <Link
          href={`/curriculum/${level}`}
          className="group inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:gap-3"
          style={{
            background: `linear-gradient(135deg, ${meta.color}33, ${meta.color}11)`,
            border: `1px solid ${meta.color}33`,
          }}
        >
          Explore {meta.label} Track
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.section>
  );
}

export default function CurriculumPage() {
  const [sport, setSport] = useState<Sport>('skiing');

  return (
    <main className="min-h-screen bg-[#0f172a]">
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-24 sm:pt-32">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-sky-500/[0.07] blur-[120px]" />
          <div className="absolute -top-20 left-1/4 h-[300px] w-[400px] rounded-full bg-amber-500/[0.04] blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-sm font-medium uppercase tracking-widest text-sky-400"
          >
            Structured Progression
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: 'var(--font-heading, "Plus Jakarta Sans", sans-serif)' }}
          >
            Your Path to{' '}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
              Mountain Mastery
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-slate-400"
          >
            28 modules. 100+ lessons. From your first day on snow to expert terrain,
            backcountry safety, and racing technique — built by certified instructors.
          </motion.p>

          {/* Sport toggle */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-1"
          >
            <button
              onClick={() => setSport('skiing')}
              className={`relative rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                sport === 'skiing'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {sport === 'skiing' && (
                <motion.div
                  layoutId="sportToggle"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-400/20"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">Skiing</span>
            </button>
            <button
              onClick={() => setSport('snowboarding')}
              className={`relative rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                sport === 'snowboarding'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {sport === 'snowboarding' && (
                <motion.div
                  layoutId="sportToggle"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-400/20"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">Snowboarding</span>
            </button>
          </motion.div>

          {/* Free modules callout */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-2 text-sm text-emerald-400"
          >
            <Unlock className="h-4 w-4" />
            First 3 beginner modules are completely free
          </motion.div>
        </div>
      </section>

      {/* Curriculum content */}
      <section className="relative mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <div className="space-y-20">
          {levelOrder.map((level, i) => (
            <LevelSection
              key={`${level}-${sport}`}
              level={level}
              sport={sport}
              index={i}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-24 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 text-center sm:p-12"
        >
          <h2
            className="text-2xl font-bold text-white sm:text-3xl"
            style={{ fontFamily: 'var(--font-heading, "Plus Jakarta Sans", sans-serif)' }}
          >
            Ready to start your journey?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-400">
            Begin with our free beginner modules today. No credit card required.
            Upgrade anytime for full access to every lesson.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/curriculum/beginner"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:shadow-sky-500/40 hover:brightness-110"
            >
              <Play className="h-4 w-4" />
              Start Free Lessons
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-8 py-3 text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-white/[0.08] hover:text-white"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
