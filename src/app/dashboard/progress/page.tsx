"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  Trophy,
  Star,
  Flame,
  Moon,
  Zap,
  Target,
  Award,
  Mountain,
  Snowflake,
  Timer,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

// ─── Icon map for badges from API ─────────────────────────────────────────────
const ICON_MAP: Record<string, any> = {
  Star,
  Flame,
  Trophy,
  Zap,
  Moon,
  Mountain,
  Snowflake,
  Timer,
  Target,
  Award,
};

// ─── Level color map ──────────────────────────────────────────────────────────
const LEVEL_COLOR: Record<string, string> = {
  Beginner: "bg-emerald-400/80",
  Intermediate: "bg-sky-400/80",
  Advanced: "bg-orange-400/80",
};

const LEVEL_DOT: Record<string, string> = {
  Beginner: "bg-emerald-400",
  Intermediate: "bg-sky-400",
  Advanced: "bg-orange-400",
};

// ─── Large Progress Ring ───────────────────────────────────────────────────────
function LargeProgressRing({ progress }: { progress: number }) {
  const { t } = useTranslation();
  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#largeGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
        />
        <defs>
          <linearGradient id="largeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-4xl font-bold font-heading text-snow"
        >
          {progress}%
        </motion.span>
        <span className="text-xs text-slate-400 mt-1">
          {t("progress.overallProgressLabel")}
        </span>
      </div>
    </div>
  );
}

// ─── Activity Heatmap (GitHub-style) ─────────────────────────────────────────
function ActivityHeatmap({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const { t } = useTranslation();
  const [tooltip, setTooltip] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  if (!data.length) return null;

  // Group into columns of 7 (weeks), each column = one week top-to-bottom
  const weeks: { date: string; count: number }[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const getColor = (count: number) => {
    if (count === 0) return "bg-white/[0.04] border border-white/[0.04]";
    const intensity = count / maxCount;
    if (intensity < 0.33) return "bg-sky-400/30";
    if (intensity < 0.66) return "bg-sky-400/60";
    return "bg-sky-400";
  };

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  // Month labels — find first day of each month in dataset
  const monthLabels: { label: string; colIdx: number }[] = [];
  weeks.forEach((week, wi) => {
    week.forEach((day) => {
      const d = new Date(day.date + "T00:00:00");
      if (d.getDate() === 1) {
        monthLabels.push({
          label: d.toLocaleString("default", { month: "short" }),
          colIdx: wi,
        });
      }
    });
  });

  return (
    <div className="relative">
      {/* Month labels */}
      <div className="flex gap-1 mb-1 ml-5">
        {weeks.map((_, wi) => {
          const ml = monthLabels.find((m) => m.colIdx === wi);
          return (
            <div
              key={wi}
              className="flex-1 text-[10px] text-slate-500 truncate"
            >
              {ml?.label || ""}
            </div>
          );
        })}
      </div>

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {dayLabels.map((d, i) => (
            <div
              key={i}
              className="text-[10px] text-slate-600 w-4 h-3 flex items-center"
            >
              {i % 2 === 1 ? d : ""}
            </div>
          ))}
        </div>

        {/* Grid */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1 flex-1">
            {Array.from({ length: 7 }, (_, di) => {
              const cell = week[di];
              if (!cell) return <div key={di} className="h-3 rounded-sm" />;
              return (
                <motion.div
                  key={di}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (wi * 7 + di) * 0.003 }}
                  className={`h-3 rounded-sm cursor-pointer transition-all hover:scale-125 hover:brightness-125 ${getColor(
                    cell.count
                  )}`}
                  onMouseEnter={(e) => {
                    const rect = (
                      e.target as HTMLElement
                    ).getBoundingClientRect();
                    setTooltip({
                      date: cell.date,
                      count: cell.count,
                      x: rect.left,
                      y: rect.top,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed z-50 pointer-events-none bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl"
            style={{ left: tooltip.x - 60, top: tooltip.y - 48 }}
          >
            <span className="font-semibold text-snow">{tooltip.count}</span>
            <span className="text-slate-400">
              {" "}
              {tooltip.count !== 1
                ? t("common.lessons")
                : t("common.lesson")}{" "}
              {t("common.on")}{" "}
            </span>
            <span className="text-ice">
              {new Date(tooltip.date + "T00:00:00").toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                }
              )}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-[10px] text-slate-500">{t("common.less")}</span>
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <div
            key={v}
            className={`w-3 h-3 rounded-sm ${getColor(v * maxCount)}`}
          />
        ))}
        <span className="text-[10px] text-slate-500">{t("common.more")}</span>
      </div>
    </div>
  );
}

// ─── Completion Timeline ───────────────────────────────────────────────────────
function CompletionTimeline({
  data,
}: {
  data: { date: string; lessonTitle: string; level: string }[];
}) {
  const { t } = useTranslation();

  if (!data.length) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p>{t("progress.completionTimelineEmpty")}</p>
      </div>
    );
  }

  // Group by date descending
  const grouped: Record<string, typeof data> = {};
  [...data].reverse().forEach((item) => {
    if (!grouped[item.date]) grouped[item.date] = [];
    grouped[item.date].push(item);
  });

  return (
    <div className="space-y-5 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
      {Object.entries(grouped).map(([date, lessons], gi) => (
        <motion.div
          key={date}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.06 * gi }}
          className="relative"
        >
          {/* Date label */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-ice/60 shrink-0" />
            <span className="text-[11px] text-slate-400 font-medium">
              {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <div className="flex-1 h-px bg-white/[0.04]" />
          </div>

          {/* Lessons on this date */}
          <div className="ml-3.5 space-y-1.5">
            {lessons.map((lesson, li) => (
              <motion.div
                key={li}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * gi + 0.04 * li }}
                className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    LEVEL_DOT[lesson.level] || "bg-slate-500"
                  }`}
                />
                <span className="text-sm text-slate-200 flex-1 truncate">
                  {lesson.lessonTitle}
                </span>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    lesson.level === "Beginner"
                      ? "bg-emerald-400/10 text-emerald-400"
                      : lesson.level === "Intermediate"
                      ? "bg-sky-400/10 text-sky-400"
                      : "bg-orange-400/10 text-orange-400"
                  }`}
                >
                  {lesson.level}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ProgressPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/progress-summary")
      .then((r) => r.json())
      .then(setStats)
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
          <p className="text-slate-400 mt-4">{t("progress.loadingText")}</p>
        </div>
      </div>
    );
  }

  const levelBreakdown = stats?.levelBreakdown || [];
  const badges = stats?.badges || [];
  const heatmap = stats?.heatmap || [];
  const timeline = stats?.timeline || [];
  const timeTracking = stats?.timeTracking || {};
  const monthly = stats?.monthlySummary || {};
  const earnedBadges = badges.filter((b: any) => b.earned).length;

  const formatMinutes = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${
      mins % 60 > 0 ? `${mins % 60}m` : ""
    }`.trim();
  };

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-snow">
          {t("progress.pageTitle")}
        </h1>
        <p className="text-slate-400 mt-1">{t("progress.pageSubtitle")}</p>
      </motion.div>

      {/* ── Top Row: Ring + Level + Time ──────────────────────────────────────── */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Overall ring */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center justify-center rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-8"
        >
          <LargeProgressRing progress={stats?.progressPercent || 0} />
          <p className="text-sm text-slate-400 mt-4">
            {stats?.completedLessons || 0} {t("progress.of")}{" "}
            {stats?.totalLessons || 0} {t("progress.lessonsCompletedOf")}
          </p>
        </motion.div>

        {/* Level breakdown */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <h3 className="text-sm font-heading font-bold text-snow mb-5">
            {t("progress.levelBreakdown")}
          </h3>
          <div className="space-y-5">
            {levelBreakdown.map((level: any) => {
              const pct =
                level.total > 0
                  ? Math.round((level.completed / level.total) * 100)
                  : 0;
              return (
                <div key={level.level}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">
                      {level.level}
                    </span>
                    <span className="text-xs text-slate-400">
                      {level.completed}/{level.total} {t("progress.lessons")}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 1.2,
                        ease: "easeOut",
                        delay: 0.4,
                      }}
                      className={`h-full rounded-full bg-gradient-to-r ${level.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Time tracking — all real */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <h3 className="text-sm font-heading font-bold text-snow mb-5">
            {t("progress.timeTracking")}
          </h3>
          <div className="space-y-5">
            {[
              {
                label: t("progress.totalTime"),
                value: formatMinutes(timeTracking.totalMinutes || 0),
                icon: Clock,
              },
              {
                label: t("progress.thisWeek"),
                value: formatMinutes(timeTracking.weekMinutes || 0),
                icon: Calendar,
              },
              {
                label: t("progress.avgSession"),
                value: formatMinutes(timeTracking.avgSessionMinutes || 0),
                icon: Timer,
              },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="text-lg font-bold font-heading text-snow">
                    {stat.value || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Activity Heatmap ──────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeInUp}
        className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-heading font-bold text-snow">
              {t("progress.activityHeatmap")}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t("progress.activityHeatmapSubtitle")}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Flame className="w-4 h-4 text-orange-400" />
            {stats?.currentStreak || 0} {t("progress.dayStreak")}
          </div>
        </div>
        <ActivityHeatmap data={heatmap} />
      </motion.div>

      {/* ── Completion Timeline + Badges ──────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-ice" />
            <div>
              <h3 className="text-sm font-heading font-bold text-snow">
                {t("progress.completionTimeline")}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t("progress.completionTimelineSub")}
              </p>
            </div>
          </div>
          <CompletionTimeline data={timeline} />
        </motion.div>

        {/* Badges */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Award className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-heading font-bold text-snow">
              {t("progress.achievements")}
            </h3>
            <span className="text-xs text-slate-400 ml-auto">
              {earnedBadges}/{badges.length} {t("progress.achievementsEarned")}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge: any, i: number) => {
              const IconComponent = ICON_MAP[badge.icon] || Star;
              return (
                <motion.div
                  key={badge.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.05 * i,
                    type: badge.earned ? "spring" : "tween",
                    stiffness: badge.earned ? 300 : undefined,
                    damping: badge.earned ? 15 : undefined,
                  }}
                  whileHover={badge.earned ? { scale: 1.08 } : {}}
                  title={badge.description}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-colors cursor-default ${
                    badge.earned
                      ? "bg-gold/5 border-gold/20"
                      : "bg-white/[0.02] border-white/[0.04] opacity-40"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      badge.earned ? "bg-gold/10" : "bg-white/[0.04]"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        badge.earned ? "text-gold" : "text-slate-600"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium leading-tight ${
                      badge.earned ? "text-snow" : "text-slate-600"
                    }`}
                  >
                    {badge.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Monthly Summary — all real ────────────────────────────────────────── */}
      <motion.div
        variants={fadeInUp}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e293b] via-[#162033] to-[#0c1a2e] border border-white/[0.06] p-6 md:p-8"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-ice/5 to-transparent rounded-full blur-3xl" />
        <h3 className="text-lg font-heading font-bold text-snow mb-4">
          {monthly.monthName || t("progress.monthlySummaryTitle")}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: t("progress.monthlyLessonsCompleted"),
              value: monthly.lessonsCompleted ?? "—",
            },
            {
              label: t("progress.monthlyTimeSpent"),
              value: monthly.watchMinutes
                ? formatMinutes(monthly.watchMinutes)
                : "—",
            },
            {
              label: t("progress.monthlyCurrentStreak"),
              value:
                monthly.longestStreak != null
                  ? `${monthly.longestStreak}d`
                  : "—",
            },
            {
              label: t("progress.monthlyBadgesEarned"),
              value: monthly.badgesEarned ?? "—",
            },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-2xl font-bold font-heading text-snow">
                {item.value}
              </p>
              <p className="text-xs text-slate-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
