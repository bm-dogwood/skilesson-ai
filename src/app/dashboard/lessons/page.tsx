"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  CheckCircle2,
  PlayCircle,
  Lock,
  Filter,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

type Level = "Beginner" | "Intermediate" | "Advanced";
type Sport = "Skiing" | "Snowboarding";
type LessonType = "Video" | "Interactive" | "Quiz";
type Status = "Complete" | "In Progress" | "Not Started";

interface Lesson {
  id: string;
  title: string;
  module: string;
  level: Level;
  sport: Sport;
  type: LessonType;
  status: Status;
  duration: string;
  progress?: number;
}

const lessons: Lesson[] = [
  {
    id: "1",
    title: "Welcome to Skiing",
    module: "Getting Started",
    level: "Beginner",
    sport: "Skiing",
    type: "Video",
    status: "Complete",
    duration: "8 min",
  },
  {
    id: "2",
    title: "Choosing Your Equipment",
    module: "Getting Started",
    level: "Beginner",
    sport: "Skiing",
    type: "Video",
    status: "Complete",
    duration: "12 min",
  },
  {
    id: "3",
    title: "Safety First on the Slopes",
    module: "Equipment & Safety",
    level: "Beginner",
    sport: "Skiing",
    type: "Interactive",
    status: "Complete",
    duration: "10 min",
  },
  {
    id: "4",
    title: "Understanding Ski Terrain",
    module: "Equipment & Safety",
    level: "Beginner",
    sport: "Skiing",
    type: "Video",
    status: "Complete",
    duration: "15 min",
  },
  {
    id: "5",
    title: "Your First Snowplow",
    module: "First Moves on Snow",
    level: "Beginner",
    sport: "Skiing",
    type: "Video",
    status: "Complete",
    duration: "18 min",
  },
  {
    id: "6",
    title: "Snowplow Stopping Drill",
    module: "First Moves on Snow",
    level: "Beginner",
    sport: "Skiing",
    type: "Interactive",
    status: "Complete",
    duration: "12 min",
  },
  {
    id: "7",
    title: "Introduction to Gliding",
    module: "The Basics",
    level: "Beginner",
    sport: "Skiing",
    type: "Video",
    status: "In Progress",
    duration: "20 min",
    progress: 45,
  },
  {
    id: "8",
    title: "Balance & Stance Fundamentals",
    module: "The Basics",
    level: "Beginner",
    sport: "Skiing",
    type: "Interactive",
    status: "Not Started",
    duration: "14 min",
  },
  {
    id: "9",
    title: "Intro to Snowboarding",
    module: "Getting Started",
    level: "Beginner",
    sport: "Snowboarding",
    type: "Video",
    status: "Not Started",
    duration: "10 min",
  },
  {
    id: "10",
    title: "Parallel Turn Foundations",
    module: "Turning Fundamentals",
    level: "Intermediate",
    sport: "Skiing",
    type: "Video",
    status: "Not Started",
    duration: "22 min",
  },
  {
    id: "11",
    title: "Carving Basics",
    module: "Speed & Control",
    level: "Intermediate",
    sport: "Skiing",
    type: "Video",
    status: "Not Started",
    duration: "25 min",
  },
  {
    id: "12",
    title: "Edge Control Masterclass",
    module: "Speed & Control",
    level: "Advanced",
    sport: "Skiing",
    type: "Interactive",
    status: "Not Started",
    duration: "30 min",
  },
];

const levelColors: Record<Level, string> = {
  Beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  Intermediate: "bg-ice/10 text-ice border-ice/20",
  Advanced: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const gradientMap: Record<Level, string> = {
  Beginner: "from-green-600/30 via-emerald-700/20 to-teal-800/30",
  Intermediate: "from-sky-600/30 via-blue-700/20 to-indigo-800/30",
  Advanced: "from-orange-600/30 via-red-700/20 to-rose-800/30",
};

export default function LessonsPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("All");
  const [sportFilter, setSportFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      if (
        search &&
        !l.title.toLowerCase().includes(search.toLowerCase()) &&
        !l.module.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (levelFilter !== "All" && l.level !== levelFilter) return false;
      if (sportFilter !== "All" && l.sport !== sportFilter) return false;
      if (typeFilter !== "All" && l.type !== typeFilter) return false;
      if (statusFilter !== "All" && l.status !== statusFilter) return false;
      return true;
    });
  }, [search, levelFilter, sportFilter, typeFilter, statusFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-snow">
          Your Lesson Library
        </h1>
        <p className="text-slate-400 mt-1">Browse and continue your lessons</p>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e293b]/50 border border-white/[0.06]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search lessons or modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-snow placeholder:text-slate-500 outline-none"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
            showFilters
              ? "bg-ice/10 border-ice/30 text-ice"
              : "bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-snow"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </motion.button>
      </div>

      {/* Filter Bar */}
      <motion.div
        initial={false}
        animate={{
          height: showFilters ? "auto" : 0,
          opacity: showFilters ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-2">
          {[
            {
              label: "Level",
              value: levelFilter,
              setter: setLevelFilter,
              options: ["All", "Beginner", "Intermediate", "Advanced"],
            },
            {
              label: "Sport",
              value: sportFilter,
              setter: setSportFilter,
              options: ["All", "Skiing", "Snowboarding"],
            },
            {
              label: "Type",
              value: typeFilter,
              setter: setTypeFilter,
              options: ["All", "Video", "Interactive", "Quiz"],
            },
            {
              label: "Status",
              value: statusFilter,
              setter: setStatusFilter,
              options: ["All", "Complete", "In Progress", "Not Started"],
            },
          ].map((filter) => (
            <div key={filter.label}>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                {filter.label}
              </label>
              <select
                value={filter.value}
                onChange={(e) => filter.setter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1e293b] border border-white/[0.06] text-sm text-snow outline-none focus:border-ice/40 transition-colors appearance-none cursor-pointer"
              >
                {filter.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Results Count */}
      <p className="text-sm text-slate-400">
        Showing <span className="text-snow font-medium">{filtered.length}</span>{" "}
        of 200+ lessons
      </p>

      {/* Lesson Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((lesson, i) => (
          <Link key={lesson.id} href={`/dashboard/lessons/${lesson.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] overflow-hidden cursor-pointer hover:border-white/[0.12] transition-colors"
            >
              {/* Thumbnail */}
              <div
                className={`relative h-36 bg-gradient-to-br ${
                  gradientMap[lesson.level]
                } flex items-center justify-center`}
              >
                <PlayCircle className="w-12 h-12 text-white/30 group-hover:text-white/50 transition-colors" />

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm">
                  <Clock className="w-3 h-3 text-white/70" />
                  <span className="text-xs text-white/80 font-medium">
                    {lesson.duration}
                  </span>
                </div>

                {/* Status Indicator */}
                <div className="absolute top-3 left-3">
                  {lesson.status === "Complete" ? (
                    <div className="w-7 h-7 rounded-full bg-green-500/80 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  ) : lesson.status === "In Progress" ? (
                    <div className="relative w-7 h-7">
                      <svg
                        className="w-7 h-7 transform -rotate-90"
                        viewBox="0 0 28 28"
                      >
                        <circle
                          cx="14"
                          cy="14"
                          r="11"
                          fill="rgba(0,0,0,0.4)"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="2"
                        />
                        <circle
                          cx="14"
                          cy="14"
                          r="11"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray={`${
                            (lesson.progress || 0) * 0.691
                          } 69.1`}
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-black/30 flex items-center justify-center">
                      <Lock className="w-3 h-3 text-white/40" />
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      levelColors[lesson.level]
                    }`}
                  >
                    {lesson.level}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                    {lesson.type}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-snow group-hover:text-ice transition-colors line-clamp-1">
                  {lesson.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{lesson.module}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
