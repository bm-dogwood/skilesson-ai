"use client";

import { useState, useMemo, useEffect } from "react";
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

type Lesson = {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  sport: "Skiing" | "Snowboarding";
  thumbnailUrl?: string;
  duration?: number;
  createdAt: string;
};

export default function LessonsClient() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [sportFilter, setSportFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch("/api/lessons-user"); // 👈 create this (explained below)
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

  // ✅ FILTER LOGIC
  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      if (search && !l.title.toLowerCase().includes(search.toLowerCase()))
        return false;

      if (levelFilter !== "All" && l.level !== levelFilter) return false;
      if (sportFilter !== "All" && l.sport !== sportFilter) return false;

      return true;
    });
  }, [lessons, search, levelFilter, sportFilter]);

  // ✅ LOADING STATE
  if (loading) {
    return <p className="text-slate-400">Loading lessons...</p>;
  }

  // ✅ NO SUBSCRIPTION UI
  if (!hasSubscription) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Lock className="w-12 h-12 text-slate-500 mb-4" />

        <h2 className="text-xl font-semibold text-snow">No Plan Selected</h2>

        <p className="text-slate-400 mt-2 mb-6">
          Choose a plan to unlock lessons.
        </p>

        <Link href="/pricing">
          <button className="px-6 py-3 rounded-xl bg-ice text-black font-semibold">
            Go to Pricing
          </button>
        </Link>
      </div>
    );
  }

  // ✅ UI
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-snow">Your Lesson Library</h1>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search lessons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl bg-[#1e293b] text-white w-full"
        />

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-slate-700 rounded-xl"
        >
          <Filter />
        </button>
      </div>

      {showFilters && (
        <div className="flex gap-3">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="p-2 bg-[#1e293b] rounded-lg"
          >
            <option>All</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="p-2 bg-[#1e293b] rounded-lg"
          >
            <option>All</option>
            <option>Skiing</option>
            <option>Snowboarding</option>
          </select>
        </div>
      )}

      {/* Lessons Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((lesson, i) => (
          <Link key={lesson.id} href={`/dashboard/lessons/${lesson.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-[#1e293b] p-4 hover:scale-[1.02]"
            >
              <div className="rounded-xl overflow-hidden bg-[#1e293b] hover:scale-[1.02] transition">
                {/* ✅ THUMBNAIL HERE */}
                <div className="relative h-36 w-full">
                  {lesson.thumbnailUrl ? (
                    <img
                      src={lesson.thumbnailUrl}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
                  )}

                  {/* Overlay Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <PlayCircle className="w-10 h-10 text-white/70" />
                  </div>
                </div>

                {/* ✅ CONTENT BELOW IMAGE */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-ice">{lesson.level}</span>
                  </div>

                  <h3 className="text-white font-semibold">{lesson.title}</h3>

                  <p className="text-slate-400 text-xs mt-1">{lesson.sport}</p>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
