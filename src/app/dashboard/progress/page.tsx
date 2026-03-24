"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";
import { useEffect, useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.08 },
  },
};

function LargeProgressRing({ progress }: { progress: number }) {
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
          stroke="url(#largeProgressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
        />
        <defs>
          <linearGradient
            id="largeProgressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
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
        <span className="text-xs text-slate-400 mt-1">Complete</span>
      </div>
    </div>
  );
}

const levelBreakdown = [
  {
    level: "Beginner",
    completed: 13,
    total: 18,
    color: "from-green-400 to-emerald-400",
  },
  {
    level: "Intermediate",
    completed: 0,
    total: 12,
    color: "from-ice to-powder",
  },
  {
    level: "Advanced",
    completed: 0,
    total: 8,
    color: "from-orange-400 to-red-400",
  },
];

const weeklyActivity = [
  { day: "Mon", minutes: 35 },
  { day: "Tue", minutes: 22 },
  { day: "Wed", minutes: 45 },
  { day: "Thu", minutes: 18 },
  { day: "Fri", minutes: 30 },
  { day: "Sat", minutes: 0 },
  { day: "Sun", minutes: 0 },
];

const maxMinutes = Math.max(...weeklyActivity.map((d) => d.minutes), 1);

const badges = [
  {
    name: "First Lesson",
    icon: Star,
    earned: true,
    description: "Complete your very first lesson",
  },
  {
    name: "Week Warrior",
    icon: Flame,
    earned: true,
    description: "5-day learning streak",
  },
  {
    name: "Module Master",
    icon: Trophy,
    earned: true,
    description: "Complete an entire module",
  },
  {
    name: "Speed Demon",
    icon: Zap,
    earned: false,
    description: "Complete 3 lessons in one day",
  },
  {
    name: "Night Owl",
    icon: Moon,
    earned: false,
    description: "Study after 10 PM",
  },
  {
    name: "Trailblazer",
    icon: Mountain,
    earned: false,
    description: "Start an Advanced lesson",
  },
  {
    name: "Snowflake",
    icon: Snowflake,
    earned: true,
    description: "Log in during winter season",
  },
  {
    name: "Sharpshooter",
    icon: Target,
    earned: false,
    description: "Score 100% on a quiz",
  },
  {
    name: "Dedicated",
    icon: Timer,
    earned: false,
    description: "Accumulate 50 hours of learning",
  },
];

const skills = [
  { name: "Balance", progress: 72 },
  { name: "Turning", progress: 35 },
  { name: "Speed Control", progress: 55 },
  { name: "Edge Control", progress: 20 },
  { name: "Stance & Posture", progress: 68 },
  { name: "Mountain Awareness", progress: 45 },
];

export default function ProgressPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/progress-summary");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-snow">
          Your Mountain Journey
        </h1>
        <p className="text-slate-400 mt-1">
          Track your progress and celebrate your achievements
        </p>
      </motion.div>

      {/* Top Section: Ring + Level Breakdown + Time */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Overall Progress Ring */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center justify-center rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-8"
        >
          <LargeProgressRing progress={stats?.progressPercent || 0} />

          <p className="text-sm text-slate-400 mt-4">
            {stats?.completedLessons || 0} of {stats?.totalLessons || 0} lessons
            completed
          </p>
        </motion.div>

        {/* Level Breakdown */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <h3 className="text-sm font-heading font-bold text-snow mb-5">
            Level Breakdown
          </h3>
          <div className="space-y-5">
            {stats?.levelBreakdown?.map((level: any) => {
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
                      {level.completed}/{level.total} lessons
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

        {/* Time Tracking */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <h3 className="text-sm font-heading font-bold text-snow mb-5">
            Time Tracking
          </h3>
          <div className="space-y-5">
            {[
              {
                label: "Total Time",
                value: `${(stats?.completedLessons || 0) * 10} min`,
                icon: Clock,
              },
              { label: "This Week", value: "3.2 hours", icon: Calendar },
              { label: "Avg Session", value: "25 min", icon: Timer },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="text-lg font-bold font-heading text-snow">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Weekly Activity Chart */}
      <motion.div
        variants={fadeInUp}
        className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
      >
        <h3 className="text-sm font-heading font-bold text-snow mb-6">
          Weekly Activity
        </h3>
        <div className="flex items-end justify-between gap-3 h-40">
          {weeklyActivity.map((day, i) => (
            <div
              key={day.day}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <span className="text-xs text-slate-400 font-medium">
                {day.minutes > 0 ? `${day.minutes}m` : ""}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{
                  height:
                    day.minutes > 0
                      ? `${(day.minutes / maxMinutes) * 100}%`
                      : "4px",
                }}
                transition={{ duration: 0.8, delay: 0.1 * i, ease: "easeOut" }}
                className={`w-full max-w-[48px] rounded-t-lg ${
                  day.minutes > 0
                    ? "bg-gradient-to-t from-ice/60 to-ice"
                    : "bg-white/[0.06]"
                }`}
                style={{ minHeight: day.minutes > 0 ? "8px" : "4px" }}
              />
              <span className="text-xs text-slate-500">{day.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Two Column: Badges + Skills */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Achievements / Badges */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Award className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-heading font-bold text-snow">
              Achievements
            </h3>
            <span className="text-xs text-slate-400 ml-auto">
              {badges.filter((b) => b.earned).length}/{badges.length} earned
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge, i) => (
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
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-colors ${
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
                  <badge.icon
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
            ))}
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-5 h-5 text-ice" />
            <h3 className="text-sm font-heading font-bold text-snow">
              Skills Breakdown
            </h3>
          </div>
          <div className="space-y-5">
            {skills.map((skill, i) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">{skill.name}</span>
                  <span className="text-xs text-slate-400">
                    {skill.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                    transition={{
                      duration: 1,
                      delay: 0.1 * i,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-ice to-powder"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Monthly Summary */}
      <motion.div
        variants={fadeInUp}
        className="rounded-2xl bg-gradient-to-br from-[#1e293b] via-[#162033] to-[#0c1a2e] border border-white/[0.06] p-6 md:p-8"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-ice/5 to-transparent rounded-full blur-3xl" />
        <h3 className="text-lg font-heading font-bold text-snow mb-4">
          March Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Lessons This Month", value: "8" },
            { label: "Time Spent", value: "5.2h" },
            { label: "Longest Streak", value: "5 days" },
            { label: "Badges Earned", value: "2" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-2xl font-bold font-heading text-snow">
                {item.value}
              </p>
              <p className="text-xs text-slate-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-white/[0.06]">
          <p className="text-sm text-slate-300">
            You&apos;re in the{" "}
            <span className="text-ice font-semibold">top 20%</span> of learners
            this month. Keep up the amazing work and you&apos;ll be ready for
            intermediate terrain by next month.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
