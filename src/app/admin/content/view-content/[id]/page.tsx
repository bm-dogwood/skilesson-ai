"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Play,
  Mountain,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const levelConfig: Record<string, { pill: string; glow: string }> = {
  Beginner: {
    pill: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    glow: "shadow-emerald-400/10",
  },
  Intermediate: {
    pill: "bg-sky-400/10 text-sky-400 border-sky-400/20",
    glow: "shadow-sky-400/10",
  },
  Advanced: {
    pill: "bg-orange-400/10 text-orange-400 border-orange-400/20",
    glow: "shadow-orange-400/10",
  },
};

export default function LessonDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const lessonId = params.id as string;
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [notes, setNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [watchedPct, setWatchedPct] = useState(0);
  const [upNext, setUpNext] = useState<any[]>([]);

  // Fetch lesson
  useEffect(() => {
    if (!lessonId) return;
    fetch(`/api/lessons/${lessonId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setLesson(data.lesson);
          setIsCompleted(data.lesson.completed || false);
          setUpNext(data.upNext || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [lessonId]);

  // Restore timestamp
  useEffect(() => {
    if (!lesson?.progress?.[0] || !videoRef.current) return;
    const video = videoRef.current;
    const onLoaded = () => {
      video.currentTime = lesson.progress[0].timestamp;
    };
    video.addEventListener("loadedmetadata", onLoaded);
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, [lesson]);

  // Auto-save every 5s
  useEffect(() => {
    if (!lesson) return;
    const interval = setInterval(() => {
      if (!videoRef.current) return;
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          timestamp: videoRef.current.currentTime,
          status: isCompleted ? "COMPLETED" : "IN_PROGRESS",
        }),
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [lesson, isCompleted]);

  const saveProgress = () => {
    if (!videoRef.current || !lesson) return;
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: lesson.id,
        timestamp: videoRef.current.currentTime,
        status: isCompleted ? "COMPLETED" : "IN_PROGRESS",
      }),
    });
  };

  const handleSaveNotes = () => {
    localStorage.setItem(`notes_${lessonId}`, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  useEffect(() => {
    const saved = localStorage.getItem(`notes_${lessonId}`);
    if (saved) setNotes(saved);
  }, [lessonId]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-ice/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-ice rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400 mb-4">
          {t("lessonDetail.lessonNotFound")}
        </p>
        <Link
          href="/dashboard/lessons"
          className="text-ice hover:underline text-sm"
        >
          ← {t("lessonDetail.backToLessons")}
        </Link>
      </div>
    );
  }

  const cfg = levelConfig[lesson.level] || levelConfig.Beginner;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 -mt-2"
    >
      {/* ── Breadcrumb ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link
          href="/admin/content"
          className="flex items-center gap-1 hover:text-ice transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t("lessonDetail.breadcrumbLessons")}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-400 truncate max-w-[200px]">
          {lesson.title}
        </span>
      </div>

      {/* ── Main layout ──────────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* ── Left: Video + Info ───────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Video player */}
          <motion.div
            {...fadeUp}
            className={`relative rounded-2xl overflow-hidden bg-[#060d18] border border-white/[0.06] shadow-2xl ${cfg.glow}`}
          >
            <div className="relative aspect-video">
              {lesson.playbackId ? (
                <>
                  <video
                    ref={videoRef}
                    src={`https://stream.mux.com/${lesson.playbackId}.m3u8`}
                    controls
                    onPause={saveProgress}
                    onEnded={saveProgress}
                    className="w-full h-full object-cover"
                    poster={lesson.thumbnailUrl}
                  >
                    {lesson.subtitlesEnUrl && (
                      <track
                        kind="subtitles"
                        src={`/api/subtitles/${lesson.id}/en`}
                        srcLang="en"
                        label="English"
                        default
                      />
                    )}
                    {lesson.subtitlesEsUrl && (
                      <track
                        kind="subtitles"
                        src={`/api/subtitles/${lesson.id}/es`}
                        srcLang="es"
                        label="Español"
                      />
                    )}
                  </video>

                  {/* Watch progress bar */}
                  {watchedPct > 0 && watchedPct < 99 && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 pointer-events-none">
                      <motion.div
                        className="h-full bg-ice"
                        style={{ width: `${watchedPct}%` }}
                      />
                    </div>
                  )}
                </>
              ) : lesson.thumbnailUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={lesson.thumbnailUrl}
                    alt={lesson.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-ice/20 border border-ice/40 flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-7 h-7 text-ice ml-1" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1e293b] to-[#0c1a2e] flex flex-col items-center justify-center gap-3">
                  <Mountain className="w-12 h-12 text-slate-700" />
                  <p className="text-slate-500 text-sm">
                    {t("lessonDetail.videoUnavailable")}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Lesson metadata */}
          <motion.div {...fadeUp} className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.pill}`}
              >
                {lesson.level}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                {lesson.sport || t("lessonDetail.generalSport")}
              </span>
              {lesson.duration && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {lesson.duration} min
                </span>
              )}
              <AnimatePresence>
                {isCompleted && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 text-xs text-emerald-400"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t("lessonDetail.completedLabel")}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <h1 className="text-xl md:text-2xl font-heading font-bold text-snow leading-tight">
              {lesson.title}
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed">
              {lesson.description}
            </p>
          </motion.div>

          {/* Key Takeaways */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl bg-[#1e293b]/40 border border-white/[0.06] p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-sm font-heading font-bold text-snow">
                {t("lessonDetail.keyTakeaways")}
              </h2>
            </div>
            <ul className="space-y-2.5">
              {lesson.takeaways?.length > 0
                ? lesson.takeaways.map((t: string, i: number) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.06 }}
                      className="flex items-start gap-2.5 text-sm text-slate-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-ice/60 mt-1.5 shrink-0" />
                      {t}
                    </motion.li>
                  ))
                : [
                    t("lessonDetail.defaultTakeaway1"),
                    t("lessonDetail.defaultTakeaway2"),
                    t("lessonDetail.defaultTakeaway3"),
                  ].map((takeaway, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-slate-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-ice/40 mt-1.5 shrink-0" />
                      {takeaway}
                    </li>
                  ))}
            </ul>
          </motion.div>

          {/* Prev / Next */}
          <div className="flex items-center justify-between pt-1">
            <Link
              href="/admin/content"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-ice transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {t("lessonDetail.allLessons")}
            </Link>
          </div>
        </div>

        {/* ── Right sidebar ────────────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Watch progress card */}
          {watchedPct > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-[#1e293b]/40 border border-white/[0.06] p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">
                  {t("lessonDetail.watchProgressLabel")}
                </span>
                <span className="text-xs font-bold text-ice">
                  {Math.round(watchedPct)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-ice to-powder"
                  style={{ width: `${watchedPct}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}

          {/* Lesson notes */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-[#1e293b]/40 border border-white/[0.06] p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-powder/10 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-powder" />
              </div>
              <h3 className="text-sm font-heading font-bold text-snow">
                {t("lessonDetail.myNotes")}
              </h3>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("lessonDetail.notesPlaceholder")}
              rows={5}
              className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 text-sm text-snow placeholder:text-slate-600 outline-none focus:border-ice/25 focus:bg-white/[0.04] resize-none transition-all leading-relaxed"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSaveNotes}
              className={`w-full mt-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                notesSaved
                  ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                  : "bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.07]"
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              {notesSaved
                ? t("lessonDetail.notesSaved")
                : t("lessonDetail.saveNotes")}
            </motion.button>
          </motion.div>

          {/* Up Next */}
          {upNext.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl bg-[#1e293b]/40 border border-white/[0.06] p-5"
            >
              <h3 className="text-sm font-heading font-bold text-snow mb-4 flex items-center gap-2">
                <div className="w-1.5 h-3.5 rounded-full bg-slate-600" />
                {t("lessonDetail.upNext")}
              </h3>
              <div className="space-y-2">
                {upNext.slice(0, 4).map((next: any, i: number) => (
                  <Link key={next.id} href={`/dashboard/lessons/${next.id}`}>
                    <motion.div
                      whileHover={{ x: 3 }}
                      className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-[#0f172a]">
                        {next.thumbnailUrl ? (
                          <img
                            src={next.thumbnailUrl}
                            alt={next.title}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PlayCircle className="w-4 h-4 text-slate-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-300 group-hover:text-snow transition-colors truncate">
                          {next.title}
                        </p>
                        {next.duration && (
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {next.duration} min
                          </p>
                        )}
                      </div>

                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-ice transition-colors shrink-0" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
