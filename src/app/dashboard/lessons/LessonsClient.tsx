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
  Filter,
  X,
  ChevronDown,
  BookOpen,
  TrendingUp,
  Sparkles,
  Mountain,
  LayoutGrid,
  List,
  Award,
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

const levelColors = {
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const sportIcons = {
  Skiing: Mountain,
  Snowboarding: TrendingUp,
};

type ViewMode = "grid" | "list";
type CompletionFilter = "All" | "Completed" | "In Progress" | "Not Started";

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

  const getStatus = (lesson: Lesson) => {
    const p = lesson.progress?.[0];
    if (!p) return "NOT_STARTED";
    return p.status || "NOT_STARTED";
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch("/api/lessons-user");
        const data = await res.json();
        setLessons(data.lessons || []);
        setHasSubscription(data.hasSubscription);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      // Search filter
      if (search && !l.title.toLowerCase().includes(search.toLowerCase()))
        return false;

      // Level filter
      if (levelFilter !== "All" && l.level !== levelFilter) return false;

      // Sport filter
      if (sportFilter !== "All" && l.sport !== sportFilter) return false;

      // Completion filter
      if (completionFilter !== "All") {
        const status = getStatus(l);
        if (completionFilter === "Completed" && status !== "COMPLETED")
          return false;
        if (completionFilter === "In Progress" && status !== "IN_PROGRESS")
          return false;
        if (completionFilter === "Not Started" && status !== "NOT_STARTED")
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
    return p && p.timestamp && p.timestamp > 5 && p.status !== "COMPLETED";
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-ice/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-ice rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-400 mt-4">Loading your lessons...</p>
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-ice/20 to-purple-500/20 blur-3xl rounded-full"></div>
          <Lock className="w-20 h-20 text-ice mb-6 relative" />
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

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-white to-ice bg-clip-text text-transparent"
          >
            Your Lesson Library
          </motion.h1>
          <p className="text-slate-400 mt-2">
            {filtered.length} {filtered.length === 1 ? "lesson" : "lessons"}{" "}
            available
          </p>
        </div>

        <div className="flex gap-2">
          {/* View Toggle */}
          <div className="flex bg-[#1e293b] rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-ice text-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-ice text-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              showFilters
                ? "bg-ice text-black"
                : "bg-[#1e293b] text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </motion.button>
        </div>
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1e293b] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-ice/50 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#1e293b] rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-semibold">Filter Lessons</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-ice hover:text-ice/80 transition-colors"
                >
                  Reset all
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Difficulty Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Beginner", "Intermediate", "Advanced"].map(
                      (level) => (
                        <button
                          key={level}
                          onClick={() => setLevelFilter(level)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                            levelFilter === level
                              ? "bg-ice text-black font-medium"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                        >
                          {level}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Sport Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Skiing", "Snowboarding"].map((sport) => (
                      <button
                        key={sport}
                        onClick={() => setSportFilter(sport)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          sportFilter === sport
                            ? "bg-ice text-black font-medium"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        {sport}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Progress Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Completed", "In Progress", "Not Started"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() =>
                            setCompletionFilter(status as CompletionFilter)
                          }
                          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                            completionFilter === status
                              ? "bg-ice text-black font-medium"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Watching Section */}
      {continueWatching.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Continue Watching</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {continueWatching.map((lesson) => {
              const percent = getProgressPercent(lesson);
              return (
                <Link key={lesson.id} href={`/dashboard/lessons/${lesson.id}`}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-[#1e293b] rounded-xl overflow-hidden"
                  >
                    <div className="relative h-40">
                      <img
                        src={lesson.thumbnailUrl || "/placeholder.jpg"}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                        <div
                          className="h-full bg-ice transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {percent}% watched
                      </p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Lessons Grid/List View */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No lessons found
          </h3>
          <p className="text-slate-400">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-ice/10 text-ice rounded-lg hover:bg-ice/20 transition-colors"
          >
            Clear filters
          </button>
        </motion.div>
      ) : viewMode === "grid" ? (
        // Grid View
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lesson, i) => {
            const SportIcon = sportIcons[lesson.sport];
            const status = getStatus(lesson);
            const percent = getProgressPercent(lesson);

            return (
              <Link key={lesson.id} href={`/dashboard/lessons/${lesson.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-[#1e293b] rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-ice/10 transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      {lesson.thumbnailUrl ? (
                        <img
                          src={lesson.thumbnailUrl}
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                          <Mountain className="w-12 h-12 text-slate-600" />
                        </div>
                      )}

                      {/* Progress Bar */}
                      {percent > 0 && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                          <div
                            className="h-full bg-ice transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        {status === "COMPLETED" && (
                          <div className="flex items-center gap-1 bg-green-500/20 backdrop-blur-sm px-2 py-1 rounded-lg text-green-400 text-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </div>
                        )}
                        {status === "IN_PROGRESS" && (
                          <div className="flex items-center gap-1 bg-blue-500/20 backdrop-blur-sm px-2 py-1 rounded-lg text-blue-400 text-xs">
                            <PlayCircle className="w-3 h-3" />
                            In Progress
                          </div>
                        )}
                      </div>

                      {/* Level Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium border backdrop-blur-sm ${
                            levelColors[lesson.level]
                          }`}
                        >
                          {lesson.level}
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-2 text-white">
                            <PlayCircle className="w-5 h-5" />
                            <span className="text-sm">Start Lesson</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {SportIcon && (
                            <SportIcon className="w-4 h-4 text-ice" />
                          )}
                          <span className="text-xs text-ice font-medium">
                            {lesson.sport}
                          </span>
                        </div>
                        {lesson.duration && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.duration} min</span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-ice transition-colors">
                        {lesson.title}
                      </h3>

                      <p className="text-slate-400 text-sm line-clamp-2">
                        {lesson.description ||
                          "Learn essential techniques and improve your skills with this comprehensive lesson."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      ) : (
        // List View
        <div className="space-y-3">
          {filtered.map((lesson, i) => {
            const SportIcon = sportIcons[lesson.sport];
            const status = getStatus(lesson);
            const percent = getProgressPercent(lesson);

            return (
              <Link key={lesson.id} href={`/dashboard/lessons/${lesson.id}`}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="bg-[#1e293b] rounded-xl overflow-hidden hover:shadow-xl hover:shadow-ice/5 transition-all"
                >
                  <div className="flex gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      {lesson.thumbnailUrl ? (
                        <img
                          src={lesson.thumbnailUrl}
                          alt={lesson.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                          <Mountain className="w-6 h-6 text-slate-600" />
                        </div>
                      )}
                      {percent > 0 && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                          <div
                            className="h-full bg-ice"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                            levelColors[lesson.level]
                          }`}
                        >
                          {lesson.level}
                        </span>
                        <div className="flex items-center gap-1">
                          {SportIcon && (
                            <SportIcon className="w-3 h-3 text-ice" />
                          )}
                          <span className="text-xs text-slate-400">
                            {lesson.sport}
                          </span>
                        </div>
                        {lesson.duration && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.duration} min</span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-white font-semibold mb-1 group-hover:text-ice transition-colors">
                        {lesson.title}
                      </h3>

                      <p className="text-slate-400 text-sm line-clamp-1">
                        {lesson.description ||
                          "Learn essential techniques and improve your skills."}
                      </p>

                      {/* Status Indicator */}
                      <div className="flex items-center gap-3 mt-2">
                        {status === "COMPLETED" && (
                          <div className="flex items-center gap-1 text-green-400 text-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </div>
                        )}
                        {status === "IN_PROGRESS" && (
                          <div className="flex items-center gap-1 text-blue-400 text-xs">
                            <PlayCircle className="w-3 h-3" />
                            {percent}% complete
                          </div>
                        )}
                        {status === "NOT_STARTED" && (
                          <div className="flex items-center gap-1 text-slate-400 text-xs">
                            <PlayCircle className="w-3 h-3" />
                            Not started
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center">
                      <PlayCircle className="w-5 h-5 text-slate-500 group-hover:text-ice transition-colors" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
