"use client";

import { useState } from "react";
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

const lessonDatabase: Record<string, LessonData> = {
  "1": {
    id: "1",
    title: "Welcome to Skiing",
    module: "Getting Started",
    moduleIndex: 1,
    level: "Beginner",
    duration: "8 min",
    description:
      "Start your skiing journey with the right mindset. This lesson covers the history of skiing as a sport, what to expect as a beginner, and how this course will transform you from a complete novice into a confident skier. We cover the learning curve, common fears, and why millions of people fall in love with skiing every year.",
    takeaways: [
      "Understand the typical learning timeline for beginner skiers",
      "Know what gear you will need before your first day on snow",
      "Learn the mountain safety code and etiquette basics",
      "Set realistic goals for your first season on skis",
    ],
    coachTip:
      "Take your time with this foundation lesson. The mental preparation here sets you up for faster progress in later modules.",
    completed: true,
  },
  "7": {
    id: "7",
    title: "Introduction to Gliding",
    module: "The Basics",
    moduleIndex: 4,
    level: "Beginner",
    duration: "20 min",
    description:
      "Now that you can stop confidently, it is time to learn how to glide. This lesson teaches you the fundamental body position for skiing, how to distribute your weight, and how to let gravity work with you rather than against you. You will practice on gentle slopes and build the muscle memory needed for more advanced techniques.",
    takeaways: [
      "Master the athletic skiing stance for optimal balance",
      "Understand weight distribution and center of gravity",
      "Practice controlled gliding on beginner terrain",
      "Build confidence with gradual speed increases",
    ],
    coachTip:
      "Focus on keeping your hands forward and visible at all times. This one habit will prevent 80% of the balance issues beginners face.",
    completed: false,
  },
};

const defaultLesson: LessonData = {
  id: "0",
  title: "Balance & Stance Fundamentals",
  module: "The Basics",
  moduleIndex: 4,
  level: "Beginner",
  duration: "14 min",
  description:
    "The foundation of all skiing technique is a proper stance. This lesson breaks down the biomechanics of skiing posture, teaches you how to find your natural center of balance, and provides exercises you can practice at home. A strong stance is the difference between a skier who fights the mountain and one who flows with it.",
  takeaways: [
    "Learn the three checkpoints of proper ski stance",
    "Practice balance drills you can do at home before hitting the slopes",
    "Understand how ankle flex controls your fore-aft balance",
    "Discover how your core muscles stabilize you during turns",
  ],
  coachTip:
    "Try the wall-sit exercise at home for 30 seconds each day. It mimics the ski stance perfectly and will build the muscle endurance you need.",
  completed: false,
};

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
  const lesson = lessonDatabase[lessonId] || { ...defaultLesson, id: lessonId };

  const [notes, setNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(lesson.completed);
  const [notesSaved, setNotesSaved] = useState(false);

  const handleSaveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const prevId = String(Math.max(1, Number(lessonId) - 1));
  const nextId = String(Number(lessonId) + 1);

  return (
    <DashboardLayout>
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
            <span className="text-slate-400">{lesson.module}</span>
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
              <div className="absolute inset-0 bg-gradient-to-br from-ice/5 via-transparent to-powder/5" />
              <div className="relative text-center space-y-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                >
                  <PlayCircle className="w-20 h-20 text-white/30 hover:text-ice/60 transition-colors mx-auto" />
                </motion.div>
                <p className="text-sm text-slate-500">
                  Video Player &mdash; Integration Required
                </p>
              </div>
            </motion.div>

            {/* Lesson Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">
                  {lesson.level}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/[0.04] text-slate-300 text-xs font-medium border border-white/[0.06]">
                  {lesson.module}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {lesson.duration}
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
                {lesson.takeaways.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-ice mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-300">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Mark Complete */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCompleted(!isCompleted)}
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
              <Link href={`/dashboard/lessons/${prevId}`}>
                <motion.div
                  whileHover={{ x: -2 }}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-ice transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Lesson
                </motion.div>
              </Link>
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
                {lesson.coachTip}
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
    </DashboardLayout>
  );
}
