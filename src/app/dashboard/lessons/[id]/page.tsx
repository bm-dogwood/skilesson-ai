"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  PlayCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Bot,
  Save,
  BookOpen,
  Lightbulb,
} from "lucide-react";

interface LessonData {
  id: string;
  title: string;
  module: string;
  moduleIndex: number;
  level: string;
  duration: string;
  description: string;
  takeaways: string[];
  coachTip: string;
  completed: boolean;
  playbackId?: string;
  thumbnailUrl?: string;
  sport?: string;
}

const upNextLessons = [
  {
    id: "8",
    title: "Balance & Stance Fundamentals",
    module: "The Basics",
    duration: "14 min",
  },
  {
    id: "9",
    title: "Intro to Snowboarding",
    module: "Getting Started",
    duration: "10 min",
  },
  {
    id: "10",
    title: "Parallel Turn Foundations",
    module: "Turning Fundamentals",
    duration: "22 min",
  },
];

export default function LessonDetailPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [notes, setNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [watchedPercentage, setWatchedPercentage] = useState(0);

  // Fetch lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lessons/${lessonId}`);
        const data = await res.json();

        if (data.success) {
          setLesson(data.lesson);
          setIsCompleted(data.lesson.completed || false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchLesson();
  }, [lessonId]);

  // Restore video timestamp from progress
  useEffect(() => {
    if (!lesson?.progress?.[0] || !videoRef.current) return;

    const video = videoRef.current;

    const handleLoaded = () => {
      video.currentTime = lesson.progress[0].timestamp;
    };

    video.addEventListener("loadedmetadata", handleLoaded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, [lesson]);

  // Save progress every 5 seconds
  useEffect(() => {
    if (!lesson) return;

    const interval = setInterval(() => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        const status = isCompleted ? "COMPLETED" : "IN_PROGRESS";

        fetch("/api/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lessonId: lesson.id,
            timestamp: currentTime,
            status,
          }),
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lesson, isCompleted]);

  // Handle video time updates
  const handleTimeUpdate = () => {
    if (!videoRef.current || !lesson?.duration) return;

    const current = videoRef.current.currentTime;
    const duration = parseFloat(lesson.duration) * 60; // Convert minutes to seconds

    if (duration) {
      const percentage = (current / duration) * 100;
      setWatchedPercentage(percentage);

      // Auto-complete at 90%
      if (percentage > 90 && !isCompleted) {
        markComplete("COMPLETED");
      }
    }
  };

  // Save progress on pause or end
  const saveProgress = () => {
    if (!videoRef.current) return;

    fetch("/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lessonId: lesson.id,
        timestamp: videoRef.current.currentTime,
        status: isCompleted ? "COMPLETED" : "IN_PROGRESS",
      }),
    });
  };

  // Central function to mark complete/incomplete
  const markComplete = async (status: "COMPLETED" | "IN_PROGRESS") => {
    setIsCompleted(status === "COMPLETED");

    await fetch("/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lessonId: lesson.id,
        status,
        timestamp: videoRef.current?.currentTime || 0,
      }),
    });
  };

  // Manual toggle completion
  const handleComplete = () => {
    const newStatus = isCompleted ? "IN_PROGRESS" : "COMPLETED";
    markComplete(newStatus);
  };

  // Save notes
  const handleSaveNotes = () => {
    // Save notes to localStorage or API
    localStorage.setItem(`notes_${lessonId}`, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  // Load saved notes
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${lessonId}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [lessonId]);

  const nextId = String(Number(lessonId) + 1);
  const prevId = String(Number(lessonId) - 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ice"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Lesson not found</p>
        <Link
          href="/dashboard/lessons"
          className="text-ice hover:underline mt-4 inline-block"
        >
          Back to Lessons
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Back + Breadcrumb */}
      <div className="space-y-2">
        <Link
          href="/dashboard/lessons"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-ice transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Lessons
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link
            href="/dashboard"
            className="hover:text-slate-300 transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href="/dashboard/lessons"
            className="hover:text-slate-300 transition-colors"
          >
            Lessons
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-400">{lesson.sport || "Sports"}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-snow truncate max-w-[200px]">
            {lesson.title}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl bg-gradient-to-br from-[#1e293b] via-[#162033] to-[#0c1a2e] border border-white/[0.06] overflow-hidden"
          >
            <div className="relative aspect-video bg-black">
              {lesson.playbackId ? (
                <>
                  <video
                    ref={videoRef}
                    src={`https://stream.mux.com/${lesson.playbackId}.m3u8`}
                    controls
                    onPause={saveProgress}
                    onEnded={saveProgress}
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full object-cover"
                  />
                  {/* Progress bar */}
                  {watchedPercentage > 0 && watchedPercentage < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-ice transition-all duration-300"
                        style={{ width: `${watchedPercentage}%` }}
                      />
                    </div>
                  )}
                </>
              ) : lesson.thumbnailUrl ? (
                <img
                  src={lesson.thumbnailUrl}
                  alt={lesson.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-white/40" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Lesson Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">
                {lesson.level || "Beginner"}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] text-slate-300 text-xs font-medium border border-white/[0.06]">
                {lesson.sport || "General"}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {lesson.duration ? `${lesson.duration} min` : "—"}
              </span>
              {isCompleted && (
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-heading font-bold text-snow">
              {lesson.title}
            </h1>

            <p className="text-slate-300 leading-relaxed">
              {lesson.description}
            </p>
          </div>

          {/* Key Takeaways */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-heading font-bold text-snow">
                Key Takeaways
              </h2>
            </div>
            <ul className="space-y-3">
              {lesson.takeaways && lesson.takeaways.length > 0 ? (
                lesson.takeaways.map((takeaway: string, idx: number) => (
                  <li key={idx} className="text-sm text-slate-300">
                    • {takeaway}
                  </li>
                ))
              ) : (
                <>
                  <li className="text-sm text-slate-300">
                    • Practice regularly to improve your technique
                  </li>
                  <li className="text-sm text-slate-300">
                    • Focus on balance and control
                  </li>
                  <li className="text-sm text-slate-300">
                    • Review the video multiple times for better retention
                  </li>
                </>
              )}
            </ul>
          </motion.div>

          {/* Mark Complete Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              isCompleted
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-gradient-to-r from-ice to-powder text-navy shadow-lg shadow-ice/20 hover:shadow-xl"
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {isCompleted ? "Completed" : "Mark as Complete"}
          </motion.button>

          {/* Prev / Next Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href={
                prevId !== "0"
                  ? `/dashboard/lessons/${prevId}`
                  : "/dashboard/lessons"
              }
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-ice transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Lesson
            </Link>

            <Link
              href={`/dashboard/lessons/${nextId}`}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-ice transition-colors"
            >
              Next Lesson
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Lesson Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-powder" />
              <h3 className="text-sm font-heading font-bold text-snow">
                Lesson Notes
              </h3>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your notes here..."
              rows={6}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-sm text-snow placeholder:text-slate-500 outline-none focus:border-ice/30 resize-none transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSaveNotes}
              className={`w-full mt-3 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                notesSaved
                  ? "bg-green-500/20 text-green-400"
                  : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
              }`}
            >
              <Save className="w-4 h-4" />
              {notesSaved ? "Saved!" : "Save Notes"}
            </motion.button>
          </motion.div>

          {/* AI Coach Tip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#162033] border border-ice/10 p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-ice/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-ice" />
              </div>
              <h3 className="text-sm font-heading font-bold text-snow">
                AI Coach Tip
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {lesson.coachTip ||
                "Stay consistent — small improvements each session make a big difference. Focus on quality over quantity, and don't forget to review key concepts regularly."}
            </p>
          </motion.div>

          {/* Up Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl bg-[#1e293b]/50 border border-white/[0.06] p-5"
          >
            <h3 className="text-sm font-heading font-bold text-snow mb-4">
              Up Next
            </h3>
            <div className="space-y-3">
              {upNextLessons.map((next, i) => (
                <Link key={next.id} href={`/dashboard/lessons/${next.id}`}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 py-2 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-slate-400">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 group-hover:text-ice transition-colors truncate">
                        {next.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {next.module} &middot; {next.duration}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-ice transition-colors shrink-0" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
