"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  CheckCircle2,
  PlayCircle,
  Lock,
  X,
  ChevronDown,
  BookOpen,
  Mountain,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Play,
} from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  sport: "Skiing" | "Snowboarding";
  thumbnailUrl?: string;
  duration?: number;
  createdAt: string;
  progress?: {
    timestamp?: number;
    status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  }[];
};

const levelConfig = {
  Beginner: {
    pill: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    bar: "from-emerald-400 to-teal-400",
    dot: "bg-emerald-400",
  },
  Intermediate: {
    pill: "bg-sky-400/10 text-sky-400 border-sky-400/20",
    bar: "from-sky-400 to-blue-400",
    dot: "bg-sky-400",
  },
  Advanced: {
    pill: "bg-orange-400/10 text-orange-400 border-orange-400/20",
    bar: "from-orange-400 to-red-400",
    dot: "bg-orange-400",
  },
};

type ViewMode = "grid" | "list";
type CompletionFilter = "All" | "Completed" | "In Progress" | "Not Started";

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function LessonsClient() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [sportFilter, setSportFilter] = useState("All");
  const [completionFilter, setCompletionFilter] =
    useState<CompletionFilter>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const getProgressPercent = (lesson: Lesson) => {
    const p = lesson.progress?.[0];
    if (!p || !lesson.duration) return 0;
    return Math.min(
      100,
      Math.round(((p.timestamp || 0) / lesson.duration) * 100)
    );
  };

  const getStatus = (lesson: Lesson) =>
    lesson.progress?.[0]?.status || "NOT_STARTED";

  useEffect(() => {
    fetch("/api/lessons-user")
      .then((r) => r.json())
      .then((data) => {
        setLessons(data.lessons || []);
        setHasSubscription(data.hasSubscription);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      if (search && !l.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (levelFilter !== "All" && l.level !== levelFilter) return false;
      if (sportFilter !== "All" && l.sport !== sportFilter) return false;
      if (completionFilter !== "All") {
        const s = getStatus(l);
        if (completionFilter === "Completed" && s !== "COMPLETED") return false;
        if (completionFilter === "In Progress" && s !== "IN_PROGRESS")
          return false;
        if (completionFilter === "Not Started" && s !== "NOT_STARTED")
          return false;
      }
      return true;
    });
  }, [lessons, search, levelFilter, sportFilter, completionFilter]);

  const resetFilters = () => {
    setSearch("");
    setLevelFilter("All");
    setSportFilter("All");
    setCompletionFilter("All");
  };

  const continueWatching = lessons.filter((l) => {
    const p = l.progress?.[0];
    return p?.timestamp && p.timestamp > 5 && p.status !== "COMPLETED";
  });

  const completedCount = lessons.filter(
    (l) => getStatus(l) === "COMPLETED"
  ).length;
  const inProgressCount = lessons.filter(
    (l) => getStatus(l) === "IN_PROGRESS"
  ).length;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-ice/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-ice rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-400 mt-4">Loading your lessons...</p>
        </div>
      </div>
    );
  }

  // ── No Subscription ───────────────────────────────────────────────────────
  if (!hasSubscription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-2xl bg-ice/10 border border-ice/20 flex items-center justify-center mb-6"
        >
          <Lock className="w-9 h-9 text-ice" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-3">
          Unlock Your Potential
        </h2>
        <p className="text-slate-400 mb-8 max-w-md">
          Choose a plan to access our complete library of premium lessons.
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

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-snow">
            Lesson Library
          </h1>
          <p className="text-slate-400 mt-1">
            {lessons.length} lessons · {completedCount} completed ·{" "}
            {inProgressCount} in progress
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-[#1e293b]/60 border border-white/[0.06] rounded-xl p-1">
            {(["grid", "list"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === v
                    ? "bg-ice text-navy shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {v === "grid" ? (
                  <LayoutGrid className="w-4 h-4" />
                ) : (
                  <List className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              showFilters
                ? "bg-ice/15 border-ice/30 text-ice"
                : "bg-[#1e293b]/60 border-white/[0.06] text-slate-300 hover:border-white/[0.12]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </motion.button>
        </div>
      </motion.div>

      {/* ── Search ──────────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search lessons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-[#1e293b]/60 border border-white/[0.06] text-snow placeholder:text-slate-500 focus:outline-none focus:border-ice/30 transition-all text-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      {/* ── Filter Panel ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6 space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-heading font-bold text-snow">
                  Filter Lessons
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-ice hover:text-ice/70 transition-colors"
                >
                  Reset all
                </button>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  {
                    label: "Level",
                    options: ["All", "Beginner", "Intermediate", "Advanced"],
                    value: levelFilter,
                    set: setLevelFilter,
                  },
                  {
                    label: "Sport",
                    options: ["All", "Skiing", "Snowboarding"],
                    value: sportFilter,
                    set: setSportFilter,
                  },
                  {
                    label: "Status",
                    options: ["All", "Completed", "In Progress", "Not Started"],
                    value: completionFilter,
                    set: (v: string) =>
                      setCompletionFilter(v as CompletionFilter),
                  },
                ].map(({ label, options, value, set }) => (
                  <div key={label}>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2.5">
                      {label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => set(opt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            value === opt
                              ? "bg-ice/15 border-ice/30 text-ice"
                              : "bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-white/[0.12] hover:text-slate-200"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Continue Watching ────────────────────────────────────────────────── */}
      {continueWatching.length > 0 && (
        <motion.div variants={fadeUp} className="space-y-4">
          <h2 className="text-base font-heading font-bold text-snow flex items-center gap-2">
            <div className="w-1.5 h-4 rounded-full bg-ice" />
            Continue Watching
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {continueWatching.map((lesson) => {
              const pct = getProgressPercent(lesson);
              const cfg = levelConfig[lesson.level];
              return (
                <Link key={lesson.id} href={`/dashboard/lessons/${lesson.id}`}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="group relative rounded-2xl overflow-hidden bg-[#1e293b]/50 border border-white/[0.06] hover:border-ice/20 transition-all"
                  >
                    <div className="relative h-36 bg-[#0f172a]">
                      {lesson.thumbnailUrl ? (
                        <img
                          src={lesson.thumbnailUrl}
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Mountain className="w-8 h-8 text-slate-600" />
                        </div>
                      )}
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <div className="w-10 h-10 rounded-full bg-ice/90 flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 text-navy ml-0.5" />
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                        <div
                          className={`h-full bg-gradient-to-r ${cfg.bar} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-snow truncate">
                          {lesson.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {pct}% complete
                        </p>
                      </div>
                      <span
                        className={`ml-3 shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.pill}`}
                      >
                        {lesson.level}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── All Lessons ──────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-heading font-bold text-snow flex items-center gap-2">
            <div className="w-1.5 h-4 rounded-full bg-slate-600" />
            All Lessons
            <span className="text-slate-500 font-normal text-sm">
              ({filtered.length})
            </span>
          </h2>
        </div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-slate-600" />
            </div>
            <h3 className="text-base font-semibold text-snow mb-1">
              No lessons found
            </h3>
            <p className="text-slate-500 text-sm mb-4">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-ice/10 text-ice text-sm font-medium hover:bg-ice/20 transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((lesson, i) => {
              const status = getStatus(lesson);
              const pct = getProgressPercent(lesson);
              const cfg = levelConfig[lesson.level];

              return (
                <Link key={lesson.id} href={`/dashboard/lessons/${lesson.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -4 }}
                    className="group rounded-2xl overflow-hidden bg-[#1e293b]/50 border border-white/[0.06] hover:border-white/[0.14] hover:shadow-xl hover:shadow-black/30 transition-all duration-300 cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-44 bg-[#0f172a] overflow-hidden">
                      {lesson.thumbnailUrl ? (
                        <img
                          src={lesson.thumbnailUrl}
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600 opacity-90"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1e293b] to-[#0c1a2e] flex items-center justify-center">
                          <Mountain className="w-10 h-10 text-slate-700" />
                        </div>
                      )}

                      {/* Dark gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent" />

                      {/* Play button on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          whileHover={{ scale: 1.05 }}
                          className="w-12 h-12 rounded-full bg-ice/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-black/40"
                        >
                          <Play className="w-5 h-5 text-navy ml-0.5" />
                        </motion.div>
                      </div>

                      {/* Progress bar */}
                      {pct > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
                          <div
                            className={`h-full bg-gradient-to-r ${cfg.bar}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}

                      {/* Top badges */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-sm ${cfg.pill}`}
                        >
                          {lesson.level}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        {status === "COMPLETED" && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-400 text-[10px] font-semibold backdrop-blur-sm">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Done
                          </span>
                        )}
                        {status === "IN_PROGRESS" && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-ice/15 border border-ice/30 text-ice text-[10px] font-semibold backdrop-blur-sm">
                            <PlayCircle className="w-2.5 h-2.5" />
                            {pct}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-ice uppercase tracking-wider">
                          {lesson.sport}
                        </span>
                        {lesson.duration && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Clock className="w-3 h-3" />
                            {lesson.duration} min
                          </div>
                        )}
                      </div>

                      <h3 className="text-sm font-semibold text-snow leading-snug group-hover:text-ice transition-colors duration-200 line-clamp-2">
                        {lesson.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {lesson.description ||
                          "Learn essential techniques and improve your skills."}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        ) : (
          // List view
          <div className="space-y-2">
            {filtered.map((lesson, i) => {
              const status = getStatus(lesson);
              const pct = getProgressPercent(lesson);
              const cfg = levelConfig[lesson.level];

              return (
                <Link key={lesson.id} href={`/dashboard/lessons/${lesson.id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ x: 3 }}
                    className="group flex items-center gap-4 p-3 rounded-xl bg-[#1e293b]/40 border border-white/[0.05] hover:border-white/[0.1] hover:bg-[#1e293b]/70 transition-all cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-[#0f172a]">
                      {lesson.thumbnailUrl ? (
                        <img
                          src={lesson.thumbnailUrl}
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400 opacity-80"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Mountain className="w-5 h-5 text-slate-700" />
                        </div>
                      )}
                      {pct > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
                          <div
                            className={`h-full bg-gradient-to-r ${cfg.bar}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${cfg.pill}`}
                        >
                          {lesson.level}
                        </span>
                        <span className="text-[11px] text-ice font-medium">
                          {lesson.sport}
                        </span>
                        {lesson.duration && (
                          <span className="text-[11px] text-slate-500 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {lesson.duration}m
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-snow truncate group-hover:text-ice transition-colors">
                        {lesson.title}
                      </p>
                      <div>
                        {status === "COMPLETED" && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        )}
                        {status === "IN_PROGRESS" && (
                          <span className="text-[11px] text-ice">
                            {pct}% complete
                          </span>
                        )}
                        {status === "NOT_STARTED" && (
                          <span className="text-[11px] text-slate-500">
                            Not started
                          </span>
                        )}
                      </div>
                    </div>

                    <PlayCircle className="w-5 h-5 text-slate-600 group-hover:text-ice transition-colors shrink-0" />
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
