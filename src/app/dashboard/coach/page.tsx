"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudArrowUpIcon,
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "@/hooks/useTranslation";

export default function AICoachUpload() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [instructorFeedback, setInstructorFeedback] = useState("");

  const fallbackResponses = [
    {
      positive: t("coachUpload.fallbackPositive1"),
      correction: t("coachUpload.fallbackCorrection1"),
      fix: t("coachUpload.fallbackFix1"),
      why: t("coachUpload.fallbackWhy1"),
    },
    {
      positive: t("coachUpload.fallbackPositive2"),
      correction: t("coachUpload.fallbackCorrection2"),
      fix: t("coachUpload.fallbackFix2"),
      why: t("coachUpload.fallbackWhy2"),
    },
    {
      positive: t("coachUpload.fallbackPositive3"),
      correction: t("coachUpload.fallbackCorrection3"),
      fix: t("coachUpload.fallbackFix3"),
      why: t("coachUpload.fallbackWhy3"),
    },
    {
      positive: t("coachUpload.fallbackPositive4"),
      correction: t("coachUpload.fallbackCorrection4"),
      fix: t("coachUpload.fallbackFix4"),
      why: t("coachUpload.fallbackWhy4"),
    },
  ];

  const getRandomFallback = () => {
    return fallbackResponses[
      Math.floor(Math.random() * fallbackResponses.length)
    ];
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai-coach-media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        setResult(getRandomFallback());
        return;
      }

      setResult(data.data.feedback);
    } catch (err) {
      setResult(getRandomFallback());
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (
      droppedFile &&
      (droppedFile.type.startsWith("image/") ||
        droppedFile.type.startsWith("video/"))
    ) {
      setFile(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block p-3 bg-gray-800 rounded-2xl mb-4"
          >
            <AcademicCapIcon className="w-8 h-8 text-gray-200" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {t("coachUpload.pageTitle")}
          </h1>
          <p className="text-gray-400">{t("coachUpload.pageSubtitle")}</p>
        </div>

        {/* Main Card */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative bg-gray-900 rounded-3xl p-8 
            border-2 transition-all duration-300
            ${
              dragActive
                ? "border-gray-600 bg-gray-800 shadow-lg shadow-gray-700/20"
                : "border-gray-800 hover:border-gray-700"
            }
          `}
        >
          {/* Upload Area */}
          {!file && !loading && !result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="flex justify-center gap-4 mb-6">
                <div className="p-3 bg-gray-800 rounded-xl">
                  <PhotoIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="p-3 bg-gray-800 rounded-xl">
                  <VideoCameraIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="p-3 bg-gray-800 rounded-xl">
                  <CloudArrowUpIcon className="w-6 h-6 text-gray-400" />
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-300 text-lg mb-2 font-medium">
                  {t("coachUpload.dragDropText")}
                </p>
                <p className="text-gray-500 text-sm">
                  {t("coachUpload.dragDropSupports")}
                </p>
              </div>

              <div className="relative inline-block">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) setFile(selectedFile);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="bg-gray-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-all border border-gray-700">
                  {t("coachUpload.selectFile")}
                </button>
              </div>
            </motion.div>
          )}

          {/* File Preview */}
          <AnimatePresence mode="wait">
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="relative rounded-2xl overflow-hidden bg-gray-800 border border-gray-700">
                  <button
                    onClick={removeFile}
                    className="absolute top-2 right-2 p-1.5 bg-gray-900/90 backdrop-blur rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 shadow-sm z-10 transition-all"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>

                  {file.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full max-h-96 object-contain"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="w-full max-h-96"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {file.type.startsWith("image") ? (
                      <PhotoIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <VideoCameraIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="text-gray-300 text-sm truncate">
                      {file.name}
                    </span>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="bg-gray-800 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
                  >
                    {loading
                      ? t("coachUpload.analyzingText")
                      : t("coachUpload.analyzeButton")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Animation */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 text-center"
              >
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-12 h-12 border-2 border-gray-700 border-t-gray-400 rounded-full"
                  />
                </div>
                <p className="text-gray-400">
                  <span className="font-semibold text-gray-200">
                    {t("coachUpload.aiCoach")}
                  </span>{" "}
                  {t("coachUpload.aiAnalyzing")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 space-y-6"
              >
                {/* AI Coach Message - Chatbot Style */}
                <div className="flex gap-3">
                  <div className="flex-1 space-y-4">
                    {/* Detailed Feedback Cards */}
                    <div className="grid gap-3">
                      {/* Positive Feedback */}
                      {result.positive && (
                        <div className="bg-gray-800/50 rounded-xl p-4 border-l-4 border-green-500">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <p className="text-green-400 font-semibold text-sm uppercase tracking-wide mb-1">
                                {t("coachUpload.positive")}
                              </p>
                              <p className="text-gray-300">{result.positive}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Correction */}
                      {result.correction && (
                        <div className="bg-gray-800/50 rounded-xl p-4 border-l-4 border-yellow-500">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <p className="text-yellow-400 font-semibold text-sm uppercase tracking-wide mb-1">
                                {t("coachUpload.correction")}
                              </p>
                              <p className="text-gray-300">
                                {result.correction}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* How to Fix */}
                      {result.fix && (
                        <div className="bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-500">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <p className="text-blue-400 font-semibold text-sm uppercase tracking-wide mb-1">
                                {t("coachUpload.fix")}
                              </p>
                              <p className="text-gray-300">{result.fix}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Why It Matters */}
                      {result.why && (
                        <div className="bg-gray-800/50 rounded-xl p-4 border-l-4 border-purple-500">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <p className="text-purple-400 font-semibold text-sm uppercase tracking-wide mb-1">
                                {t("coachUpload.why")}
                              </p>
                              <p className="text-gray-300">{result.why}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Recommended Lessons */}
                    {result.lessons?.length > 0 && (
                      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="font-semibold text-white">
                            {t("coachUpload.recommendedLessons")}
                          </h3>
                        </div>
                        <div className="space-y-2">
                          {result.lessons.map((lesson: string, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
                            >
                              <span className="text-gray-500 text-sm">
                                #{idx + 1}
                              </span>
                              <span className="text-gray-300 group-hover:text-white transition-colors">
                                {lesson}
                              </span>
                              <span className="ml-auto text-gray-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                →
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-2">
                      <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors border border-gray-700">
                        {t("coachUpload.helpful")}
                      </button>
                      <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors border border-gray-700">
                        {t("coachUpload.askClarification")}
                      </button>
                      <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors border border-gray-700">
                        {t("coachUpload.saveFeedback")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instructor Feedback Section */}
                <div className="border-t border-gray-800 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400" />
                    <h2 className="font-semibold text-white">
                      {t("coachUpload.instructorFeedbackTitle")}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    <textarea
                      value={instructorFeedback}
                      onChange={(e) => setInstructorFeedback(e.target.value)}
                      placeholder={t(
                        "coachUpload.instructorFeedbackPlaceholder"
                      )}
                      className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-all text-sm font-medium">
                        {t("coachUpload.saveNotes")}
                      </button>
                      <button className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-all text-sm font-medium">
                        {t("coachUpload.requestExpertReview")}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          {t("coachUpload.footerPowered")}
        </p>
      </motion.div>
    </div>
  );
}
