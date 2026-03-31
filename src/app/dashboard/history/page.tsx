"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Video,
  Clock,
  ChevronDown,
  X,
  CheckCircle2,
  Loader2,
  Star,
  Lightbulb,
  Wrench,
  BookOpen,
  AlertTriangle,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface HistoryItem {
  id: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  thumbnailUrl?: string;
  aiDescription: string;
  aiFeedback: string;
  instructorFeedback?: string;
  createdAt: string;
  status: "pending" | "completed" | "reviewed";
  sport?: string;
  drill?: string;
}

type SortOption = "newest" | "oldest" | "status";
type FilterOption = "all" | "pending" | "completed" | "reviewed";

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
};

// ─── Feedback Parser ───────────────────────────────────────────────────────────
function ParsedFeedback({
  feedback,
  compact = false,
}: {
  feedback: string;
  compact?: boolean;
}) {
  if (!feedback) return null;

  let parsed: any = null;
  try {
    parsed = JSON.parse(feedback);
  } catch {
    return (
      <p
        className={`text-slate-300 leading-relaxed ${
          compact ? "line-clamp-2 text-sm" : ""
        }`}
      >
        {feedback}
      </p>
    );
  }

  if (compact) {
    const summary =
      parsed.correction || parsed.positive || parsed.aiFeedback || "";
    return <p className="text-slate-400 text-sm line-clamp-2">{summary}</p>;
  }

  const sections = [
    {
      key: "positive",
      label: "What you're doing well",
      icon: Star,
      color: "text-emerald-400",
      bg: "bg-emerald-400/8",
      border: "border-emerald-400/20",
    },
    {
      key: "correction",
      label: "Area for Improvement",
      icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-400/8",
      border: "border-amber-400/20",
    },
    {
      key: "fix",
      label: "How to Fix",
      icon: Wrench,
      color: "text-sky-400",
      bg: "bg-sky-400/8",
      border: "border-sky-400/20",
    },
    {
      key: "why",
      label: "Why It Matters",
      icon: Lightbulb,
      color: "text-purple-400",
      bg: "bg-purple-400/8",
      border: "border-purple-400/20",
    },
  ];

  return (
    <div className="space-y-3">
      {sections.map(({ key, label, icon: Icon, color, bg, border }) =>
        parsed[key] ? (
          <div key={key} className={`rounded-xl border ${border} ${bg} p-4`}>
            <div className={`flex items-center gap-2 mb-1.5 ${color}`}>
              <Icon className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {label}
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {parsed[key]}
            </p>
          </div>
        ) : null
      )}

      {parsed.lessons?.length > 0 && (
        <div className="rounded-xl border border-ice/20 bg-ice/8 p-4">
          <div className="flex items-center gap-2 mb-2 text-ice">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Recommended Lessons
            </span>
          </div>
          <ul className="space-y-1">
            {parsed.lessons.map((lesson: string, i: number) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <span className="text-ice mt-0.5">·</span>
                {lesson}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: HistoryItem["status"] }) {
  const config = {
    pending: {
      label: "Processing",
      icon: Loader2,
      cls: "bg-amber-400/10 text-amber-400 border-amber-400/20",
      spin: true,
    },
    completed: {
      label: "AI Analyzed",
      icon: CheckCircle2,
      cls: "bg-ice/10 text-ice border-ice/20",
      spin: false,
    },
    reviewed: {
      label: "Instructor Reviewed",
      icon: Star,
      cls: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
      spin: false,
    },
  }[status] || {
    label: status,
    icon: Clock,
    cls: "bg-slate-400/10 text-slate-400 border-slate-400/20",
    spin: false,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${config.cls}`}
    >
      <Icon className={`w-3 h-3 ${config.spin ? "animate-spin" : ""}`} />
      {config.label}
    </span>
  );
}

// ─── History Card ──────────────────────────────────────────────────────────────
function HistoryCard({
  item,
  onClick,
  index,
}: {
  item: HistoryItem;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="group rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] hover:border-white/[0.12] overflow-hidden cursor-pointer transition-all duration-200"
    >
      {/* Media thumbnail */}
      <div className="relative aspect-video bg-[#0f172a] overflow-hidden">
        {item.mediaType === "image" ? (
          <img
            src={item.thumbnailUrl || item.mediaUrl}
            alt="Session"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <video
            src={item.mediaUrl}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            poster={item.thumbnailUrl}
            muted
          />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Media type pill */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-[11px] text-slate-300 border border-white/10">
            {item.mediaType === "image" ? (
              <Camera className="w-3 h-3" />
            ) : (
              <Video className="w-3 h-3" />
            )}
            {item.mediaType === "image" ? "Photo" : "Video"}
          </span>
        </div>

        {/* Status */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={item.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          {item.sport ? (
            <span className="text-xs font-semibold text-ice uppercase tracking-wider">
              {item.sport}
            </span>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </div>
        </div>

        {item.drill && (
          <p className="text-sm text-slate-300 font-medium">{item.drill}</p>
        )}

        {/* Feedback preview */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            AI Feedback
          </p>
          <ParsedFeedback feedback={item.aiFeedback} compact />
        </div>

        {item.instructorFeedback && (
          <div className="pt-2 border-t border-white/[0.04] space-y-1">
            <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Instructor Note
            </p>
            <p className="text-sm text-slate-400 line-clamp-1">
              {item.instructorFeedback}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({
  item,
  onClose,
}: {
  item: HistoryItem;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="bg-[#1e293b] border border-white/[0.08] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#1e293b]/95 backdrop-blur-sm border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusBadge status={item.status} />
              <span className="text-xs text-slate-500">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-slate-400 hover:text-snow transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="p-6 space-y-6">
            {/* Media */}
            <div className="rounded-xl overflow-hidden bg-[#0f172a]">
              {item.mediaType === "image" ? (
                <img
                  src={item.mediaUrl}
                  alt="Session"
                  className="w-full object-contain max-h-80"
                />
              ) : (
                <video
                  src={item.mediaUrl}
                  controls
                  className="w-full max-h-80"
                />
              )}
            </div>

            {/* Meta */}
            {(item.sport || item.drill) && (
              <div className="flex items-center gap-3">
                {item.sport && (
                  <span className="px-3 py-1 rounded-full bg-ice/10 text-ice text-xs font-semibold border border-ice/20">
                    {item.sport}
                  </span>
                )}
                {item.drill && (
                  <span className="text-sm text-slate-400">{item.drill}</span>
                )}
              </div>
            )}

            {/* AI Feedback */}
            <div>
              <h3 className="text-base font-heading font-bold text-snow mb-4">
                AI Feedback
              </h3>
              <ParsedFeedback feedback={item.aiFeedback} />
            </div>

            {/* Instructor Feedback */}
            {item.instructorFeedback && (
              <div className="rounded-xl bg-emerald-400/5 border border-emerald-400/15 p-5">
                <h3 className="text-base font-heading font-bold text-emerald-400 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Instructor Feedback
                </h3>
                <ParsedFeedback feedback={item.instructorFeedback} />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function HistoryPage() {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ai-coach-history");
      if (!res.ok) throw new Error("Failed to fetch history");
      const result = await res.json();
      setData(result.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filtered = [...data]
    .filter((item) => filter === "all" || item.status === filter)
    .sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      return a.status.localeCompare(b.status);
    });

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-ice/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-ice rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-400 mt-4">Loading your history...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchHistory}
          className="px-5 py-2 rounded-xl bg-ice/10 text-ice text-sm font-semibold hover:bg-ice/20 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-snow">
              Session History
            </h1>
            <p className="text-slate-400 mt-1">
              {data.length} {data.length === 1 ? "session" : "sessions"}{" "}
              recorded
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Filter */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterOption)}
                className="pl-8 pr-8 py-2 rounded-xl bg-[#1e293b]/60 border border-white/[0.06] text-sm text-slate-200 appearance-none outline-none hover:border-white/[0.12] transition-colors cursor-pointer"
              >
                <option value="all">All Sessions</option>
                <option value="pending">Processing</option>
                <option value="completed">AI Analyzed</option>
                <option value="reviewed">Instructor Reviewed</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pl-8 pr-8 py-2 rounded-xl bg-[#1e293b]/60 border border-white/[0.06] text-sm text-slate-200 appearance-none outline-none hover:border-white/[0.12] transition-colors cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="status">By Status</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* ── Filter Pills ─────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeInUp}
          className="flex items-center gap-2 flex-wrap"
        >
          {(["all", "pending", "completed", "reviewed"] as FilterOption[]).map(
            (f) => {
              const count =
                f === "all"
                  ? data.length
                  : data.filter((d) => d.status === f).length;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    filter === f
                      ? "bg-ice/15 border-ice/40 text-ice"
                      : "bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-white/[0.12] hover:text-slate-200"
                  }`}
                >
                  {f === "all"
                    ? "All"
                    : f === "pending"
                    ? "Processing"
                    : f === "completed"
                    ? "AI Analyzed"
                    : "Reviewed"}
                  <span className="ml-1.5 opacity-60">{count}</span>
                </button>
              );
            }
          )}
        </motion.div>

        {/* ── Grid ─────────────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
              <Camera className="w-7 h-7 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-snow mb-2">
              No sessions found
            </h3>
            <p className="text-slate-400 text-sm max-w-xs">
              {filter !== "all"
                ? "Try changing the filter to see more results."
                : "Upload your first training session to get AI feedback."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={stagger}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((item, i) => (
              <HistoryCard
                key={item.id}
                item={item}
                index={i}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* ── Modal ────────────────────────────────────────────────────────────── */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}
