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
  Calendar,
  CheckCircle2,
  ArrowRight,
  Trophy,
  Zap,
  TrendingUp,
  Mountain,
} from "lucide-react";

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

// Progress ring component
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

// Animated counter
function AnimatedStat({
  value,
  suffix = "",
  isNumber = true,
}: {
  value: number | string;
  suffix?: string;
  isNumber?: boolean;
}) {
  const displayValue = typeof value === "number" ? value : value;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="text-2xl md:text-3xl font-bold font-heading text-snow"
    >
      {displayValue}
      {suffix}
    </motion.span>
  );
}

// Stat Card Component
function StatCard({ label, value, icon: Icon, color, suffix = "" }: any) {
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
      {typeof value === "number" ? (
        <AnimatedStat value={value} suffix={suffix} />
      ) : (
        <span className="text-2xl md:text-3xl font-bold font-heading text-snow">
          {value}
        </span>
      )}
    </motion.div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const dashboardData = await res.json();
        setData(dashboardData);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-ice/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-ice rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-400 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data?.hasSubscription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-ice/20 to-purple-500/20 blur-3xl rounded-full"></div>
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-3">
          Unlock Your Potential
        </h2>
        <p className="text-slate-400 mb-8 max-w-md">
          Choose a plan to access our complete library of premium lessons and
          start your journey to mastery.
        </p>

        <Link href="/pricing">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-ice to-ice/80 text-black font-semibold shadow-lg shadow-ice/20"
          >
            View Plans
          </motion.button>
        </Link>
      </div>
    );
  }

  const user = data?.user;
  const stats = data?.stats || {
    completedLessons: 0,
    hoursLearned: 0,
    progressPercent: 0,
  };
  const continueWatching = data?.continueWatching;
  const lessons = data?.lessons || [];
  const modules = data?.modules || [];

  const getProgressPercent = (lesson: any) => {
    const p = lesson.progress?.[0];
    if (!p || !lesson.duration) return 0;
    return Math.min(100, Math.round((p.timestamp / lesson.duration) * 100));
  };

  // Calculate streak days from actual data or use default
  const streakDays = data?.streakDays || [
    { day: "Mon", done: true },
    { day: "Tue", done: true },
    { day: "Wed", done: true },
    { day: "Thu", done: true },
    { day: "Fri", done: true },
    { day: "Sat", done: false },
    { day: "Sun", done: false },
  ];

  const upcomingSessions = data?.upcomingSessions || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-snow">
          Welcome back, {user?.name || "Rider"}
        </h1>
        <p className="text-slate-400 mt-1">
          {user?.level || "Beginner"} • {user?.sport || "Snowboarding"}
          {stats.progressPercent > 0 && " • Keep the momentum going!"}
        </p>
      </motion.div>

      {/* Continue Watching Hero Card */}
      {continueWatching && (
        <motion.div
          variants={fadeInUp}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e293b] via-[#162033] to-[#0c1a2e] border border-white/[0.06] p-6 md:p-8"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-ice/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-powder/5 to-transparent rounded-full blur-2xl" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <ProgressRing
                progress={getProgressPercent(continueWatching)}
                size={120}
                strokeWidth={8}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-2xl font-bold text-snow">
                    {getProgressPercent(continueWatching)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-ice/10 text-ice text-xs font-semibold">
                  IN PROGRESS
                </span>
                <span className="text-xs text-slate-400">
                  {continueWatching.module || "Lesson"}{" "}
                  {continueWatching.moduleIndex || 1}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-heading font-bold text-snow">
                {continueWatching.title}
              </h2>
              <p className="text-slate-400 text-sm line-clamp-2">
                {continueWatching.description ||
                  "Continue where you left off and master this skill."}
              </p>
              <Link href={`/dashboard/lessons/${continueWatching.id}`}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ice to-powder text-navy font-semibold rounded-xl shadow-lg shadow-ice/20 hover:shadow-ice/30 transition-shadow mt-2"
                >
                  <Play className="w-4 h-4" />
                  Continue Where You Left Off
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Weekly Streak */}
      <motion.div
        variants={fadeInUp}
        className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-orange-400" />
            <div>
              <h3 className="text-lg font-heading font-bold text-snow">
                {stats.currentStreak || 0} Day Streak!
              </h3>
              <p className="text-sm text-slate-400">
                {stats.currentStreak >= 5
                  ? "Amazing progress! Keep it up!"
                  : "Keep it going! Consistency is key."}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 md:gap-4 max-w-md">
          {streakDays.map((day: any, i: number) => (
            <motion.div
              key={day.day}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 * i, type: "spring", stiffness: 300 }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                  day.done
                    ? "bg-ice/20 border-ice text-ice"
                    : "bg-white/[0.03] border-white/[0.08] text-slate-500"
                }`}
              >
                {day.done ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  day.done ? "text-ice" : "text-slate-500"
                }`}
              >
                {day.day}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          label="Lessons Completed"
          value={stats.completedLessons || 0}
          icon={BookOpen}
          color="text-ice"
        />
        <StatCard
          label="Hours Learned"
          value={stats.hoursLearned || 0}
          suffix="h"
          icon={Clock}
          color="text-powder"
        />
        <StatCard
          label="Current Streak"
          value={stats.currentStreak || 0}
          suffix="d"
          icon={Flame}
          color="text-orange-400"
        />
        <StatCard
          label="Current Level"
          value={user?.level || "Beginner"}
          icon={Award}
          color="text-gold"
        />
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Curriculum Section */}
        <motion.div
          variants={fadeInUp}
          className="lg:col-span-2 rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <h3 className="text-lg font-heading font-bold text-snow mb-5">
            Your Curriculum
          </h3>
          <div className="space-y-4">
            {modules.length > 0 ? (
              modules.map((mod: any, i: number) => {
                const pct = Math.round((mod.completed / mod.total) * 100);
                return (
                  <motion.div
                    key={mod.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center gap-4"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                        pct === 100
                          ? "bg-green-500/20 text-green-400"
                          : pct > 0
                          ? "bg-ice/10 text-ice"
                          : "bg-white/[0.04] text-slate-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-snow truncate">
                          {mod.title}
                        </span>
                        <span className="text-xs text-slate-400 shrink-0 ml-2">
                          {mod.completed}/{mod.total}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{
                            duration: 1,
                            delay: 0.2 + 0.05 * i,
                            ease: "easeOut",
                          }}
                          className={`h-full rounded-full ${
                            pct === 100
                              ? "bg-gradient-to-r from-green-400 to-emerald-400"
                              : "bg-gradient-to-r from-ice to-powder"
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No modules available yet</p>
                <p className="text-sm mt-1">Check back soon for new content!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Coach Widget */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#162033] border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-ice/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-ice" />
              </div>
              <h3 className="text-sm font-heading font-bold text-snow">
                AI Coach
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {data?.aiTip ||
                "Great progress this week! You're building momentum. Ready to level up your skills? Let's set some goals for the next session."}
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ice/10 text-ice text-sm font-semibold hover:bg-ice/20 transition-colors"
            >
              Chat with AI Coach
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Upcoming Live Sessions */}
          {upcomingSessions.length > 0 && (
            <motion.div
              variants={fadeInUp}
              className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-powder" />
                <h3 className="text-sm font-heading font-bold text-snow">
                  Live Sessions
                </h3>
              </div>
              <div className="space-y-4">
                {upcomingSessions.slice(0, 3).map((session: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * i }}
                    className="pb-4 border-b border-white/[0.04] last:border-0 last:pb-0"
                  >
                    <p className="text-sm font-medium text-snow">
                      {session.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {session.instructor}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-ice">{session.date}</span>
                      {session.spots && (
                        <span className="text-xs text-slate-500">
                          {session.spots} spots left
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <h3 className="text-lg font-heading font-bold text-snow mb-5">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((item: any, i: number) => {
              const IconComponent =
                item.icon === "CheckCircle2"
                  ? CheckCircle2
                  : item.icon === "Play"
                  ? Play
                  : item.icon === "Trophy"
                  ? Trophy
                  : item.icon === "BookOpen"
                  ? BookOpen
                  : Zap;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center gap-3 py-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                    <IconComponent className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-sm text-slate-300 flex-1">
                    {item.action}
                  </span>
                  <span className="text-xs text-slate-500 shrink-0">
                    {item.time}
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
