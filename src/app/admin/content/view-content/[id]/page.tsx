"use client";

import { useEffect, useState } from "react";
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
import DashboardLayout from "@/components/DashboardLayout";

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

  const [notes, setNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lessons/${lessonId}`);
        const data = await res.json();

        if (data.success) {
          setLesson(data.lesson);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchLesson();
  }, [lessonId]);
  const handleComplete = async () => {
    const newStatus = isCompleted ? "IN_PROGRESS" : "COMPLETED";

    setIsCompleted(!isCompleted); // optimistic update

    await fetch("/api/progress", {
      method: "POST",
      body: JSON.stringify({
        lessonId: lesson.id,
        status: newStatus,
      }),
    });
  };
  useEffect(() => {
    if (lesson) {
      setIsCompleted(lesson.completed || false);
    }
  }, [lesson]);
  const handleSaveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const nextId = String(Number(lessonId) + 1);
  if (loading) {
    return <p className="text-slate-400">Loading lesson...</p>;
  }

  if (!lesson) {
    return <p className="text-red-400">Lesson not found</p>;
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
          href="/admin/content"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-ice transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Lessons
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link
            href="/admin/dashboard"
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
          <span className="text-slate-400">{lesson.sport}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-snow">{lesson.title}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-video rounded-2xl bg-gradient-to-br from-[#1e293b] via-[#162033] to-[#0c1a2e] border border-white/[0.06] overflow-hidden flex items-center justify-center"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
              {lesson.videoUrl ? (
                <video
                  src={lesson.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
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
                {lesson.level}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] text-slate-300 text-xs font-medium border border-white/[0.06]">
                {lesson.sport}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {lesson.duration ? `${lesson.duration} min` : "—"}
              </span>
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
              <li className="text-sm text-slate-300">
                • Practice regularly to improve your technique
              </li>
              <li className="text-sm text-slate-300">
                • Focus on balance and control
              </li>
            </ul>
          </motion.div>

          {/* Mark Complete */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              isCompleted
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-gradient-to-r from-ice to-powder text-navy shadow-lg shadow-ice/20"
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {isCompleted ? "Completed" : "Mark as Complete"}
          </motion.button>

          {/* Prev / Next */}
          <div className="flex items-center justify-between pt-2">
            <Link href="/dashboard/lessons">← Back to Lessons</Link>

            <Link href={`/dashboard/lessons/${nextId}`}>
              <motion.div
                whileHover={{ x: 2 }}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-ice transition-colors"
              >
                Next Lesson
                <ChevronRight className="w-4 h-4" />
              </motion.div>
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
              Stay consistent — small improvements each session make a big
              difference.
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
