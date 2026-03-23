"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

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
}: {
  value: number;
  suffix?: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="text-2xl md:text-3xl font-bold font-heading text-snow"
    >
      {value}
      {suffix}
    </motion.span>
  );
}

const streakDays = [
  { day: "Mon", done: true },
  { day: "Tue", done: true },
  { day: "Wed", done: true },
  { day: "Thu", done: true },
  { day: "Fri", done: true },
  { day: "Sat", done: false },
  { day: "Sun", done: false },
];

const modules = [
  { title: "Getting Started", lessons: 4, completed: 4, total: 4 },
  { title: "Equipment & Safety", lessons: 3, completed: 3, total: 3 },
  { title: "First Moves on Snow", lessons: 5, completed: 5, total: 5 },
  { title: "The Basics", lessons: 4, completed: 1, total: 4 },
  { title: "Turning Fundamentals", lessons: 6, completed: 0, total: 6 },
  { title: "Speed & Control", lessons: 5, completed: 0, total: 5 },
];

const upcomingSessions = [
  {
    title: "Live Q&A: First Time on the Mountain",
    instructor: "Coach Sarah M.",
    date: "Tomorrow, 7:00 PM EST",
    spots: 12,
  },
  {
    title: "Group Session: Linked Turns Masterclass",
    instructor: "Jake Rodriguez",
    date: "Thu, Mar 20 at 6:30 PM EST",
    spots: 8,
  },
  {
    title: "Weekend Workshop: Gear Selection 101",
    instructor: "Emily Chen",
    date: "Sat, Mar 22 at 10:00 AM EST",
    spots: 24,
  },
];

const recentActivity = [
  {
    action: 'Completed "Snowplow Stopping Drill"',
    time: "2 hours ago",
    icon: CheckCircle2,
  },
  { action: "Started Module 4: The Basics", time: "3 hours ago", icon: Play },
  { action: 'Earned "Week Warrior" badge', time: "Yesterday", icon: Trophy },
  {
    action: 'Watched "Choosing Your First Skis"',
    time: "Yesterday",
    icon: BookOpen,
  },
  { action: "Joined Community Discussion", time: "2 days ago", icon: Zap },
];

export default function DashboardPage() {
  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* Welcome */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-snow">
          Welcome back, Alex
        </h1>
        <p className="text-slate-400 mt-1">
          Keep the momentum going. You&apos;re making great progress.
        </p>
      </motion.div>

      {/* Hero Card: Continue Where You Left Off */}
      <motion.div
        variants={fadeInUp}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e293b] via-[#162033] to-[#0c1a2e] border border-white/[0.06] p-6 md:p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-ice/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-powder/5 to-transparent rounded-full blur-2xl" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <ProgressRing progress={38} size={120} strokeWidth={8} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-2xl font-bold text-snow">38%</span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-ice/10 text-ice text-xs font-semibold">
                IN PROGRESS
              </span>
              <span className="text-xs text-slate-400">Module 4 of 6</span>
            </div>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-snow">
              Module 4: The Basics
            </h2>
            <p className="text-slate-400 text-sm">
              Lesson 2 of 4 &mdash; Introduction to Gliding
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ice to-powder text-navy font-semibold rounded-xl shadow-lg shadow-ice/20 hover:shadow-ice/30 transition-shadow mt-2"
            >
              <Play className="w-4 h-4" />
              Continue Where You Left Off
            </motion.button>
          </div>
        </div>
      </motion.div>

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
                5 Day Streak!
              </h3>
              <p className="text-sm text-slate-400">
                Keep it going! Two more days for a perfect week.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 md:gap-4 max-w-md">
          {streakDays.map((day, i) => (
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
        {[
          {
            label: "Lessons Completed",
            value: 23,
            icon: BookOpen,
            color: "text-ice",
          },
          {
            label: "Hours Learned",
            value: 12.5,
            suffix: "h",
            icon: Clock,
            color: "text-powder",
          },
          {
            label: "Current Streak",
            value: 5,
            suffix: "d",
            icon: Flame,
            color: "text-orange-400",
          },
          {
            label: "Current Level",
            value: "Beginner",
            icon: Award,
            color: "text-gold",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            whileHover={{ y: -2 }}
            className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-xs text-slate-400 font-medium">
                {stat.label}
              </span>
            </div>
            {typeof stat.value === "number" ? (
              <AnimatedStat value={stat.value} suffix={stat.suffix} />
            ) : (
              <span className="text-2xl md:text-3xl font-bold font-heading text-snow">
                {stat.value}
              </span>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Two Column: Curriculum + AI Coach / Upcoming */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Curriculum */}
        <motion.div
          variants={fadeInUp}
          className="lg:col-span-2 rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
        >
          <h3 className="text-lg font-heading font-bold text-snow mb-5">
            Your Curriculum
          </h3>
          <div className="space-y-4">
            {modules.map((mod, i) => {
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
            })}
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
              Great progress this week! You&apos;ve mastered snowplow stopping.
              Tomorrow, let&apos;s work on your first linked turns.
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
              {upcomingSessions.map((session, i) => (
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
                    <span className="text-xs text-slate-500">
                      {session.spots} spots
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        variants={fadeInUp}
        className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
      >
        <h3 className="text-lg font-heading font-bold text-snow mb-5">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-center gap-3 py-2"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-sm text-slate-300 flex-1">
                {item.action}
              </span>
              <span className="text-xs text-slate-500 shrink-0">
                {item.time}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
