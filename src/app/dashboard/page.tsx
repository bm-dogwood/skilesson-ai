"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Flame,
  Award,
  Bot,
  Play,
  CheckCircle2,
  ArrowRight,
  Trophy,
  Zap,
  TrendingUp,
  Camera,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

// ─── Progress Ring ─────────────────────────────────────────────────────────────
function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  suffix = "",
}: {
  label: string;
  value: number | string;
  icon: any;
  color: string;
  suffix?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-xs text-slate-400 font-medium">{label}</span>
      </div>
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl font-bold font-heading text-snow"
      >
        {value}
        {suffix}
      </motion.span>
    </motion.div>
  );
}

// ─── Weekly Bar Chart ──────────────────────────────────────────────────────────
function WeeklyActivityChart({
  data,
}: {
  data: { day: string; completed: number; watchMinutes: number }[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxCompleted = Math.max(...data.map((d) => d.completed), 1);
  const maxMinutes = Math.max(...data.map((d) => d.watchMinutes), 1);

  return (
    <div className="space-y-4">
      {/* Bar chart */}
      <div className="flex items-end gap-2 h-32 pt-2">
        {data.map((d, i) => {
          const completedPct = (d.completed / maxCompleted) * 100;
          const minutesPct = (d.watchMinutes / maxMinutes) * 100;
          const isHovered = hovered === i;

          return (
            <div
              key={d.day}
              className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 bg-[#0f172a] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 whitespace-nowrap shadow-xl -translate-y-16 pointer-events-none"
                >
                  <span className="font-semibold text-ice">{d.completed}</span>{" "}
                  completed
                  <br />
                  <span className="font-semibold text-powder">
                    {d.watchMinutes}
                  </span>{" "}
                  mins
                </motion.div>
              )}

              {/* Stacked bars */}
              <div className="relative w-full flex flex-col justify-end gap-0.5 h-24">
                {/* Watch time bar */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.05 * i,
                    ease: "easeOut",
                  }}
                  style={{
                    height: `${(minutesPct / 100) * 80}%`,
                    transformOrigin: "bottom",
                    minHeight: d.watchMinutes > 0 ? "4px" : "0px",
                  }}
                  className={`w-full rounded-t-sm transition-colors ${
                    isHovered ? "bg-powder/50" : "bg-powder/20"
                  }`}
                />
                {/* Completed bar */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.05 * i + 0.1,
                    ease: "easeOut",
                  }}
                  style={{
                    height: `${(completedPct / 100) * 80}%`,
                    transformOrigin: "bottom",
                    minHeight: d.completed > 0 ? "6px" : "0px",
                  }}
                  className={`w-full rounded-t-sm transition-colors ${
                    isHovered
                      ? "bg-ice"
                      : "bg-gradient-to-t from-ice/80 to-ice/60"
                  }`}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                {d.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-ice/70" />
          <span>Lessons completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-powder/30" />
          <span>Watch time</span>
        </div>
      </div>
    </div>
  );
}

// ─── Status Donut Chart ────────────────────────────────────────────────────────
function StatusDonut({
  data,
  total,
}: {
  data: { label: string; value: number; color: string }[];
  total: number;
}) {
  const size = 140;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  let offset = 0;
  const segments = data.map((d) => {
    const pct = total > 0 ? d.value / total : 0;
    const seg = {
      ...d,
      pct,
      dasharray: `${pct * circumference} ${circumference}`,
      dashoffset: -offset * circumference,
    };
    offset += pct;
    return seg;
  });

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0">
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={strokeWidth}
          />
          {segments.map((seg, i) => (
            <motion.circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              strokeDasharray={seg.dasharray}
              strokeDashoffset={seg.dashoffset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 * i }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-snow">{total}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wide">
            lessons
          </span>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: seg.color }}
              />
              <span className="text-xs text-slate-400">{seg.label}</span>
            </div>
            <span className="text-sm font-semibold text-snow">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Module Progress Bars ──────────────────────────────────────────────────────
function ModuleProgress({
  modules,
}: {
  modules: { title: string; completed: number; total: number }[];
}) {
  return (
    <div className="space-y-4">
      {modules.length > 0 ? (
        modules.map((mod, i) => {
          const pct =
            mod.total > 0 ? Math.round((mod.completed / mod.total) * 100) : 0;
          return (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 font-medium">{mod.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {mod.completed}/{mod.total}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      pct === 100
                        ? "text-green-400"
                        : pct > 0
                        ? "text-ice"
                        : "text-slate-500"
                    }`}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 1,
                    delay: 0.2 + 0.08 * i,
                    ease: "easeOut",
                  }}
                  className={`h-full rounded-full ${
                    pct === 100
                      ? "bg-gradient-to-r from-green-400 to-emerald-400"
                      : pct > 0
                      ? "bg-gradient-to-r from-ice to-powder"
                      : "bg-white/10"
                  }`}
                />
              </div>
            </motion.div>
          );
        })
      ) : (
        <div className="text-center py-8 text-slate-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No modules yet</p>
        </div>
      )}
    </div>
  );
}

// ─── AI Submissions Sparkline ──────────────────────────────────────────────────
function AISubmissionsChart({
  data,
}: {
  data: { week: string; count: number }[];
}) {
  if (!data.length) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        No submissions yet
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.count), 1);
  const width = 240;
  const height = 60;
  const padX = 8;
  const padY = 6;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = data.map((d, i) => ({
    x: padX + (i / Math.max(data.length - 1, 1)) * innerW,
    y: padY + (1 - d.count / max) * innerH,
    ...d,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padY} L ${
    points[0].x
  } ${height - padY} Z`;

  return (
    <div className="space-y-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
      >
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <motion.path
          d={areaD}
          fill="url(#sparkGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="#38bdf8"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        {/* Dots */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="#38bdf8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + 0.05 * i }}
          />
        ))}
      </svg>
      {/* Week labels */}
      <div className="flex justify-between">
        {data.map((d) => (
          <span key={d.week} className="text-[10px] text-slate-500">
            {d.week}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-ice/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-ice rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-400 mt-4">{t("dashboard.loadingText")}</p>
        </div>
      </div>
    );
  }

  if (!data?.hasSubscription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h2 className="text-3xl font-bold text-white mb-3">
          {t("common.unlockTitle")}
        </h2>
        <p className="text-slate-400 mb-8 max-w-md">
          {t("common.unlockDescription")}
        </p>
        <Link href="/pricing">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-ice to-ice/80 text-black font-semibold shadow-lg shadow-ice/20"
          >
            {t("common.viewPlans")}
          </motion.button>
        </Link>
      </div>
    );
  }

  const user = data.user;
  const stats = data.stats;
  const continueWatching = data.continueWatching;
  const modules: { title: string; completed: number; total: number }[] =
    data.modules || [];
  const statusChart: { label: string; value: number; color: string }[] =
    data.statusChart || [];
  const weeklyActivity: {
    day: string;
    completed: number;
    watchMinutes: number;
  }[] = data.weeklyActivity || [];
  const aiSubmissionsChart: { week: string; count: number }[] =
    data.aiSubmissionsChart || [];
  const recentActivity: { action: string; time: string; icon: string }[] =
    data.recentActivity || [];
  const streakDays: { day: string; done: boolean }[] = data.streakDays || [];

  const getProgressPercent = (lesson: any) => {
    const p = lesson.progress?.[0];
    if (!p || !lesson.duration) return 0;
    return Math.min(100, Math.round((p.timestamp / lesson.duration) * 100));
  };

  const iconMap: Record<string, any> = {
    CheckCircle2,
    Play,
    Trophy,
    BookOpen,
    Zap,
  };

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* ── Welcome ──────────────────────────────────────────────────────────── */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-snow">
          {t("dashboard.welcomeBack")}, {user?.name || "Rider"}
        </h1>
        <p className="text-slate-400 mt-1">
          {user?.level || "Beginner"} · {user?.sport || "Snowboarding"}
          {stats.overallProgress > 0 &&
            ` · ${stats.overallProgress}% ${t("dashboard.overallComplete")}`}
        </p>
      </motion.div>

      {/* ── Continue Watching ─────────────────────────────────────────────────── */}
      {continueWatching && (
        <motion.div
          variants={fadeInUp}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e293b] via-[#162033] to-[#0c1a2e] border border-white/[0.06] p-6 md:p-8"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-ice/10 to-transparent rounded-full blur-3xl" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative shrink-0">
              <ProgressRing
                progress={getProgressPercent(continueWatching)}
                size={120}
                strokeWidth={8}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-snow">
                  {getProgressPercent(continueWatching)}%
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <span className="px-2.5 py-1 rounded-full bg-ice/10 text-ice text-xs font-semibold">
                {t("dashboard.continueWatchingBadge")}
              </span>
              <h2 className="text-xl md:text-2xl font-heading font-bold text-snow">
                {continueWatching.title}
              </h2>
              <p className="text-slate-400 text-sm line-clamp-2">
                {continueWatching.description || "Continue where you left off."}
              </p>
              <Link href={`/dashboard/lessons/${continueWatching.id}`}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ice to-powder text-navy font-semibold rounded-xl shadow-lg shadow-ice/20 mt-2"
                >
                  <Play className="w-4 h-4" />
                  {t("dashboard.continueWatchingCta")}
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Stat Cards ────────────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          label={t("dashboard.lessonsCompleted")}
          value={stats.completedLessons}
          icon={BookOpen}
          color="text-ice"
        />
        <StatCard
          label={t("dashboard.hoursLearned")}
          value={stats.hoursLearned}
          suffix="h"
          icon={Clock}
          color="text-powder"
        />
        <StatCard
          label={t("dashboard.currentStreak")}
          value={stats.currentStreak}
          suffix="d"
          icon={Flame}
          color="text-orange-400"
        />
        <StatCard
          label={t("dashboard.aiSubmissions")}
          value={stats.totalSubmissions}
          icon={Camera}
          color="text-purple-400"
        />
      </motion.div>

      {/* ── Charts Row ────────────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div
          variants={fadeInUp}
          className="lg:col-span-2 rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-heading font-bold text-snow">
                {t("dashboard.weeklyActivityTitle")}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t("dashboard.weeklyActivitySubtitle")}
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-ice/60" />
          </div>
          <WeeklyActivityChart data={weeklyActivity} />
        </motion.div>

        {/* Lesson Status Donut */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-heading font-bold text-snow">
                {t("dashboard.lessonStatusTitle")}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t("dashboard.lessonStatusSubtitle")}
              </p>
            </div>
          </div>
          <StatusDonut data={statusChart} total={stats.totalLessons} />
        </motion.div>
      </div>

      {/* ── Module Progress + AI Submissions ────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Module Progress */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <h3 className="text-base font-heading font-bold text-snow mb-5">
            Progress by Level
          </h3>
          <ModuleProgress modules={modules} />
        </motion.div>

        {/* AI Submissions Trend */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-heading font-bold text-snow">
                AI Coach Submissions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Submissions per week
              </p>
            </div>
            <Bot className="w-5 h-5 text-ice/60" />
          </div>
          <AISubmissionsChart data={aiSubmissionsChart} />

          {stats.totalSubmissions > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {stats.totalSubmissions}{" "}
                {stats.totalSubmissions !== 1
                  ? t("dashboard.aiCoachSubmissionsTotalPlural")
                  : t("dashboard.aiCoachSubmissionsTotal")}
              </span>
              <Link href="/dashboard/ai-coach">
                <button className="text-xs text-ice hover:text-ice/80 flex items-center gap-1 transition-colors">
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Streak + AI Coach ─────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Streak */}
        <motion.div
          variants={fadeInUp}
          className="lg:col-span-2 rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <h3 className="text-base font-heading font-bold text-snow">
                {stats.currentStreak} {t("dashboard.streakTitle")}
              </h3>
              <p className="text-xs text-slate-400">
                {stats.currentStreak >= 5
                  ? t("dashboard.streakEncouragementHigh")
                  : t("dashboard.streakEncouragementLow")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {streakDays.map((day, i) => (
              <motion.div
                key={day.day}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.06 * i, type: "spring", stiffness: 300 }}
                className="flex flex-col items-center gap-1.5 flex-1"
              >
                <div
                  className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center border-2 transition-colors ${
                    day.done
                      ? "bg-ice/20 border-ice text-ice"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-500"
                  }`}
                >
                  {day.done ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    day.done ? "text-ice" : "text-slate-500"
                  }`}
                >
                  {day.day}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Coach CTA */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#162033] border border-white/[0.06] p-6 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-ice/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-ice" />
            </div>
            <h3 className="text-sm font-heading font-bold text-snow">
              {t("dashboard.aiCoachCardTitle")}
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-4 flex-1">
            {t("dashboard.aiCoachCardDescription")}
          </p>
          <Link href="/dashboard/coach">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ice/10 text-ice text-sm font-semibold hover:bg-ice/20 transition-colors"
            >
              {t("dashboard.aiCoachCardCta")}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* ── Recent Activity ───────────────────────────────────────────────────── */}
      {recentActivity.length > 0 && (
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <h3 className="text-base font-heading font-bold text-snow mb-5">
            {t("dashboard.recentActivity")}
          </h3>
          <div className="space-y-2">
            {recentActivity.map((item, i) => {
              const IconComponent = iconMap[item.icon] || Zap;
              const timeLabel = item.time
                ? new Date(item.time).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center gap-3 py-2 border-b border-white/[0.03] last:border-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                    <IconComponent className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-sm text-slate-300 flex-1">
                    {item.action}
                  </span>
                  <span className="text-xs text-slate-500 shrink-0">
                    {timeLabel}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
