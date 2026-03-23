'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  Lock,
  Play,
  Sparkles,
  Unlock,
  Video,
  MousePointerClick,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react';
import {
  getModulesByLevelAndSport,
  getTotalDurationMinutes,
  getLessonCount,
  levelMeta,
  type Module,
  type Lesson,
} from '@/lib/curriculum-data';

type Sport = 'skiing' | 'snowboarding';
type Level = 'beginner' | 'intermediate' | 'advanced';

const validLevels: Level[] = ['beginner', 'intermediate', 'advanced'];

const typeConfig = {
  video: {
    icon: Video,
    label: 'Video',
    classes: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  },
  interactive: {
    icon: MousePointerClick,
    label: 'Interactive',
    classes: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  quiz: {
    icon: HelpCircle,
    label: 'Quiz',
    classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
};

function LessonRow({ lesson, index }: { lesson: Lesson; index: number }) {
  const config = typeConfig[lesson.type];
  const TypeIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="group flex items-start gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.03]"
    >
      {/* Status icon */}
      <div className="mt-0.5 flex-shrink-0">
        {lesson.isFree ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Play className="h-4 w-4 text-emerald-400" />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
            <Lock className="h-3.5 w-3.5 text-slate-500" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
            {lesson.title}
          </h4>
          {lesson.isFree && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
              Free
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
          {lesson.description}
        </p>
      </div>

      {/* Meta */}
      <div className="flex flex-shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${config.classes}`}
        >
          <TypeIcon className="h-3 w-3" />
          {config.label}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-600">
          <Clock className="h-3 w-3" />
          {lesson.duration}
        </span>
      </div>
    </motion.div>
  );
}

function ModuleAccordion({
  module,
  index,
  level,
}: {
  module: Module;
  index: number;
  level: Level;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const meta = levelMeta[level];
  const totalMinutes = module.lessons.reduce(
    (sum, l) => sum + parseInt(l.duration, 10),
    0
  );
  const freeCount = module.lessons.filter((l) => l.isFree).length;
  const allFree = freeCount === module.lessons.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-white/[0.1]"
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start gap-4 p-5 text-left transition-colors sm:p-6"
      >
        {/* Module number */}
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${meta.color}, ${meta.color}88)`,
          }}
        >
          {module.number}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-white">
              {module.title}
            </h3>
            {allFree && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                <Unlock className="h-3 w-3" />
                FREE
              </span>
            )}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">
            {module.description}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {module.lessons.length} lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {totalMinutes} min
            </span>
            {freeCount > 0 && !allFree && (
              <span className="flex items-center gap-1 text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                {freeCount} free
              </span>
            )}
          </div>
        </div>

        {/* Expand indicator */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="mt-1.5 flex-shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-slate-500" />
        </motion.div>
      </button>

      {/* Expanded lesson list */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="border-t border-white/[0.04] px-3 py-3 sm:px-4">
              {module.lessons.map((lesson, i) => (
                <LessonRow key={lesson.id} lesson={lesson} index={i} />
              ))}

              {/* CTA for locked modules */}
              {!allFree && (
                <div className="mt-2 flex justify-center pb-2">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/[0.08] px-5 py-2 text-xs font-medium text-sky-400 transition-all duration-300 hover:bg-sky-500/[0.15] hover:text-sky-300"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Start Free Trial to Unlock
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LevelPage() {
  const params = useParams();
  const level = params.level as string;
  const [sport, setSport] = useState<Sport>('skiing');

  // Validate level
  if (!validLevels.includes(level as Level)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Level not found</h1>
          <p className="mt-2 text-slate-400">
            Choose from beginner, intermediate, or advanced.
          </p>
          <Link
            href="/curriculum"
            className="mt-4 inline-flex items-center gap-2 text-sky-400 hover:text-sky-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Curriculum
          </Link>
        </div>
      </main>
    );
  }

  const currentLevel = level as Level;
  const meta = levelMeta[currentLevel];
  const modules = getModulesByLevelAndSport(currentLevel, sport);
  const totalMinutes = getTotalDurationMinutes(modules);
  const totalLessons = getLessonCount(modules);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const freeModules = modules.filter((m) =>
    m.lessons.every((l) => l.isFree)
  ).length;

  // Level-specific accent gradients for the hero
  const heroGradients: Record<Level, string> = {
    beginner: 'from-sky-500/[0.08] via-cyan-500/[0.04] to-transparent',
    intermediate: 'from-amber-500/[0.08] via-orange-500/[0.04] to-transparent',
    advanced: 'from-rose-500/[0.08] via-red-500/[0.04] to-transparent',
  };

  return (
    <main className="min-h-screen bg-[#0f172a]">
      {/* Hero */}
      <section className="relative overflow-hidden pb-12 pt-20 sm:pt-28">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className={`absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b ${heroGradients[currentLevel]} blur-[120px]`}
          />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 flex items-center gap-2 text-sm text-slate-500"
          >
            <Link
              href="/curriculum"
              className="transition-colors hover:text-slate-300"
            >
              Curriculum
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span style={{ color: meta.color }} className="font-medium">
              {meta.label}
            </span>
          </motion.nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                style={{
                  background: `${meta.color}11`,
                  color: meta.color,
                  border: `1px solid ${meta.color}33`,
                }}
              >
                {meta.label} Track
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
                style={{
                  fontFamily:
                    'var(--font-heading, "Plus Jakarta Sans", sans-serif)',
                }}
              >
                {currentLevel === 'beginner' && 'From First Timer to Green-Run Cruiser'}
                {currentLevel === 'intermediate' && 'Blue Runs, Moguls & Beyond'}
                {currentLevel === 'advanced' && 'Expert Terrain & Total Mastery'}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-3 max-w-xl text-slate-400"
              >
                {meta.tagline}
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="flex gap-6 text-center"
            >
              <div>
                <div className="text-2xl font-bold text-white">
                  {modules.length}
                </div>
                <div className="text-xs text-slate-500">Modules</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {totalLessons}
                </div>
                <div className="text-xs text-slate-500">Lessons</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {hours > 0 ? `${hours}h` : `${mins}m`}
                </div>
                <div className="text-xs text-slate-500">
                  {hours > 0 ? `${mins}m` : 'Total'}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sport toggle (only for beginner & intermediate which have sport-specific content) */}
          {currentLevel !== 'advanced' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-8 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-1"
            >
              <button
                onClick={() => setSport('skiing')}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  sport === 'skiing'
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {sport === 'skiing' && (
                  <motion.div
                    layoutId="levelSportToggle"
                    className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.08]"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">Skiing</span>
              </button>
              <button
                onClick={() => setSport('snowboarding')}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  sport === 'snowboarding'
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {sport === 'snowboarding' && (
                  <motion.div
                    layoutId="levelSportToggle"
                    className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.08]"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">Snowboarding</span>
              </button>
            </motion.div>
          )}

          {/* Free callout for beginner */}
          {freeModules > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-2 text-sm text-emerald-400"
            >
              <Unlock className="h-4 w-4" />
              {freeModules} module{freeModules > 1 ? 's' : ''} completely free — no account needed
            </motion.div>
          )}
        </div>
      </section>

      {/* Module list */}
      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <div className="space-y-4">
          {modules.map((mod, i) => (
            <ModuleAccordion
              key={mod.id}
              module={mod}
              index={i}
              level={currentLevel}
            />
          ))}
        </div>

        {/* Bottom navigation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-16 flex flex-col items-center gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center sm:p-10"
        >
          {currentLevel === 'beginner' && (
            <>
              <h2
                className="text-xl font-bold text-white sm:text-2xl"
                style={{
                  fontFamily:
                    'var(--font-heading, "Plus Jakarta Sans", sans-serif)',
                }}
              >
                Ready to keep progressing?
              </h2>
              <p className="max-w-md text-sm text-slate-400">
                Once you are linking turns confidently on green runs, the
                intermediate track opens up blue runs, moguls, powder, and more.
              </p>
              <Link
                href="/curriculum/intermediate"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all duration-300 hover:shadow-amber-500/30 hover:brightness-110"
              >
                Explore Intermediate
                <ChevronRight className="h-4 w-4" />
              </Link>
            </>
          )}

          {currentLevel === 'intermediate' && (
            <>
              <h2
                className="text-xl font-bold text-white sm:text-2xl"
                style={{
                  fontFamily:
                    'var(--font-heading, "Plus Jakarta Sans", sans-serif)',
                }}
              >
                Push your limits further
              </h2>
              <p className="max-w-md text-sm text-slate-400">
                The advanced track covers expert terrain, backcountry safety,
                racing, freestyle, and the mental game of elite riding.
              </p>
              <Link
                href="/curriculum/advanced"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-red-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all duration-300 hover:shadow-rose-500/30 hover:brightness-110"
              >
                Explore Advanced
                <ChevronRight className="h-4 w-4" />
              </Link>
            </>
          )}

          {currentLevel === 'advanced' && (
            <>
              <h2
                className="text-xl font-bold text-white sm:text-2xl"
                style={{
                  fontFamily:
                    'var(--font-heading, "Plus Jakarta Sans", sans-serif)',
                }}
              >
                This is the summit
              </h2>
              <p className="max-w-md text-sm text-slate-400">
                You have reached the most comprehensive snow sports curriculum
                available. Start your free trial and unlock every lesson.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all duration-300 hover:shadow-sky-500/30 hover:brightness-110"
              >
                <Play className="h-4 w-4" />
                Start Free Trial
              </Link>
            </>
          )}

          <Link
            href="/curriculum"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Full Curriculum
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
